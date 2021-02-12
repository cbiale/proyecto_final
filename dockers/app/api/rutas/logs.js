'use strict'

const r = require('rethinkdb')

async function logs(servidor, opciones) {
    const db = opciones.rethinkdb

    // obtengo los logs
    async function obtenerLogs(id) {
        try {
            const datos = await r.db('iot').table('logs')
                .orderBy({ index: r.desc('tiempo') })
                .filter({ 'dispositivoId': id }).run(db);
            const resultado = await datos.toArray()
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // agregar logs
    async function agregarLogs(parametros) {

        const id = parametros.dispositivoId;
        const estado = parametros.ultimoEstado;
        const tiempo = new Date().toJSON();

        let cantidad = await r.db('iot').table('dispositivos').filter({ id: id }).count().run(db)
        // si existe el dispositivo
        if (cantidad != 0) {
            try {
                // inserto log
                const resultado = await r.db('iot').table('logs').insert
                    ({
                        dispositivoId: id,
                        tiempo: tiempo,
                        estado: estado
                    }).
                    run(db)
                return resultado
            } catch (error) {
                throw new Error(error)
            }
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

    // agregar log
    servidor.route({
        url: '/',
        method: 'POST',
        preValidation: [servidor.autenticar],
        handler: async (request, response) => {
            servidor.log.info(`Agregando log, datos: ${JSON.stringify(request.body)}`)
            return agregarLogs(request.body)
        },
    })
}

module.exports = logs
module.exports.autoPrefix = '/logs'
