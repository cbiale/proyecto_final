printf -- "> Huerta-IoT\n\n"

printf -- "----------------------------------------------------------------------------\n"

printf -- "Compilando...\n"
mos build --platform ESP32

printf -- "\n"
read -n 1 -s -r -p "Presione enter para continuar cuando a conectado el nodo."

printf -- "\n\nCopiando binario al nodo...\n"
mos flash

printf -- "Configurando WiFi...\n"
mos wifi Pippe carolina0304

printf -- "Configurando MQTT...\n"
mos config-set mqtt.enable=true mqtt.server=192.168.0.10:1883

printf -- "----------------------------------------------------------------------------\n"
