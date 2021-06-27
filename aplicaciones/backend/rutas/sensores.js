'use strict'

async function sensores(servidor, opciones) {
    const sensores = opciones.couch.use('sensores')

    async function obtenerSensores() {
        try {
            // obtengo los sensores
            const limite = await opciones.couch.db.get('sensores').doc_count
            const q = {
                selector: {
                },
                limit: limite,
            }
            const resultado = await sensores.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo un sensor
    async function obtenerSensor(id) {
        try {
            const resultado = await sensores.get(id)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo un sensor
    async function crearSensor(parametros) {
        try {
            const id = parametros.descripcion.trim().toLowerCase().replace(/\s/g, '-')
            const descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()
            const metrica =
                parametros.metrica.trim().charAt(0).toUpperCase() +
                parametros.metrica.trim().slice(1).toLowerCase()

            const resultado = await sensores.insert({
                _id: id,
                descripcion: descripcion,
                metrica: metrica,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico un sensor
    async function modificarSensor(id, parametros) {
        try {
            const descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()

            const metrica =
                parametros.metrica.charAt(0).trim().toUpperCase() +
                parametros.metrica.slice(1).trim().toLowerCase()

            const resultado = await sensores.insert({
                _id: id,
                _rev: parametros._rev,
                descripcion: descripcion,
                metrica: metrica,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // elimino un sensor
    async function eliminarSensor(id, rev) {
        try {
            const resultado = await sensores.destroy(id, rev)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // defino las rutas

    // obtengo sensores
    servidor.route({
        url: '/',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Obteniendo sensores`)
            return obtenerSensores()
        },
    })

    // creo un sensor
    servidor.route({
        url: '/',
        method: 'POST',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(
                `Agregando sensor, datos: ${JSON.stringify(request.body)}`,
            )
            return crearSensor(request.body)
        },
    })

    // obtengo un sensor
    servidor.route({
        url: '/:id',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(`Obteniendo sensor, id: ${request.params.id}`)
            return obtenerSensor(request.params.id)
        },
    })

    // modifico un sensor
    servidor.route({
        url: '/:id',
        method: 'PUT',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(
                `Modificando sensor, id: ${request.params.id}, datos: ${JSON.stringify(
                    request.body,
                )}`,
            )
            return modificarSensor(request.params.id, request.body)
        },
    })

    // elimino un sensor
    servidor.route({
        url: '/:id',
        method: 'DELETE',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Eliminando sensor, id: ${request.params.id} ${JSON.stringify(request.headers._rev)}`)
            return eliminarSensor(request.params.id, request.headers._rev)
        },
    })
}

module.exports = sensores
module.exports.autoPrefix = '/sensores'
