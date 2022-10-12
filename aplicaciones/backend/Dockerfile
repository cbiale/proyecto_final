FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
EXPOSE 3001
COPY . .
CMD [ "npm", "start" ]