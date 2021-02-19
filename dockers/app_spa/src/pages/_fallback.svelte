<script>
  import { url } from "@roxi/routify";
  import Contenedor from 'Contenedor.svelte'
  import H1 from 'H1.svelte'
  import H2 from 'H2.svelte'
  import Boton from 'Boton.svelte'
</script>

<Contenedor tipo={'centrado'}>
  <H1 texto={'404'} />
  <H2 texto={'No encontrado'} />
  <H2 texto={'😱😱😱😱'} />
  <a
    class="inline-block py-2 px-3 text-gray-900 hover:text-gray-700 no-underline"
    href={$url('/')}>
    <Boton label={'Volver'} color="{'success'}" />
  </a>
</Contenedor>
