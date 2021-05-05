<script>
  import { administrador } from '../../../store'
  import {
    ColumnFilterInputs,
    SearchInput,
    Datatable,
    rows,
  } from 'svelte-simple-datatables'
  import { onMount } from 'svelte'
  import { dispositivosServicio } from '../../../servicios/dispositivos.servicio'
  import Boton from '../../../componentes/Boton.svelte'

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
    rowPerPage: 10,
    scrollY: false,
  }

  // variable de dispositivos (para mostrar en el mapa)
  let dispositivos

  onMount(async () => {
    dispositivos = await dispositivosServicio.listarDispositivos()
  })

  async function eliminar(row) {
    await dispositivosServicio.eliminarDispositivo(row)
    dispositivos = await dispositivosServicio.listarDispositivos()
  }
</script>

{#if dispositivos}
  <div>
    <div class="items-center flex flex-wrap">
      {#if $administrador === true}
        <a href="dispositivos/nuevo">
          <Boton label="Nuevo" color="success" icono="nuevo" />
        </a>
      {/if}
      <SearchInput />
    </div>
    <Datatable {settings} data={dispositivos}>
      <thead>
        <th
          data-key="_id"
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
          data-key="longitud"
          scope="col"
          class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
          Longitud
        </th>
        <th
          scope="col"
          class="px-6 py-3 font-semibold text-gray-700 tracking-wider" />
        {#if $administrador === true}
          <th
            scope="col"
            class="px-6 py-3 font-semibold text-gray-700 tracking-wider" />
          <th
            scope="col"
            class="px-6 py-3 font-semibold text-gray-700 tracking-wider" />
          <th
            scope="col"
            class="px-6 py-3 font-semibold text-gray-700 tracking-wider" />
        {/if}
      </thead>
      <ColumnFilterInputs />
      <tbody class="bg-white divide-y divide-gray-200">
        {#each $rows as row}
          <tr>
            <td>{row._id}</td>
            <td>{row.denominacion}</td>
            <td>{row.latitud}</td>
            <td>{row.longitud}</td>
            <td>
              {#if row.actuadores || row.sensores || row.tiempo}
                <a href="dispositivos/{row._id}/dashboard">
                  <Boton label="" color="warning" icono="dashboard" />
                </a>
              {/if}
            </td>
            {#if $administrador === true}
              <td>
                <a href="dispositivos/{row._id}/reglas">
                  <Boton label="" color="success" icono="reglas" />
                </a>
              </td>
              <td>
                <a href="dispositivos/{row._id}">
                  <Boton label="" color="info" icono="editar" />
                </a>
              </td>
              <td>
                <Boton
                  label=""
                  color="error"
                  icono="borrar"
                  on:click={() => eliminar(row)} />
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </Datatable>
  </div>
{/if}
