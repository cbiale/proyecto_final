import HMR from '@roxi/routify/hmr'
import App from './App.svelte'
import leaflet from 'leaflet/dist/leaflet.css'

const app = HMR(App, { target: document.body }, 'routify-app')

export default app

