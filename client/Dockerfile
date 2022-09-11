FROM node:16

ARG API_URI
ENV API_URI=${API_URI}
ENV PORT=3000
ENV YM_ID=0

WORKDIR /root
COPY . .

RUN yarn install

VOLUME ["/root"]

EXPOSE ${PORT}

ENTRYPOINT ["yarn", "start"]
