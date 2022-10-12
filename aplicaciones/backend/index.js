'use strict'

const build = require('./app')

const inicio = async () => {
    const servidor = await build({
        logger: {
            prettyPrint: true,
        },
    })
    await servidor.ready()
    servidor.log.info(`\nRutas API:\n${servidor.printRoutes()}`)
    await servidor.listen(3001, '0.0.0.0')
}

inicio()