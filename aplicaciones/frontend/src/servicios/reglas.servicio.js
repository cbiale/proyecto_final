import { get } from 'svelte/store'
import axios from 'axios'
import { sesion, backend } from '../store'

const BASE_URL = `http://${backend}:3001/api/v1/reglas`

let axiosConfig = {
  headers: {
    Authorization: 'Bearer ' + get(sesion),
  },
}

async function listarReglas() {
  try {
    const datos = await axios.get(BASE_URL, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function obtenerRegla(id) {
  try {
    const datos = await axios.get(`${BASE_URL}/${id}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function agregarRegla(valores) {
  try {
    const datos = await axios.post(BASE_URL, valores, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function eliminarRegla(valores) {
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
  
  async function modificarRegla(valores) {
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

export const reglasServicio = {
  listarReglas,
  obtenerRegla,
  modificarRegla,
  agregarRegla,
  eliminarRegla,
}
