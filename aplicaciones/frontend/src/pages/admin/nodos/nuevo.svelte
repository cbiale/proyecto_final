<script>
  // validar formulario, basado en: https://codechips.me/svelte-form-validation-with-yup/

  import { onMount } from 'svelte'
  import { goto } from "@roxi/routify";

  import Boton from '../../../componentes/Boton.svelte'
  import Label from '../../../componentes/Label.svelte'
  import Entrada from '../../../componentes/Entrada.svelte'
  import Contenedor from '../../../componentes/Contenedor.svelte'
  import Error from '../../../componentes/Error.svelte'

  import { nodosServicio } from '../../../servicios/nodos.servicio'
  import { nodosEsquema } from '../../../esquemas/nodos.esquema'

  // datos formulario
  let valores = {}
  let errores = {}

  onMount(async () => {
    valores.denominacion = ''
    valores.latitud = ''
    valores.longitud = ''
  })

  const capturarErrores = ({ inner }) => {
    return inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message }
    }, {})
  }

  async function guardar() {
    try {
      await nodosEsquema.validate(valores, { abortEarly: false })
      await nodosServicio.agregarNodo(valores)
      $goto('/admin/nodos')
    } catch (err) {
      console.log (err)
      errores = capturarErrores(err)
    }
  }
</script>

<form on:submit|preventDefault={guardar}>
<Contenedor tipo="formulario">
  <div class="mb-4">
    <Label texto="Denominación" />
    <Entrada
      id="denominacion"
      ayuda="Denominación del nodo"
      type="text"
      bind:value={valores.denominacion} />
    {#if errores.denominacion}<Error texto={errores.denominacion}/>{/if}
  </div>
  <div class="mb-4">
    <Label texto="Latitud" />
    <Entrada
      id="latitud"
      ayuda="Latitud donde se ubica el nodo"
      type="text"
      bind:value={valores.latitud} />
    {#if errores.latitud}<Error texto={errores.latitud}/>{/if}
  </div>
  <div class="mb-4">
    <Label texto="Longitud" />
    <Entrada
      id="longitud"
      ayuda="Longitud donde se ubica el nodo"
      type="text"
      bind:value={valores.longitud} />
    {#if errores.longitud}<Error texto={errores.longitud}/>{/if}
  </div>
  <Contenedor tipo='justificado'>

  <Boton label="Guardar" icono="guardar" color="primary" type="submit" texto="Guardar" />
  <a href="/admin/nodos">
    <Boton label="Volver" color="success" />
  </a>
  </Contenedor>
</Contenedor>
</form>