docker stack ps  Huerta-IoT-servicios | awk '{printf "%s %s\n",$1, $3}' | grep couchdb | awk '{printf "%s\n",$1}'

