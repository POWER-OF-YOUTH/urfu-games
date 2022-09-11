#!/bin/bash

if [[ ${1} = "" ]]
then
    echo "You must specify frontend port."
    exit
fi
if [[ ${2} = "" ]]
then
    echo "You must specify api port."
    exit
fi

frontend_hostname=""
frontend_port=${1}
api_hostname="localhost"
api_port=${2}
api_uri="http://${api_hostname}:${api_port}"
postgres_password=default

echo "Frontend port: ${1}"
echo "API port: ${2}"

FRONTEND_HOSTNAME=${frontend_hostname} \
FRONTEND_PORT=${frontend_port} \
API_PORT=${api_port} \
API_URI=${api_uri} \
POSTGRES_PASSWORD=${postgres_password} \
docker compose up -d
