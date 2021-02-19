## Desarrollo

`npm run dev`

## Producción: 
`npm run build & npm run start`

## Incluye:
- Svelte *(ESM builds con Svite)*
- Routify *(rutas del lado del cliente)*
- TailwindCSS *(CSS)*
- Fastify *(API)*

## Template de proyecto

Obtenido de [https://github.com/andrasbacsai/svelte-fastify-starter](https://github.com/andrasbacsai/svelte-fastify-starter).

## Tareas

- Armado y configuración inicial del proyecto **[finalizado]**
- Configuración base de datos RethinkDB **[finalizada]**
- Configuración servidor Mosquitto **[finalizado]**
- Nodos falsos para pruebas **[finalizado] [prueba pendiente]**
- API REST **[finalizada] [prueba sensores, actuadores y dispositivos superada]**
- Seguridad en API REST **[finalizada]**
- Autenticación usando JWT en el backend **[finalizada] [prueba superada]**
- Login web **[finalizada]**
- ABM sensores **[finalizado] [prueba superada]**
- ABM actuadores **[finalizado] [prueba superada]**
- ABM dispositivos **[finalizado] [prueba superada]**
- ABM de reglas
- ABM de usuarios
- Manejo de init
- Listado de mediciones
- Dashboard
- Listado de logs
- Mapa de dispositivos **[finalizado] [prueba superada]**
- MQTT backend
- MQTT frontend usando websockets
- Nodo real en ESP32 usando RIOT-OS
- Analizar como manejar seguridad con servidor Mosquitto desde los nodos falsos y reales.
- Prueba integral en Fly.io

## Posibles tareas

- Invalidar tokens JWT usando un blacklist
- Controlar por usuarios dados de baja que tienen un token JWT
- Ver de usar COaP
- Ver seguridad en Fly.io
- Logout web *(Considerando se usa JWT)*
