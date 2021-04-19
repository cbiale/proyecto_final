<script>
  // core components
  import Contenedor from 'Contenedor.svelte'
  import Boton from 'Boton.svelte'
  import H2 from 'H2.svelte'
  import Label from 'Label.svelte'
  import Entrada from 'Entrada.svelte'
  import { onMount, onDestroy } from 'svelte'
  import { dispositivosServicio } from '../../../../../servicios/dispositivos.servicio'
  import { medicionesServicio } from '../../../../../servicios/mediciones.servicio'
  import { logsServicio } from '../../../../../servicios/logs.servicio'
  import { isEqual, xorWith } from 'lodash'

  export let id

  
  // datos dispositivo0
  let tiempo
  let dispositivo
  let valoresSensores = []
  let valoresActuadores = []
  let finalizado

  async function obtenerDatos() {
    dispositivo = await dispositivosServicio.obtenerDispositivo(id)
    let tempo = []
    // datos sensores
    for (let sensor of dispositivo.sensores) {
      const valores = await medicionesServicio.listarMedicionesSensor(
        dispositivo._id,
        sensor,
      )
      tempo.push(valores)
    }

    // si hay cambio
    if (tempo.length !== valoresSensores.length) {
      valoresSensores = tempo
    }
    if (xorWith(tempo, valoresSensores, isEqual).length !== 0) {
      valoresSensores = tempo
    }

    tempo = []
    // datos actuadores
    for (let actuador of dispositivo.actuadores) {
      const valores = await logsServicio.listarLogsActuador(
        dispositivo._id,
        actuador,
      )
      tempo.push(valores)
    }

    // si hay cambio
    if (tempo.length !== valoresActuadores.length) {
      valoresActuadores = tempo
    }
    if ((xorWith(tempo, valoresActuadores, isEqual).length) !== 0) {
      valoresActuadores = tempo
    }
    console.log(valoresActuadores)
  }

  const intervalo = setInterval(async () => {
    obtenerDatos()
  }, 5000)

  onMount(async () => {
    await obtenerDatos()
    finalizado = true
  })

  onDestroy(() => clearInterval(intervalo))
</script>

<div>
  {#if dispositivo && finalizado}
    <div class="flex flex-wrap">
      <div class="px-2">
        <Contenedor tipo="justificado">
          <a href="reglas">
            <Boton label="Reglas" icono="reglas" color="success" />
          </a>
          <a href="mediciones">
            <Boton label="Mediciones" icono="mediciones" color="success" />
          </a>
          <a href="logs">
            <Boton label="Logs" icono="logs" color="success" />
          </a>
          <a href="/admin/dispositivos">
            <Boton label="Volver" color="success" />
          </a>
        </Contenedor>
      </div>

      <div class="container mx-4 ">
        <p>Sensores:</p>
        {#each valoresSensores as valor}
          <div
            class="inline-block my-2 mx-2 overflow-hidden rounded shadow-md w-64
            text-center">
            <div class="divide-y divide-green">
              <div class="text-sm text-white font-bold bg-indigo-500">
                {valor.sensor.descripcion} - {valor.sensor.metrica}
              </div>
              {#each valor.datos as medicion}
                <div>{medicion}</div>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <div class="container mx-4">
        <p>Actuadores:</p>
        {#each valoresActuadores as valor}
          <div
            class="inline-block my-2 mx-2 overflow-hidden rounded shadow-md w-64
            text-center">
            <div class="divide-y divide-green">
              <div class="text-sm text-white font-bold bg-indigo-500">
                {valor.actuador.descripcion} - {valor.actuador.tipo}
              </div>
              <div>{valor.datos}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
