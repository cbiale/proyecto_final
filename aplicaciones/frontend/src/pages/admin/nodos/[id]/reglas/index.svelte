<script>
  import {
    ColumnFilterInputs,
    Datatable,
    rows,
  } from 'svelte-simple-datatables'
  import { onMount } from 'svelte'
  import { goto } from '@roxi/routify'


  import Boton from '../../../../../componentes/Boton.svelte'
  import H2 from '../../../../../componentes/H2.svelte'
  import Contenedor from '../../../../../componentes/Contenedor.svelte'
  import Select from '../../../../../componentes/Select.svelte'
  import Label from '../../../../../componentes/Label.svelte'

  import { reglasServicio } from '../../../../../servicios/reglas.servicio'
  import { nodosServicio } from '../../../../../servicios/nodos.servicio'

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
  // variable nodo
  let nodo
  // variables de reglas del nodo
  let arrayReglasNodo
  let reglasNodo
  // variables de reglas
  let reglas
  // nueva regla a asociar
  let nuevaRegla

  onMount(async () => {
    // obtengo reglas del nodo
    nodo = await nodosServicio.obtenerNodo(id)
    // obtengo reglas
    console.log(arrayReglasNodo)
    // si no tiene reglas
    if (typeof nodo.reglas === 'undefined') {
      arrayReglasNodo = []
    } else {
        arrayReglasNodo = nodo.reglas
    }
    // transformo en un set
    reglasNodo = new Set(arrayReglasNodo)
    // obtengo reglas del sistema
    reglas = await reglasServicio.listarReglas()
  })

  // agregar una regla
  function agregarRegla(valor) {
    reglasNodo.add(valor)
    arrayReglasNodo = Array.from(reglasNodo)
  }

  // eliminar una regla
  function eliminarRegla(valor) {
    reglasNodo.delete(valor)
    arrayReglasNodo = Array.from(reglasNodo)
  }

  // obtengo descripcion de una regla
  function obtenerDescripcion(valor) {
    let regla = reglas.find((regla) => regla._id === valor)
    return regla.descripcion
  }

  async function guardar() {
    try {
      nodo.reglas = arrayReglasNodo
      console.log(nodo)
      await nodosServicio.modificarNodo(nodo)
      $goto('/admin/nodos')
    } catch (err) {
      console.log(err)
    }
  }
</script>

{#if reglas && reglasNodo}
<form on:submit|preventDefault={guardar}>
  <Contenedor tipo="justificado">
    <H2 texto="Reglas de: {id}" />
  </Contenedor>

  <Datatable {settings} data={arrayReglasNodo} classList="flex-shrink-0">
    <thead>
      <th
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Id
      </th>
      <th
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider">
        Descripción
      </th>

      <th
        scope="col"
        class="px-6 py-3 font-semibold text-gray-700 tracking-wider" />
    </thead>
    <ColumnFilterInputs />
    <tbody class="bg-white divide-y divide-gray-200">
      {#each $rows as row}
        <tr>
          <td>{row}</td>
          <td>{obtenerDescripcion(row)}</td>
          <td>
            <Boton
              label=""
              color="error"
              icono="borrar"
              on:click={() => eliminarRegla(row)} />
          </td>
        </tr>
      {/each}
    </tbody>
  </Datatable>

  <Contenedor tipo="justificado">
    <Label texto="Agregar regla" />
    <Select id="regla" bind:value={nuevaRegla}>
      {#each reglas as regla}
        <option value={regla._id}>{regla.descripcion}</option>
      {/each}
    </Select>
    <Boton
      label="Regla"
      color="info"
      icono="agregar"
      on:click={() => agregarRegla(nuevaRegla)} />
  </Contenedor>
  <Contenedor tipo="justificado">
    <Boton
      label="Guardar"
      icono="guardar"
      color="primary"
      type="submit"
      texto="Guardar" />
    <a href="/admin/nodos">
      <Boton label="Volver" color="success" />
    </a>
  </Contenedor>
  </form>
{/if}
