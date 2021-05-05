printf -- "> Huerta-IoT\n\n"

printf -- "----------------------------------------------------------------------------\n"

printf -- "Eliminando stacks...\n"

docker stack rm Huerta-IoT-servicios
docker stack rm Huerta-IoT-aplicaciones

printf -- "Eliminando red...\n"
docker network rm huerta_iot_net

printf -- "----------------------------------------------------------------------------\n"
