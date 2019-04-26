FROM node:10-alpine

WORKDIR /usr/app

COPY service-account.json service-account.json
COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
