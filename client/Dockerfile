FROM node:16

WORKDIR /home
COPY . /home

ENV API_URI=https://api.urfugames.ru
ENV PORT=3000
# Идентификатор счетчика Яндекс.Метрики.
ENV YM_ID=0

RUN yarn install
RUN yarn build

VOLUME ["/home/build"]

ENTRYPOINT ["/bin/bash"]

