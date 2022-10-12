import { get } from 'svelte/store'
import axios from 'axios'
import { sesion, backend } from '../store'

const BASE_URL = `${backend}/api/v1/nodos`

let axiosConfig = {
  headers: {
    Authorization: 'Bearer ' + get(sesion)
  },
}

async function listarNodos() {
  try {
    const datos = await axios.get(BASE_URL, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function obtenerNodo(id) {
  try {
    const datos = await axios.get(`${BASE_URL}/${id}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function agregarNodo(valores) {
  try {
    const datos = await axios.post(BASE_URL, valores, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function eliminarNodo(valores) {
  try {
    axiosConfig.headers._rev = valores._rev
    const datos = await axios.delete(`${BASE_URL}/${valores._id}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function modificarNodo(valores) {
  try {
    console.log(valores)
    const datos = await axios.put(
      `${BASE_URL}/${valores._id}`,
      valores,
      axiosConfig,
    )
    const resultado = datos.data
    console.log(resultado)
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

export const nodosServicio = {
  listarNodos,
  obtenerNodo,
  modificarNodo,
  agregarNodo,
  eliminarNodo,
}
