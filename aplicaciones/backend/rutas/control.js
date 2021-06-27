'use strict'

async function control(servidor, opciones) {

    async function control() {
        return "ok"
    }
    // defino las rutas

    servidor.route({
        url: '/',
        method: 'GET',
        handler: async (request, response) => {
            servidor.log.info(`Control`)
            return control()
        },
    })

}

module.exports = control
module.exports.autoPrefix = '/control'
