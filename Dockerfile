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
    printf "npm run start\nredis-server" > entrypoint.sh

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY . /app

RUN npm install

EXPOSE 3000 6379

# nohup redis-server

CMD ["/bin/sh", "entrypoint.sh"]