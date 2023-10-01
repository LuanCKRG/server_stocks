FROM node:lts-alpine

WORKDIR /app

RUN apk update && apk add --no-cache nmap && \
    apk update && apk add install -y redis-server\
    echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY . /app

RUN npm install

EXPOSE 3000

ENTRYPOINT  ["/usr/bin/redis-server"]
EXPOSE 6379

CMD ["npm", "start"]