const config = require('./configuracion')
const round10 = require('round10').round10

// variables
let fastify
let token

// datos para las pruebas
const base_url = '/api/v1/mediciones/'
const nodoId = 'nodo-1'
const sensorId = 'humedad-ambiente'
const nodoInexistenteId = '----'
const sensorInexistenteId = '----'
const lineasMostradas = 5
const totalMediciones = 10

async function cargarDatosMediciones() {
    let sensor = {
        _id: sensorId,
        descripcion: 'humedad ambiente',
        metrica: '%'
    }

    let nodo = {
        _id: nodoId,
        denominacion: 'nodo 1',
        latitud: '-27.9133',
        longitud: '-55.8244'
    }


    await fastify.couch.db.use('sensores').insert(sensor)
    await fastify.couch.db.use('nodos').insert(nodo)

    for (var i = 0; i < totalMediciones; i++) {
        let medicion = {
            nodo: nodoId,
            tiempo: new Date().toJSON(),
            sensor: sensorId,
            valor: round10(Math.random() * (100 - 30) + 30, -2)
        }
        await fastify.couch.db.use('mediciones').insert(medicion)
    }
}

// configuración inicial
beforeAll(async () => {
    const respuesta = await config.cargarDatos()
    fastify = respuesta.fastify
    token = respuesta.token
    await cargarDatosMediciones()
})

// configuración final
afterAll(async () => {
    await config.limpiarDatos(fastify)
})

// pruebas
describe('Mediciones', () => {
    test('Se retornan todas las mediciones de un nodo con un código 200', async () => {
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
        expect(respuesta.json().length).toBe(totalMediciones)
    })

    test('Se retornan todas las mediciones de un nodo y sensor con un código 200', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'GET',
            url: base_url + nodoId + '/' + sensorId,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se controla la respuesta
        expect(respuesta.statusCode).toEqual(200)
        expect(respuesta.json().datos.length).toBeLessThanOrEqual(lineasMostradas)
    })

    test('Se retornan todas las mediciones de un nodo para un sensor inexistente con un código 500', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'GET',
            url: base_url + nodoId + '/' + sensorInexistenteId,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se controla la respuesta
        expect(respuesta.statusCode).toEqual(500)

    })

})