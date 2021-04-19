const BASE_URL = '/api/v1/logs'
import { get } from 'svelte/store'
import { sesion } from '../store'
import axios from 'axios'

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
