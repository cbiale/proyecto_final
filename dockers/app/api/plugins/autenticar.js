'use strict'

const fp = require('fastify-plugin')

async function autenticar(servidor, opts) {
  const { httpErrors, config } = servidor

  servidor.register(require('fastify-jwt'), {
    secret: servidor.config.JWT_SECRET,
  })

  // para usar en las rutas privadas
  servidor.decorate('autenticar', async function (requerimiento, respuesta) {
    try {
      // verifico el token
      // se puede validar si el token no entro en una blacklist
      // almacenando el tocken en una tabla de la base de datos
      await requerimiento.jwtVerify()
    } catch (err) {
      //respuesta.send(err)
      throw httpErrors.forbidden('No se ha encontrado autorización')
    }
  })
}

// expongo el decorador al ámbito de fastify
module.exports = fp(autenticar)
