'use strict'

async function logs(servidor, opciones) {
    const logs = opciones.couch.use('logs')
    const actuadores = opciones.couch.use('actuadores')
    const nodos = opciones.couch.use('nodos')

    // obtengo los logs
    async function obtenerLogs(id) {
        try {
            // obtengo los logs
            const datosLogs = await opciones.couch.db.get('logs').doc_count
            const q = {
                selector: {
                    nodo: { $eq: id },
                    tiempo: { $gt: null },
                },
                limit: datosLogs,
                sort: [{ tiempo: 'desc' }],
            }
            const resultado = await logs.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo los logs de un actuador
    async function obtenerLogsActuador(id, actuador) {
        try {
            // obtengo ultimo dato obtenido de los logs del actuador
            // obtengo datos del actuador
            const descripcion = await actuadores.get(actuador)

            // obtengo los logs
            const q = {
                selector: {
                    nodo: { $eq: id },
                    actuador: { $eq: actuador },
                    tiempo: { $gt: null },
                },
                sort: [{ tiempo: 'desc' }],
                fields: ['valor'],
                limit: 1,
            }
            const datos = await logs.find(q)
            const arreglo = datos.docs.map(({ valor }) => valor)

            return {
                actuador: descripcion,
                datos: datos.docs,
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    // defino las rutas

    // obtengo logs
    servidor.route({
        url: '/:id',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Obteniendo logs, id: ${request.params.id}`)
            return obtenerLogs(request.params.id)
        },
    })

    // obtengo logs de un nodo por tipo de actuador
    servidor.route({
        url: '/:id/:actuador',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(
                `Obteniendo logs, id: ${request.params.id}, actuador: ${request.params.actuador}`,
            )
            return obtenerLogsActuador(request.params.id, request.params.actuador)
        },
    })

}

module.exports = logs
module.exports.autoPrefix = '/logs'
