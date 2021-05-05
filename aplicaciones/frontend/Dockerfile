FROM node:14-alpine

WORKDIR /usr/src/app

COPY rollup.config.js ./
COPY package*.json ./
COPY *.json ./

RUN npm install

COPY ./src ./src
COPY ./assets ./assets

RUN npm run build

EXPOSE 5000

ENV HOST=0.0.0.0

CMD [ "npm", "run", "serve" ]
