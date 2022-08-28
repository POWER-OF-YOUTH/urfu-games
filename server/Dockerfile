FROM node:16

WORKDIR /home
COPY . /home

ENV API_URI=https://api.urfugames.ru
ENV PORT=3000
ENV ADMIN_LOGIN=admin
ENV ADMIN_EMAIL=admin@urfugames.ru
ENV ADMIN_PASSWORD=admin
ENV JWT_SECRET=jwt_secret
ENV USER_PWD_SALT=salt
ENV DATABASE_URI=postgres://postgres:default@postgres

RUN yarn install

EXPOSE 3000

VOLUME ["/home/files"]

ENTRYPOINT ["yarn", "start"]
