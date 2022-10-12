'use strict'

async function nodos(servidor, opciones) {
    const nodos = opciones.couch.use('nodos')
    const mqtt = opciones.mqtt

    // obtengo los nodos
    async function obtenerNodos() {
        try {
            const limite = await opciones.couch.db.get('nodos').doc_count

            // obtengo los sensores
            const q = {
                selector: {},
                limit: limite,
            }
            const resultado = await nodos.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo un nodo
    async function obtenerNodo(id) {
        try {
            const resultado = await nodos.get(id)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo un nodo
    async function crearNodo(parametros) {
        try {
            parametros.denominacion =
                parametros.denominacion.trim().charAt(0).toUpperCase() +
                parametros.denominacion.trim().slice(1).toLowerCase()
            parametros.latitud = parseFloat(parametros.latitud)
            parametros.longitud = parseFloat(parametros.longitud)

            const resultado = await nodos.insert({
                denominacion: parametros.denominacion,
                latitud: parametros.latitud,
                longitud: parametros.longitud,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico un nodos
    async function modificarNodo(id, parametros) {
        try {
            parametros.denominacion =
                parametros.denominacion.trim().charAt(0).toUpperCase() +
                parametros.denominacion.trim().slice(1).toLowerCase()
            parametros.latitud = parseFloat(parametros.latitud)
            parametros.longitud = parseFloat(parametros.longitud)
            if (parametros.tiempo) {
                parametros.tiempo = parseInt(parametros.tiempo)
                // enviar mensaje MQTT al nodo
                let estado = {
                    actuador: 'tiempo',
                    valor: parametros.tiempo,
                }
                await mqtt.publish(`tiempo/${id}`, JSON.stringify(estado))
            }

            const resultado = await nodos.insert({
                _id: id,
                _rev: parametros._rev,
                denominacion: parametros.denominacion,
                latitud: parametros.latitud,
                longitud: parametros.longitud,
                // verificar uso
                ...(parametros.tiempo && { tiempo: parametros.tiempo }),
                ...(parametros.sensores && { sensores: parametros.sensores }),
                ...(parametros.actuadores && { actuadores: parametros.actuadores }),
                ...(parametros.reglas && { reglas: parametros.reglas }),
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // elimino un nodo
    async function eliminarNodo(id, rev) {
        try {
            const resultado = await nodos.destroy(id, rev)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // defino las rutas

    // obtengo nodos
    servidor.route({
        url: '/',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Obteniendo nodos`)
            return obtenerNodos()
        },
    })

    // creo un nodo
    servidor.route({
        url: '/',
        method: 'POST',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(
                `Agregando nodo, datos: ${JSON.stringify(request.body)}`,
            )
            return crearNodo(request.body)
        },
    })

    // obtengo un nodo
    servidor.route({
        url: '/:id',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(`Obteniendo nodo, id: ${request.params.id}`)
            return obtenerNodo(request.params.id)
        },
    })

    // modifico un nodo
    servidor.route({
        url: '/:id',
        method: 'PUT',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            request.log.info(
                `Modificando nodo, id: ${request.params.id
                }, datos: ${JSON.stringify(request.body)}`,
            )
            return modificarNodo(request.params.id, request.body)
        },
    })

    // elimino un nodo (borrado lógico)
    servidor.route({
        url: '/:id',
        method: 'DELETE',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(
                `Eliminando nodo, id: ${request.params.id} ${JSON.stringify(
                    request.headers._rev,
                )}`,
            )
            return eliminarNodo(request.params.id, request.headers._rev)
        },
    })
}

module.exports = nodos
module.exports.autoPrefix = '/nodos'
