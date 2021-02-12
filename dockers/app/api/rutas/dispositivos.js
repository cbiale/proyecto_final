'use strict'

const r = require('rethinkdb')

async function dispositivos(servidor, opciones) {
    const db = opciones.rethinkdb

    // obtengo los dispositivos
    async function obtenerDispositivos() {
        try {
            const datos = await r
                .db('iot')
                .table('dispositivos')
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

    // obtengo un dispositivo
    async function obtenerDispositivo(id) {
        try {
            const resultado = await r.db('iot').table('dispositivos').get(id).run(db)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo un dispositivo
    async function crearDispositivo(parametros) {
        try {
            const denominacion = parametros.denominacion
            const latitud = parametros.latitud
            const longitud = parametros.longitud

            const resultado = await r
                .db('iot')
                .table('dispositivos')
                .insert({
                    denominacion: denominacion,
                    latitud: latitud,
                    longitud: longitud
                })
                .run(db)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico un dispositivos
    async function modificarDispositivo(id, parametros) {
        try {
            const denominacion = parametros.denominacion
            const latitud = parametros.latitud
            const longitud = parametros.longitud

            const resultado = await r
                .db('iot')
                .table('dispositivos')
                .get(id)
                .update({
                    denominacion: denominacion,
                    latitud: latitud,
                    longitud: longitud
                })
                .run(db)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // elimino un dispositivo
    async function eliminarDispositivo(id) {
        try {
            const resultado = await r
                .db('iot')
                .table('dispositivos')
                .get(id)
                .update({ borrado: 1 })
                .run(db)
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
            request.log.info(`Agregando dispositivo, datos: ${JSON.stringify(request.body)}`)
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
                `Modificando dispositivo, id: ${request.params.id}, datos: ${JSON.stringify(request.body)}`,
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
            servidor.log.info(`Eliminando dispositivo, id: ${request.params.id}`)
            return eliminarDispositivo(request.params.id)
        },
    })
}

module.exports = dispositivos
module.exports.autoPrefix = '/dispositivos'
