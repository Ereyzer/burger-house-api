# syntax=docker/dockerfile:1

FROM node:24.11-alpine

WORKDIR /usr/src/app

# Встановлюємо інструменти для нативних модулів (bcrypt, sharp тощо)
RUN apk update && apk upgrade --no-cache

RUN apk add --no-cache python3 make g++

COPY /app/package*.json ./

RUN npm ci

COPY . .

CMD [ "npm", "run", "start:dev" ]
