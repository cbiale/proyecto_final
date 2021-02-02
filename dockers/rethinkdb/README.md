Ingresar a Fly.io:

```
flyctl auth login
```

Crear un slot en fly.io con la siguiente configuración:
- app: huerta-db
- puertos: 8080
 - empresa: personal

```
flyctl init huerta-db --dockerfile --port 8080 --org personal
```

Crear un volumen para la base de datos:

```
flyctl volumes create db_data --region lhr
```

> se puede elegir otras regiones: https://fly.io/docs/reference/regions/

En el archivo fly.toml agregar:

```
[[mounts]]
source="db_data"
destination="/db/data"
```

Crear el servidor:

```
flyctl deploy
```

## Definir una red interna

Para definir una red interna y usar el descubrimiento de instancias mediante el DNS interno se debe agregar al archivo fly.toml:

```
[experimental]
  private_network=true
```

Esto permite comunicar a otras instancias y otras aplicaciones que conforman el sistema.

## Detener el sistema

Para suspender el o los servidores se debe ejecutar:

```
flyctl suspend huerta-db
```

## Consideraciones al escalar

El script `rethinkdb.sh` permite escalar la base de datos e internamente usa el DNS de fly.io para obtener las otras instancias de la base de datos.

Si se quieren agregar instancias (escalado horizontal) se debe ejecutar:

```
flyctl scale count N -a huerta-db
```

Donde `N` es la cantidad de instancias a agregar.

Para ver la cantidad de instancias se debe ejecutar el comando:

```
flyctl scale show -a huerta-db 
```

> Es posible usar autoescalado: https://fly.io/docs/reference/scaling/

> Se deben tener `N` volúmenes si se desean persistir los datos: https://fly.io/docs/reference/scaling/#anchor-scaling

## Archivos adicionales:
- `fly.toml`: archivo usado para construir la aplicación.
- `Dockerfile`: archivo usado para construir la imagen de docker.

