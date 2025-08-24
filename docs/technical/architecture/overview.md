# AirbarDashboard Architecture Standardization Plan

## Current State Analysis

The AirbarDashboard project is currently a messy monolithic structure with:
- Mixed React/Vite frontend in `client/`
- Node/Express API split between `server/` and `client/src/server/`
- Prisma DB configuration in root `prisma/`
- Shared TypeScript types in `shared/`
- Extensive documentation clutter in root
- Build artifacts and cache files scattered throughout

## Target Standard Layout

```
AirbarDashboard/
├── apps/
│   ├── web/                    # React/Vite frontend
│   │   ├── src/
│   │   │   ├── features/       # Feature-based modules
│   │   │   │   ├── auth/       # Login, register, reset password
│   │   │   │   ├── trips/      # Trip management, browsing
│   │   │   │   ├── parcels/    # Package sending, tracking
│   │   │   │   ├── booking/    # Matching, requests, booking flow
│   │   │   │   ├── wallet/     # Payments, earnings, transactions
│   │   │   │   ├── chat/       # Messaging between users
│   │   │   │   └── dashboard/  # Main dashboard, analytics
│   │   │   ├── components/     # Global/shared components
│   │   │   │   ├── ui/         # Shadcn/UI components
│   │   │   │   └── layout/     # Layout components
│   │   │   ├── hooks/          # Global React hooks
│   │   │   ├── lib/            # Utilities, configs
│   │   │   └── marketing/      # Landing page, public marketing
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   └── api/                    # Node/Express backend
│       ├── src/
│       │   ├── features/       # Feature-based API modules
│       │   │   ├── auth/       # Authentication endpoints
│       │   │   ├── trips/      # Trip management API
│       │   │   ├── parcels/    # Package/parcel API
│       │   │   ├── booking/    # Matching/booking API
│       │   │   ├── wallet/     # Payment processing API
│       │   │   └── chat/       # Messaging API
│       │   ├── middleware/     # Express middleware
│       │   ├── utils/          # Server utilities
│       │   └── server.ts       # Express app entry point
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── shared/                 # Shared TypeScript types & utilities
│   │   ├── src/
│   │   │   ├── types/          # TypeScript interfaces/types
│   │   │   ├── schemas/        # Zod validation schemas
│   │   │   └── utils/          # Shared utility functions
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── db/                     # Database package
│       ├── prisma/
│       │   ├── migrations/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       ├── src/
│       │   ├── client.ts       # Prisma client export
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── infra/
│   ├── docker/
│   │   ├── Dockerfile.web      # Frontend Dockerfile
│   │   ├── Dockerfile.api      # Backend Dockerfile
│   │   └── Dockerfile.db       # Database Dockerfile (if needed)
│   └── compose.dev.yml         # Development docker-compose
├── docs/
│   ├── api/                    # API documentation
│   ├── deployment/             # Deployment guides
│   └── development/            # Development setup
├── .github/
│   └── workflows/
│       ├── ci.yml              # Continuous integration
│       ├── deploy-staging.yml  # Staging deployment
│       └── deploy-prod.yml     # Production deployment
├── .gitignore
├── .editorconfig
├── .env.example
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # PNPM workspace configuration
└── tsconfig.base.json          # Base TypeScript configuration
```

## Step-by-Step Migration Plan

### Phase 1: Foundation Setup

#### 1.1 Create Git Branch & Backup
```bash
# Create migration branch
git checkout -b chore/standardize-structure

# Create backup branch as safety net
git checkout -b backup/pre-standardization main
git checkout chore/standardize-structure
```

