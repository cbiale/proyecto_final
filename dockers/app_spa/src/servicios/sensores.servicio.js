const BASE_URL = '/api/v1/sensores'
import { get } from 'svelte/store'
import { sesion } from '../store'
import axios from 'axios'

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

async function eliminarSensor(id) {
  try {
    const datos = await axios.delete(`${BASE_URL}/${id}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function modificarSensor(id, valores) {
  try {
    const datos = await axios.put(
      `${BASE_URL}/${id}`,
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
