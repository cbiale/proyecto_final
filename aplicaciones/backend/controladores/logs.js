'use strict'

async function logs(servidor, opciones) {
    const logs = opciones.couch.use('logs')
    const actuadores = opciones.couch.use('actuadores')
    const dispositivos = opciones.couch.use('dispositivos')

    // obtengo los logs
    async function obtenerLogs(id) {
        try {
            // obtengo los logs
            const datosLogs = await opciones.couch.db.get('logs')
            const q = {
                selector: {
                    dispositivoId: { $eq: id },
                    tiempo: { $gt: null },
                },
                limit: datosLogs.doc_count,
                sort: [{ tiempo: 'desc' }],
            }
            const resultado = await logs.find(q)
            console.log(resultado)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo los logs de un actuador
    async function obtenerLogsActuador(id, actuador) {
        try {
            // obtendo ultimo dato obtenido de los logs del actuador
            // obtendo datos del sensor
            const descripcion = await actuadores.get(actuador)

            // obtengo los logs
            const q = {
                selector: {
                    dispositivoId: { $eq: id },
                    actuador: { $eq: actuador },
                    tiempo: { $gt: null },
                },
                sort: [{ tiempo: 'desc' }],
                fields: ['valor'],
                limit: 1,
            }
            const datos = await logs.find(q)
            const arreglo = datos.docs.map(({ valor }) => valor)

            return {
                actuador: descripcion,
                datos: datos.docs,
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    // agregar logs
    async function agregarLogs(parametros) {
        const id = parametros.dispositivoId
        const estado = parametros.ultimoEstado
        const tiempo = new Date().toJSON()

        // determino si existe el dispositivo
        let cantidadDispositivo = await dispositivos.view('cantidad', 'cantidad', {
            key: dispositivoId,
        })
        let cantidad = cantidadDispositivo.rows.length

        // si existe el dispositivo
        if (cantidad !== 0) {
            try {
                // inserto log
                const resultado = await logs.insert.insert({
                    dispositivoId: id,
                    tiempo: tiempo,
                    estado: estado,
                })
                return resultado
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}

module.exports = logs