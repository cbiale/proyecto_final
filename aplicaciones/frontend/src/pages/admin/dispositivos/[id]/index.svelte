<script>
  // validar formulario, basado en: https://codechips.me/svelte-form-validation-with-yup/

  import { onMount } from 'svelte'
  import { goto } from '@roxi/routify'
  import Boton from '../../../../componentes/Boton.svelte'
  import Label from '../../../../componentes/Label.svelte'
  import Entrada from '../../../../componentes/Entrada.svelte'
  import Contenedor from '../../../../componentes/Contenedor.svelte'
  import Error from '../../../../componentes/Error.svelte'
  import H2 from '../../../../componentes/H2.svelte'

  import { dispositivosServicio } from '../../../../servicios/dispositivos.servicio'
  import { dispositivosEsquema } from '../../../../esquemas/dispositivos.esquema'

  export let id

  // datos dispositivo
  let dispositivo
  // datos formulario
  let valores = {}
  let errores = {}

  onMount(async () => {
    dispositivo = await dispositivosServicio.obtenerDispositivo(id)
    valores._id = id
    valores._rev = dispositivo._rev
    valores.denominacion = dispositivo.denominacion
    valores.latitud = dispositivo.latitud
    valores.longitud = dispositivo.longitud
    // en el caso que se haya conectado el dispositivo
    valores.tiempo = dispositivo.tiempo
    valores.sensores = dispositivo.sensores
    valores.actuadores = dispositivo.actuadores
    // en el caso que se hayan asociado reglas
    valores.reglas = dispositivo.reglas
  })

  const capturarErrores = ({ inner }) => {
    return inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message }
    }, {})
  }

  async function guardar() {
    try {
      await dispositivosEsquema.validate(valores, { abortEarly: false })
      console.log(valores)
      await dispositivosServicio.modificarDispositivo(valores)
      $goto('/admin/dispositivos')
    } catch (err) {
      console.log(err)
      errores = capturarErrores(err)
    }
  }
</script>

{#if dispositivo}
  <form on:submit|preventDefault={guardar}>
    <Contenedor tipo="formulario">
      <H2 texto="Id: {dispositivo._id}" />
      <div class="mb-4">
        <Label texto="Denominación" />
        <Entrada
          id="denominacion"
          ayuda="Denominación del dispositivo"
          type="text"
          bind:value={valores.denominacion} />
        {#if errores.denominacion}
          <Error texto={errores.denominacion} />
        {/if}
      </div>
      <div class="mb-4">
        <Label texto="Latitud" />
        <Entrada
          id="latitud"
          ayuda="Latitud donde se ubica el dispositivo"
          type="text"
          bind:value={valores.latitud} />
        {#if errores.latitud}
          <Error texto={errores.latitud} />
        {/if}
      </div>
      <div class="mb-4">
        <Label texto="Longitud" />
        <Entrada
          id="longitud"
          ayuda="Longitud donde se ubica el dispositivo"
          type="text"
          bind:value={valores.longitud} />
        {#if errores.longitud}
          <Error texto={errores.longitud} />
        {/if}
      </div>

      {#if valores.tiempo}
          <div class="mb-4">
            <Label texto="Tiempo" />
            <Entrada
              id="tiempo"
              ayuda="Tiempo entre lecturas"
              type="numeric"
              bind:value={valores.tiempo} />
          </div>
      {/if}

      <Contenedor tipo="justificado">

        <Boton
          label="Guardar"
          icono="guardar"
          color="primary"
          type="submit"
          texto="Guardar" />
        <a href="/admin/dispositivos">
              <Boton label="Volver" color="success" />
        </a>
      </Contenedor>
    </Contenedor>
  </form>
{/if}
