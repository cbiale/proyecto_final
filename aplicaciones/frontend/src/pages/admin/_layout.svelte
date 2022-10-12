<script>
  import { sesion, administrador } from '../../store'
  import Login from '../ingresar/index.svelte'
  import Enlace from '../../componentes/Enlace.svelte'
</script>

{#if $sesion}

  <div class="flex flex-wrap">
    <div
      class="item-center text-center  xl:w-1/6
       mx-auto flex flex-col w-full overflow-y-hidden">
      <nav>
        <Enlace label='Mapa' icono='mapa' enlace='/admin/mapa'/>
        <Enlace label='Nodos' icono='nodos' enlace='/admin/nodos'/>
        {#if $administrador === true}
            <Enlace label='Sensores' icono='sensores' enlace='/admin/sensores'/>
            <Enlace label='Actuadores' icono='actuadores' enlace='/admin/actuadores'/>
            <Enlace label='Reglas' icono='reglas' enlace='/admin/reglas'/>
            <Enlace label='Usuarios' icono='usuarios' enlace='/admin/usuarios'/>
        {:else}
            <Enlace label='Sensores' icono='sensores'/>
            <Enlace label='Actuadores' icono='actuadores'/>
            <Enlace label='Reglas' icono='reglas'/>
            <Enlace label='Usuarios' icono='usuarios'/>
        {/if}
      </nav>
    </div>
    <div class="w-auto xl:w-5/6 p-4 ">
      <!-- contenido -->
      <slot />
    </div>
  </div>
{:else}
  <Login />
{/if}
