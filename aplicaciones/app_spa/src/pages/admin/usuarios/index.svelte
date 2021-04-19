<script>
  import { ColumnFilterInputs, SearchInput, Datatable, rows } from 'svelte-simple-datatables'
  import { onMount } from 'svelte'
  import { usuariosServicio } from '../../../servicios/usuarios.servicio'
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
    rowPerPage: 10,
    scrollY: false
  }

  // variable de usuarios
  let usuarios

  onMount(async () => {
    usuarios = await usuariosServicio.listarUsuarios()
  })

  async function eliminar(id) {
    await usuariosServicio.eliminarUsuario(id)
    usuarios = await usuariosServicio.listarUsuarios()
  }
</script>

{#if usuarios}
  <div>
    <div class="items-center flex flex-wrap">
      <a href="/admin/usuarios/nuevo">
        <Boton label="Nuevo" color="success" icono="nuevo" />
      </a>
      <SearchInput />
    </div>
    <Datatable {settings} data={usuarios}>
      <thead>
        <th
          data-key="_id"
          scope="col"
          class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
          Id
        </th>
        <th
          scope="col"
          class="px-6 py-3 font-semibold text-gray-700 tracking-wider" />
        <th
          scope="col"
          class="px-6 py-3 font-semibold text-gray-700 tracking-wider" />

      </thead>
      <ColumnFilterInputs/>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each $rows as row}
          <tr>
            <td>{row._id}</td>
            <th>
              <a href="/admin/usuarios/{row._id}">
                <Boton label="" color="info" icono="editar" />
              </a>
            </th>
            <th>
              <Boton
                label=""
                color="error"
                icono="borrar"
                on:click={() => eliminar(row)} />
            </th>
          </tr>
        {/each}
      </tbody>
    </Datatable>
  </div>
{/if}
