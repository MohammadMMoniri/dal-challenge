FROM docker.arvancloud.ir/node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY .npmrc ./


RUN npm ci --only=production && npm cache clean --force

COPY .  ./

RUN npm run build

EXPOSE 3000

CMD [ "node", "./dist/src/main.js" ]