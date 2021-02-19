'use strict'

const fp = require('fastify-plugin')
const mqtt = require('async-mqtt')

// conecto a un servidor mqtt
async function conectar (servidor, opts) {
    servidor.log.info('Obteniendo conexión a MQTT...')
    let cliente = mqtt.connect('mqtt://localhost:1883');
    servidor.log.info('Conexión a MQTT obtenida')
    try {
        // suscripciones
        // inicio: determina los sensores y actuadores del nodo
        await cliente.subscribe('inicio/#')
        // mediciones: se obtienen las mediciones del nodo
        await cliente.subscribe('mediciones/#')
    } catch (error) {
        throw new Error(error)
    }

    // uso luego en rutas
    servidor.decorate('mqtt', cliente)
}

// expongo el decorador al ámbito de fastify
module.exports = fp(conectar)
