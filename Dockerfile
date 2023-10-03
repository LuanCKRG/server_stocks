FROM node:lts-alpine

WORKDIR /app


RUN apk update && apk add --no-cache nmap && \
    echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss

RUN apk add --update redis && \
    npm install -g concurrently && \
    npm run build

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY . /app

RUN npm install

EXPOSE 3000 6379

CMD concurrently "/usr/bin/redis-server --bind '0.0.0.0'" "npm run start"