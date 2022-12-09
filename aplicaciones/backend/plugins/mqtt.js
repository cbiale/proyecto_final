'use strict'

const fp = require('fastify-plugin')
const mqtt = require('async-mqtt')
const lodash = require('lodash')
const { includes } = require('lodash')
const round10 = require('round10').round10;

// conecto a un servidor mqtt
async function conectar(servidor, opciones) {
    const mediciones = opciones.couch.use('mediciones')
    const logs = opciones.couch.use('logs')
    const sensores = opciones.couch.use('sensores')
    const actuadores = opciones.couch.use('actuadores')
    const nodos = opciones.couch.use('nodos')
    const reglas = opciones.couch.use('reglas')

    servidor.log.info('Obteniendo conexión a MQTT...')
    let cliente = mqtt.connect(process.env.MQTT_URL || 'mqtt://localhost:1883')
    servidor.log.info('Conexión a MQTT obtenida')
    try {
        // suscripciones
        // inicio: determina los sensores y actuadores del nodo
        await cliente.subscribe('$queue/inicio/#')
        // sensores: se obtienen las mediciones del nodo
        await cliente.subscribe('$queue/sensores/#')
        // actuadores: se obtienen los logs del nodo
        await cliente.subscribe('$queue/actuadores/#')
    } catch (error) {
        servidor.log.error(error)
        process.exit(1)
    }

    try {
        // al recibir un mensaje
        cliente.on('message', (topico, mensaje) => {
            servidor.log.info(`Nuevo mensaje: ${topico} ${mensaje}`)
            try {
                if (topico.indexOf('sensores') !== -1) {
                    let datos = JSON.parse(mensaje)
                    agregarMedicion(topico, datos)
                }
                if (topico.indexOf('actuadores') !== -1) {
                    let datos = JSON.parse(mensaje)
                    agregarLog(topico, datos)
                }
                if (topico.indexOf('inicio') !== -1) {
                    let datos = JSON.parse(mensaje)
                    agregarInicio(topico, datos)
                }
            } catch (error) {
                servidor.log.error('Mensaje mal formado o error al insertar')
            }
        })
    } catch (error) {
        servidor.log.error('Error al recibir mensaje')
    }

    // uso luego en rutas
    servidor.decorate('mqtt', cliente)

    // agregar medición
    async function agregarMedicion(topico, mensaje) {
        // id de nodo dentro del mensaje
        let id = topico.substring(9)
        // ver de usar NTP
        let tiempo = new Date().toJSON()

        // controlo si existe el nodo
        let cantidadNodo = await nodos.view('cantidad', 'cantidad', {
            key: id,
        })
        let cantidad = cantidadNodo.rows.length

        // si existe el nodo
        if (cantidad !== 0) {
            // obtengo nodo para usarlo en control de datos de mediciones y en reglas
            let nodo = await nodos.get(id)

            servidor.log.info(`Agregando datos recibidos de ${id}`)
            try {
                // controlo mediciones
                let controlMensaje = true

                // recorro los datos enviados
                for (let clave of Object.keys(mensaje)) {
                    // si la clave del dato no se encuentra en los sensores del nodo
                    if (!nodo.sensores.includes(clave)) {
                        // indico que ha fallado el control y salgo del for
                        controlMensaje = false
                        break
                    }
                }

                if (controlMensaje === true) {
                    // inserto mediciones si se paso el control de mensajes
                    for (let clave of Object.keys(mensaje)) {
                        const resultado = await mediciones.insert({
                            nodo: id,
                            tiempo: tiempo,
                            sensor: clave,
                            valor: round10(mensaje[clave], -2),
                        })
                    }
                    // controlo las reglas asociadas al nodo
                    if (typeof nodo.reglas !== 'undefined') {
                        await controlarReglas(nodo, mensaje)
                    }
                } else {
                    servidor.log.error(
                        'Control de datos de sensores recibido no superado',
                    )
                }
            } catch (error) {
                servidor.log.error(error)
            }
        } else {
            servidor.log.error('nodo erróneo')
        }
    }

    // controlar reglas
    async function controlarReglas(nodo, datos) {
        // manejo de reglas
        const { Engine } = require('json-rules-engine')
        // armo facts
        const facts = datos
        const options = {
            allowUndefinedFacts: true,
        }
        for (const reglaId of nodo.reglas) {
            try {
                // obtengo regla
                const regla = await reglas.get(reglaId)
                // defino motor con regla a evaluar y opciones
                let arreglo = []
                arreglo.push(regla.condiciones)
                let motor = new Engine(arreglo, options)
                // si se cumple la regla
                motor.on('regla', (params) => {
                    for (const accion of regla.acciones) {
                        // si el nodo tiene el actuador mando mensaje
                        if (nodo.actuadores.includes(accion.actuador)) {
                            servidor.log.info(JSON.stringify(accion))
                            // se envía mensaje MQTT al nodo para que controle cambio de estado
                            cliente.publish(
                                `control/${nodo._id}`,
                                JSON.stringify(accion),
                            )
                        } else {
                            servidor.log.info(
                                `nodo sin actuador ${accion.actuador} asociado a la regla ${reglaId}`,
                            )
                        }
                    }
                })
                // ejecuto motor
                motor.run(facts)
            } catch (error) {
                servidor.log.error(error)
            }
        }
    }

    // agregar log
    async function agregarLog(topico, mensaje) {
        // nodo dentro del mensaje
        let id = topico.substring(11)
        // ver de usar NTP
        let tiempo = new Date().toJSON()

        // controlo si existe el nodo
        let cantidadNodo = await nodos.view('cantidad', 'cantidad', {
            key: id,
        })
        let cantidad = cantidadNodo.rows.length

        // si existe el nodo
        if (cantidad !== 0) {
            // obtengo nodo para usarlo en control de datos de mediciones y en reglas
            let nodo = await nodos.get(id)
            console.log(nodo.actuadores)
            console.log(mensaje.actuador)
            if (
                nodo.actuadores.includes(mensaje.actuador) ||
                mensaje.actuador === 'tiempo'
            ) {
                servidor.log.info(`Agregando datos recibidos de ${id}`)
                try {
                    // inserto logs
                    const resultado = await logs.insert({
                        nodo: id,
                        tiempo: tiempo,
                        actuador: mensaje.actuador,
                        valor: mensaje.valor,
                    })
                } catch (error) {
                    servidor.log.error(error)
                }
            } else {
                servidor.log.error('Control de datos de actuador recibido no superado')
            }
        } else {
            servidor.log.error('nodo erroneo')
        }
    }

    // agregar inicio
    async function agregarInicio(topico, mensaje) {
        // nodo dentro del mensaje
        let id = topico.substring(7)
        // ver de usar NTP
        let tiempo = new Date().toJSON()

        // controlo si existe el nodo
        let cantidadNodo = await nodos.view('cantidad', 'cantidad', {
            key: id,
        })
        let cantidad = cantidadNodo.rows.length
        // obtengo datos de nodo
        let nodo
        if (cantidad !== 0) {
            nodo = await nodos.get(id)
        }

        // obtengo sensores
        let q = {
            selector: {
                _id: { $gt: null },
            },
            fields: ['_id'],
        }
        let datosSensores = await sensores.find(q)
        datosSensores = datosSensores.docs
        datosSensores = datosSensores.map((sensor) => sensor._id)

        // obtengo actuadores
        let datosActuadores = await actuadores.find(q)
        datosActuadores = datosActuadores.docs
        datosActuadores = datosActuadores.map((actuador) => actuador._id)

        const controlClaves = ['tiempo', 'sensores', 'actuadores']


        // si existe el nodo
        // si todas las claves necesarias son enviadas
        // si los sensores existen en el sistema
        // si los actuadores existen en el sistema
        if (
            cantidad !== 0 &&
            lodash.xor(controlClaves, Object.keys(mensaje)).length === 0 &&
            lodash.difference(mensaje.sensores, datosSensores).length === 0 &&
            lodash.difference(mensaje.actuadores, datosActuadores).length === 0
        ) {
            servidor.log.info(`Agregando datos de inicio recibidos de ${id}`)
            try {
                for (let clave of Object.keys(mensaje)) {
                    // inserto datos en log del nodo
                    // si es tiempo ingreso directamente
                    // si es sensores o actuadores ingreso si hay valores en la lista
                    if (clave === 'tiempo' || mensaje[clave].length !== 0) {
                        const resultado = await logs.insert({
                            nodo: id,
                            tiempo: tiempo,
                            actuador: `Inicio - ${clave}`,
                            valor: mensaje[clave],
                        })
                    }
                }

                // cargo inicialmente en off los actuadores
                for (let i = 0; i < mensaje.actuadores.length; i++) {
                    const valorInicial = 'Off'
                    q = {
                        selector: {
                            _id: { $eq: mensaje.actuadores[i] },
                        },
                        fields: ['tipo'],
                    }
                    let tipo = await actuadores.find(q)
                    tipo = tipo.docs

                    if (tipo === 'multinivel') {
                        valorInicial = 0
                    }

                    const resultado = await logs.insert({
                        nodo: id,
                        tiempo: tiempo,
                        actuador: mensaje.actuadores[i],
                        valor: valorInicial,
                    })
                }
                // actualizo datos nodo
                await nodos.insert({
                    _id: nodo._id,
                    _rev: nodo._rev,
                    denominacion: nodo.denominacion,
                    latitud: nodo.latitud,
                    longitud: nodo.longitud,
                    ...(nodo.reglas && { reglas: nodo.reglas }),
                    actuadores: mensaje.actuadores,
                    sensores: mensaje.sensores,
                    tiempo: mensaje.tiempo,
                })
            } catch (error) {
                servidor.log.error(error)
            }
        } else {
            // si existe el nodo se debe eliminar sus datos asociados por error en inicio
            if (cantidad !== 0) {
                await nodos.insert({
                    _id: nodo._id,
                    _rev: nodo._rev,
                    denominacion: nodo.denominacion,
                    latitud: nodo.latitud,
                    longitud: nodo.longitud,
                    actuadores: [],
                    sensores: [],
                    tiempo: null,
                })
            }
            servidor.log.error('nodo erróneo o error en datos de inicio')
        }
    }
}

// expongo el decorador al ámbito de fastify
module.exports = fp(conectar)
