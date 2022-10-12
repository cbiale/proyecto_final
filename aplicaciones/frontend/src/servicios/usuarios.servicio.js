import { get } from 'svelte/store'
import axios from 'axios'
import { sesion, backend } from '../store'

const BASE_URL = `${backend}/api/v1/usuarios`

let axiosConfig = {
  headers: {
    Authorization: 'Bearer ' + get(sesion),
  },
}

async function listarUsuarios() {
  try {
    const datos = await axios.get(BASE_URL, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function obtenerUsuario(id) {
  try {
    const datos = await axios.get(`${BASE_URL}/${id}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function agregarUsuario(valores) {
  try {
    const datos = await axios.post(BASE_URL, valores, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function eliminarUsuario(valores) {
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
  
  async function modificarUsuario(valores) {
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

export const usuariosServicio = {
  listarUsuarios,
  obtenerUsuario,
  modificarUsuario,
  agregarUsuario,
  eliminarUsuario,
}
