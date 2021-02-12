##### Autor:  Claudio Omar Biale (2020-2021)

# Introducción

El proyecto corresponde al trabajo final de la *Especialización en Internet de las Cosas* dictada en la *Facultad de Ingeniería* de la *Universidad de Buenos Aires*.

# Instrucciones

Para ejecutar la aplicación se deben crear las aplicaciones que se encuentran en el directorio `dockers`.

Los archivos `.toml` configuran las aplicaciones en [fly.io](https://fly.io).

Los archivos `Dockerfile` permiten configurar como se van a construir las imágenes de docker.

Para comprender lo que se realiza es recomendable leer los archivos `README.md` de cada aplicación.

Hasta el momento se ha configurado en fly.io las siguientes aplicaciones:
- Servidor Mosquitto.
- Base de datos Rethinkdb *(con archivo .sh para crear un cluster al escalar la cantidad de instancias)*.

Se encuentra en proceso de desarrollo el sitio web que funciona con:
- Fastify (https://www.fastify.io/)
- Svelte (https://svelte.dev/)
- Routify (https://routify.dev/)