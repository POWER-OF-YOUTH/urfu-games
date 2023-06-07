#!/bin/bash

# Запуск сервисов.

if [[ -z $ADMIN_PASSWORD ]]; then
    echo "The ADMIN_PASSWORD environment variable is required but was not specified."
    exit 1
fi
if [[ -z $POSTGRES_PASSWORD ]]; then
    echo "The POSTGRES_PASSWORD environment variable is required but was not specified."
    exit 1
fi
if [[ -z $JWT_SECRET ]]; then
    echo "The JWT_SECRET environment variable is required but was not specified."
    exit 1
fi
if [[ -z $USER_PWD_SALT ]]; then
    echo "The USER_PWD_SALT environment variable is required but was not specified."
    exit 1
fi

FRONTEND_URI="https://89.223.124.186.com"
API_URI="https://api.89.223.124.186.com"
FILES_URI="https://files.89.223.124.186.com"
DATABASE_URI="postgres://postgres:$POSTGRES_PASSWORD@postgres:5432/main"
YM_ID=${YM_ID:-0}

reset() {
    docker network create urfu-games-network
    docker container rm -f postgres api files
}

start_postgres() {
    local data_directory=$1
    local local_port=$2

    docker container run                            \
        --env POSTGRES_PASSWORD=$POSTGRES_PASSWORD  \
        -p 127.0.0.1:$local_port:5432               \
        -v $data_directory:/var/lib/postgresql/data \
        --restart always                            \
        -d                                          \
        --network urfu-games-network                \
        --name postgres                             \
        urfu-games-postgres
}

start_api() {
    local local_port=$1

    docker container run                     \
        --env API_URI=$API_URI               \
        --env FILES_URI=$FILES_URI           \
        --env DATABASE_URI=$DATABASE_URI     \
        --env ADMIN_PASSWORD=$ADMIN_PASSWORD \
        --env JWT_SECRET=$JWT_SECRET         \
        --env USER_PWD_SALT=$USER_PWD_SALT   \
        -p 127.0.0.1:$local_port:3000        \
        --restart always                     \
        -d                                   \
        --network urfu-games-network         \
        --name api                           \
        urfu-games-api:prod
}

start_files() {
    local data_directory=$1
    local local_port=$2

    docker container run              \
        --env FILES_URI=$FILES_URI    \
        -p 127.0.0.1:$local_port:3000 \
        -v $data_directory:/root/data \
        --restart always              \
        -d                            \
        --network urfu-games-network  \
        --name files                  \
        urfu-games-files:prod
}

start_nginx() {
    nginx -s reload
}

reset
start_postgres "/var/lib/postgresql/data" 5432
start_api 3000
start_files "/var/www/files.89.223.124.186.com" 3001
start_nginx

