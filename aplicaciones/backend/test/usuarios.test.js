const config = require('./configuracion')

// variables
let fastify
let token

// datos para las pruebas
const base_url = '/api/v1/usuarios/'
const id = 'prueba'

let agregar = {
    id : id,
    password : 'clave',
    administrador : true
}

let modificar = {
    password : 'nuevaClave',
    administrador : false
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
describe('Usuarios', () => {

    test('Si no se agregaron nuevos usuarios devuelve un documento (admin_prueba) y un código 200', async () => {
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
        expect(respuesta.json().length).toBe(1)
    })

    test('Si ingreso un usuario devuelve un código 200 y como parte de la respuesta {ok : true}', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'POST',
            url: base_url,
            body: agregar,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se guarda el token MVCC 
        modificar._rev = respuesta.json().rev
        // se controla la respuesta
        expect(respuesta.json().ok).toEqual(true)
        expect(respuesta.statusCode).toEqual(200)
    })

    test('Si busco un usuario existente devuelve un código 200 y datos del documento', async () => {
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

    test('Si cambio un usuario devuelve un código 200, el id y {ok : true}', async () => {
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

    test('Si se borra un usuario devuelve un código 200, el id y {ok : true}', async () => {
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

    test('Si se ha borrado el usuario y se obtienen los documentos devuelve un documento (admin_prueba) y un código 200', async () => {
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
        expect(respuesta.json().length).toBe(1)
    })

    test('Si busco el usuario admin devuelve un código 200 y null', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'GET',
            url: base_url + 'admin',
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        // se controla la respuesta
        expect(respuesta.json()).toEqual(null)
        expect(respuesta.statusCode).toEqual(200)
    })
})