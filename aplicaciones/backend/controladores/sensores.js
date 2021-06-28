'use strict'

async function sensores(servidor, opciones) {
    const sensores = opciones.couch.use('sensores')

    async function obtenerSensores() {
        try {
            // obtengo los sensores
            const limite = await opciones.couch.db.get('sensores').doc_count
            const q = {
                selector: {
                },
                limit: limite,
            }
            const resultado = await sensores.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo un sensor
    async function obtenerSensor(id) {
        try {
            const resultado = await sensores.get(id)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo un sensor
    async function crearSensor(parametros) {
        try {
            const id = parametros.descripcion.trim().toLowerCase().replace(/\s/g, '-')
            const descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()
            const metrica =
                parametros.metrica.trim().charAt(0).toUpperCase() +
                parametros.metrica.trim().slice(1).toLowerCase()

            const resultado = await sensores.insert({
                _id: id,
                descripcion: descripcion,
                metrica: metrica,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico un sensor
    async function modificarSensor(id, parametros) {
        try {
            const descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()

            const metrica =
                parametros.metrica.charAt(0).trim().toUpperCase() +
                parametros.metrica.slice(1).trim().toLowerCase()

            const resultado = await sensores.insert({
                _id: id,
                _rev: parametros._rev,
                descripcion: descripcion,
                metrica: metrica,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // elimino un sensor
    async function eliminarSensor(id, rev) {
        try {
            const resultado = await sensores.destroy(id, rev)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = sensores
