const config = require('./configuracion')

// variables
let fastify

// datos para las pruebas
const base_url = '/api/v1/ingresar'

const claveIncorrecta = {
    id: 'admin_prueba', 
    password: 'admin_falso'
}

const usuarioIncorrecto = {
    id: 'admin_prueba_falso', 
    password: 'admin'
}

const usuarioClaveIncorrectos = {
    id: 'admin_prueba_falso', 
    password: 'admin_falso'
}

const usuarioClaveCorrectos = {
    id: 'admin_prueba', 
    password: 'admin'
}

// configuración inicial
beforeAll(async () => {
    fastify = await config.cargarDatosIngresar()
})

// configuración final
afterAll(async () => {
    await config.limpiarDatos(fastify)
})

describe('Usuarios', () => {

    test('La clave ingresada no es correcta', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'POST',
            url: base_url,
            body: claveIncorrecta
        })

        // se controla la respuesta
        expect(respuesta.statusCode).toEqual(200)
        expect(respuesta.json().estado).toEqual('error')
    })

    test('El usuario ingresado no es correcto', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'POST',
            url: base_url,
            body : usuarioIncorrecto
        })

        // se controla la respuesta
        expect(respuesta.statusCode).toEqual(200)
        expect(respuesta.json().estado).toEqual('error')
    })

    test('El usuario y clave ingresados no son correctos', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'POST',
            url: base_url,
            body : usuarioClaveIncorrectos
        })

        // se controla la respuesta
        expect(respuesta.statusCode).toEqual(200)
        expect(respuesta.json().estado).toEqual('error')
    })

    test('El usuario y clave ingresada son correctos', async () => {
        // se pasa petición 
        const respuesta = await fastify.inject({
            method: 'POST',
            url: base_url,
            body : usuarioClaveCorrectos
        })

        // se controla la respuesta
        expect(respuesta.statusCode).toEqual(200)
        expect(respuesta.json().estado).toEqual('ok')
    })
})