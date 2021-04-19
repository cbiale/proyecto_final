const BASE_URL = '/api/v1/dispositivos/'
import { get } from 'svelte/store'
import { sesion } from '../store'
import axios from 'axios'

let axiosConfig = {
  headers: {
    Authorization: 'Bearer ' + get(sesion),
  },
}

async function listarDispositivos() {
  try {
    const datos = await axios.get(BASE_URL, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function obtenerDispositivo(id) {
  try {
    const datos = await axios.get(`${BASE_URL}/${id}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function agregarDispositivo(valores) {
  try {
    const datos = await axios.post(BASE_URL, valores, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function eliminarDispositivo(valores) {
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
  
  async function modificarDispositivo(valores) {
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

export const dispositivosServicio = {
  listarDispositivos,
  obtenerDispositivo,
  modificarDispositivo,
  agregarDispositivo,
  eliminarDispositivo,
}
