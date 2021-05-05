<script>
  import { url } from '@roxi/routify'
  import { goto } from '@roxi/routify'
  import { sesion, administrador, backend } from '../../store'
  import Boton from '../../componentes/Boton.svelte'
  import Contenedor from '../../componentes/Contenedor.svelte'
  import Label from '../../componentes/Label.svelte'
  import Entrada from '../../componentes/Entrada.svelte'
  import Error from '../../componentes/Error.svelte'
  import axios from 'axios'

  const BASE_URL = `http://${backend}:3001/api/v1/ingresar/`

  if ($sesion) {
    $goto('/admin/mapa')
  }

  let usuario = {}
  let mensajeError = ''

  async function ingresar() {
    try {
      const datos = await axios.post(BASE_URL, {
        id: usuario.id,
        password: usuario.password,
      })
      const resultado = datos.data
      console.log(resultado)
      if (resultado.estado === 'ok') {
        sesion.set(resultado.token)
        administrador.set(resultado.administrador)
        $goto('/admin/mapa')
      } else {
        mensajeError = 'Usuario o clave incorrecto'
      }
    } catch (error) {
      mensajeError = error
    }
  }
</script>

<main>
<form on:submit|preventDefault={ingresar}>
  <Contenedor tipo='formulario'>
    <div class="mb-4">
      <Label texto='Usuario' />
      <Entrada
        id= 'usuario'
        ayuda= 'Nombre de usuario'
        type="text"
        bind:value={usuario.id} />
    </div>
    <div class="mb-4">
      <Label texto='Clave' />
      <Entrada
        id= 'usuario'
        ayuda= 'Clave del usuario'
        type="password"
        bind:value={usuario.password} />
    </div>
    {#if mensajeError}
        <Error texto={mensajeError} />
    {/if}
    <Contenedor tipo='justificado'>
      <Boton
        label='Ingresar'
        color='primary'
        icono='usuario'
        type='submit'/>

      <a
        class="inline-block py-2 px-3 text-gray-900 hover:text-gray-700
        no-underline"
        href={$url('/')}>
        <Boton label='Volver' color='success' icono='home' />
      </a>
    </Contenedor>
  </Contenedor>
  </form>
</main>
