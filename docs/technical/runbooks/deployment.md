# Production Deployment Guide

*Complete deployment procedures and infrastructure setup for Airbar platform*

---

## 🏗️ Deployment Overview

This guide covers production deployment for the Airbar crowdshipping platform using Docker containers, PostgreSQL database, and reverse proxy configuration.

**Target Environment**: Production-ready containerized deployment
**Orchestration**: Docker Compose with health checks
**Database**: PostgreSQL 15 with connection pooling
**Caching**: Redis for session and application caching

---

## 🔧 Pre-deployment Requirements

### Infrastructure Prerequisites
- **Server**: Linux Ubuntu 22.04+ or similar
- **RAM**: 4GB minimum, 8GB recommended
- **CPU**: 2 cores minimum, 4 cores recommended  
- **Storage**: 50GB minimum, SSD recommended
- **Network**: Public IP with ports 80, 443 accessible

### Software Requirements
```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose V2
sudo apt update
sudo apt install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### Domain and SSL
- Domain name pointed to server IP
- SSL certificate (Let's Encrypt recommended)
- Reverse proxy setup (Nginx recommended)

---

## 📁 Production Environment Setup

### 1. Clone Production Repository
```bash
# Clone to production directory
git clone https://github.com/your-org/AirbarDashboard.git /opt/airbar
cd /opt/airbar

# Create production branch tracking
git checkout -b production origin/main
```

### 2. Environment Configuration
```bash
# Create production environment file
cp .env.example .env.production

# Edit with production values
nano .env.production
```

**Required Environment Variables:**
```bash
# Database Configuration
DATABASE_URL=postgresql://airbar_prod:SECURE_PASSWORD@postgres:5432/airbar_production
POSTGRES_USER=airbar_prod
POSTGRES_PASSWORD=SECURE_RANDOM_PASSWORD
POSTGRES_DB=airbar_production

# Application Security  
JWT_SECRET=256-bit-secure-random-string
JWT_REFRESH_SECRET=different-256-bit-random-string
ENCRYPTION_KEY=32-character-encryption-key

# Redis Configuration
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=redis-secure-password

# Stripe Integration
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# Email Service (Optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@yourairbar.com
SMTP_PASSWORD=email-service-password

# File Storage
AWS_S3_BUCKET=airbar-production-uploads
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

# Application URLs
API_URL=https://api.yourairbar.com
WEB_URL=https://yourairbar.com
FRONTEND_URL=https://yourairbar.com

# Security Settings
NODE_ENV=production
CORS_ORIGIN=https://yourairbar.com
SECURE_COOKIES=true
```

### 3. Database Preparation
```bash
# Create database backup directory
sudo mkdir -p /opt/airbar/backups
sudo chown -R $USER:$USER /opt/airbar

# Setup database initialization
mkdir -p ./infra/docker/production
```

Create database initialization script:
```sql
-- File: infra/docker/production/init-db.sql
CREATE DATABASE airbar_production;
CREATE USER airbar_prod WITH ENCRYPTED PASSWORD 'SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE airbar_production TO airbar_prod;

-- Enable required extensions
\c airbar_production;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

---

## 🐳 Docker Production Setup

### 1. Production Docker Compose
```yaml
# File: docker-compose.production.yml
version: '3.8'

services:
  # Database
  postgres:
    image: postgres:15-alpine
    container_name: airbar-db-prod
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8"
    ports:
      - "127.0.0.1:5432:5432"  # Only localhost access
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./infra/docker/production/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql:ro
      - ./backups:/backups
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped
    networks:
      - airbar-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: airbar-redis-prod
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redis_prod_data:/data
      - ./infra/docker/redis-prod.conf:/usr/local/etc/redis/redis.conf:ro
    command: ["redis-server", "/usr/local/etc/redis/redis.conf", "--requirepass", "${REDIS_PASSWORD}"]
    healthcheck:
      test: ["CMD", "redis-cli", "--no-auth-warning", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 10s
    restart: unless-stopped
    networks:
      - airbar-network

  # API Service
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: production
    container_name: airbar-api-prod
    env_file:
      - .env.production
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
    ports:
      - "127.0.0.1:3001:3001"
    volumes:
      - api_uploads_prod:/app/uploads
      - ./logs:/app/logs
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/api/health", "||", "exit", "1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    networks:
      - airbar-network
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"

  # Web Service
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      target: production
    container_name: airbar-web-prod
    env_file:
      - .env.production
    ports:
      - "127.0.0.1:3000:3000"
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000", "||", "exit", "1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
    networks:
      - airbar-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  postgres_prod_data:
    driver: local
  redis_prod_data:
    driver: local
  api_uploads_prod:
    driver: local

networks:
  airbar-network:
    driver: bridge
    name: airbar-prod-network
    ipam:
      config:
        - subnet: 172.21.0.0/16
```

### 2. Production Dockerfiles

