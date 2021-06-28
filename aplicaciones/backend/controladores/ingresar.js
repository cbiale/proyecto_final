'use strict'

const argon2 = require('argon2')

async function ingresar(servidor, opciones) {
    const usuarios = opciones.couch.use('usuarios')

    // obtengo un usuario y comparo su clave
    async function obtenerUsuario(parametros, respuesta) {
        try {
            const { id, password } = parametros

            const resultado = await usuarios.get(id)
            servidor.log.info(resultado)
            servidor.log.info(resultado.administrador)
            // si encuentro al usuario
            if (
                resultado._id === id &&
                (await argon2.verify(resultado.password, password))
            ) {
                // password es correcto
                // mando respuesta y token
                const token = await respuesta.jwtSign({ id })
                return { estado: 'ok', administrador: resultado.administrador, token }
            } else {
                // password no es correcto
                return { estado: 'error' }
            }
        } catch (error) {
            return { estado: 'error' }
        }
    }
}

module.exports = ingresar