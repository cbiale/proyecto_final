id_contenedor_mqtt="$(docker ps | grep Huerta-IoT-servicios_vmq | awk '{print $1}')"
id_contenedor_db="$(docker ps | grep Huerta-IoT-servicios_couchdb | awk '{print $1}')"

estado_mqtt=false
estado_db=false
while [[ $estado_mqtt != true && $estado_db != true ]]
do
   estado_mqtt="$(docker container inspect -f '{{.State.Running}}' $id_contenedor_mqtt)"
   estado_db="$(docker container inspect -f '{{.State.Running}}' $id_contenedor_db)"
   printf -- "...\n"
done
