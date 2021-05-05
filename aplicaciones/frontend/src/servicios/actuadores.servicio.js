import { get } from 'svelte/store'
import axios from 'axios'
import { sesion, backend } from '../store'

const BASE_URL = `http://${backend}:3001/api/v1/actuadores`

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

async function eliminarActuador(valores) {
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
  
  async function modificarActuador(valores) {
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

export const actuadoresServicio = {
  listarActuadores,
  obtenerActuador,
  modificarActuador,
  agregarActuador,
  eliminarActuador,
}
