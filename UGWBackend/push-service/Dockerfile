FROM node:12-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY ts*.json ./
COPY jest.config.js .prettierrc ./
COPY __tests__ __tests__
COPY src src

RUN npm test
RUN npm run build

FROM node:12-alpine as runner

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --prod
COPY --from=builder /app/build build

CMD ["npm", "start"]
