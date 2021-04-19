<script>
  import { url } from '@roxi/routify'
  import { goto } from '@roxi/routify'
  import { sesion } from '../../store'
  import Boton from 'Boton.svelte'
  import Contenedor from 'Contenedor.svelte'
  import Label from 'Label.svelte'
  import Entrada from 'Entrada.svelte'
  import axios from 'axios'

  if ($sesion) {
    $goto('/admin/mapa')
  }

  let usuario = {}

  async function ingresar() {
    try {
      const datos = await axios.post('/api/v1/ingresar', {
        id: usuario.id,
        password: usuario.password,
      })
      const resultado = datos.data
      console.log(resultado)
      if (resultado.estado === 'ok') {
        sesion.set(resultado.token)
        $goto('/admin/mapa')
      }
    } catch (error) {
      console.log(error)
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
