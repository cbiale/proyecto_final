<script>
  // validar formulario, basado en: https://codechips.me/svelte-form-validation-with-yup/

  import { onMount } from 'svelte'
  import { goto } from "@roxi/routify";

  import Boton from '../../../componentes/Boton.svelte'
  import Label from '../../../componentes/Label.svelte'
  import Entrada from '../../../componentes/Entrada.svelte'
  import Select from '../../../componentes/Select.svelte'
  import Contenedor from '../../../componentes/Contenedor.svelte'
  import Error from '../../../componentes/Error.svelte'

  import { actuadoresServicio } from '../../../servicios/actuadores.servicio'
  import { actuadoresEsquema } from '../../../esquemas/actuadores.esquema'

  // datos formulario
  let valores = {}
  let errores = {}

  onMount(async () => {
    valores.descripcion = ''
    valores.tipo = 'On off'
  })

  const capturarErrores = ({ inner }) => {
    return inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message }
    }, {})
  }

  async function guardar() {
    try {
      await actuadoresEsquema.validate(valores, { abortEarly: false })
      await actuadoresServicio.agregarActuador(valores)
      $goto('/admin/actuadores')
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
        ayuda="Descripción del tipo de actuador"
        type="text"
        bind:value={valores.descripcion} />
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
