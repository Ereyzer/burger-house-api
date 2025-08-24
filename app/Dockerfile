# syntax=docker/dockerfile:1

FROM node:22.18-alpine

WORKDIR /usr/src/app

COPY /app/package*.json ./

RUN npm ci

COPY . .

# TODO: 
# COPY /scripts/ ./scripts/

# RUN ./scripts/*.sh

CMD [ "npm", "run", "start:dev" ]