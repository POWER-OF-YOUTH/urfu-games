#!/bin/bash

# Запуск сервисов.

FRONTEND_URI="https://urfugames.ru"
API_URI="https://api.urfugames.ru"
FILES_URI="https://files.urfugames.ru"
DATABASE_URI="postgres://postgres:$POSTGRES_PASSWORD@postgres:5432/main"
#ADMIN_PASSWORD
#POSTGRES_PASSWORD
#JWT_SECRET
#USER_PWD_SALT
YM_ID=${YM_ID:-0}

reset() {
    docker network create urfu-games-network
    docker container rm -f postgres api files
}

start_postgres() {
    local data_directory=${1:-"/var/lib/postgresql/data"}
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
        --env ADMIN_PASSWORD=$ADMIN_PASSWORD \
        --env DATABASE_URI=$DATABASE_URI     \
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
    local local_port=$1

    docker container run              \
        --env FILES_URI=$FILES_URI    \
        -p 127.0.0.1:$local_port:3000 \
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
start_files 3001
start_nginx

