<script>
  // validar formulario, basado en: https://codechips.me/svelte-form-validation-with-yup/

  import { onMount } from 'svelte'
  import { params, goto } from '@roxi/routify'
  import Boton from '../../../componentes/Boton.svelte'
  import Label from '../../../componentes/Label.svelte'
  import Entrada from '../../../componentes/Entrada.svelte'
  import Contenedor from '../../../componentes/Contenedor.svelte'
  import Select from '../../../componentes/Select.svelte'
  import Error from '../../../componentes/Error.svelte'
  import H2 from '../../../componentes/H2.svelte'

  import { actuadoresServicio } from '../../../servicios/actuadores.servicio'
  import { actuadoresEsquema } from '../../../esquemas/actuadores.esquema'

  export let id

  // datos nodo
  let actuador
  // datos formulario
  let valores = {}
  let errores = {}

  onMount(async () => {
    actuador = await actuadoresServicio.obtenerActuador(id)
    valores._id = id
    valores._rev = actuador._rev
    valores.descripcion = actuador.descripcion
    valores.tipo = actuador.tipo
  })

  const capturarErrores = ({ inner }) => {
    return inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message }
    }, {}) 
  }

  async function guardar() {
    try {
      await actuadoresEsquema.validate(valores, { abortEarly: false })
      await actuadoresServicio.modificarActuador(valores)
      $goto('/admin/actuadores')
    } catch (err) {
      errores = capturarErrores(err)
    }
  }
</script>

{#if actuador}
  <form on:submit|preventDefault={guardar}>
    <Contenedor tipo="formulario">
      <H2 texto="Id: {actuador._id}" />
      <div class="mb-4">
        <Label texto="Descripción" />
        <Entrada
          id="descripcion"
          ayuda="Descripción del tipo de actuador"
          type="text"
          bind:value={valores.descripcion} readonly/>
        {#if errores.descripcion}
          <Error texto={errores.descripcion} />
        {/if}
      </div>
      <div class="mb-4">
        <Label texto="Tipo" />
        <Select id="tipo" bind:value={valores.tipo}>
          <option value="On off">On Off</option>
          <option value="Multinivel">Multinivel</option>
        </Select>
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
