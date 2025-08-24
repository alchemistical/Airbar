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