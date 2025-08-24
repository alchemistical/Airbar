# Multi-stage build for Web - Optimized for production
FROM node:20-alpine AS base
WORKDIR /app

# Install system dependencies and pnpm
RUN apk add --no-cache libc6-compat
RUN corepack enable pnpm

# Dependency stage - for better layer caching
FROM base AS deps
WORKDIR /app

# Copy dependency files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile --prefer-offline

# Development stage
FROM deps AS development
WORKDIR /app

# Copy source code
COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

EXPOSE 5173
CMD ["pnpm", "--filter", "@airbar/web", "dev", "--host", "0.0.0.0"]

# Builder stage - Build the web application
FROM deps AS builder
WORKDIR /app

# Copy source code
COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Set production environment
ENV NODE_ENV=production

# Build packages first (dependency order)
RUN pnpm --filter @airbar/shared build

# Build web app with optimizations
RUN pnpm --filter @airbar/web build

# Production stage - Optimized nginx runtime
FROM nginx:1.25-alpine AS production

# Install security updates and additional tools
RUN apk add --no-cache dumb-init curl && \
    apk upgrade --no-cache && \
    rm -rf /var/cache/apk/*

# Copy nginx configuration
COPY infra/docker/nginx.conf /etc/nginx/nginx.conf

# Copy built static files with proper permissions
COPY --from=builder --chown=nginx:nginx /app/apps/web/dist /usr/share/nginx/html

# Create nginx user directories with proper permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run/nginx && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run/nginx /usr/share/nginx/html

# Use non-root user
USER nginx

# Health check for nginx
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]