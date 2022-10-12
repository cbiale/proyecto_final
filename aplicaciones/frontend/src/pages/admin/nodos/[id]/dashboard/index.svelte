<script>
  // core components
  import Contenedor from '../../../../../componentes/Contenedor.svelte'
  import H2 from '../../../../../componentes/H2.svelte'
  import Boton from '../../../../../componentes/Boton.svelte'
  import { onMount, onDestroy } from 'svelte'
  import { nodosServicio } from '../../../../../servicios/nodos.servicio'
  import { medicionesServicio } from '../../../../../servicios/mediciones.servicio'
  import { logsServicio } from '../../../../../servicios/logs.servicio'
  import { isEqual, xorWith } from 'lodash'

  export let id

  // datos nodo
  let tiempo
  let nodo
  let valoresSensores = []
  let valoresActuadores = []
  let finalizado

  async function obtenerDatos() {
    nodo = await nodosServicio.obtenerNodo(id)
    let tempo = []
    // datos sensores
    for (let sensor of nodo.sensores) {
      const valores = await medicionesServicio.listarMedicionesSensor(
        nodo._id,
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
    for (let actuador of nodo.actuadores) {
      const valores = await logsServicio.listarLogsActuador(
        nodo._id,
        actuador,
      )
      tempo.push(valores)
    }

    // si hay cambio
    if (tempo.length !== valoresActuadores.length) {
      valoresActuadores = tempo
    }
    if (xorWith(tempo, valoresActuadores, isEqual).length !== 0) {
      valoresActuadores = tempo
    }
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
  {#if nodo && finalizado}
    <Contenedor tipo="justificado">
      <H2 texto="Dashboard de: {id}" />
    </Contenedor>

    <div class="flex flex-wrap">
      <div class="px-2">
        <Contenedor tipo="justificado">
          <a href="mediciones">
            <Boton label="Mediciones" icono="mediciones" color="success" />
          </a>
          <a href="logs">
            <Boton label="Logs" icono="logs" color="success" />
          </a>
          <a href="/admin/nodos">
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
              {#each valor.datos as medicion}
                <div>{medicion.valor}</div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
