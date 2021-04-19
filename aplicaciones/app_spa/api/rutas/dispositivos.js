'use strict'

async function dispositivos(servidor, opciones) {
  const dispositivos = opciones.couch.use('dispositivos')

  // obtengo los dispositivos
  async function obtenerDispositivos() {
    try {
      const limite = await opciones.couch.db.get('dispositivos').doc_count

      // obtengo los sensores
      const q = {
        selector: {},
        limit: limite
      }
      const resultado = await dispositivos.find(q)
      return resultado.docs
    } catch (error) {
      throw new Error(error)
    }
  }

  // obtengo un dispositivo
  async function obtenerDispositivo(id) {
    try {
      const resultado = await dispositivos.get(id)
      return resultado
    } catch (error) {
      throw new Error(error)
    }
  }

  // creo un dispositivo
  async function crearDispositivo(parametros) {
    try {
      const denominacion =
        parametros.denominacion.trim().charAt(0).toUpperCase() +
        parametros.denominacion.trim().slice(1).toLowerCase()
      const latitud = parametros.latitud
      const longitud = parametros.longitud

      const resultado = await dispositivos.insert({
        // _id: id,
        denominacion: denominacion,
        latitud: latitud,
        longitud: longitud,
      })
      return resultado
    } catch (error) {
      throw new Error(error)
    }
  }

  // modifico un dispositivos
  async function modificarDispositivo(id, parametros) {
    try {
      const denominacion =
        parametros.denominacion.trim().charAt(0).toUpperCase() +
        parametros.denominacion.trim().slice(1).toLowerCase()
      const latitud = parametros.latitud
      const longitud = parametros.longitud

      const resultado = await dispositivos.insert({
        _id: id,
        _rev: parametros._rev,
        denominacion: denominacion,
        latitud: latitud,
        longitud: longitud,
      })
      return resultado
    } catch (error) {
      throw new Error(error)
    }
  }

  // elimino un dispositivo
  async function eliminarDispositivo(id, rev) {
    try {
        const resultado = await dispositivos.destroy(id, rev)
        return resultado
    } catch (error) {
      throw new Error(error)
    }
  }

  // defino las rutas

  // obtengo dispositivos
  servidor.route({
    url: '/',
    method: 'GET',
    preValidation: [servidor.autenticar],
    handler: async (request, response) => {
      servidor.log.info(`Obteniendo dispositivos`)
      return obtenerDispositivos()
    },
  })

  // creo un dispositivo
  servidor.route({
    url: '/',
    method: 'POST',
    preValidation: [servidor.autenticar],
    handler: async (request, response) => {
      request.log.info(
        `Agregando dispositivo, datos: ${JSON.stringify(request.body)}`,
      )
      return crearDispositivo(request.body)
    },
  })

  // obtengo un dispositivo
  servidor.route({
    url: '/:id',
    method: 'GET',
    preValidation: [servidor.autenticar],
    handler: async (request, response) => {
      request.log.info(`Obteniendo dispositivo, id: ${request.params.id}`)
      return obtenerDispositivo(request.params.id)
    },
  })

  // modifico un dispositivo
  servidor.route({
    url: '/:id',
    method: 'PUT',
    preValidation: [servidor.autenticar],
    handler: async (request, response) => {
      request.log.info(
        `Modificando dispositivo, id: ${
          request.params.id
        }, datos: ${JSON.stringify(request.body)}`,
      )
      return modificarDispositivo(request.params.id, request.body)
    },
  })

  // elimino un dispositivo (borrado lógico)
  servidor.route({
    url: '/:id',
    method: 'DELETE',
    preValidation: [servidor.autenticar],
    handler: async (request, response) => {
      servidor.log.info(`Eliminando dispositivo, id: ${request.params.id} ${JSON.stringify(request.headers._rev)}`)
      return eliminarDispositivo(request.params.id, request.headers._rev)
    },
  })
}

module.exports = dispositivos
module.exports.autoPrefix = '/dispositivos'
