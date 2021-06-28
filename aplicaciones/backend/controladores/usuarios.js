'use strict'

// guardar passwords con argon2
const argon2 = require('argon2')

async function usuarios(servidor, opciones) {
    const usuarios = opciones.couch.use('usuarios')

    // obtengo los usuarios
    async function obtenerUsuarios() {
        try {
            // obtengo los usuarios
            const limite = await opciones.couch.db.get('usuarios').doc_count
            const q = {
                selector: {
                    _id: { $ne: 'admin' },
                },
                limit: limite,
            }
            const resultado = await usuarios.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo un usuario
    async function obtenerUsuario(id) {
        try {
            let resultado = null
            if (id !== 'admin') {
                const resultado = await usuarios.get(id)
                return resultado
            }
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo un usuario
    async function crearUsuario(parametros) {
        try {
            const id = parametros.id.trim()
            const password = parametros.password.trim()
            const hash = await argon2.hash(password)

            const resultado = await usuarios.insert({
                _id: id,
                password: hash,
                administrador: parametros.administrador
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico un usuario
    async function modificarUsuario(id, parametros) {
        try {
            const password = parametros.password.trim()
            const hash = await argon2.hash(password)

            const resultado = await usuarios.insert({
                _id: id,
                _rev: _rev,
                password: hash,
                administrador: parametros.administrador
            })
            return resultado

        } catch (error) {
            throw new Error(error)
        }
    }

    // elimino un usuario
    async function eliminarUsuario(id, rev) {
        try {
            const resultado = await usuarios.destroy(id, rev)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = usuarios
