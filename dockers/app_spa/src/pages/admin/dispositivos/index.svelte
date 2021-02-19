<script>
  import { SearchInput, Datatable, rows } from 'svelte-simple-datatables'
  import { onMount } from 'svelte'
  import { dispositivosServicio } from '../../../servicios/dispositivos.servicio'
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

  // variable de dispositivos (para mostrar en el mapa)
  let dispositivos

  onMount(async () => {
    dispositivos = await dispositivosServicio.listarDispositivos()
  })

  async function eliminar(id) {
    await dispositivosServicio.eliminarDispositivo(id)
    dispositivos = await dispositivosServicio.listarDispositivos()
  }

</script>

{#if dispositivos}
<div class="items-center flex flex-wrap">
    <a href="/admin/dispositivos/nuevo">
        <Boton label="Nuevo" color="success" icono="nuevo" />
      </a>  
    <SearchInput />
</div>
  <Datatable {settings} data={dispositivos}>
    <thead>
      <th
        data-key="id"
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Id
      </th>
      <th
        data-key="denominacion"
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Denominación
      </th>
      <th
        data-key="latitud"
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Latitud
      </th>
      <th
        data-key="latitud"
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Longitud
      </th>
      <th
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider" />
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
          <td>{row.denominacion}</td>
          <td>{row.latitud}</td>
          <td>{row.longitud}</td>
          <th>
            <a href="/admin/dispositivos/{row.id}/dashboard">
              <Boton label="" color="warning" icono="dashboard" />
            </a>
          </th>
          <th>
            <a href="/admin/dispositivos/{row.id}">
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
