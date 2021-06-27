'use strict'

const fastify = require('fastify')
const fastifyCors = require('fastify-cors')
const autoload = require('fastify-autoload')
const sensible = require('fastify-sensible')
const carga = require('under-pressure')
const path = require('path')
const entorno = require('fastify-env')

module.exports = async function (opciones = {}) {
    // servidor
    const servidor = fastify(opciones)

    process.on('unhandledRejection', (err) => {
        servidor.log.error(err)
        process.exit(1)
    })

    // habilito cors
    await servidor.register(fastifyCors)

    const esquemaEntorno = {
        type: 'object',
        required: ['JWT_SECRET'],
        properties: {
            JWT_SECRET: {
                type: 'string',
            },
        },
    }

    await servidor
        .register(entorno, {
            schema: esquemaEntorno,
            dotenv: true, // leo de un archivo .env
        })
        .ready((error) => {
            if (error) servidor.log.error(error)
            servidor.log.info(`\nVariables:\n${JSON.stringify(servidor.config)}`) // o servidor[options.confKey]
        })

    // manejo de errores http
    await servidor.register(sensible)

    await servidor.register(require('fastify-couchdb'), {
        url: 'http://admin:admin@couchdb:5984',
    })

    // mide la carga del proceso y si la carga supera lo establecido
    // devuelve el error de "Service Unavailable"
    await servidor.register(carga, {
        maxEventLoopDelay: 1000,
        maxHeapUsedBytes: 1000000000,
        maxRssBytes: 1000000000,
        maxEventLoopUtilization: 0.98,
    })

    // cargo plugins
    await servidor.register(autoload, (parent) => ({
        dir: path.join(__dirname, 'plugins'),
        options: {
            couch: parent.couch,
        },
    }))

    // mqtt
    await servidor.register(autoload, (parent) => ({
        dir: path.join(__dirname, 'mqtt'),
        options: {
            couch: parent.couch,
        },
    }))

    // cargo rutas
    await servidor.register(autoload, (parent) => ({
        dir: path.join(__dirname, 'rutas'),
        options: {
            prefix: 'api/v1',
            couch: parent.couch,
            mqtt: parent.mqtt,
        },
    }))
    servidor.log.info(`\nRutas API:\n${servidor.printRoutes()}`)
    return servidor
}
