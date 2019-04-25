FROM node:10-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
