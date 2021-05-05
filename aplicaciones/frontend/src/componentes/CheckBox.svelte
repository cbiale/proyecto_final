<script>
  export let checked
  export let id
  export let texto
</script>

<style>
  input:checked ~ .dot {
    transform: translateX(100%);
    background-color: #48bb78;
  }
</style>

<!-- Toggle A -->
<div class="flex items-center w-full mb-12">

  <label for={id} class="flex text-sm  items-center cursor-pointer">
    <!-- toggle -->
    <div class="relative">
      <!-- input -->
      <input id={id} type="checkbox" class="sr-only" bind:checked />
      <!-- line -->
      <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner" />
      <!-- dot -->
      <div
        class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1
        transition" />
    </div>
    <!-- label -->
    <div class="ml-3 text-gray-700 font-medium">{texto}</div>
  </label>

</div>
