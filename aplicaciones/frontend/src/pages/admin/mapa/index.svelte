<script>
  import { administrador } from '../../../store'
  import { LeafletMap, TileLayer, Marker, Popup } from 'svelte-leafletjs'
  import { onMount } from 'svelte'
  import H2 from '../../../componentes/H2.svelte'
  import { nodosServicio } from '../../../servicios/nodos.servicio'

  // variable de nodos (para mostrar en el mapa)
  let nodos = []
  let resultado = []
  // centro del mapa
  let centroLatitud
  let centroLongitud
  let opcionesMapa = {}

  onMount(async () => {
    resultado = await nodosServicio.listarNodos()
    await centros(resultado)
  })

  async function centros(resultado) {
    centroLatitud =
      (Math.max.apply(
        Math,
        resultado.map(function (o) {
          return o.latitud
        }),
      ) +
        Math.min.apply(
          Math,
          resultado.map(function (o) {
            return o.latitud
          }),
        )) /
      2
    centroLongitud =
      (Math.max.apply(
        Math,
        resultado.map(function (o) {
          return o.longitud
        }),
      ) +
        Math.min.apply(
          Math,
          resultado.map(function (o) {
            return o.longitud
          }),
        )) /
      2
    console.log(centroLatitud, centroLongitud)
    // opciones del mapa
    opcionesMapa = {
      center: [centroLatitud, centroLongitud],
      zoom: 14,
    }
    console.log(opcionesMapa)
    nodos = resultado
  }

  // figura
  const enlace =
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

  // opciones de la capa
  const opcionesCapa = {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 14,
    attribution: `© OpenStreetMap contributors
            &copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
            &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
    subdomains: 'abcd',
  }

  // variable del mapa
  let mapaLeaflet
</script>

{#if nodos && centroLatitud && centroLongitud}
  <LeafletMap bind:this={mapaLeaflet} options={opcionesMapa}>
    <TileLayer url={enlace} options={opcionesCapa} />
    {#each nodos as nodo}
      <Marker latLng={[nodo.latitud, nodo.longitud]}>
        <Popup>
          <center>
            <b>{nodo.denominacion}</b>
            {#if nodo.actuadores || nodo.sensores || nodo.tiempo}
              <br />
              <a href="/admin/nodos/{nodo._id}/dashboard">
                ver dashboard
              </a>
            {/if}
            <br />
            {#if $administrador === true}
              <a href="/admin/nodos/{nodo._id}">editarlo</a>
            {/if}
          </center>
        </Popup>
      </Marker>
    {/each}
  </LeafletMap>
{:else}
  <H2 texto="Sin nodos" />
{/if}
