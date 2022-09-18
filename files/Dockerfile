FROM node:16

WORKDIR /root
COPY . .

ENV HOSTNAME=localhost
ENV PORT=3000
ENV API_URI=https://api.urfugames.ru
ENV FILES_URI=https://files.urfugames.ru
ENV FILES_UPLOADING_DIR=/root/data

RUN yarn install

EXPOSE ${PORT}

VOLUME ["/root"]
VOLUME ["${FILES_UPLOADING_DIR}"]

ENTRYPOINT ["yarn", "dev"]
