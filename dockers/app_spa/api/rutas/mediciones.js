'use strict'

const r = require('rethinkdb')

async function mediciones(servidor, opciones) {
    const db = opciones.rethinkdb

    // obtengo las mediciones
    async function obtenerMediciones(id) {
        try {
            const datos = await r.db('iot').table('mediciones')
                .orderBy({ index: r.desc('tiempo') })
                .filter({ 'dispositivoId': id }).run(db);
            const resultado = await datos.toArray()
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // defino las rutas

    // obtengo mediciones
    servidor.route({
        url: '/:id',
        method: 'GET',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Obteniendo mediciones, id: ${request.params.id}`)
            return obtenerMediciones(request.params.id)
        },
    })
}

module.exports = mediciones
module.exports.autoPrefix = '/mediciones'
