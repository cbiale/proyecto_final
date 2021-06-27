
'use strict'

async function inicio() {
    const servidor = await require('./app')({
        logger: {
            prettyPrint: true,
        },
    })
    await servidor.ready()
    servidor.log.info(`\nRutas API:\n${servidor.printRoutes()}`)
    await servidor.listen(3001, '0.0.0.0')
}

inicio()
