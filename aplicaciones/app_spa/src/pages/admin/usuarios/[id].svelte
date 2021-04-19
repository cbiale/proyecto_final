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

  import { usuariosServicio } from '../../../servicios/usuarios.servicio'
  import { usuariosEsquemaModificar } from '../../../esquemas/usuarios.esquema'

  export let id

  // datos usuario
  let usuario
  // datos formulario
  let valores = {}
  let errores = {}

  onMount(async () => {
    usuario = await usuariosServicio.obtenerUsuario(id)
    valores._id = id
    valores._rev = usuario._rev
    valores.password = ''
    valores.passwordControl = ''
  })

  const capturarErrores = ({ inner }) => {
    return inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message }
    }, {})
  }

  async function guardar() {
    try {
      await usuariosEsquemaModificar.validate(valores, { abortEarly: false })
      await usuariosServicio.modificarUsuario(valores)
      $goto('/admin/usuarios')
    } catch (err) {
      console.log(err)
      errores = capturarErrores(err)
    }
  }
</script>

{#if usuario}
  <form on:submit|preventDefault={guardar}>
    <Contenedor tipo="formulario">
      <H2 texto="Id: {usuario._id}" />

      <div class="mb-4">
        <Label texto="Clave" />
        <Entrada
          id="password"
          ayuda="Clave del usuario"
          type="password"
          bind:value={valores.password} />
        {#if errores.password}
          <Error texto={errores.password} />
        {/if}
      </div>

      <div class="mb-4">
        <Label texto="Repetir Clave" />
        <Entrada
          id="passwordControl"
          ayuda="Control clave del usuario"
          type="password"
          bind:value={valores.passwordControl} />
        {#if errores.passwordControl}
          <Error texto={errores.passwordControl} />
        {/if}
      </div>

      <Contenedor tipo="justificado">

        <Boton
          label="Guardar"
          icono="guardar"
          color="primary"
          type="submit"
          texto="Guardar" />
        <a href="/admin/usuarios">
          <Boton label="Volver" color="success" />
        </a>
      </Contenedor>
    </Contenedor>
  </form>
{/if}
