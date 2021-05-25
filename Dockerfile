FROM node:14
WORKDIR /app
COPY ./package.json .
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
  then yarn --production=false; \
  else yarn --production=true; \
  fi
COPY . .
RUN yarn build
CMD ['node','dist/index.js']
