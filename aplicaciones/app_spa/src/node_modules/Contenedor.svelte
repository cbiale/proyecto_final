<script>
  export let tipo
  // tipos de contenedores
  let tipos = ['centrado', 'justificado', 'formulario']

  // controlo tipo
  if (tipos.indexOf(tipo) === -1) {
    tipo = 'justificado'
  }
</script>

{#if tipo == 'centrado'}
  <div class="w-full item-center text-center mx-auto">
    <slot />
  </div>
{/if}
{#if tipo == 'justificado'}
  <div class="flex items-center justify-between">
    <slot />
  </div>
{/if}
{#if tipo == 'formulario'}
    <div class="rounded px-2 pt-2 pb-2 mb-2 flex flex-col">
      <slot />
    </div>
{/if}
