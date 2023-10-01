FROM node:lts-alpine AS base

WORKDIR /app

RUN apk update && apk add --no-cache nmap && \
    apk add --upgrade redis-server && \
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

CMD ["npm", "start"]