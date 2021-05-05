import { get } from 'svelte/store'
import axios from 'axios'
import { sesion, backend } from '../store'

const BASE_URL = `http://${backend}:3001/api/v1/sensores`

let axiosConfig = {
  headers: {
    Authorization: 'Bearer ' + get(sesion),
  },
}

async function listarSensores() {
  try {
    const datos = await axios.get(BASE_URL, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function obtenerSensor(id) {
  try {
    const datos = await axios.get(`${BASE_URL}/${id}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function agregarSensor(valores) {
  try {
    const datos = await axios.post(BASE_URL, valores, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function eliminarSensor(valores) {
  try {
    axiosConfig.headers._rev = valores._rev
    const datos = await axios.delete(
      `${BASE_URL}/${valores._id}`,
      axiosConfig,
    )
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function modificarSensor(valores) {
  try {
    const datos = await axios.put(
      `${BASE_URL}/${valores._id}`,
      valores,
      axiosConfig,
    )
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

export const sensoresServicio = {
  listarSensores,
  obtenerSensor,
  modificarSensor,
  agregarSensor,
  eliminarSensor,
}
