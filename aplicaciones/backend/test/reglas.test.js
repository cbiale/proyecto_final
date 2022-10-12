const config = require('./configuracion')

// variables
let fastify
let token

// datos para las pruebas
const base_url = '/api/v1/reglas/'
let id

let agregar = {
    descripcion: 'regla 1',
    condiciones: [],
    acciones: []
}

let modificar = {
    descripcion: 'regla 1',
    condiciones: [],
    acciones: []
}


// configuración inicial
beforeAll(async () => {
    const respuesta = await config.cargarDatos()
    fastify = respuesta.fastify
    token = respuesta.token
})

// configuración final
afterAll(async () => {
    await config.limpiarDatos(fastify)
})

// pruebas
describe('Reglas', () => {
    test('Si la base de datos está vacía devuelve cero reglas y un código 200', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'GET',
            url: base_url,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se controla la respuesta
        expect(respuesta.statusCode).toEqual(200)
        expect(respuesta.json().length).toBe(0)
    })

    test('Si ingreso una regla devuelve un código 200 y como parte de la respuesta {ok : true}', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'POST',
            url: base_url,
            body: agregar,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se guarda el id devuelto
        id = respuesta.json().id
        // se guarda el token MVCC 
        modificar._rev = respuesta.json().rev
        // se controla la respuesta
        expect(respuesta.json().ok).toEqual(true)
        expect(respuesta.statusCode).toEqual(200)
    })

    test('Si busco una regla existente devuelve un código 200 y datos del documento', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'GET',
            url: base_url + id,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se controla la respuesta
        expect(respuesta.json()._id).toEqual(id)
        expect(respuesta.statusCode).toEqual(200)
    })

    test('Si cambio una regla devuelve un código 200, el id y {ok : true}', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'PUT',
            url: base_url + id,
            body: modificar,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se guarda el token MVCC
        modificar._rev = respuesta.json().rev
        // se controla la respuesta
        expect(respuesta.json().id).toEqual(id)
        expect(respuesta.json().ok).toEqual(true)
        expect(respuesta.statusCode).toEqual(200)
    })

    test('Si se borra una regla devuelve un código 200, el id y {ok : true}', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'DELETE',
            url: base_url + id,
            headers: {
                Authorization: 'Bearer ' + token,
                _rev : modificar._rev
            },
        })
        // se controla la respuesta
        expect(respuesta.json().id).toEqual(id)
        expect(respuesta.json().ok).toEqual(true)
        expect(respuesta.statusCode).toEqual(200)
    })

    test('Si se ha borrado una regla y se obtienen los documentos devuelve cero documentos y un código 200', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'GET',
            url: base_url,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se controla la respuesta
        expect(respuesta.statusCode).toEqual(200)
        expect(respuesta.json().length).toBe(0)
    })

})