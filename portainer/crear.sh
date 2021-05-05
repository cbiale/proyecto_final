printf -- "> Huerta-IoT\n\n"
printf -- "----------------------------------------------------------------------------\n"
printf -- "Creando stack...\n"
docker stack deploy -c portainer-agent-stack.yml portainer
printf -- "----------------------------------------------------------------------------\n"
