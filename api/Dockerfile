FROM node:16

WORKDIR /root
COPY . .

ENV API_URI=http://define_outside
ENV FILES_URI=http://define_outside
ENV DATABASE_URI=http://posgtres:password@define_outside:5432/db_name
ENV PORT=3000
ENV ADMIN_PASSWORD=admin
ENV JWT_SECRET=jwt_secret
ENV USER_PWD_SALT=salt
ENV NODE_ENV=development

RUN yarn install

EXPOSE ${PORT}

VOLUME ["/root"]

ENTRYPOINT ["yarn", "dev"]
