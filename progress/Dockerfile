FROM node:16

WORKDIR /home
COPY . /home

ENV API_URI=https://api.urfugames.ru
ENV HOSTNAME=localhost
ENV PORT=3000
ENV DATABASE_URI=postgres://postgres:default@postgres/progress
ENV JWT_SECRET=jwt_secret

RUN yarn install

ENTRYPOINT ["yarn", "start"]
