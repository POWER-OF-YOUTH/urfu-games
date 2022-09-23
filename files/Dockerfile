FROM node:16

WORKDIR /root
COPY . .

ENV API_URI=http://define_outside
ENV FILES_URI=http://define_outside
ENV PORT=3000
ENV FILES_UPLOADING_DIR=/root/data
ENV NODE_ENV=development

RUN yarn install

EXPOSE ${PORT}

VOLUME ["/root"]
VOLUME ["${FILES_UPLOADING_DIR}"]

ENTRYPOINT ["yarn", "dev"]
