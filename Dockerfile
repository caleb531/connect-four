# ─── Stage 1: build the frontend ─────────────────────────────────────────────
# This Dockerfile is necessary because DigitalOcean's node buildpack does not
# support pnpm (only npm/yarn); to work around this, we must containerize the
# application ourselves, which allows us to install pnpm without issue.
FROM node:24-alpine AS builder

# Upgrade corepack to latest to fix "Internal Error: Cannot find matching keyid"
# error when installing latest pnpm (source:
# <https://vercel.com/guides/corepack-errors-github-actions>)
RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/app

# Copy manifests first so that the dependency layer is cached independently
# from source changes — speeds up re-builds when only source files change
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build


# ─── Stage 2: lean production image ──────────────────────────────────────────
FROM node:24-alpine AS production

RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/app
ENV NODE_ENV=production

# Install only runtime dependencies (skips eslint, playwright, sinon, etc.)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Server source and compiled frontend from the builder stage
COPY server ./server
COPY --from=builder /usr/app/dist ./dist

# SQLite database lives here — mount a named volume to persist it across
# container restarts and upgrades
VOLUME ["/usr/app/data"]

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q --spider http://localhost:8080/ || exit 1

CMD ["node", "server/index.js"]
