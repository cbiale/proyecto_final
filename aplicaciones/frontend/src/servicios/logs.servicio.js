import { get } from 'svelte/store'
import axios from 'axios'
import { sesion, backend } from '../store'

const BASE_URL = `${backend}/api/v1/logs`

let axiosConfig = {
  headers: {
    Authorization: 'Bearer ' + get(sesion),
  },
}

async function listarLogs(id) {
  try {
    const datos = await axios.get(`${BASE_URL}/${id}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

async function listarLogsActuador(id, actuador) {
    try {
      const datos = await axios.get(`${BASE_URL}/${id}/${actuador}`, axiosConfig)
      const resultado = datos.data
      return resultado
    } catch (error) {
      throw new Error(`Estado HTTP ${error}`)
    }
  }
  
export const logsServicio = { listarLogs, listarLogsActuador }