**API Dockerfile Updates:**
```dockerfile
# File: apps/api/Dockerfile
# Production stage
FROM node:18-alpine AS production

# Security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Working directory
WORKDIR /app
COPY --chown=nodejs:nodejs . .

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter @airbar/db generate

# Build application
RUN pnpm build:prod

# Remove dev dependencies and source
RUN rm -rf packages/*/src apps/*/src
RUN pnpm prune --prod

USER nodejs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/api/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/api/dist/server.js"]
```

### 3. Redis Production Configuration
```bash
# File: infra/docker/redis-prod.conf
# Basic configuration
bind 0.0.0.0
port 6379
timeout 0
tcp-keepalive 300

# Memory management
maxmemory 512mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000
dir /data

# Security
protected-mode yes
# requirepass will be set via command line

# Logging
loglevel notice
logfile ""

# Disable dangerous commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG "CONFIG_b45a2b5c8f"
```

---

## 🚀 Deployment Process

### 1. Initial Deployment
```bash
# Navigate to production directory
cd /opt/airbar

# Pull latest changes
git pull origin main

# Build production images
docker compose -f docker-compose.production.yml build --no-cache

# Start services
docker compose -f docker-compose.production.yml up -d

# Check service status
docker compose -f docker-compose.production.yml ps

# View logs
docker compose -f docker-compose.production.yml logs -f
```

### 2. Database Migration
```bash
# Run database migrations
docker compose -f docker-compose.production.yml exec api pnpm db:migrate deploy

# Seed initial data (if needed)
docker compose -f docker-compose.production.yml exec api pnpm db:seed
```

### 3. SSL and Reverse Proxy Setup
```nginx
# File: /etc/nginx/sites-available/airbar.conf
server {
    listen 80;
    server_name yourairbar.com www.yourairbar.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourairbar.com www.yourairbar.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/yourairbar.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourairbar.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Web app proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File upload size
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Enable Nginx configuration:
```bash
sudo ln -s /etc/nginx/sites-available/airbar.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔄 Continuous Deployment

### 1. GitHub Actions Workflow
```yaml
# File: .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Run tests
      run: pnpm test

    - name: Build production
      run: pnpm build:prod

    - name: Deploy to production server
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.PROD_HOST }}
        username: ${{ secrets.PROD_USERNAME }}
        key: ${{ secrets.PROD_SSH_KEY }}
        script: |
          cd /opt/airbar
          git pull origin main
          docker compose -f docker-compose.production.yml build --no-cache
          docker compose -f docker-compose.production.yml up -d
          docker compose -f docker-compose.production.yml exec -T api pnpm db:migrate deploy
```

### 2. Deployment Script
```bash
#!/bin/bash
# File: scripts/deploy.sh
set -e

echo "🚀 Starting Airbar production deployment..."

# Configuration
COMPOSE_FILE="docker-compose.production.yml"
BACKUP_DIR="/opt/airbar/backups"

# Create backup
echo "📁 Creating database backup..."
docker compose -f $COMPOSE_FILE exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql"

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Build new images
echo "🏗️ Building Docker images..."
docker compose -f $COMPOSE_FILE build --no-cache

# Run database migrations
echo "🗃️ Running database migrations..."
docker compose -f $COMPOSE_FILE up -d postgres redis
sleep 10
docker compose -f $COMPOSE_FILE exec -T api pnpm db:migrate deploy

# Rolling restart
echo "🔄 Restarting services..."
docker compose -f $COMPOSE_FILE up -d --force-recreate

# Health checks
echo "🏥 Performing health checks..."
sleep 30

# Check API health
if curl -f http://127.0.0.1:3001/api/health; then
    echo "✅ API is healthy"
else
    echo "❌ API health check failed"
    exit 1
fi

# Check web health
if curl -f http://127.0.0.1:3000; then
    echo "✅ Web app is healthy"
else
    echo "❌ Web app health check failed"
    exit 1
fi

echo "🎉 Deployment completed successfully!"

# Cleanup old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo "✨ All done!"
```

Make script executable:
```bash
chmod +x scripts/deploy.sh
```

---

## 📊 Monitoring and Logging

### 1. Log Management
```bash
# View application logs
docker compose -f docker-compose.production.yml logs -f api
docker compose -f docker-compose.production.yml logs -f web

# Log rotation setup
sudo nano /etc/logrotate.d/airbar
```

Logrotate configuration:
```
/opt/airbar/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    notifempty
    sharedscripts
    postrotate
        docker kill --signal=USR1 airbar-api-prod
    endscript
}
```

### 2. Health Monitoring Script
```bash
#!/bin/bash
# File: scripts/health-check.sh

# Configuration
API_URL="http://127.0.0.1:3001/api/health"
WEB_URL="http://127.0.0.1:3000"
SLACK_WEBHOOK_URL="$SLACK_WEBHOOK_URL"

# Function to send alert
send_alert() {
    local service=$1
    local status=$2
    
    curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"🚨 Airbar $service is $status\"}" \
    $SLACK_WEBHOOK_URL
}

# Check API health
if ! curl -f -s $API_URL > /dev/null; then
    echo "API health check failed"
    send_alert "API" "DOWN"
    exit 1
fi

# Check web health  
if ! curl -f -s $WEB_URL > /dev/null; then
    echo "Web health check failed"
    send_alert "Web" "DOWN"
    exit 1
fi

echo "All services healthy"
```

