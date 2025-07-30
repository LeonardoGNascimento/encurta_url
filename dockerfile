FROM node

WORKDIR /app

COPY ./package.json .

RUN npm i -g @nestjs/cli
RUN npm i

COPY . .