'use strict'

const r = require('rethinkdb')

async function actuadores(servidor, opciones) {
    const db = opciones.rethinkdb

    // obtengo los actuadores
    async function obtenerActuadores() {
        try {
            const datos = await r
                .db('iot')
                .table('actuadores')
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

    // obtengo un actuador
    async function obtenerActuador(id) {
        try {
            const resultado = await r.db('iot').table('actuadores').get(id).run(db)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo un actuador
    async function crearActuador(parametros) {
        try {
            const descripcion = parametros.descripcion
            const metrica = parametros.metrica

            const resultado = await r.
                db('iot').table('actuadores')
                .insert({
                    descripcion: descripcion,
                    metrica: metrica,
                })
                .run(db)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico un actuador
    async function modificarActuador(id, parametros) {
        try {
            const descripcion = parametros.descripcion
            const metrica = parametros.metrica

            const resultado = await r
                .db('iot').table('actuadores').get(id)
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

    // elimino un actuador
    async function eliminarActuador(id) {
        try {
            const resultado = await r
                .db('iot').table('actuadores').get(id)
                .update({ borrado: 1 })
                .run(db)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // defino las rutas

    // obtengo actuadores
    servidor.route({
        url: '/',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Obteniendo sensores`)
            return obtenerActuadores()
        },
    })

    // creo un actuador
    servidor.route({
        url: '/',
        method: 'POST',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(`Agregando actuador, datos: ${JSON.stringify(request.body)}`)
            return crearActuador(request.body)
        },
    })

    // obtengo un actuador
    servidor.route({
        url: '/:id',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(`Obteniendo actuador, id: ${request.params.id}`)
            return obtenerActuador(request.params.id)
        },
    })

    // modifico un actuador
    servidor.route({
        url: '/:id',
        method: 'PUT',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(
                `Modificando actuador, id: ${request.params.id}, datos: ${JSON.stringify(request.body)}`,
            )
            return modificarActuador(request.params.id, request.body)
        },
    })

    // elimino un actuador (borrado lógico)
    servidor.route({
        url: '/:id',
        method: 'DELETE',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Eliminando actuador, id: ${request.params.id}`)
            return eliminarActuador(request.params.id)
        },
    })
}

module.exports = actuadores
module.exports.autoPrefix = '/actuadores'
