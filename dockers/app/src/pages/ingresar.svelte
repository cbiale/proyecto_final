<script>
  import { url } from "@roxi/routify";
  import Boton from 'Boton.svelte'
  import Contenedor from 'Contenedor.svelte'
  import Label from 'Label.svelte'
  import Entrada from 'Entrada.svelte'

  const ingresar = () => {
    console.log('dsadsada')
  }
</script>

<main>
    <Contenedor tipo={'formulario'}>
    <div class="mb-4">
      <Label texto={'Usuario'} />
      <Entrada id={'usuario'} ayuda={'Nombre de usuario'} type="text" />
    </div>
    <div class="mb-4">
      <Label texto={'Clave'} />
      <Entrada id={'usuario'} ayuda={'Clave del usuario'} type="password"/>
    </div>
    <Contenedor tipo={'justificado'}>
      <Boton
        label={'Ingresar'}
        color={'primary'}
        icono={'usuario'}
        on:click={() => ingresar()} />

    <a class="inline-block py-2 px-3 text-gray-900 hover:text-gray-700 no-underline" href={$url('/')>
    <Boton
        label={'Volver'}
        color={'success'}
        icono={'home'}/>
    </a>
    </Contenedor>
  </Contenedor>
</main>
