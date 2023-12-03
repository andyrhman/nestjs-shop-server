###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:alpine As development

WORKDIR /var/nest-shop-server

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:alpine As build

WORKDIR /var/nest-shop-server

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /var/nest-shop-server/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

EXPOSE 465 25 587

###################
# PRODUCTION
###################

FROM node:alpine As production

COPY --chown=node:node --from=build /var/nest-shop-server/node_modules ./node_modules
COPY --chown=node:node --from=build /var/nest-shop-server/dist ./dist

CMD [ "node", "dist/src/main.js" ]
