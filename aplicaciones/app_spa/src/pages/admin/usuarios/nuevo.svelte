<script>
  // validar formulario, basado en: https://codechips.me/svelte-form-validation-with-yup/

  import { onMount } from 'svelte'
  import { goto } from "@roxi/routify";

  import Boton from 'Boton.svelte'
  import Label from 'Label.svelte'
  import Entrada from 'Entrada.svelte'
  import Contenedor from 'Contenedor.svelte'
  import Error from 'Error.svelte'

  import { usuariosServicio } from '../../../servicios/usuarios.servicio'
  import { usuariosEsquemaAgregar } from '../../../esquemas/usuarios.esquema'

  // datos formulario
  let valores = {}
  let errores = {}

  onMount(async () => {
    valores.id = ''
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
      await usuariosEsquemaAgregar.validate(valores, { abortEarly: false })
      await usuariosServicio.agregarUsuario(valores)
      $goto('/admin/usuarios')
    } catch (err) {
      console.log (err)
      errores = capturarErrores(err)
    }
  }
  </script>

<form on:submit|preventDefault={guardar}>
  <Contenedor tipo="formulario">

    <div class="mb-4">
        <Label texto="Nombre (id)" />
        <Entrada
          id="id"
          ayuda="Nombre del usuario"
          type="text"
          bind:value={valores.id} />
        {#if errores.id}
          <Error texto={errores.id} />
        {/if}
      </div>
  
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
