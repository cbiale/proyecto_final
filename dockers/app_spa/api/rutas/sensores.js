'use strict'

const r = require('rethinkdb')

async function sensores(servidor, opciones) {
  const db = opciones.rethinkdb

  // obtengo los sensores
  async function obtenerSensores() {
    try {
      const datos = await r
        .db('iot')
        .table('sensores')
        .filter({
          borrado: 0,
        })
        .run(db)
      const resultado = await datos.toArray()
      return resultado
    } catch (error) {
      throw new Error(error)
    }
  }

  // obtengo un sensor
  async function obtenerSensor(id) {
    try {
      const resultado = await r.db('iot').table('sensores').get(id).run(db)
      return resultado
    } catch (error) {
      throw new Error(error)
    }
  }

  // creo un sensor
  async function crearSensor(parametros) {
    try {
      const descripcion =
        parametros.descripcion.charAt(0).toUpperCase() +
        parametros.descripcion.slice(1).toLowerCase()
      const metrica =
        parametros.metrica.charAt(0).toUpperCase() +
        parametros.metrica.slice(1).toLowerCase()

      const resultado = await r
        .db('iot')
        .table('sensores')
        .insert({
          descripcion: descripcion,
          metrica: metrica,
          borrado: 0,
        })
        .run(db)
      return resultado
    } catch (error) {
      throw new Error(error)
    }
  }

  // modifico un sensor
  async function modificarSensor(id, parametros) {
    try {
      const descripcion =
        parametros.descripcion.charAt(0).toUpperCase() +
        parametros.descripcion.slice(1).toLowerCase()
      const metrica =
        parametros.metrica.charAt(0).toUpperCase() +
        parametros.metrica.slice(1).toLowerCase()

      const resultado = await r
        .db('iot')
        .table('sensores')
        .get(id)
        .update({
          descripcion: descripcion,
          metrica: metrica,
        })
        .run(db)
      return resultado
    } catch (error) {
      throw new Error(error)
    }
  }

  // elimino un sensor
  async function eliminarSensor(id) {
    try {
      const resultado = await r
        .db('iot')
        .table('sensores')
        .get(id)
        .update({ borrado: 1 })
        .run(db)
      return resultado
    } catch (error) {
      throw new Error(error)
    }
  }

  // defino las rutas

  // obtengo sensores
  servidor.route({
    url: '/',
    method: 'GET',
    preValidation: [servidor.autenticar],
    handler: async (request, response) => {
      servidor.log.info(`Obteniendo sensores`)
      return obtenerSensores()
    },
  })

  // creo un sensor
  servidor.route({
    url: '/',
    method: 'POST',
    preValidation: [servidor.autenticar],
    handler: async (request, response) => {
      request.log.info(
        `Agregando sensor, datos: ${JSON.stringify(request.body)}`,
      )
      return crearSensor(request.body)
    },
  })

  // obtengo un sensor
  servidor.route({
    url: '/:id',
    method: 'GET',
    preValidation: [servidor.autenticar],
    handler: async (request, response) => {
      request.log.info(`Obteniendo sensor, id: ${request.params.id}`)
      return obtenerSensor(request.params.id)
    },
  })

  // modifico un sensor
  servidor.route({
    url: '/:id',
    method: 'PUT',
    preValidation: [servidor.autenticar],
    handler: async (request, response) => {
      request.log.info(
        `Modificando sensor, id: ${request.params.id}, datos: ${JSON.stringify(
          request.body,
        )}`,
      )
      return modificarSensor(request.params.id, request.body)
    },
  })

  // elimino un sensor (borrado lógico)
  servidor.route({
    url: '/:id',
    method: 'DELETE',
    preValidation: [servidor.autenticar],
    handler: async (request, response) => {
      servidor.log.info(`Eliminando sensor, id: ${request.params.id}`)
      return eliminarSensor(request.params.id)
    },
  })
}

module.exports = sensores
module.exports.autoPrefix = '/sensores'
