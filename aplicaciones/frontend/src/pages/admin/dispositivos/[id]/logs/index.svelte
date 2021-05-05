<script>
  import {
    ColumnFilterInputs,
    SearchInput,
    Datatable,
    rows,
  } from 'svelte-simple-datatables'
  import { onMount } from 'svelte'
  import { logsServicio } from '../../../../../servicios/logs.servicio'
  import dayjs from 'dayjs'
  import Boton from '../../../../../componentes/Boton.svelte'
  import H2 from '../../../../../componentes/H2.svelte'
  import Contenedor from '../../../../../componentes/Contenedor.svelte'

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

  export let id
  // variable de logs del dispositivo
  let logs

  onMount(async () => {
    // obtengo acciones del dispositivo
    logs = await logsServicio.listarLogs(id)
    // cambio datos de la fecha
    logs.forEach(
      (row) =>
        (row.tiempo = dayjs(row.tiempo).format('YYYY/MM/DD HH:mm:ss SSS')),
    )
  })
</script>

{#if logs}
  <Contenedor tipo="justificado">
    <H2 texto="Logs de: {id}" />
  </Contenedor>
  <Contenedor tipo="justificado">
    <SearchInput />
    <a href="./dashboard">
      <Boton label="Volver" color="success" />
    </a>
  </Contenedor>

  <Datatable {settings} data={logs} classList="flex-shrink-0">
    <thead>
      <th
        data-key="tiempo"
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Tiempo
      </th>
      <th
        data-key="actuador"
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Actuador
      </th>
      <th
        data-key="valor"
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Valor
      </th>
    </thead>
    <ColumnFilterInputs />
    <tbody class="bg-white divide-y divide-gray-200">
      {#each $rows as row}
        <tr>
          <td>{row.tiempo}</td>
          <td>{row.actuador}</td>
          <td class="text-center">{row.valor}</td>
        </tr>
      {/each}
    </tbody>

  </Datatable>
{/if}
