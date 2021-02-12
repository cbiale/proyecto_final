'use strict'

const r = require('rethinkdb')

async function usuarios(servidor, opciones) {
    const db = opciones.rethinkdb

    // obtengo los usuarios
    async function obtenerUsuarios() {
        try {
            const datos = await r.db('iot').table('usuarios').
            filter(
                r.row('id').ne('admin')
                .and(r.row('borrado').eq(0)))
                .run(db)
            const resultado = await datos.toArray()
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo un usuario
    async function obtenerUsuario(id) {
        try {
            let resultado = null
            if (id !== 'admin') {
                resultado = await r.db('iot').table('usuarios').get(id).run(db)
            }
            console.log(resultado)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo un usuario
    async function crearUsuario(parametros) {
        try {
            const id = parametros.id
            const password = parametros.password

            const resultado = await r
                .db('iot')
                .table('usuarios')
                .insert({
                    id: id,
                    password: password,
                })
                .run(db)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico un usuario
    async function modificarUsuario(parametros) {
        try {
            const password = parametros.password

            const resultado = await r
                .db('iot')
                .table('usuarios')
                .get(id)
                .update({
                    password: password,
                })
                .run(db)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // elimino un usuario
    async function eliminarUsuario(id) {
        try {
            const resultado = await r
                .db('iot')
                .table('usuarios')
                .get(id)
                .update({
                    borrado: 1,
                })
                .run(db)
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
            request.log.info(`Agregando usuario, datos: ${JSON.stringify(request.body)}`)
            return crearUsuario(request.params)
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
                `Modificando usuario, id: ${request.params.id}, datos: ${JSON.stringify(request.body)}`,
            )
            return modificarUsuario(request.params)
        },
    })

    // elimino un usuario
    servidor.route({
        url: '/:id',
        method: 'DELETE',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Eliminando usuario, id: ${request.params.id}`)
            return eliminarUsuario(request.params.id)
        },
    })
}

module.exports = usuarios
module.exports.autoPrefix = '/usuarios'
