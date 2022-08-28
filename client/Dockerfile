FROM node:16

WORKDIR /home
COPY . /home

ARG API_URI
ENV API_URI=${API_URI:-https://api.urfugames.ru}
ENV PORT=3000
# Идентификатор счетчика Яндекс.Метрики.
ENV YM_ID=0

RUN yarn install
RUN yarn build

VOLUME ["/home/build"]

