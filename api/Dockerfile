FROM node:16 AS prod

ENV NODE_ENV=production

WORKDIR /root
COPY . /root

RUN yarn install --prod && yarn build

EXPOSE 3000

CMD ["yarn", "start"]

FROM prod AS dev

ENV JWT_SECRET=jwt_secret
ENV USER_PWD_SALT=salt
ENV NODE_ENV=development

RUN yarn install

VOLUME ["/root"]

CMD ["yarn", "dev"]
