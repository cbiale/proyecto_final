'use strict'

async function actuadores(servidor, opciones) {
    const actuadores = opciones.couch.use('actuadores')

    // obtengo los actuadores
    async function obtenerActuadores() {
        try {
            // obtengo los actuadores
            const limite = await opciones.couch.db.get('actuadores').doc_count
            const q = {
                selector: {},
                limit: limite,
            }
            const resultado = await actuadores.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo un actuador
    async function obtenerActuador(id) {
        try {
            const resultado = await actuadores.get(id)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // creo un actuador
    async function crearActuador(parametros) {
        try {
            const id = parametros.descripcion.trim().toLowerCase().replace(/\s/g, '-')
            const descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()
            const tipo =
                parametros.tipo.trim().charAt(0).toUpperCase() +
                parametros.tipo.trim().slice(1).toLowerCase()

            const resultado = await actuadores.insert({
                _id: id,
                descripcion: descripcion,
                tipo: tipo,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // modifico un actuador
    async function modificarActuador(id, parametros) {
        try {
            const descripcion =
                parametros.descripcion.trim().charAt(0).toUpperCase() +
                parametros.descripcion.trim().slice(1).toLowerCase()
            const tipo =
                parametros.tipo.trim().charAt(0).toUpperCase() +
                parametros.tipo.trim().slice(1).toLowerCase()

            const resultado = await actuadores.insert({
                _id: id,
                _rev: parametros._rev,
                descripcion: descripcion,
                tipo: tipo,
            })
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }

    // elimino un actuador
    async function eliminarActuador(id, rev) {
        try {
            const resultado = await actuadores.destroy(id, rev)
            return resultado
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = actuadores
