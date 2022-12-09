const config = require('./configuracion')
const mqtt = require('async-mqtt')

// variables
let fastify, cliente, db

// datos para las pruebas
const retardoProcesamiento = 2000

// datos del nodo

let sensorUno = {
    _id: 'humedad-suelo',
    descripcion: 'Humedad suelo',
    metrica: '%'
}

let sensorDos = {
    _id: 'humedad-ambiente',
    descripcion: 'Humedad ambiente',
    metrica: '%'
}

let actuador = {
    _id: 'bomba-agua',
    descripcion: 'Bomba agua',
    tipo: 'on-off'
}

let nodo = {
    _id: '1',
    denominacion: 'nodo 1',
    latitud: '-27.9133',
    longitud: '-55.8244'
}

const valoresIniciales = {
    tiempo: 1,
    sensores: [sensorUno._id, sensorDos._id],
    actuadores: [actuador._id],
}

const valorInicialActuador = 'Off'

const datosLogsInicioTiempo = {
    nodo: nodo._id,
    actuador: 'Inicio - tiempo',
    valor: valoresIniciales.tiempo,
}

const datosLogsInicioSensores = {
    nodo: nodo._id,
    actuador: 'Inicio - sensores',
    valor: valoresIniciales.sensores,
}

const datosLogsInicioActuadores = {
    nodo: nodo._id,
    actuador: 'Inicio - actuadores',
    valor: valoresIniciales.actuadores,
}

const datosInicialesActuador = {
    nodo: nodo._id,
    actuador: actuador._id,
    valor: valorInicialActuador
}


/*const datosSensores = {
    'humedad-suelo': 30  // debe ser igual a los sensores enviados en inicio
}

const datosActuadores = {
    actuador: 'bomba-agua',
    valor: 'on'  // debe ser valor acorde a los enviados por tipo
}

// datos del nodo erróneo
const datosInicioIncorrecto = {
    tiempo: 1,
    sensores: ['----'],
    actuadores: ['----'],
}
*/

// tópicos del nodo
const topicoInicio = `inicio/${nodo._id}`
//const topicoTiempo = `tiempo/${nodo._id}`
//const topicoSensores = `sensores/${nodo._id}`
//const topicoActuadores = `actuadores/${nodo._id}`
//const topicoControl = `control/${nodo._id}`

async function obtenerLogs(id) {
    try {
        // obtengo los logs
        const datosLogs = await db.get('logs').doc_count
        const q = {
            selector: {
                nodo: { $eq: id },
                tiempo: { $gt: null },
            },
            limit: datosLogs,
            sort: [{ tiempo: 'desc' }],
        }
        const resultado = await db.use('logs').find(q)
        return resultado.docs
    } catch (error) {
        throw new Error(error)
    }
}


// configuración inicial
beforeEach(async () => {
    const respuesta = await config.cargarDatos()
    fastify = respuesta.fastify
    token = respuesta.token
    db = fastify.couch.db
    await db.use('sensores').insert(sensorUno)
    await db.use('sensores').insert(sensorDos)
    await db.use('actuadores').insert(actuador)
    await db.use('nodos').insert(nodo)
    cliente = mqtt.connect('mqtt://localhost:1883')
})

// configuración final
afterEach(async () => {
    await config.limpiarDatos(fastify)
})

// pruebas
describe('Mqtt', () => {
    test('Al recibir datos de inicio se completan datos en el nodo y se agregan logs', async () => {
        // se pasa petición 
        await cliente.publish(topicoInicio, JSON.stringify(valoresIniciales))
        await new Promise((r) => setTimeout(r, retardoProcesamiento));

        // se obtiene información de la base de datos
        const datosNodo = await db.use('nodos').get(nodo._id)
        const datosLogs = await obtenerLogs(nodo._id)

        // la información de sensores, actuadores y tiempo debe ser igual a lo enviado
        expect(datosNodo.sensores).toEqual(valoresIniciales.sensores)
        expect(datosNodo.actuadores).toEqual(valoresIniciales.actuadores)
        expect(datosNodo.tiempo).toEqual(valoresIniciales.tiempo)
        // se deben cargar los datos de inicio (tiempo, sensores y actuadores registrados)
        expect(datosLogs).toEqual(
            expect.arrayContaining([
                expect.objectContaining(datosLogsInicioTiempo),
                expect.objectContaining(datosLogsInicioSensores),
                expect.objectContaining(datosLogsInicioActuadores),
                expect.objectContaining(datosInicialesActuador)
            ])
        )
    })

    /*
    // test('Al recibir datos de inicio erróneos se vacían datos anexos y no se agregan logs', async () => {
        // se pasa petición 
        await cliente.publish(topicoInicio, JSON.stringify(datosInicioIncorrecto))
        await new Promise((r) => setTimeout(r, retardoProcesamiento));

        // se obtiene información de la base de datos
        nodo = await bd.use('nodos').get(nodo._id)
        const logs = await obtenerLogs(nodo._id)

        // la información de sensores, actuadores y tiempo se vacía 
        expect(nodo.sensores).toEqual([])
        expect(nodo.actuadores).toEqual([])
        expect(nodo.tiempo).toEqual(null)
        expect(logs).toEqual([])
    })

    test('Al recibir datos de sensores se agregan datos de lecturas de sensores', async () => {
        // se pasa petición de inicio
        await cliente.publish(topicoInicio, JSON.stringify(datosInicio))
        await new Promise((r) => setTimeout(r, retardoProcesamiento));

        // se pasa petición de datos de sensores
        await cliente.publish(topicoSensores, JSON.stringify(datosSensores))
        await new Promise((r) => setTimeout(r, retardoProcesamiento));

        // se obtiene información de la base de datos
        // nodo = await fastify.couch.db.use('nodos').get(nodo._id)
        // const logs = await config.obtenerLogs(nodo._id)

        // la información de sensores, actuadores y tiempo debe ser igual a lo enviado
        expect(1).toEqual(1)
    })

    test('Al recibir datos de actuadores se agregan datos de logs', async () => {
        // se pasa petición de inicio
        await cliente.publish(topicoInicio, JSON.stringify(datosInicio))
        await new Promise((r) => setTimeout(r, retardoProcesamiento));

        // se pasa petición de datos de sensores
        await cliente.publish(topicoActuadores, JSON.stringify(datosActuadores))
        await new Promise((r) => setTimeout(r, retardoProcesamiento));

        // se obtiene información de la base de datos
        // nodo = await fastify.couch.db.use('nodos').get(nodo._id)
        // const logs = await config.obtenerLogs(nodo._id)

        // la información de sensores, actuadores y tiempo debe ser igual a lo enviado
        expect(1).toEqual(1)
    })
    */
})