#### 1.2 Setup Workspace Configuration
```bash
# Create root package.json for workspaces
cat > package.json << 'EOF'
{
  "name": "airbardashboard",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "concurrently \"pnpm dev:api\" \"pnpm dev:web\"",
    "dev:api": "pnpm --filter @airbar/api dev",
    "dev:web": "pnpm --filter @airbar/web dev",
    "build": "pnpm --filter @airbar/shared build && pnpm --filter @airbar/db build && pnpm --filter @airbar/api build && pnpm --filter @airbar/web build",
    "test": "pnpm --recursive test",
    "lint": "pnpm --recursive lint",
    "type-check": "pnpm --recursive type-check",
    "clean": "pnpm --recursive clean && rm -rf node_modules",
    "docker:dev": "docker-compose -f infra/compose.dev.yml up",
    "docker:down": "docker-compose -f infra/compose.dev.yml down"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "typescript": "^5.6.3"
  }
}
EOF

# Create PNPM workspace config
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF
```

#### 1.3 Setup Base TypeScript Configuration
```bash
# Create base tsconfig.json
cat > tsconfig.base.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Default",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@airbar/shared": ["./packages/shared/src"],
      "@airbar/shared/*": ["./packages/shared/src/*"],
      "@airbar/db": ["./packages/db/src"],
      "@airbar/db/*": ["./packages/db/src/*"]
    }
  }
}
EOF
```

#### 1.4 Setup Environment & Configuration Files
```bash
# Create .editorconfig
cat > .editorconfig << 'EOF'
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
EOF

# Create comprehensive .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# TypeScript
*.tsbuildinfo

# Cache directories
.cache/
.parcel-cache/
.eslintcache

# Database
*.sqlite
*.db

# Docker
.dockerignore

# Misc
.turbo/
.husky/_/

# Development clutter (old structure)
.local/
.replit
attached_assets/
web-bundles/
BMAD-METHOD/
replit.md
test-endpoints.js
EOF

# Create environment template
cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/airbar_dev"

# Authentication
JWT_SECRET="your-jwt-secret-here"
JWT_EXPIRES_IN="7d"

# Redis (for sessions/cache)
REDIS_URL="redis://localhost:6379"

# External APIs
GOOGLE_MAPS_API_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# App Configuration
NODE_ENV="development"
PORT="3001"
FRONTEND_URL="http://localhost:5173"
EOF
```

### Phase 2: Package Structure Setup

#### 2.1 Create Shared Package
```bash
mkdir -p packages/shared/src/{types,schemas,utils}

# packages/shared/package.json
cat > packages/shared/package.json << 'EOF'
{
  "name": "@airbar/shared",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./types": "./dist/types/index.js",
    "./schemas": "./dist/schemas/index.js",
    "./utils": "./dist/utils/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "typescript": "^5.6.3"
  }
}
EOF

# packages/shared/tsconfig.json
cat > packages/shared/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "noEmit": false
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
EOF
```

#### 2.2 Create Database Package
```bash
mkdir -p packages/db/src

# packages/db/package.json
cat > packages/db/package.json << 'EOF'
{
  "name": "@airbar/db",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^6.14.0",
    "prisma": "^6.14.0"
  },
  "devDependencies": {
    "tsx": "^4.19.1",
    "typescript": "^5.6.3"
  }
}
EOF

# packages/db/tsconfig.json
cat > packages/db/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "noEmit": false
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
EOF
```

### Phase 3: App Structure Migration

#### 3.1 Create Web App Structure
```bash
mkdir -p apps/web/src/{features/{auth,trips,parcels,booking,wallet,chat,dashboard},components/{ui,layout},hooks,lib,marketing}

# apps/web/package.json
cat > apps/web/package.json << 'EOF'
{
  "name": "@airbar/web",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist node_modules/.vite"
  },
  "dependencies": {
    "@airbar/shared": "workspace:*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.7.0",
    "@tanstack/react-query": "^5.60.5",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.2",
    "typescript": "^5.6.3",
    "vite": "^5.4.19"
  }
}
EOF

# apps/web/tsconfig.json
cat > apps/web/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@airbar/shared": ["../../packages/shared/src"],
      "@airbar/shared/*": ["../../packages/shared/src/*"]
    }
  },
  "include": ["src"],
  "references": [
    { "path": "../../packages/shared" }
  ]
}
EOF

# apps/web/vite.config.ts
cat > apps/web/vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@airbar/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
EOF
```

