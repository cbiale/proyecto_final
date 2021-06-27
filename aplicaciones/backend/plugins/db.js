'use strict'

const fp = require('fastify-plugin')
const argon2 = require('argon2')

// conecta a la base de datos y la inicializa si no existe la base de datos iot
async function conectar(servidor, opciones) {
    try {
        let couch = opciones.couch
        await iniciar(servidor, couch)
    } catch (err) {
        // si hay error, lo muestro y termino
        servidor.log.error(err)
        process.exit(1)
    }
}

async function iniciar(servidor, couch) {
    servidor.log.info('Verificando existencia de base de datos...')
    try {
        // creo la base de datos de usuarios
        servidor.log.info('Creando usuarios...')
        await couch.db.create('usuarios')

        // creo el usuario admin
        const password = await argon2.hash('admin')
        await couch.db.use('usuarios').insert({
            _id: 'admin',
            password: password,
            administrador: true
        })

        // creo las otras bases de datos
        servidor.log.info('Creando bases de datos...')
        await couch.db.create('dispositivos')
        await couch.db.create('sensores')
        await couch.db.create('actuadores')
        await couch.db.create('mediciones')
        await couch.db.create('logs')
        await couch.db.create('reglas')
        console.log('Creando vistas')

        // creo vistas
        servidor.log.info('Creando vistas...')
        const documento = {
            _id: '_design/cantidad',
            views: {
                cantidad: {
                    reduce: '_count',
                    map: 'function (doc) {\n  emit(doc._id, 1);\n}',
                },
            },
            language: 'javascript',
        }
        await couch.db.use('mediciones').insert(documento)
        await couch.db.use('logs').insert(documento)
        await couch.db.use('dispositivos').insert(documento)

        // creo indices
        servidor.log.info('Creando indices...')
        const indice = {
            index: {
                fields: [
                    {
                        tiempo: 'desc',
                    },
                ],
            },
            type: 'json',
        }
        await couch.db.use('mediciones').createIndex(indice)
        await couch.db.use('logs').createIndex(indice)

    } catch (err) {
        servidor.log.error(`Error: ${err}`)
    }
    servidor.log.info('Verificado!!')
}

// expongo el decorador al ámbito de fastify
module.exports = fp(conectar)
