#!/bin/bash

API_URI="http://api.urfugames.ru" \
FILES_URI=http://files.urfugames.ru \
POSTGRES_PASSWORD=default \
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile all \
    up --force-recreate --abort-on-container-exit $@
