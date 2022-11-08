'use strict'

async function mediciones(servidor, opciones) {
    const mediciones = opciones.couch.use('mediciones')
    const sensores = opciones.couch.use('sensores')

    // obtengo las mediciones
    async function obtenerMediciones(id) {
        try {
            // obtengo las mediciones
            const datosMediciones = await opciones.couch.db.get('mediciones')
            const q = {
                selector: {
                    nodo: { $eq: id },
                    tiempo: { $gt: null },
                },
                limit: datosMediciones.doc_count,
                sort: [{ tiempo: 'desc' }],
            }
            servidor.log.info(q)
            const resultado = await mediciones.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo las mediciones por nodo y tipo de sensor (5 últimos valores)
    async function obtenerMedicionesSensor(id, sensor) {
        try {
            // obtendo datos del sensor
            const descripcion = await sensores.get(sensor)

            // obtengo últimos 5 valores obtenidos de las mediciones del sensor asociado al nodo
            // obtengo las mediciones
            const q = {
                selector: {
                    nodo: { $eq: id },
                    sensor: { $eq: sensor },
                    tiempo: { $gt: null },
                },
                sort: [{ tiempo: 'desc' }],
                fields: ['valor', 'tiempo'],
                limit: 5,
            }

            const datos = await mediciones.find(q)
            console.log(datos)
            const arregloDatos = datos.docs.map(({ valor }) => valor)
            const arregloTiempo = datos.docs.map(({ tiempo }) => tiempo)

            return {
                sensor: descripcion,
                datos: arregloDatos,
                tiempo: arregloTiempo
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    // defino las rutas

    // obtengo mediciones de un nodo
    servidor.route({
        url: '/:id',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Obteniendo mediciones, id: ${request.params.id}`)
            return obtenerMediciones(request.params.id)
        },
    })

    // obtengo mediciones de un nodo por tipo de sensor
    servidor.route({
        url: '/:id/:sensor',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(
                `Obteniendo mediciones, id: ${request.params.id}, sensor: ${request.params.sensor}`,
            )
            return obtenerMedicionesSensor(request.params.id, request.params.sensor)
        },
    })
}

module.exports = mediciones
module.exports.autoPrefix = '/mediciones'
