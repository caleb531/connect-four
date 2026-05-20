# ==========================================
# 1. Build Stage
# ==========================================

FROM node:24.15.0-alpine AS builder

# Install build essentials
RUN apk update && apk add --no-cache libc6-compat

# Force-update npm globally to clear base-image npm vulnerabilities,
# then safely activate the latest pnpm
RUN npm install -g npm@latest corepack@latest \
  && corepack enable \
  && corepack prepare pnpm@10 --activate

WORKDIR /usr/app

# Leverage layer caching [cite: 3, 6]
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY ./ ./
RUN pnpm build
RUN pnpm prune --prod

# ==========================================
# 2. Production Runtime Stage
# ==========================================
FROM node:24.15.0-alpine AS runner
WORKDIR /usr/app

# Set production environment
ENV NODE_ENV=production

# Remove global package managers entirely from the runtime image.
# Since we execute the app directly with node, we don't need npm or yarn in production.
# This obliterates the source of the LSP vulnerability flags.
RUN rm -rf /usr/local/lib/node_modules/npm \
  && rm -rf /usr/local/bin/npm \
  && rm -rf /usr/local/bin/npx \
  && rm -rf /usr/local/bin/yarn \
  && rm -rf /usr/local/bin/yarnpkg

# Ensure the built-in 'node' user owns the working directory
RUN chown -R node:node /usr/app

# Copy built assets from builder stage
COPY --from=builder --chown=node:node /usr/app/package.json ./
COPY --from=builder --chown=node:node /usr/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/app/server ./server
COPY --from=builder --chown=node:node /usr/app/dist ./dist

# Switch to the official non-root user
USER node

EXPOSE 8080

# Run the app directly with node
CMD ["npm", "start"]
