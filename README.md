##### Autor:  Claudio Omar Biale (2020-2021)

# Introducción

El proyecto denominado **Huerta-IoT** corresponde al trabajo final de la *Especialización en Internet de las Cosas* dictada en la *Facultad de Ingeniería* de la *Universidad de Buenos Aires*.

# Instrucciones

Para iniciar el sistema en local como un stack de `Docker Swarm` se deben ejecutar:

```
./crear.sh
```

Para eliminar el conjunto de aplicaciones de `Docker Swarm` se debe ejecutar:

```
./eliminar.sh
```

# Componentes

El sistema está compuesto de las siguientes aplicaciones:
- Cluster MQTT EMQX (https://www.emqx.io/).
- Cluster de base de datos CouchDB (https://couchdb.apache.org/).
- Backend escalable usando fastify (https://www.fastify.io/).
- Frontend usando Svelte (https://svelte.dev/), Routify (https://routify.dev/) y tailwindcss (https://tailwindcss.com/).

# Licencia

**Huerta-IoT** está licenciado con la licencia MIT. Consulte la [LICENCIA](LICENSE) como referencia.

