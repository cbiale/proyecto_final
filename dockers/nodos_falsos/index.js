'use strict'

const mqtt = require('async-mqtt')
const cliente = mqtt.connect('mqtt:mosquitto:1883')

let temperatura
let humedadSuelo
let humedadAmbiente
let bomba = true

let valores = {}

// configuración del nodo
const estado = {
  dispositivoId: '',
  sensores: ['Temperatura ambiente', 'Humedad suelo', 'Humedad ambiente'],
  actuadores: ['bomba agua'],
}

// tópicos
const topicoInicio = `/init/${estado.dispositivoId}`
const topicoSensores = `/sensores/${estado.dispositivoId}`

// al iniciar se pasa configuración del nodo
cliente.publish(topicoInicio, estado)

// cada un minuto se pasan valores de los sensores
let timer_id = setInterval(function () {
  // obtengo valores falsos
  temperatura = Math.random() * (35 - 10) + 10
  humedadSuelo = Math.random() * (100 - 30) + 30
  humedadAmbiente = Math.random() * (100 - 30) + 30

  // armo el JSON
  valores = {
    'Temperatura ambiente': temperatura,
    'Humedad suelo': humedadSuelo,
    'Humedad ambiente': humedadAmbiente,
  }
  // publico
  cliente.publish(topicoSensores, valores)
}, 60000)