#### 3.2 Create API App Structure
```bash
mkdir -p apps/api/src/{features/{auth,trips,parcels,booking,wallet,chat},middleware,utils}

# apps/api/package.json
cat > apps/api/package.json << 'EOF'
{
  "name": "@airbar/api",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint . --ext .ts,.js --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@airbar/shared": "workspace:*",
    "@airbar/db": "workspace:*",
    "express": "^4.21.2",
    "cors": "^2.8.5",
    "helmet": "^8.1.0",
    "compression": "^1.8.1",
    "express-rate-limit": "^8.0.1",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.25.76",
    "dotenv": "^17.2.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcrypt": "^6.0.0",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^20.16.11",
    "tsx": "^4.19.1",
    "typescript": "^5.6.3"
  }
}
EOF

# apps/api/tsconfig.json
cat > apps/api/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": "src",
    "noEmit": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@airbar/shared": ["../../packages/shared/src"],
      "@airbar/shared/*": ["../../packages/shared/src/*"],
      "@airbar/db": ["../../packages/db/src"],
      "@airbar/db/*": ["../../packages/db/src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"],
  "references": [
    { "path": "../../packages/shared" },
    { "path": "../../packages/db" }
  ]
}
EOF
```

### Phase 4: Infrastructure Setup

#### 4.1 Create Docker Infrastructure
```bash
mkdir -p infra/docker

# infra/docker/Dockerfile.web
cat > infra/docker/Dockerfile.web << 'EOF'
FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build:web

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY infra/docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# infra/docker/Dockerfile.api
cat > infra/docker/Dockerfile.api << 'EOF'
FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/db/package.json ./packages/db/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build:api

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
USER nodejs
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "server.js"]
EOF

# infra/compose.dev.yml
cat > infra/compose.dev.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: airbar-db
    environment:
      POSTGRES_USER: airbar_user
      POSTGRES_PASSWORD: airbar_password
      POSTGRES_DB: airbar_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U airbar_user -d airbar_dev"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: airbar-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  api:
    build:
      context: ..
      dockerfile: infra/docker/Dockerfile.api
    container_name: airbar-api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://airbar_user:airbar_password@postgres:5432/airbar_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ../apps/api:/app/apps/api
      - ../packages:/app/packages
    develop:
      watch:
        - action: sync
          path: ../apps/api/src
          target: /app/apps/api/src
        - action: rebuild
          path: ../apps/api/package.json

  web:
    build:
      context: ..
      dockerfile: infra/docker/Dockerfile.web
    container_name: airbar-web
    ports:
      - "5173:80"
    depends_on:
      - api
    volumes:
      - ../apps/web:/app/apps/web
      - ../packages:/app/packages
    develop:
      watch:
        - action: sync
          path: ../apps/web/src
          target: /app/apps/web/src
        - action: rebuild
          path: ../apps/web/package.json

volumes:
  postgres_data:
  redis_data:
EOF
```

#### 4.2 Create GitHub Actions CI/CD
```bash
mkdir -p .github/workflows

# .github/workflows/ci.yml
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check

  test:
    name: Test
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
EOF
```

### Phase 5: Migration Execution

#### 5.1 Move Files to New Structure
```bash
# Move shared code
mv shared/* packages/shared/src/
rmdir shared

# Move database files
mv prisma/* packages/db/
rmdir prisma

# Move API files
mv server/* apps/api/src/
# Move client-side server files to API
mv client/src/server/* apps/api/src/
rmdir server
rm -rf client/src/server

# Move web files
mv client/* apps/web/
rmdir client

# Move tests
mv test/* apps/api/src/__tests__/
rmdir test

# Clean up clutter
rm -rf .local web-bundles BMAD-METHOD attached_assets
rm replit.md test-endpoints.js
```

