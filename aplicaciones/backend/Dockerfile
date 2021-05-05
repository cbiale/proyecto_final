FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3001

ENV  NODE_ENV production

CMD [ "node", "index" ]
