#!/bin/bash

# nombre de app
FLY_APP_NAME="huerta-db"

# variable para cadena de joins
cadena=" "

# ip local
ips=$(grep fly-local-6pn /etc/hosts | awk '{print $1}') 

# otras ips
otros=$( (dig aaaa global.$FLY_APP_NAME.internal @fdaa::3 +short | grep -v "$ips") || echo "") 

# armo la cadena de joins
for host in ${otros[*]}
do
    echo "HOST:  " $host
    cadena="$cadena --join $host"
done

# datos de control
echo "IP: " $ips
echo "OTROS IPS: " $otros
echo "CADENA: " $cadena
echo "COMANDO: rethinkdb " $cadena "--bind all"

# comando que ejecuta rethinkdb
rethinkdb $cadena --bind all