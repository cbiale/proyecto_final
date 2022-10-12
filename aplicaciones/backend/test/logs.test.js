const config = require('./configuracion')
const round10 = require('round10').round10

// variables
let fastify
let token

// datos para las pruebas
const base_url = '/api/v1/logs/'
const nodoId = 'nodo-1'
const actuadorId = 'bomba-agua'
const nodoInexistenteId = '----'
const actuadorInexistenteId = '----'
const lineasMostradas = 1
const totalLogs = 10

async function cargarDatosActuadores() {
    let actuador = {
        _id: actuadorId,
        descripcion: 'bomba agua',
        tipo: 'on-off'
    }

    let nodo = {
        _id: nodoId,
        denominacion: 'nodo 1',
        latitud: '-27.9133',
        longitud: '-55.8244'
    }

    await fastify.couch.db.use('actuadores').insert(actuador)
    await fastify.couch.db.use('nodos').insert(nodo)

    for (var i = 0; i < totalLogs; i++) {
        let log = {
            nodo: nodoId,
            tiempo: new Date().toJSON(),
            actuador: actuadorId,
            valor: (i % 2 ? 'on' : 'off')
        }
        await fastify.couch.db.use('logs').insert(log)
    }
}

// configuración inicial
beforeAll(async () => {
    const respuesta = await config.cargarDatos()
    fastify = respuesta.fastify
    token = respuesta.token
    await cargarDatosActuadores()
})

// configuración final
afterAll(async () => {
    await config.limpiarDatos(fastify)
})

// pruebas
describe('Logs', () => {
    test('Se retornan todos los logs de un nodo con un código 200', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'GET',
            url: base_url + nodoId,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se controla la respuesta
        expect(respuesta.statusCode).toEqual(200)
        expect(respuesta.json().length).toBe(totalLogs)
    })

    test('Se retornan todos los logs de un nodo y nodo con un código 200', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'GET',
            url: base_url + nodoId + '/' + actuadorId,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se controla la respuesta
        expect(respuesta.statusCode).toEqual(200)
        expect(respuesta.json().datos.length).toBeLessThanOrEqual(lineasMostradas)
    })

    test('Se retornan todos los logs de un nodo para un actuador inexistente con un código 500', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'GET',
            url: base_url + nodoId + '/' + actuadorInexistenteId,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se controla la respuesta
        expect(respuesta.statusCode).toEqual(500)
    })

})