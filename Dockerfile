FROM --platform=linux/amd64 node:19-alpine as development

WORKDIR /home/app

ENV NODE_ENV=development

RUN apk add --no-cache \
    chromium \
    chromium-chromedriver
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./

RUN npm install webpack glob rimraf --legacy-peer-deps

RUN npm install --only=development --legacy-peer-deps

COPY . .

RUN npm run build

CMD [ "node", "dist/main" ]