<script>
  import { onMount } from 'svelte'
  import { goto } from '@roxi/routify'

  import Boton from '../../../componentes/Boton.svelte'
  import Label from '../../../componentes/Label.svelte'
  import Entrada from '../../../componentes/Entrada.svelte'
  import Select from '../../../componentes/Select.svelte'
  import Contenedor from '../../../componentes/Contenedor.svelte'
  import Error from '../../../componentes/Error.svelte'

  import { actuadoresServicio } from '../../../servicios/actuadores.servicio'
  import { sensoresServicio } from '../../../servicios/sensores.servicio'
  import { reglasServicio } from '../../../servicios/reglas.servicio'
  import { reglasEsquema } from '../../../esquemas/reglas.esquema'

  export let id

  // datos formulario
  let sensores
  let actuadores
  let valores = {}
  let errores = {}
  let condiciones = []
  let acciones = []

  onMount(async () => {
    valores = await reglasServicio.obtenerRegla(id)
    // defino condiciones y acciones
    condiciones = valores.condiciones.conditions.all
    acciones = valores.acciones
    // datos de sensores
    sensores = await sensoresServicio.listarSensores()
    // datos de actuadores
    actuadores = await actuadoresServicio.listarActuadores()
  })

  const capturarErrores = ({ inner }) => {
    return inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message }
    }, {})
  }

  async function guardar() {
    try {
      valores.condiciones = {
        conditions: { all: condiciones },
      }
      // agrego evento default a la regla
      valores.condiciones.event = {
        type: 'regla',
        params: {
          resultado: 'ok',
        },
      }
      valores.acciones = acciones
      await reglasEsquema.validate(valores, { abortEarly: false })
      await reglasServicio.modificarRegla(valores)
      $goto('/admin/reglas')
    } catch (err) {
      console.log(err)
      errores = capturarErrores(err)
      console.log(errores)
    }
  }

  // elimina una condicion
  function eliminarCondicion(condicion) {
    condiciones = condiciones.filter((i) => i !== condicion)
  }

  // agregar una condicion
  function agregarCondicion() {
    condiciones = [
      ...condiciones,
      {
        fact: undefined,
        operator: 'equal',
        value: '',
      },
    ]
  }

  // eliminar una accion
  const eliminarAccion = (accion) => {
    acciones = acciones.filter((i) => i !== accion)
  }

  const agregarAccion = () => {
    acciones = [
      ...acciones,
      {
        actuador: undefined,
        valor: undefined,
      },
    ]
  }

  function obtenerTipo(tipo) {
    let encontrado = actuadores.find((id) => id._id == tipo)
    return encontrado.tipo
  }
</script>

{#if sensores && actuadores}
  <form on:submit|preventDefault={guardar}>
    <Contenedor tipo="formulario">
      <div class="mb-4">
        <Label texto="Descripción" />
        <Entrada
          id="descripcion"
          ayuda="Descripción de la regla"
          type="text"
          bind:value={valores.descripcion} />
        {#if errores.descripcion}
          <Error texto={errores.descripcion} />
        {/if}
      </div>

      <Label texto="Condiciones (no opcionales)" />
      <Contenedor tipo="justificado">
        <Boton
          label="Condición"
          color="info"
          icono="agregar"
          on:click={() => agregarCondicion()} />
      </Contenedor>

      {#each condiciones as condicion, i}
        <Contenedor tipo="justificado">
          <Label texto="Sensor" />
          <Select id="tipo" bind:value={condicion.fact}>
            {#each sensores as sensor}
              <option value={sensor._id}>{sensor.descripcion}</option>
            {/each}
          </Select>

          <Label texto="Condición" />
          <Select id="condicion" bind:value={condicion.operator}>
            <option value="equal" selected>igual a</option>
            <option value="notEqual">distinto a</option>
            <option value="lessThan">menor a</option>
            <option value="lessThanInclusive">menor o igual a</option>
            <option value="greaterThan">mayor a</option>
            <option value="greaterThanInclusive">mayor o igual a</option>
          </Select>

          <Label texto="Valor" />
          <Entrada
            id="valor"
            ayuda="Valor a comparar"
            type="number"
            step="0.01"
            bind:value={condicion.value} />

          <Boton
            label=""
            color="error"
            icono="borrar"
            on:click={() => eliminarCondicion(condicion)} />

        </Contenedor>
        {#if errores[`condiciones.conditions.all[${i}].fact`]}
          <Error texto={errores[`condiciones.conditions.all[${i}].fact`]} />
        {/if}
        {#if errores[`condiciones.conditions.all[${i}].operator`]}
          <Error texto={errores[`condiciones.conditions.all[${i}].operator`]} />
        {/if}
        {#if errores[`condiciones.conditions.all[${i}].value`]}
          <Error texto={errores[`condiciones.conditions.all[${i}].value`]} />
        {/if}
      {/each}

      <Contenedor tipo="justificado">
        <Boton
          label="Acción"
          color="info"
          icono="agregar"
          on:click={() => agregarAccion()} />
      </Contenedor>

      {#each acciones as accion, i}
        <Contenedor tipo="justificado">
          <Label texto="Actuador" />
          <Select id="tipo" bind:value={accion.actuador}>
            {#each actuadores as actuador}
              <option value={actuador._id}>{actuador.descripcion}</option>
            {/each}
          </Select>
          {#if accion.actuador}
            <Label texto="Estado" />
            {#if obtenerTipo(accion.actuador) === 'On off'}
              <Select id="valor" bind:value={accion.valor}>
                <option value="On" selected>On</option>
                <option value="Off">Off</option>
              </Select>
            {:else}
              <Entrada
                id="valor"
                ayuda="Nuevo valor"
                type="number"
                bind:value={accion.valor} />
            {/if}
          {/if}
          <Boton
            label=""
            color="error"
            icono="borrar"
            on:click={() => eliminarAccion(accion)} />

        </Contenedor>
        {#if errores[`acciones.[${i}].actuador`]}
          <Error texto={errores[`acciones.[${i}].actuador`]} />
        {/if}
        {#if errores[`acciones.[${i}].valor`]}
          <Error texto={errores[`acciones.[${i}].valor`]} />
        {/if}
      {/each}

      <Contenedor tipo="justificado">
        <Boton
          label="Guardar"
          icono="guardar"
          color="primary"
          type="submit"
          texto="Guardar" />
        <a href="/admin/reglas">
          <Boton label="Volver" color="success" />
        </a>
      </Contenedor>

    </Contenedor>
  </form>
{/if}
