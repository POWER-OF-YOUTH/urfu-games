API_URI=https://api.urfugames.ru \
FILES_URI=https://files.urfugames.ru \
POSTGRES_PASSWORD=default \
docker compose -f docker-compose.yml --profile all up --force-recreate
