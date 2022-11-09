printf -- "> Huerta-IoT\n\n"
printf -- "----------------------------------------------------------------------------\n"
printf -- "Creando red...\n"
docker network create -d overlay --attachable huerta_iot_net
printf -- "\nIniciando servicios de base de datos y MQTT...\n"
docker stack deploy -c servicio-mqtt.yml -c servicio-db.yml Huerta-IoT-servicios
printf -- "\n"
read -n 1 -s -r -p "Presione una tecla para continuar cuando a finalizado el inicio de los servicios."
printf -- "\n\nIniciando servicios de backend y frontend de Huerta-IoT...\n"
docker stack deploy -c servicio-backend.yml -c servicio-frontend.yml Huerta-IoT-aplicaciones
printf -- "----------------------------------------------------------------------------\n"
