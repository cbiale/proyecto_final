'use strict'

const r = require('rethinkdb')

async function ingresar(servidor, opciones) {
  const db = opciones.rethinkdb

  // obtengo un usuario y comparo su clave

  //curl -X POST -H "Content-Type: application/json" -d '{"id": "prueba", "password": "nada"}' http://localhost:3001/api/v1/ingresar
  //curl -X POST -H "Content-Type: application/json" -d '{"id": "admin", "password": ""}' http://localhost:3001/api/v1/ingresar
  //curl -X POST -H "Content-Type: application/json" -d '{"id": "admin", "password": "admin"}' http://localhost:3001/api/v1/ingresar
  //curl -X GET -H "Authorization: Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjEzMDAwMTE3fQ.BhOJF8VHYXj6p31uGRlrlsqrobdtzlAuBWxgdQkm6Eo}" -H "Content-Type: application/json"  http://localhost:3001/api/v1/sensores
  async function obtenerUsuario(parametros, respuesta) {
    try {
      const { id, password } = parametros
      const resultado = await r
        .db('iot')
        .table('usuarios')
        .filter({ id: id, password: password })
        .count()
        .run(db)
        // si encuentro al usuario
        if (resultado !== 0) {
            // mando respuesta y token
            const token = await respuesta.jwtSign({ id })
            return { estado: 'ok', token }
        } else {
            // sino devuelvo error
            return { estado: 'error'}
        }
    } catch (error) {
      throw new Error(error)
    }
  }

  // defino las rutas

  // ingreso
  servidor.route({
    url: '/',
    method: 'POST',
    handler: async (request, response) => {
      request.log.info(
        `Controlando ingreso de usuario, datos: ${JSON.stringify(
          request.body,
        )}`,
      )
      return obtenerUsuario(request.body, response)
    },
  })
}

module.exports = ingresar
module.exports.autoPrefix = '/ingresar'
