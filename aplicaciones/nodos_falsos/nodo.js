'use strict'

const mqtt = require('async-mqtt')
const yargs = require('yargs')
const round10 = require('round10').round10

// manejo de argumentos
const argv = yargs(process.argv.slice(2))
  .scriptName('nodo')
  .usage('Uso: node $0 -i id_nodo')
  .example('node $0 -i 514df27f24a06f55434b3eb27e00cb8d', '')
  .example('\nInicia el nodo con id: 514df27f24a06f55434b3eb27e00cb8d', '')
  .option('id', {
    alias: 'i',
    describe: 'Id del nodo',
    demandOption: 'El Id del nodo es requerido',
    type: 'string',
    nargs: 1,
  })
  .help()
  .alias('help', 'h')
  .alias('version', 'v')
  .epilog('Copyright 2021 - Biale Hermanos S.H.')
  .strict().argv

// variable Id dispositivo
let dispositivoId = argv.id

// Usar un tópico (estado)
// sensor o actuador : valor
// Otro tópico (control)
// actuador : nuevo valor
const topicoInicio = `inicio/${dispositivoId}`
const topicoTiempo = `tiempo/${dispositivoId}`
const topicoEstado = `estado/${dispositivoId}`
const topicoControl = `control/${dispositivoId}`

// cliente MQTT
let cliente

// variables de estado y actuadores
let estado = {}
let bombaAgua = true

// variable de tiempo (minutos)
let tiempo = 1

// configuración del nodo (en este caso se pasa tiempo, sensores y actuadores)
// si bien no es una buena practica, es una forma simple de iniciar un nodo
const datos = {
  tiempo: tiempo,
  sensores: ['temperatura-ambiente', 'humedad-suelo', 'humedad-ambiente'],
  actuadores: ['bomba-de-agua'],
}

// programa principal

// conexión a broker MQTT
try {
  console.log('Conectando...')
  cliente = mqtt.connect('mqtt:localhost:1883')
  console.log('Conectado!')

  // suscripciones a cambio de tiempo y actuadores
  cliente.subscribe(topicoTiempo)
  cliente.subscribe(topicoControl)
} catch (error) {
  // en caso de error salgo del programa
  console.log('Error al conectarse a broker MQTT o al subscribirse a tópicos')
  process.exit(1)
}
// recepción de mensajes
cliente.on('message', (topico, mensaje) => {
  console.log(`Nuevo mensaje: ${topico} ${mensaje}`)
  try {
    // se puede validar en ambos casos que se reciban datos correctos (MEJORA)
    // usar lodash (Referencia: https://markoskon.com/lodash-utilities/)
    if (topico === topicoTiempo) {
      tiempo = mensaje['Tiempo']
    }
    if (topico === topicoControl) {
      if (bombaAgua !== mensaje['Bomba agua']) {
        bombaAgua = mensaje['Bomba agua']
        cliente.publish(topicoEstado, bombaAgua)
      }
    }
  } catch (error) {
    console.log('Mensaje mal formado')
  }
})

// al iniciar se pasa configuración del nodo
console.log(`Inicio...${JSON.stringify(datos)}`)
cliente.publish(topicoInicio, JSON.stringify(datos))
console.log('Iniciado...')

// cada un minuto se pasan valores de los sensores
let timer_id = setInterval(function () {
  // obtengo valores falsos
  let temperatura = Math.random() * (35 - 10) + 10
  let humedadSuelo = Math.random() * (100 - 30) + 30
  let humedadAmbiente = Math.random() * (100 - 30) + 30

  estado = {
    'temperatura-ambiente': round10(temperatura, -2),
    'humedad-suelo': round10(humedadSuelo, -2),
    'humedad-ambiente': round10(humedadAmbiente, -2),
  }

  // publico
  console.log(`Publico...${JSON.stringify(estado)}`)
  cliente.publish(topicoEstado, JSON.stringify(estado))
}, tiempo * 10000)