FROM node:23-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /usr/app

COPY package*.json ./

COPY . .

EXPOSE 5001

CMD ["tail", "-f", "/dev/null"]