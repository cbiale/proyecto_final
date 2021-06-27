'use strict'

async function reglas(servidor, opciones) {
    const reglas = opciones.couch.use('reglas')

    // obtengo los reglas
    async function obtenerReglas() {
        try {
            // obtengo los reglas
            const limite = await opciones.couch.db.get('reglas').doc_count
            const q = {
                selector: {},
                limit: limite,
            }
            const resultado = await reglas.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo una regla
    async function obtenerRegla(id) {
        try {
            const resultado = await reglas.get(id)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo una regla
    async function crearRegla(parametros) {
        try {
            parametros.descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()

            const resultado = await reglas.insert({
                descripcion: parametros.descripcion,
                condiciones: parametros.condiciones,
                acciones: parametros.acciones,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico una regla
    async function modificarRegla(id, parametros) {
        try {
            parametros.descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()

            const resultado = await reglas.insert({
                _id: id,
                _rev: parametros._rev,
                descripcion: parametros.descripcion,
                condiciones: parametros.condiciones,
                acciones: parametros.acciones,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // elimino una regla
    async function eliminarRegla(id, rev) {
        try {
            const resultado = await reglas.destroy(id, rev)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // defino las rutas

    // obtengo reglas
    servidor.route({
        url: '/',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Obteniendo reglas`)
            return obtenerReglas()
        },
    })

    // creo una regla
    servidor.route({
        url: '/',
        method: 'POST',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(
                `Agregando regla, datos: ${JSON.stringify(request.body)}`,
            )
            return crearRegla(request.body)
        },
    })

    // obtengo una regla
    servidor.route({
        url: '/:id',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(`Obteniendo regla, id: ${request.params.id}`)
            return obtenerRegla(request.params.id)
        },
    })

    // modifico una regla
    servidor.route({
        url: '/:id',
        method: 'PUT',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(
                `Modificando regla, id: ${request.params.id}, datos: ${JSON.stringify(
                    request.body,
                )}`,
            )
            return modificarRegla(request.params.id, request.body)
        },
    })

    // elimino una regla
    servidor.route({
        url: '/:id',
        method: 'DELETE',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(
                `Eliminando regla, id: ${request.params.id} ${JSON.stringify(
                    request.headers._rev,
                )}`,
            )
            return eliminarRegla(request.params.id, request.headers._rev)
        },
    })
}

module.exports = reglas
module.exports.autoPrefix = '/reglas'
