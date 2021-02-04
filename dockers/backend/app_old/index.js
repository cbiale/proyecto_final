"use strict"

// const fastifyCors = require('fastify-cors')
const fastify = require('fastify');
const autoload = require('fastify-autoload')
const path = require('path')

const app = fastify({
    logger: {
        prettyPrint: true
    }
})

process.on('unhandledRejection', err => {
    app.log.error(err);
    process.exit(1);
});



app.register(require("fastify-nuxtjs")).after(() => {
    app.nuxt("/hello")
})

// habilito cors
// app.register(fastifyCors)

// cargo plugins
app.register(autoload, {
    dir: path.join(__dirname, 'plugins')
})

app.ready();

app.log.info(app.printRoutes());

app.listen(process.env.PUERTO | 3000);



