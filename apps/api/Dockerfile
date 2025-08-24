# Multi-stage build for API - Optimized for production
FROM node:20-alpine AS base
WORKDIR /app

# Install system dependencies and pnpm globally
RUN apk add --no-cache libc6-compat
RUN corepack enable pnpm

# Dependency stage - for better layer caching
FROM base AS deps
WORKDIR /app

# Copy dependency files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/db/package.json ./packages/db/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile --prefer-offline

# Development stage
FROM deps AS development
WORKDIR /app

# Copy source code
COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

EXPOSE 3001
CMD ["pnpm", "--filter", "@airbar/api", "dev"]

# Builder stage - Build the application
FROM deps AS builder
WORKDIR /app

# Copy source code
COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Build packages first (dependency order)
RUN pnpm --filter @airbar/shared build
RUN pnpm --filter @airbar/db build
RUN pnpm --filter @airbar/api build

# Remove dev dependencies and source files
RUN pnpm install --prod --frozen-lockfile --prefer-offline
RUN rm -rf packages/*/src packages/*/tsconfig.json apps/api/src apps/api/tsconfig.json

# Production stage - Optimized runtime image
FROM node:20-alpine AS production
WORKDIR /app

# Install production system dependencies
RUN apk add --no-cache dumb-init curl && \
    rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

# Copy built application and dependencies with proper ownership
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/packages ./packages
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

EXPOSE 3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/api/dist/server.js"]