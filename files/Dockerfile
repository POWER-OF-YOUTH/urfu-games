FROM node:16

COPY . .

ENV HOSTNAME=localhost
ENV API_URI=https://api.urfugames.ru
ENV FILES_URI=https://files.urfugames.ru
ENV PORT=3000
ENV UPLOADING_DIR=/home/data

RUN yarn install

EXPOSE 3000

VOLUME ["/home/data"]

ENTRYPOINT ["yarn", "start"]
