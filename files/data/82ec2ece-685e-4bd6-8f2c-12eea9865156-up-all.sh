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

if [ -f ".env" ]
then
    rm .env
fi
printf "\
FRONTEND_HOSTNAME=${frontend_hostname}\n\
FRONTEND_PORT=${frontend_port}\n\
API_PORT=${api_port}\n\
API_URI=${api_uri}\n\
POSTGRES_PASSWORD=${postgres_password}\n\
" >> .env

docker compose up -d
