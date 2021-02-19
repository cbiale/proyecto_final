const BASE_URL = '/api/v1/actuadores/'
import { get } from 'svelte/store'
import { sesion } from '../store'
import axios from 'axios'

let axiosConfig = {
  headers: {
    Authorization: 'Bearer ' + get(sesion),
  },
}

async function listarActuadores() {
  try {
    const datos = await axios.get(BASE_URL, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function obtenerActuador(id) {
  try {
    const datos = await axios.get(`${BASE_URL}/${id}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function agregarActuador(valores) {
  try {
    const datos = await axios.post(BASE_URL, valores, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function eliminarActuador(id) {
  try {
    const datos = await axios.delete(`${BASE_URL}/${id}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function modificarActuador(id, valores) {
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

export const actuadoresServicio = {
  listarActuadores,
  obtenerActuador,
  modificarActuador,
  agregarActuador,
  eliminarActuador,
}
