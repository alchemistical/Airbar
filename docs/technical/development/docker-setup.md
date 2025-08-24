# Docker Setup Guide

## Installing Docker

### macOS
```bash
# Install Docker Desktop
brew install --cask docker-desktop

# Or download from: https://www.docker.com/products/docker-desktop
```

### Starting Docker
1. Launch Docker Desktop from Applications
2. Wait for Docker to start (whale icon in menu bar)
3. Verify installation: `docker --version`

## Database Setup

### Option 1: With Docker (Recommended)
```bash
# Start PostgreSQL and Redis
pnpm docker:dev

# Check services are running  
docker ps
```

### Option 2: Local PostgreSQL (Alternative)
```bash
# Install PostgreSQL locally
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb airbar_dev
```

## Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Update DATABASE_URL in .env for your setup:
# Docker: postgresql://airbar_user:airbar_password@localhost:5432/airbar_dev  
# Local: postgresql://username@localhost:5432/airbar_dev
```

## Next Steps
```bash
# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev
```