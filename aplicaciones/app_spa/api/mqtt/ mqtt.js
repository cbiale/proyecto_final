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

  servidor.log.info('Obteniendo conexión a MQTT...')
  let cliente = mqtt.connect('mqtt://localhost:1883')
  servidor.log.info('Conexión a MQTT obtenida')
  try {
    // suscripciones
    // inicio: determina los sensores y actuadores del nodo
    await cliente.subscribe('inicio/#')
    // mediciones: se obtienen las mediciones y estado del nodo
    await cliente.subscribe('estado/#')

    // al recibir un mensaje
    cliente.on('message', (topico, mensaje) => {
      console.log(`Nuevo mensaje: ${topico} ${mensaje}`)
      try {
        if (topico.indexOf('estado') !== -1) {
          let datos = JSON.parse(mensaje)
          agregarMedicion(topico, datos)
        }
        if (topico.indexOf('inicio') !== -1) {
          let datos = JSON.parse(mensaje)
          agregarInicio(topico, datos)
        }
      } catch (error) {
        console.log('Mensaje mal formado o error al insertar')
      }
    })
  } catch (error) {
    throw new Error(error)
  }

  // uso luego en rutas
  servidor.decorate('mqtt', cliente)

  // agregar medición
  async function agregarMedicion(topico, mensaje) {
    // dispositivo dentro del mensaje
    let dispositivoId = topico.substring(7)
    // ver de usar NTP
    let tiempo = new Date().toJSON()

    // controlo si existe el dispositivo
    let cantidadDispositivo = await dispositivos.view('cantidad', 'cantidad', {
      key: dispositivoId,
    })
    let cantidad = cantidadDispositivo.rows.length
    
    // si existe el dispositivo
    if (cantidad !== 0) {
      servidor.log.info(`Agregando datos recibidos de ${dispositivoId}`)
      try {
        // inserto mediciones
        for (let clave of Object.keys(mensaje)) {
          console.log(clave)
          const resultado = await mediciones.insert({
            dispositivoId: dispositivoId,
            tiempo: tiempo,
            sensor: clave,
            valor: mensaje[clave],
          })
        }
      } catch (error) {
        console.log(error)
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
    datosActuadores = datosActuadores.map((sensor) => sensor._id)

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
          const valorInicial = 'off'
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
          actuadores: mensaje.actuadores,
          sensores: mensaje.sensores,
          tiempo: mensaje.tiempo,
        })
      } catch (error) {
        console.log(error)
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
