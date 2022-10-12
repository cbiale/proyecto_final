'use strict'

// guardar passwords con argon2
const argon2 = require('argon2')

async function usuarios(servidor, opciones) {
    const usuarios = opciones.couch.use('usuarios')

    // obtengo los usuarios
    async function obtenerUsuarios() {
        try {
            // obtengo los usuarios
            const limite = await opciones.couch.db.get('usuarios').doc_count
            const q = {
                selector: {
                    _id: { $ne: 'admin' },
                },
                limit: limite,
            }
            const resultado = await usuarios.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo un usuario
    async function obtenerUsuario(id) {
        try {
            let resultado = null
            if (id !== 'admin') {
                const resultado = await usuarios.get(id)
                return resultado
            }
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo un usuario
    async function crearUsuario(parametros) {
        try {
            const id = parametros.id.trim()
            const password = parametros.password.trim()
            const hash = await argon2.hash(password)

            const resultado = await usuarios.insert({
                _id: id,
                password: hash,
                administrador: parametros.administrador
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico un usuario
    async function modificarUsuario(id, parametros) {
        try {
            const password = parametros.password.trim()
            const hash = await argon2.hash(password)

            const resultado = await usuarios.insert({
                _id: id,
                _rev: parametros._rev,
                password: hash,
                administrador: parametros.administrador
            })
            return resultado

        } catch (error) {
            throw new Error(error)
        }
    }

    // elimino un usuario
    async function eliminarUsuario(id, rev) {
        try {
            const resultado = await usuarios.destroy(id, rev)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // defino las rutas

    // obtengo usuarios
    servidor.route({
        url: '/',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Obteniendo usuarios`)
            return obtenerUsuarios()
        },
    })

    // creo un usuario
    servidor.route({
        url: '/',
        method: 'POST',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(
                `Agregando usuario, datos: ${JSON.stringify(request.body)}`,
            )
            return crearUsuario(request.body)
        },
    })

    // obtengo un usuario
    servidor.route({
        url: '/:id',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(`Obteniendo usuario, id: ${request.params.id}`)
            return obtenerUsuario(request.params.id)
        },
    })

    // modifico un usuario
    servidor.route({
        url: '/:id',
        method: 'PUT',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(
                `Modificando usuario, id: ${request.params.id}, datos: ${JSON.stringify(
                    request.body,
                )}`,
            )
            return modificarUsuario(request.params.id, request.body)
        },
    })

    // elimino un usuario
    servidor.route({
        url: '/:id',
        method: 'DELETE',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Eliminando usuario, id: ${request.params.id} ${JSON.stringify(request.headers._rev)}`)
            return eliminarUsuario(request.params.id, request.headers._rev)
        },
    })
}

module.exports = usuarios
module.exports.autoPrefix = '/usuarios'
