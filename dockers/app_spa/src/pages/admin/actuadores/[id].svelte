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

  import { actuadoresServicio } from '../../../servicios/actuadores.servicio'
  import { actuadoresEsquema } from '../../../esquemas/actuadores.esquema'

  export let id

  // datos dispositivo
  let actuador
  // datos formulario
  let valores = {}
  let errores = {}

  onMount(async () => {
    actuador = await actuadoresServicio.obtenerActuador(id)
    valores.descripcion = actuador.descripcion
  })

  const capturarErrores = ({ inner }) => {
    return inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message }
    }, {})
  }

  async function guardar() {
    try {
      await actuadoresEsquema.validate(valores, { abortEarly: false })
      await actuadoresServicio.modificarActuador(id, valores)
      $goto('/admin/actuadores')
    } catch (err) {
        console.log(err)
      errores = capturarErrores(err)
    }
  }
</script>

{#if actuador}
  <form on:submit|preventDefault={guardar}>
    <Contenedor tipo="formulario">
      <H2 texto="Id: {actuador.id}" />
      <div class="mb-4">
        <Label texto="Descripción" />
        <Entrada
          id="descripcion"
          ayuda="Descripción del tipo de actuador"
          type="text"
          bind:value={valores.descripcion} />
        {#if errores.descripcion}
          <Error texto={errores.descripcion} />
        {/if}
      </div>
      <Contenedor tipo="justificado">

        <Boton
          label="Guardar"
          icono="guardar"
          color="primary"
          type="submit"
          texto="Guardar" />
        <a href="/admin/actuadores">
          <Boton label="Volver" color="success" />
        </a>
      </Contenedor>
    </Contenedor>
  </form>
{/if}
