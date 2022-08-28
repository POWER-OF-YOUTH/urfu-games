API_URI=https://api.urfugames.ru \
FILES_URI=https://files.urfugames.ru \
POSTGRES_PASSWORD=default \
docker compose up -f docker-compose.yml --profile all --force-recreate
