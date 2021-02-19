const BASE_URL = "http://localhost:3000/api/v1/logs/"

async function obtenerLogs(id) {
    let respuesta = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
    });

    if (respuesta.status !== 200) {
        throw new Error(`Estado HTTP ${respuesta.status}`);
    }
    return respuesta;
}

async function agregarLog(datos) {
    let respuesta = await fetch(BASE_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(datos)
    })

    if (respuesta.status !== 201) {
        throw new Error(`Estado HTTP ${respuesta.status}`);
    }
}

export const logsServicio = { obtenerLogs, agregarLog };