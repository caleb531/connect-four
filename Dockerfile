FROM node:16-alpine

WORKDIR /home/node/app

COPY . ./

# It is critical that we set the correct permissions *after* files are copied,
# otherwise we would encounter several "EACCES: permission denied" errors
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /usr/local/lib/node_modules && chown -R node:node /usr/local/lib/node_modules
RUN mkdir -p /usr/local/bin && chown -R node:node /usr/local/bin

USER node

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

COPY --chown=node:node . .

EXPOSE 8080

# Because we need to install dev dependencies in order to build the project
# above, we cannot set NODE_ENV=production before that point; however, we *do*
# need to set NODE_ENV=production to instruct my Express server to serve from
# the correct directory (dist/, in this case), so we wait to set it here
ENV NODE_ENV production
CMD [ "pnpm", "start" ]
