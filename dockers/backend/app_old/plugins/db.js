'use strict'

const fp = require('fastify-plugin')
const r = require('rethinkdb')

// conecta a la base de datos y la inicializa si no existe la base de datos iot
async function conectar (servidor, opts) {
    let db
    // conecto a la base de datos
    servidor.log.info('Conectando a la base de datos...')
    try {
        // localhost dado que voy a usar un proxy
        db = await r.connect( {host: 'localhost', port: 28015})
        servidor.log.info('Conectado!!')
        await iniciar(servidor, db)
    } catch (err) {
        // si hay error, lo muestro y termino
		servidor.log.error(err)
		process.exit(1)
    }
    // uso luego en rutas
    servidor.decorate('rethinkdb', db)
}

async function iniciar(servidor, db) {
    servidor.log.info('Verificando existencia de base de datos...')
    let dbs = await r.dbList().run(db)

    // si no existe la base de datos iot
    // crea la base de datos, tablas e indices
    if (!dbs.find(iot => iot === 'iot')) {
        await r.dbCreate('iot').run(db)
        await r.db('iot').tableCreate('huertas').run(db)
        await r.db('iot').tableCreate('dispositivos').run(db)
        await r.db('iot').tableCreate('entidades').run(db)
        await r.db('iot').tableCreate('sensores').run(db)
        await r.db('iot').tableCreate('actuadores').run(db)
        await r.db('iot').tableCreate('mediciones').run(db)
        await r.db('iot').table('mediciones').indexCreate('tiempo').run(db)
        await r.db('iot').tableCreate('logs').run(db)
        await r.db('iot').table('logs').indexCreate('tiempo').run(db)
    }
    servidor.log.info("Verificado!!")
}

// expongo el decorador al ámbito de fastify
module.exports = fp(conectar)
