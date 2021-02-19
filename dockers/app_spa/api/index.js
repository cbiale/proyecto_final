'use strict'

const fastify = require('fastify')
const crearServidor = require('./servidor');

async function ejecutar() {

    const app = fastify({
        logger: {
            prettyPrint: true
        }
    })

    process.on('unhandledRejection', err => {
        app.log.error(err)
        process.exit(1)
    })

    await app.register(crearServidor)

    await app.ready()

    
    app.log.info(`\nRutas API:\n${app.printRoutes()}`)

    await app.listen(process.env.PUERTO | 3001)
}

ejecutar()
