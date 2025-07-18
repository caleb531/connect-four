# This Dockerfile is necessary because DigitalOcean's node buildpack does not
# support pnpm (only npm/yarn); to work around this, we must containerize the
# application ourselves, which allows us to install pnpm without issue

# Base image
FROM node:22-alpine
RUN apk update && apk add --no-cache libc6-compat
# Upgrade corepack to latest to fix "Internal Error: Cannot find matching keyid"
# error when installing latest pnpm (source:
# <https://vercel.com/guides/corepack-errors-github-actions>)
RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set up project
WORKDIR /usr/app
# Because the package.json and pnpm-lock.yaml are the only files needed to
# install dependencies, we copy them first and separately from the other project
# files; this allows us to take advantage of Docker's layer caching feature,
# which in turn speeds up subsequent Docker builds (see
# <https://stackoverflow.com/questions/51533448/why-copy-package-json-precedes-copy>
# for more details)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY ./ ./
RUN pnpm build

# Start server
EXPOSE 8080
ENV NODE_ENV production
CMD ["pnpm", "start"]
