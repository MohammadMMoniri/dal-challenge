FROM docker.arvancloud.ir/node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY .  ./

RUN npm run build

EXPOSE 3000

CMD [ "node", "./dist/main.js" ]