<script>
  import { SearchInput, Datatable, rows } from 'svelte-simple-datatables'
  import { onMount } from 'svelte'
  import { sensoresServicio } from '../../../servicios/sensores.servicio'
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

  // variable de sensores
  let sensores

  onMount(async () => {
    sensores = await sensoresServicio.listarSensores()
  })

  async function eliminar(id) {
    await sensoresServicio.eliminarSensor(id)
    sensores = await sensoresServicio.listarSensores()
  }
</script>

{#if sensores}
  <div class="items-center flex flex-wrap">
    <a href="/admin/sensores/nuevo">
        <Boton label="Nuevo" color="success" icono="nuevo" />
      </a>
      <SearchInput />
  </div>
  <Datatable {settings} data={sensores}>
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
        data-key="metrica"
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Métrica
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
          <td>{row.metrica}</td>
          <th>
            <a href="/admin/sensores/{row.id}">
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
