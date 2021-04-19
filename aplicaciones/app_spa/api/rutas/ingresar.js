'use strict'

const argon2 = require('argon2')

async function ingresar(servidor, opciones) {
  const usuarios = opciones.couch.use('usuarios')

  // obtengo un usuario y comparo su clave

  //curl -X POST -H "Content-Type: application/json" -d '{"id": "prueba", "password": "nada"}' http://localhost:3001/api/v1/ingresar
  //curl -X POST -H "Content-Type: application/json" -d '{"id": "admin", "password": ""}' http://localhost:3001/api/v1/ingresar
  //curl -X POST -H "Content-Type: application/json" -d '{"id": "admin", "password": "admin"}' http://localhost:3001/api/v1/ingresar
  //curl -X GET -H "Authorization: Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjEzMDAwMTE3fQ.BhOJF8VHYXj6p31uGRlrlsqrobdtzlAuBWxgdQkm6Eo}" -H "Content-Type: application/json"  http://localhost:3001/api/v1/sensores
  async function obtenerUsuario(parametros, respuesta) {
    try {
      const { id, password } = parametros

      // const resultado = await r.db('iot').table('usuarios').get(id).run(db)
      const resultado = await usuarios.get(id)
      servidor.log.info(resultado)
      servidor.log.info(resultado.id === id)
      servidor.log.info(await argon2.verify(resultado.password, password))

      // si encuentro al usuario
      if (
        resultado._id === id &&
        (await argon2.verify(resultado.password, password))
      ) {
        // password match
        // mando respuesta y token
        const token = await respuesta.jwtSign({ id })
        return { estado: 'ok', token }
      } else {
        // password did not match
        return { estado: 'error' }
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