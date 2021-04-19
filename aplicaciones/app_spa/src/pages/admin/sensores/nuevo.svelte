<script>
  // validar formulario, basado en: https://codechips.me/svelte-form-validation-with-yup/

  import { onMount } from 'svelte'
  import { goto } from "@roxi/routify";

  import Boton from 'Boton.svelte'
  import Label from 'Label.svelte'
  import Entrada from 'Entrada.svelte'
  import Contenedor from 'Contenedor.svelte'
  import Error from 'Error.svelte'

  import { sensoresServicio } from '../../../servicios/sensores.servicio'
  import { sensoresEsquema } from '../../../esquemas/sensores.esquema'

  // datos formulario
  let valores = {}
  let errores = {}

  onMount(async () => {
    valores.descripcion = ''
    valores.metrica = ''
  })

  const capturarErrores = ({ inner }) => {
    return inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message }
    }, {})
  }

  async function guardar() {
    try {
      await sensoresEsquema.validate(valores, { abortEarly: false })
      await sensoresServicio.agregarSensor(valores)
      $goto('/admin/sensores')
    } catch (err) {
      console.log (err)
      errores = capturarErrores(err)
    }
  }
  </script>

<form on:submit|preventDefault={guardar}>
  <Contenedor tipo="formulario">
    <div class="mb-4">
      <Label texto="Descripción" />
      <Entrada
        id="descripcion"
        ayuda="Descripción del tipo de sensor"
        type="text"
        bind:value={valores.descripcion} />
      {#if errores.descripcion}
        <Error texto={errores.descripcion} />
      {/if}
    </div>
    <div class="mb-4">
        <Label texto="Métrica" />
        <Entrada
          id="metrica"
          ayuda="Métrica del tipo de sensor"
          type="text"
          bind:value={valores.metrica} />
        {#if errores.metrica}
          <Error texto={errores.metrica} />
        {/if}
      </div>
      <Contenedor tipo="justificado">

      <Boton
        label="Guardar"
        icono="guardar"
        color="primary"
        type="submit"
        texto="Guardar" />
      <a href="/admin/sensores">
        <Boton label="Volver" color="success" />
      </a>
    </Contenedor>
  </Contenedor>
</form>
