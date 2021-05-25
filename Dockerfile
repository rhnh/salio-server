FROM node:14
WORKDIR /app
COPY ./package.json .
RUN yarn 
COPY . .
RUN yarn build
CMD ['node','dist/index.js']
