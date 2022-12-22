FROM node:16-alpine

WORKDIR /home/node/app

COPY . ./

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /usr/local/lib/node_modules && chown -R node:node /usr/local/lib/node_modules
RUN mkdir -p /usr/local/lib/node_modules/pnpm && chown -R node:node /usr/local/lib/node_modules/pnpm
RUN mkdir -p /usr/local/bin && chown -R node:node /usr/local/bin

USER node

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

COPY --chown=node:node . .

EXPOSE 8080

ENV NODE_ENV production
CMD [ "pnpm", "start" ]
