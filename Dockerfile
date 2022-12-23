# Base image
FROM node:16-alpine
RUN apk update && apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set up project
WORKDIR /usr/app
COPY ./package.json /usr/app
RUN pnpm install
COPY ./ ./
RUN pnpm build

# Start server
EXPOSE 8080
ENV NODE_ENV production
CMD ["pnpm", "start"]
