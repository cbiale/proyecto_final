'use strict'

async function reglas(servidor, opciones) {
    const reglas = opciones.couch.use('reglas')

    // obtengo los reglas
    async function obtenerReglas() {
        try {
            // obtengo los reglas
            const limite = await opciones.couch.db.get('reglas').doc_count
            const q = {
                selector: {},
                limit: limite,
            }
            const resultado = await reglas.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo una regla
    async function obtenerRegla(id) {
        try {
            const resultado = await reglas.get(id)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo una regla
    async function crearRegla(parametros) {
        try {
            parametros.descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()

            const resultado = await reglas.insert({
                descripcion: parametros.descripcion,
                condiciones: parametros.condiciones,
                acciones: parametros.acciones,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico una regla
    async function modificarRegla(id, parametros) {
        try {
            parametros.descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()

            const resultado = await reglas.insert({
                _id: id,
                _rev: parametros._rev,
                descripcion: parametros.descripcion,
                condiciones: parametros.condiciones,
                acciones: parametros.acciones,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // elimino una regla
    async function eliminarRegla(id, rev) {
        try {
            const resultado = await reglas.destroy(id, rev)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = reglas