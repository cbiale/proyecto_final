/* istanbul ignore file */

const build = require('../app')
const argon2 = require('argon2')

async function cargarDatosIngresar() {
    fastify = await build()
    // creo el usuario admin_prueba
    const password = await argon2.hash('admin')

    await fastify.couch.db.use('usuarios').insert({
        _id: 'admin_prueba',
        password: password,
        administrador: true
    })
    return fastify
}


async function cargarDatos() {
    fastify = await build()
    // creo el usuario admin_prueba
    const password = await argon2.hash('admin')

    await fastify.couch.db.use('usuarios').insert({
        _id: 'admin_prueba',
        password: password,
        administrador: true
    })
    // me conecto al sistema con el usuario admin_prueba
    const respuesta = await fastify.inject({
        method: 'POST',
        url: '/api/v1/ingresar/',
        body: { id: 'admin_prueba', password: 'admin' }
    })
    const json = respuesta.json()
    // obtengo el token
    token = json.token
    return {
        fastify : fastify,
        token : token 
    }
}


async function limpiarDatos(fastify) {
    await fastify.couch.db.destroy('usuarios')
    await fastify.couch.db.destroy('sensores')
    await fastify.couch.db.destroy('nodos')
    await fastify.couch.db.destroy('actuadores')
    await fastify.couch.db.destroy('mediciones')
    await fastify.couch.db.destroy('logs')
    await fastify.couch.db.destroy('reglas')
    await fastify.close()
}


module.exports = {
    cargarDatosIngresar, cargarDatos, limpiarDatos
}