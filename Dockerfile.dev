FROM node:20.3.1

WORKDIR /var/nest-shop-server
COPY package.json .
RUN npm install
COPY . .

CMD npm run start:dev