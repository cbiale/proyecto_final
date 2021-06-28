'use strict'

async function mediciones(servidor, opciones) {
    const mediciones = opciones.couch.use('mediciones')
    const sensores = opciones.couch.use('sensores')

    // obtengo las mediciones
    async function obtenerMediciones(id) {
        try {
            // obtengo las mediciones
            const datosMediciones = await opciones.couch.db.get('mediciones')
            const q = {
                selector: {
                    dispositivoId: { $eq: id },
                    tiempo: { $gt: null },
                },
                limit: datosMediciones.doc_count,
                sort: [{ tiempo: 'desc' }],
            }
            servidor.log.info(q)
            const resultado = await mediciones.find(q)
            return resultado.docs
        } catch (error) {
            throw new Error(error)
        }
    }

    // obtengo las mediciones por dispositivo y tipo de sensor (5 últimos valores)
    async function obtenerMedicionesSensor(id, sensor) {
        try {
            // obtendo datos del sensor
            const descripcion = await sensores.get(sensor)

            // obtengo últimos 5 valores obtenidos de las mediciones del sensor asociado al dispositivo
            // obtengo las mediciones
            const q = {
                selector: {
                    dispositivoId: { $eq: id },
                    sensor: { $eq: sensor },
                    tiempo: { $gt: null },
                },
                sort: [{ tiempo: 'desc' }],
                fields: ['valor'],
                limit: 5,
            }

            const datos = await mediciones.find(q)
            const arreglo = datos.docs.map(({ valor }) => valor)
            return {
                sensor: descripcion,
                datos: arreglo
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = mediciones