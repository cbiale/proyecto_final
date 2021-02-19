<script>
  import { sesion } from '../../store'
  import Login from '../ingresar/index.svelte'
  import Enlace from 'Enlace.svelte'
</script>

{#if $sesion}

  <div class="flex flex-wrap">
    <div
      class="item-center text-center  xl:w-1/5
      justify-center mx-auto flex flex-col w-full overflow-y-hidden">
      <nav>
        <Enlace label='Mapa' icono='mapa' enlace='/admin/mapa'/>
        <Enlace label='Dispositivos' icono='dispositivos' enlace='/admin/dispositivos'/>
        <Enlace label='Sensores' icono='sensores' enlace='/admin/sensores'/>
        <Enlace label='Actuadores' icono='actuadores' enlace='/admin/actuadores'/>
        <!--Enlace label='Reglas' icono='reglas' enlace='/admin/reglas'/-->
        <Enlace label='Usuarios' icono='usuarios' enlace='/admin/usuarios'/>
    </nav>

    </div>
    <div class="w-auto xl:w-4/5 p-4 ">
      <!-- contenido -->
      <slot />
    </div>
  </div>
{:else}
  <Login />
{/if}
