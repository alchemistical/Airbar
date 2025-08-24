# Docker Development Setup

This guide explains how to set up and use the Docker development environment for the Airbar Dashboard.

## Prerequisites

- **Docker Desktop** (v4.0 or later)
- **Docker Compose** (v2.0 or later)
- **Git** (for cloning the repository)

## Quick Start

### 1. One-Command Setup

```bash
# Start the entire development environment
pnpm docker:up

# Or use the helper script
./scripts/docker-dev.sh up
```

This will start:
- 🐘 **PostgreSQL** database on port 5432
- 🔴 **Redis** cache on port 6379
- 🚀 **API** service on port 3001
- 🌐 **Web** application on port 3000
- 🔧 **PgAdmin** (optional) on port 5050

### 2. Access Your Application

- **Web Application**: http://localhost:3000
- **API Server**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health
- **PgAdmin** (database admin): http://localhost:5050

## Available Commands

### NPM Scripts

```bash
# Build Docker images
pnpm docker:build

# Start all services
pnpm docker:up

# Stop all services
pnpm docker:down

# Restart all services
pnpm docker:restart

# View logs
pnpm docker:logs          # All services
pnpm docker:logs:api      # API only
pnpm docker:logs:web      # Web only

# Check service status
pnpm docker:status

# Clean up (removes containers, volumes, images)
pnpm docker:clean
```

### Helper Script

```bash
# Using the helper script (more features)
./scripts/docker-dev.sh help     # Show all commands
./scripts/docker-dev.sh up       # Start services
./scripts/docker-dev.sh down     # Stop services
./scripts/docker-dev.sh logs api # View API logs
./scripts/docker-dev.sh status   # Service status
./scripts/docker-dev.sh clean    # Full cleanup
```

## Development Features

### Hot Reloading

Both the API and Web applications support hot reloading:

- **API**: TypeScript files in `apps/api/src/` are watched and auto-restart the server
- **Web**: React/TypeScript files in `apps/web/src/` are watched and auto-refresh the browser

### Volume Mounts

The following directories are mounted for live development:

```yaml
API Service:
  - ./apps/api/src → /app/apps/api/src
  - ./packages → /app/packages
  - ./shared → /app/shared

Web Service:
  - ./apps/web/src → /app/apps/web/src
  - ./apps/web/public → /app/apps/web/public
  - ./packages → /app/packages
```

## Environment Configuration

### Default Development Settings

| Service | Container Name | Port | Credentials |
|---------|----------------|------|-------------|
| PostgreSQL | airbar-db | 5432 | `airbar_user` / `airbar_password` |
| Redis | airbar-redis | 6379 | (no auth) |
| API | airbar-api | 3001 | - |
| Web | airbar-web | 3000 | - |
| PgAdmin | airbar-pgadmin | 5050 | `admin@airbar.com` / `admin` |

## Next Steps

After setting up Docker development:

1. **Build Images**: `pnpm docker:build`
2. **Start Services**: `pnpm docker:up` 
3. **Check Status**: `pnpm docker:status`
4. **View Logs**: `pnpm docker:logs`
5. **Access Application**: http://localhost:3000