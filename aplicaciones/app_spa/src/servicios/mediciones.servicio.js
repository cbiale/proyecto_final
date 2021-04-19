const BASE_URL = '/api/v1/mediciones'
import { get } from 'svelte/store'
import { sesion } from '../store'
import axios from 'axios'


let axiosConfig = {
  headers: {
    Authorization: 'Bearer ' + get(sesion),
  },
}

async function listarMediciones(id) {
  try {
    const datos = await axios.get(`${BASE_URL}/${id}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

 async function listarMedicionesSensor(id, sensor) {
  try {
    const datos = await axios.get(`${BASE_URL}/${id}/${sensor}`, axiosConfig)
    const resultado = datos.data
    return resultado
  } catch (error) {
    throw new Error(`Estado HTTP ${error}`)
  }
}

export const medicionesServicio = { listarMediciones, listarMedicionesSensor }
