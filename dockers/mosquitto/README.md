# Servidor MQTT usando Mosquitto

## Pasos realizados

Ingresar a Fly.io:

```
flyctl auth login
```

Crear un slot en fly.io con la siguiente configuración:
- app: huerta-mqtt
- puertos: 1883
- empresa: personal

```
flyctl init huerta-mqtt --dockerfile --port 1883 --org personal
```

Crear un archivo de password para mosquitto con:
- usuario: admin-mqtt
- clave: carolina

```
mosquitto_passwd -c ./passwd huerta-mqtt
```

Instalar las dependencias de `mkcert`

```
sudo apt install libnss3-tools
```

Descargar binario de: https://github.com/FiloSottile/mkcert/releases

Crear un certificado:

```
mkdir certs
./mkcert -key-file certs/mqtt-server.key -cert-file certs/mqtt-server.crt huerta-mqtt.fly.dev	
```

Copiar el certificado:

```
cp "$(./mkcert -CAROOT)/rootCA.pem" certs/rootCA.pem
```

Crear un volumen para mosquitto:

```
flyctl volumes create mosquitto_data --region lhr
```

En el archivo fly.toml agregar:

```
[[mounts]]
source="mosquitto_data"
destination="/mosquitto/data"
```

En el archivo fly.toml cambiar donde dice:

```
  [[services.ports]]
    handlers = ["http"]
    port = "80"

  [[services.ports]]
    handlers = ["tls", "http"]
    port = "443"
```

por:

```
  [[services.ports]]
    handlers = [ ]
    port = "10000" 
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

## Pruebas

En una consola ejecutar:

```
mosquitto_sub -L mqtts://admin-mqtt:carolina@huerta-mqtt.fly.dev:10000/# --cafile certs/rootCA.pem
```

En otra ejecutar y escribir el texto a publicar mediante MQTT:

```
mosquitto_pub -L mqtts://admin-mqtt:carolina@huerta-mqtt.fly.dev:10000/tests --cafile certs/rootCA.pem  -l
```

## Detener el sistema

Para suspender el servidor se debe ejecutar:

```
flyctl suspend huerta-mqtt
```

## Archivos adicionales:
- `fly.toml`: archivo usado para construir la aplicación.
- `Dockerfile`: archivo usado para construir la imagen de docker.