#### 5.2 Update Import Paths
```bash
# Update all imports in API files
find apps/api/src -name "*.ts" -type f -exec sed -i '' 's|@shared/|@airbar/shared/|g' {} \;
find apps/api/src -name "*.ts" -type f -exec sed -i '' 's|from "shared/|from "@airbar/shared/|g' {} \;

# Update all imports in Web files  
find apps/web/src -name "*.tsx?" -type f -exec sed -i '' 's|@shared/|@airbar/shared/|g' {} \;
find apps/web/src -name "*.tsx?" -type f -exec sed -i '' 's|from "shared/|from "@airbar/shared/|g' {} \;
```

#### 5.3 Feature Folder Structure for API

```bash
# Create feature modules in API
mkdir -p apps/api/src/features/{auth,trips,parcels,booking,wallet,chat}

# Example: apps/api/src/features/auth/index.ts
cat > apps/api/src/features/auth/index.ts << 'EOF'
export * from './routes'
export * from './controllers'
export * from './services'
export * from './middleware'
EOF

# Example: apps/api/src/features/auth/routes.ts
cat > apps/api/src/features/auth/routes.ts << 'EOF'
import { Router } from 'express'
import { authController } from './controllers'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/refresh', authController.refresh)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

export { router as authRoutes }
EOF
```

#### 5.4 Feature Folder Structure for Web

```bash
# Create feature modules in Web
mkdir -p apps/web/src/features/{auth,trips,parcels,booking,wallet,chat,dashboard}

# Example: apps/web/src/features/auth/index.ts
cat > apps/web/src/features/auth/index.ts << 'EOF'
export * from './components'
export * from './hooks'
export * from './api'
export * from './types'
EOF

# Example: apps/web/src/features/auth/api.ts
cat > apps/web/src/features/auth/api.ts << 'EOF'
import { z } from 'zod'
import { authSchema } from '@airbar/shared/schemas'

const API_BASE = '/api/auth'

export const authApi = {
  login: async (data: z.infer<typeof authSchema.login>) => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },
  // ... other auth methods
}
EOF
```

### Phase 6: Development Experience Setup

#### 6.1 Install Dependencies & Build
```bash
# Install PNPM if not installed
npm install -g pnpm

# Install all dependencies
pnpm install

# Build packages
pnpm build

# Generate Prisma client
pnpm --filter @airbar/db db:generate
```

#### 6.2 Create Development Scripts
```bash
# Add to root package.json scripts section:
cat >> package.json << 'EOF'
  "scripts": {
    "dev": "concurrently \"pnpm dev:db\" \"pnpm dev:api\" \"pnpm dev:web\"",
    "dev:db": "docker-compose -f infra/compose.dev.yml up -d postgres redis",
    "dev:api": "pnpm --filter @airbar/api dev",
    "dev:web": "pnpm --filter @airbar/web dev",
    "build:packages": "pnpm --filter @airbar/shared build && pnpm --filter @airbar/db build",
    "build:apps": "pnpm build:packages && pnpm --filter @airbar/api build && pnpm --filter @airbar/web build",
    "test": "pnpm --recursive test",
    "lint": "pnpm --recursive lint",
    "type-check": "pnpm --recursive type-check",
    "clean": "pnpm --recursive clean && rm -rf node_modules",
    "docker:dev": "docker-compose -f infra/compose.dev.yml up",
    "docker:down": "docker-compose -f infra/compose.dev.yml down",
    "db:push": "pnpm --filter @airbar/db db:push",
    "db:migrate": "pnpm --filter @airbar/db db:migrate",
    "db:seed": "pnpm --filter @airbar/db db:seed",
    "db:studio": "pnpm --filter @airbar/db db:studio"
  }
EOF
```

### Phase 7: Quality & Guardrails

#### 7.1 Update Husky Git Hooks
```bash
# Update .husky/pre-commit
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
pnpm type-check
EOF
```

