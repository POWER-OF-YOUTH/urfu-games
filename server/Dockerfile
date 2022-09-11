FROM node:16

WORKDIR /root
COPY . .

ENV API_URI=https://api.urfugames.ru
ENV HOSTNAME=localhost
ENV DATABASE_URI=postgres://postgres:default@postgres
ENV PORT=3000
ENV ADMIN_PASSWORD=admin
ENV JWT_SECRET=jwt_secret
ENV USER_PWD_SALT=salt
ENV NODE_ENV=development

RUN yarn install

EXPOSE ${PORT}

VOLUME ["/root"]

ENTRYPOINT ["yarn", "dev"]
