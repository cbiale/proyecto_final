'use strict'

async function actuadores(servidor, opciones) {
    const actuadores = opciones.couch.use('actuadores')

    // obtengo los actuadores
    async function obtenerActuadores() {
        try {
            // obtengo los actuadores
            const limite = await opciones.couch.db.get('actuadores').doc_count
            const q = {
                selector: {},
                limit: limite,
            }
            const resultado = await actuadores.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo un actuador
    async function obtenerActuador(id) {
        try {
            const resultado = await actuadores.get(id)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo un actuador
    async function crearActuador(parametros) {
        try {
            const id = parametros.descripcion.trim().toLowerCase().replace(/\s/g, '-')
            const descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()
            const tipo =
                parametros.tipo.trim().charAt(0).toUpperCase() +
                parametros.tipo.trim().slice(1).toLowerCase()

            const resultado = await actuadores.insert({
                _id: id,
                descripcion: descripcion,
                tipo: tipo,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico un actuador
    async function modificarActuador(id, parametros) {
        try {
            const descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()
            const tipo =
                parametros.tipo.trim().charAt(0).toUpperCase() +
                parametros.tipo.trim().slice(1).toLowerCase()

            const resultado = await actuadores.insert({
                _id: id,
                _rev: parametros._rev,
                descripcion: descripcion,
                tipo: tipo,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // elimino un actuador
    async function eliminarActuador(id, rev) {
        try {
            const resultado = await actuadores.destroy(id, rev)
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
            servidor.log.info(`Obteniendo actuadores`)
            return obtenerActuadores()
        },
    })

    // creo un actuador
    servidor.route({
        url: '/',
        method: 'POST',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(
                `Agregando actuador, datos: ${JSON.stringify(request.body)}`,
            )
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
                `Modificando actuador, id: ${request.params.id}, datos: ${JSON.stringify(
                    request.body,
                )}`,
            )
            return modificarActuador(request.params.id, request.body)
        },
    })

    // elimino un actuador
    servidor.route({
        url: '/:id',
        method: 'DELETE',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Eliminando actuador, id: ${request.params.id} ${JSON.stringify(request.headers._rev)}`)
            return eliminarActuador(request.params.id, request.headers._rev)
        },
    })
}

module.exports = actuadores
module.exports.autoPrefix = '/actuadores'

    