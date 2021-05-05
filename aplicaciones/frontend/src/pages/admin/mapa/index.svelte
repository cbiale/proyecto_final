<script>
  import { administrador } from '../../../store'
  import { LeafletMap, TileLayer, Marker, Popup } from 'svelte-leafletjs'
  import { onMount } from 'svelte'
  import H2 from '../../../componentes/H2.svelte'
  import { dispositivosServicio } from '../../../servicios/dispositivos.servicio'

  // variable de dispositivos (para mostrar en el mapa)
  let dispositivos = []
  let resultado = []
  // centro del mapa
  let centroLatitud
  let centroLongitud
  let opcionesMapa = {}

  onMount(async () => {
    resultado = await dispositivosServicio.listarDispositivos()
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
    dispositivos = resultado
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

{#if dispositivos && centroLatitud && centroLongitud}
  <LeafletMap bind:this={mapaLeaflet} options={opcionesMapa}>
    <TileLayer url={enlace} options={opcionesCapa} />
    {#each dispositivos as dispositivo}
      <Marker latLng={[dispositivo.latitud, dispositivo.longitud]}>
        <Popup>
          <center>
            <b>{dispositivo.denominacion}</b>
            {#if dispositivo.actuadores || dispositivo.sensores || dispositivo.tiempo}
              <br />
              <a href="/admin/dispositivos/{dispositivo._id}/dashboard">
                ver dashboard
              </a>
            {/if}
            <br />
            {#if $administrador === true}
              <a href="/admin/dispositivos/{dispositivo._id}">editarlo</a>
            {/if}
          </center>
        </Popup>
      </Marker>
    {/each}
  </LeafletMap>
{:else}
  <H2 texto="Sin dispositivos" />
{/if}
