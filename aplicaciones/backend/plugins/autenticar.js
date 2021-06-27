'use strict'

const fp = require('fastify-plugin')

async function autenticar(servidor, opts) {
    const { httpErrors, config } = servidor

    servidor.register(require('fastify-jwt'), {
        secret: servidor.config.JWT_SECRET,
    })

    // para usar en las rutas privadas
    servidor.decorate('autenticar', async function (request, reply) {
        try {
            // verifico el token
            // se puede validar si el token no entro en una blacklist
            // almacenando el token en una tabla de la base de datos
            const valor = await request.jwtVerify()
        } catch (err) {
            throw httpErrors.forbidden('No se ha encontrado autorización' + err)
        }
    })
}

// expongo el decorador al ámbito de fastify
module.exports = fp(autenticar)
