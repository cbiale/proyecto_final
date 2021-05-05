printf -- "> Huerta-IoT\n\n"
printf -- "----------------------------------------------------------------------------\n"
printf -- "Creando red...\n"
docker network create --ingress --driver overlay ingress
printf -- "----------------------------------------------------------------------------\n"