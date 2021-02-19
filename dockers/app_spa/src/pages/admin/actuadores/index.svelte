<script>
  import { SearchInput, Datatable, rows } from 'svelte-simple-datatables'
  import { goto } from "@roxi/routify";

  import { onMount } from 'svelte'
  import { actuadoresServicio } from '../../../servicios/actuadores.servicio'
  import Boton from 'Boton.svelte'

  const settings = {
    blocks: {
      searchInput: false,
    },
    labels: {
      search: 'Buscar...', // search input placeholer
      filter: 'Filtrar', // filter inputs placeholder
      noRows: 'Sin datos',
      info: 'Mostrando de {start} a {end} de {rows} entradas',
      previous: 'Previo',
      next: 'Siguiente',
    },
    columnFilter: true,
  }

  // variable de actuadores
  let actuadores

  onMount(async () => {
    actuadores = await actuadoresServicio.listarActuadores()
  })

  async function eliminar(id) {
    await actuadoresServicio.eliminarActuador(id)
    actuadores = await actuadoresServicio.listarActuadores()
  }
</script>

{#if actuadores}
  <div class="items-center flex flex-wrap">
    <a href="/admin/actuadores/nuevo">
      <Boton label="Nuevo" color="success" icono="nuevo" />
    </a>
    <SearchInput />
  </div>
  <Datatable {settings} data={actuadores}>
    <thead>
      <th
        data-key="id"
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Id
      </th>
      <th
        data-key="descripcion"
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Descripción
      </th>
      <th
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider" />
      <th
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider" />

    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each $rows as row}
        <tr>
          <td>{row.id}</td>
          <td>{row.descripcion}</td>
          <th>
            <a href="/admin/actuadores/{row.id}">
              <Boton label="" color="info" icono="editar" />
            </a>
          </th>
          <th>
            <Boton
              label=""
              color="error"
              icono="borrar"
              on:click={() => eliminar(row.id)} />
          </th>
        </tr>
      {/each}
    </tbody>
  </Datatable>
{/if}
