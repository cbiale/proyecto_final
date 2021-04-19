<script>
  // validar formulario, basado en: https://codechips.me/svelte-form-validation-with-yup/

  import { onMount } from 'svelte'
  import { params, goto } from '@roxi/routify'
  import Boton from 'Boton.svelte'
  import Label from 'Label.svelte'
  import Entrada from 'Entrada.svelte'
  import Contenedor from 'Contenedor.svelte'
  import Error from 'Error.svelte'
  import H2 from 'H2.svelte'

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
  })

  const capturarErrores = ({ inner }) => {
    return inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message }
    }, {})
  }

  async function guardar() {
    try {
      await dispositivosEsquema.validate(valores, { abortEarly: false })
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
        <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <H2 texto="Id: {id}" />
          <div class="mb-4">
            <Label texto="Tiem  po" />
            <Entrada
              id="tiempo"
              ayuda="Tiempo entre lecturas"
              type="numeric"
              bind:value={valores.tiempo} />
          </div>
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