#### 7.2 Create API Documentation Structure
```bash
mkdir -p docs/{api,deployment,development}

# docs/development/README.md
cat > docs/development/README.md << 'EOF'
# Development Guide

## Quick Start

1. **Prerequisites**: Node.js 20+, PNPM, Docker
2. **Setup**: `pnpm install && cp .env.example .env`
3. **Database**: `pnpm docker:dev`
4. **Development**: `pnpm dev`

## Architecture

This is a monorepo using PNPM workspaces:

- `apps/web` - React frontend (port 5173)
- `apps/api` - Express backend (port 3001)
- `packages/shared` - Shared types & utilities
- `packages/db` - Prisma database layer

## Feature Development

Each feature should follow this structure:

### API Features (`apps/api/src/features/[feature]`)
- `index.ts` - Feature exports
- `routes.ts` - Express routes
- `controllers.ts` - Route handlers
- `services.ts` - Business logic
- `middleware.ts` - Feature middleware
- `types.ts` - Feature-specific types

### Web Features (`apps/web/src/features/[feature]`)
- `index.ts` - Feature exports
- `components/` - Feature components
- `hooks/` - Feature hooks
- `api.ts` - API client
- `types.ts` - Feature-specific types

## Commands

- `pnpm dev` - Start all services
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm type-check` - Type check all packages
EOF
```

## Migration Execution Checklist

### ✅ Phase 1: Foundation
- [ ] Create `chore/standardize-structure` branch
- [ ] Setup workspace configuration (package.json, pnpm-workspace.yaml)
- [ ] Create base TypeScript config (tsconfig.base.json)
- [ ] Setup environment files (.env.example, .editorconfig, .gitignore)

### ✅ Phase 2: Packages
- [ ] Create `packages/shared` with proper package.json & tsconfig
- [ ] Create `packages/db` with proper package.json & tsconfig
- [ ] Move existing shared code to packages/shared/src
- [ ] Move existing prisma to packages/db

### ✅ Phase 3: Apps
- [ ] Create `apps/web` structure with feature folders
- [ ] Create `apps/api` structure with feature folders
- [ ] Move client code to apps/web
- [ ] Move server code to apps/api
- [ ] Update all import paths throughout codebase

### ✅ Phase 4: Infrastructure
- [ ] Create Docker configurations (Dockerfile.web, Dockerfile.api)
- [ ] Create development docker-compose (infra/compose.dev.yml)
- [ ] Setup GitHub Actions CI/CD (.github/workflows/ci.yml)

### ✅ Phase 5: Migration
- [ ] Move all files to new structure
- [ ] Update import statements across codebase
- [ ] Organize code into feature modules
- [ ] Clean up old structure artifacts

### ✅ Phase 6: Development
- [ ] Install PNPM and dependencies
- [ ] Build all packages
- [ ] Setup development scripts
- [ ] Test local development flow

### ✅ Phase 7: Quality
- [ ] Update git hooks and linting
- [ ] Create development documentation
- [ ] Test build and deployment process
- [ ] Commit and create pull request

## One-Command Setup

After migration, developers can start working with:

```bash
# Clone and setup
git clone <repo>
cd AirbarDashboard
cp .env.example .env
pnpm install

# Start development (one command!)
pnpm dev
```

This starts:
- PostgreSQL + Redis (Docker containers)  
- API server on port 3001
- Web app on port 5173
- File watching for hot reloading

## Post-Migration Benefits

1. **Clean Architecture**: Feature-based organization, clear separation of concerns
2. **Proper Monorepo**: PNPM workspaces, shared packages, type safety
3. **Developer Experience**: One command dev setup, hot reloading, proper tooling
4. **Production Ready**: Docker configs, CI/CD, proper build process
5. **Maintainable**: Clear patterns, documentation, guardrails for future development

The migration transforms a messy codebase into a professional, scalable full-stack application following modern development practices.