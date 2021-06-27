'use strict'

const fp = require('fastify-plugin')
const mqtt = require('async-mqtt')
const lodash = require('lodash')
const { includes } = require('lodash')

// conecto a un servidor mqtt
async function conectar(servidor, opciones) {
    const mediciones = opciones.couch.use('mediciones')
    const logs = opciones.couch.use('logs')
    const sensores = opciones.couch.use('sensores')
    const actuadores = opciones.couch.use('actuadores')
    const dispositivos = opciones.couch.use('dispositivos')
    const reglas = opciones.couch.use('reglas')

    servidor.log.info('Obteniendo conexión a MQTT...')
    let cliente = mqtt.connect('mqtt://emqx:1883')
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
        // dispositivo dentro del mensaje
        let dispositivoId = topico.substring(9)
        // ver de usar NTP
        let tiempo = new Date().toJSON()

        // controlo si existe el dispositivo
        let cantidadDispositivo = await dispositivos.view('cantidad', 'cantidad', {
            key: dispositivoId,
        })
        let cantidad = cantidadDispositivo.rows.length

        // si existe el dispositivo
        if (cantidad !== 0) {
            // obtengo dispositivo para usarlo en control de datos de mediciones y en reglas
            let dispositivo = await dispositivos.get(dispositivoId)

            servidor.log.info(`Agregando datos recibidos de ${dispositivoId}`)
            try {
                // controlo mediciones
                let controlMensaje = true

                // recorro los datos enviados
                for (let clave of Object.keys(mensaje)) {
                    // si la clave del dato no se encuentra en los sensores del dispositivo
                    if (!dispositivo.sensores.includes(clave)) {
                        // indico que ha fallado el control y salgo del for
                        controlMensaje = false
                        break
                    }
                }

                if (controlMensaje === true) {
                    // inserto mediciones si se paso el control de mensajes
                    for (let clave of Object.keys(mensaje)) {
                        const resultado = await mediciones.insert({
                            dispositivoId: dispositivoId,
                            tiempo: tiempo,
                            sensor: clave,
                            valor: mensaje[clave],
                        })
                    }
                    // controlo las reglas asociadas al nodo
                    if (typeof dispositivo.reglas !== 'undefined') {
                        await controlarReglas(dispositivo, mensaje)
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
            servidor.log.error('Dispositivo erróneo')
        }
    }

    // controlar reglas
    async function controlarReglas(dispositivo, datos) {
        // manejo de reglas
        const { Engine } = require('json-rules-engine')
        // armo facts
        const facts = datos
        const options = {
            allowUndefinedFacts: true,
        }
        for (const reglaId of dispositivo.reglas) {
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
                        // si el dispositivo tiene el actuador mando mensaje
                        if (dispositivo.actuadores.includes(accion.actuador)) {
                            servidor.log.info(JSON.stringify(accion))
                            // se envía mensaje MQTT al dispositivo para que controle cambio de estado
                            cliente.publish(
                                `control/${dispositivo._id}`,
                                JSON.stringify(accion),
                            )
                        } else {
                            servidor.log.info(
                                `Dispositivo sin actuador ${accion.actuador} asociado a la regla ${reglaId}`,
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
        // dispositivo dentro del mensaje
        let dispositivoId = topico.substring(11)
        // ver de usar NTP
        let tiempo = new Date().toJSON()

        // controlo si existe el dispositivo
        let cantidadDispositivo = await dispositivos.view('cantidad', 'cantidad', {
            key: dispositivoId,
        })
        let cantidad = cantidadDispositivo.rows.length

        // si existe el dispositivo
        if (cantidad !== 0) {
            // obtengo dispositivo para usarlo en control de datos de mediciones y en reglas
            let dispositivo = await dispositivos.get(dispositivoId)

            if (
                dispositivo.actuadores.includes(mensaje.actuador) ||
                mensaje.actuador === 'tiempo'
            ) {
                servidor.log.info(`Agregando datos recibidos de ${dispositivoId}`)
                try {
                    // inserto logs
                    const resultado = await logs.insert({
                        dispositivoId: dispositivoId,
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
            servidor.log.error('Dispositivo erroneo')
        }
    }

    // agregar inicio
    async function agregarInicio(topico, mensaje) {
        // dispositivo dentro del mensaje
        let dispositivoId = topico.substring(7)
        // ver de usar NTP
        let tiempo = new Date().toJSON()

        // controlo si existe el dispositivo
        let cantidadDispositivo = await dispositivos.view('cantidad', 'cantidad', {
            key: dispositivoId,
        })
        let cantidad = cantidadDispositivo.rows.length
        // obtengo datos de dispositivo
        let dispositivo
        if (cantidad !== 0) {
            dispositivo = await dispositivos.get(dispositivoId)
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

        // si existe el dispositivo
        // si todas las claves necesarias son enviadas
        // si los sensores existen en el sistema
        // si los actuadores existen en el sistema
        if (
            cantidad !== 0 &&
            lodash.xor(controlClaves, Object.keys(mensaje)).length === 0 &&
            lodash.difference(mensaje.sensores, datosSensores).length === 0 &&
            lodash.difference(mensaje.actuadores, datosActuadores).length === 0
        ) {
            servidor.log.info(
                `Agregando datos de inicio recibidos de ${dispositivoId}`,
            )
            try {
                for (let clave of Object.keys(mensaje)) {
                    // inserto datos en log del dispositivo
                    // si es tiempo ingreso directamente
                    // si es sensores o actuadores ingreso si hay valores en la lista
                    if (clave === 'tiempo' || mensaje[clave].length !== 0) {
                        const resultado = await logs.insert({
                            dispositivoId: dispositivoId,
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

                    console.log(tipo)
                    if (tipo === 'multinivel') {
                        valorInicial = 0
                    }

                    const resultado = await logs.insert({
                        dispositivoId: dispositivoId,
                        tiempo: tiempo,
                        actuador: mensaje.actuadores[i],
                        valor: valorInicial,
                    })
                }

                // actualizo datos dispositivo
                await dispositivos.insert({
                    _id: dispositivo._id,
                    _rev: dispositivo._rev,
                    denominacion: dispositivo.denominacion,
                    latitud: dispositivo.latitud,
                    longitud: dispositivo.longitud,
                    ...(dispositivo.reglas && { reglas: dispositivo.reglas }),
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
                await dispositivos.insert({
                    _id: dispositivo._id,
                    _rev: dispositivo._rev,
                    denominacion: dispositivo.denominacion,
                    latitud: dispositivo.latitud,
                    longitud: dispositivo.longitud,
                    actuadores: [],
                    sensores: [],
                    tiempo: null,
                })
            }
            servidor.log.error('Dispositivo erróneo o error en datos de inicio')
        }
    }
}

// expongo el decorador al ámbito de fastify
module.exports = fp(conectar)
