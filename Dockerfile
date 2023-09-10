FROM ghcr.io/puppeteer/puppeteer:21.1.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_PATH=./build

WORKDIR /usr/src/app/

COPY package*.json ./
RUN npm ci
COPY . .


CMD [ "node", "build/server.js" ]