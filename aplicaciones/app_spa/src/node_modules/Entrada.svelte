<script>
  export let id
  export let ayuda
  export let value
</script>

<input bind:value id={id} name={id} placeholder={ayuda} {...$$restProps} 
    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-4 transition-colors duration-200 ease-in-out"/>