Setup cron job:
```bash
# Add to crontab
*/5 * * * * /opt/airbar/scripts/health-check.sh
```

---

## 🔒 Security Hardening

### 1. Firewall Configuration
```bash
# Setup UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 2. Docker Security
```bash
# Create Docker daemon configuration
sudo nano /etc/docker/daemon.json
```

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "live-restore": true,
  "userland-proxy": false,
  "no-new-privileges": true
}
```

### 3. Database Security
```sql
-- Additional database security
ALTER USER airbar_prod SET log_statement = 'none';
ALTER USER airbar_prod SET log_min_duration_statement = 1000;
CREATE ROLE readonly;
GRANT USAGE ON SCHEMA public TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
```

---

## 💾 Backup and Recovery

### 1. Automated Backup Script
```bash
#!/bin/bash
# File: scripts/backup.sh

BACKUP_DIR="/opt/airbar/backups"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d-%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "Creating database backup..."
docker compose -f docker-compose.production.yml exec -T postgres \
  pg_dump -U $POSTGRES_USER -h localhost $POSTGRES_DB \
  > "$BACKUP_DIR/db-backup-$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/db-backup-$DATE.sql"

# Upload volumes backup
echo "Creating volumes backup..."
docker run --rm -v airbar_postgres_prod_data:/data -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/volumes-backup-$DATE.tar.gz -C /data .

# Cleanup old backups
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $BACKUP_DIR/db-backup-$DATE.sql.gz"
```

### 2. Recovery Procedures
```bash
# Restore from backup
#!/bin/bash
# File: scripts/restore.sh

BACKUP_FILE=$1
if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup-file>"
    exit 1
fi

# Stop services
docker compose -f docker-compose.production.yml stop api web

# Restore database
gunzip -c $BACKUP_FILE | docker compose -f docker-compose.production.yml exec -T postgres \
  psql -U $POSTGRES_USER -d $POSTGRES_DB

# Restart services
docker compose -f docker-compose.production.yml start
```

---

## 🔧 Maintenance Tasks

### 1. Regular Maintenance Script
```bash
#!/bin/bash
# File: scripts/maintenance.sh

echo "🧹 Starting maintenance tasks..."

# Update system packages
sudo apt update && sudo apt upgrade -y

# Docker cleanup
docker system prune -f
docker volume prune -f

# Log rotation
sudo logrotate -f /etc/logrotate.d/airbar

# Database maintenance
docker compose -f docker-compose.production.yml exec postgres \
  psql -U $POSTGRES_USER -d $POSTGRES_DB -c "VACUUM ANALYZE;"

# Check disk space
df -h

echo "✅ Maintenance completed"
```

### 2. Performance Monitoring
```bash
# Setup performance monitoring
sudo apt install htop iotop nethogs

# Database performance monitoring
docker compose -f docker-compose.production.yml exec postgres \
  psql -U $POSTGRES_USER -d $POSTGRES_DB -c "
  SELECT query, calls, total_time, mean_time 
  FROM pg_stat_statements 
  ORDER BY total_time DESC LIMIT 10;"
```

---

## 🚨 Troubleshooting Guide

### Common Issues

**1. Service Won't Start**
```bash
# Check logs
docker compose -f docker-compose.production.yml logs service_name

# Check system resources
free -h
df -h

# Restart individual service
docker compose -f docker-compose.production.yml restart api
```

**2. Database Connection Issues**
```bash
# Check PostgreSQL status
docker compose -f docker-compose.production.yml exec postgres pg_isready

# Check connections
docker compose -f docker-compose.production.yml exec postgres \
  psql -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT * FROM pg_stat_activity;"
```

**3. Memory Issues**
```bash
# Check memory usage
docker stats

# Restart services to clear memory
docker compose -f docker-compose.production.yml restart
```

### Emergency Procedures

**Complete System Recovery:**
```bash
# Stop all services
docker compose -f docker-compose.production.yml down

# Backup current state
cp -r /opt/airbar /opt/airbar-backup-$(date +%Y%m%d)

# Restore from clean state
git reset --hard origin/main
./scripts/deploy.sh
```

---

## 📋 Deployment Checklist

### Pre-deployment
- [ ] All tests passing in CI/CD
- [ ] Database migrations created and tested
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Backup created
- [ ] Monitoring alerts configured

### Deployment
- [ ] Deploy script executed successfully
- [ ] All services started and healthy
- [ ] Database migrations applied
- [ ] API endpoints responding correctly
- [ ] Web application loading properly
- [ ] SSL/HTTPS working correctly

### Post-deployment
- [ ] Health checks passing
- [ ] Log files being written correctly
- [ ] Backup system functioning
- [ ] Performance metrics normal
- [ ] User acceptance testing completed
- [ ] Rollback plan documented

---

*This deployment guide ensures a robust, secure, and maintainable production environment for the Airbar platform. Always test deployment procedures in a staging environment before applying to production.*