# Airbar Microservices Architecture

## Full System Schematic

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AIRBAR MICROSERVICES ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────────────────────┘

                             ┌─────────────────────────┐
                             │      LOAD BALANCER      │
                             │    Traefik/Nginx CDN    │
                             │  SSL Termination &      │
                             │  Rate Limiting          │
                             └───────────┬─────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
            ┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
            │   WEB CLIENT   │  │  MOBILE CLIENT  │  │   ADMIN PANEL  │
            │  React/Vite    │  │   (Future)      │  │   (Future)     │
            │  Port: 5173    │  │                 │  │                │
            └───────┬────────┘  └─────────────────┘  └────────────────┘
                    │
                    │ HTTP/WebSocket
                    │
            ┌───────▼────────┐
            │   API GATEWAY  │
            │  Express.js    │
            │  Port: 3001    │
            │ ┌─────────────┐│
            │ │Rate Limiter ││  ← Redis
            │ │CORS Handler ││
            │ │JWT Auth     ││
            │ │Swagger Docs ││
            │ └─────────────┘│
            └───────┬────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
   ┌────▼─────┐┌───▼───┐┌──────▼──────┐
   │   AUTH   ││ TRIPS ││  PACKAGES   │
   │ SERVICE  ││SERVICE││   SERVICE   │
   │          ││       ││             │
   │• Login   ││• CRUD ││• Send/Match │
   │• JWT     ││• Match││• Tracking   │
   │• Sessions││• View ││• Delivery   │
   └──────────┘└───────┘└─────────────┘

                    │
        ┌───────────┼────────────────────────────────┐
        │           │                                │
   ┌────▼─────┐┌───▼─────┐┌──────▼──────┐┌─────────▼─────────┐
   │ MATCHING ││ PAYMENT ││   MESSAGING ││    NOTIFICATIONS  │
   │ SERVICE  ││ SERVICE ││   SERVICE   ││     SERVICE       │
   │          ││         ││             ││                   │
   │• ML Algo ││• Stripe ││• Real-time  ││• Email/SMS/Push   │
   │• Scoring ││• Escrow ││• Chat       ││• Event Triggers   │
   │• Routing ││• Wallet ││• WebSocket  ││• Templates        │
   └──────────┘└─────────┘└─────────────┘└───────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────────┐ │
│    │ PostgreSQL   │    │    Redis     │    │    Stripe    │    │ File Storage│ │
│    │   Primary    │    │    Cache     │    │   Payments   │    │    (AWS/    │ │
│    │   Database   │    │              │    │              │    │   Local)    │ │
│    │              │    │• Sessions    │    │• Escrow      │    │             │ │
│    │• Users       │    │• Rate Limit  │    │• Webhooks    │    │• Avatars    │ │
│    │• Trips       │    │• Temporary   │    │• Refunds     │    │• Documents  │ │
│    │• Packages    │    │  Data        │    │              │    │• Images     │ │
│    │• Matches     │    │              │    │              │    │             │ │
│    │• Transactions│    │              │    │              │    │             │ │
│    │• Analytics   │    │              │    │              │    │             │ │
│    └──────────────┘    └──────────────┘    └──────────────┘    └─────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              MONITORING & OBSERVABILITY                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ Prometheus  │  │   Grafana   │  │    Loki     │  │ AlertManager│           │
│  │   Metrics   │  │ Dashboards  │  │    Logs     │  │   Alerts    │           │
│  │ Collection  │  │             │  │ Aggregation │  │             │           │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                            │
│  │Node Exporter│  │Redis Export │  │Postgres     │                            │
│  │System Stats │  │Cache Metrics│  │DB Metrics   │                            │
│  └─────────────┘  └─────────────┘  └─────────────┘                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 DEPLOYMENT                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│                    ┌─────────────────────────────────┐                         │
│                    │          DOCKER COMPOSE         │                         │
│                    │        (Dev/Staging/Prod)       │                         │
│                    └─────────────────────────────────┘                         │
│                                                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                  │
│  │    DEV     │ │  STAGING   │ │    PROD    │ │  MONITORING│                  │
│  │            │ │            │ │            │ │            │                  │
│  │• Hot Reload│ │• SSL Certs │ │• Auto Scale│ │• Health    │                  │
│  │• Debug     │ │• Log Aggr  │ │• CDN       │ │• Metrics   │                  │
│  │• Local DB  │ │• Monitoring│ │• Backups   │ │• Alerts    │                  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘                  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              KEY INTEGRATIONS                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ EXTERNAL SERVICES:                      INTERNAL SERVICES:                     │
│ • Stripe (Payments)                     • Authentication (JWT)                  │
│ • Twilio (SMS)                          • Rate Limiting (Redis)                 │
│ • SendGrid (Email)                      • Session Management                    │
│ • Google Maps (Geo)                     • File Upload Service                   │
│ • AWS S3 (Storage)                      • Real-time Notifications              │
│                                         • Analytics & Tracking                 │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## API Endpoints

```
Health:     /api/health, /api/ready, /api/live, /api/metrics
Auth:       /api/auth/login, /api/auth/register, /api/auth/refresh
Dashboard:  /api/dashboard/stats, /api/dashboard/activities
Trips:      /api/trips/* (CRUD operations)
Packages:   /api/parcels/* (CRUD operations)
Matching:   /api/matches/* (Discovery & management)
Payments:   /api/wallet/* (Transactions & escrow)
Chat:       /api/chat/* (Real-time messaging)
Docs:       /api/docs (OpenAPI/Swagger)
```

## Architecture Highlights

### 🏗️ **Monorepo Structure**
- **pnpm workspace** with apps (`api`, `web`) and shared packages
- Centralized dependency management and build orchestration
- Shared TypeScript types and utilities across services

### 🔐 **Authentication & Security**
- **JWT tokens** with refresh token rotation
- **Redis-backed session management** with device fingerprinting
- **Advanced rate limiting** with bypass tokens for testing
- **CORS**, **Helmet**, and security middleware

### 🗄️ **Database Architecture**
- **PostgreSQL** as primary database with comprehensive schema
- **Prisma ORM** for type-safe database operations
- **Analytics tables** for user behavior tracking
- **Feature flags** for A/B testing and rollout management

### ⚡ **Caching & Performance**
- **Redis** for sessions, rate limiting, and temporary data
- **Bundle optimization** with intelligent route preloading
- **Lazy loading** for React components
- **Response compression** and optimization

### 💳 **Payment System**
- **Stripe integration** with webhook handling
- **Escrow system** for secure transactions
- **Multi-currency support** with USD default
- **Refund and withdrawal** capabilities

### 📊 **Monitoring & Observability**
- **Prometheus** for metrics collection
- **Grafana** for visualization and dashboards
- **Loki** for log aggregation
- **AlertManager** for incident response
- **Health checks** for Kubernetes compatibility

### 🐳 **Deployment Infrastructure**
- **Docker Compose** configurations for all environments
- **Traefik** load balancer with SSL termination
- **Multi-environment** support (dev, staging, production)
- **Volume persistence** for data and uploads

### 🎯 **API Design**
- **Express.js** with modular route organization
- **OpenAPI/Swagger** documentation at `/api/docs`
- **Error handling** with correlation IDs
- **Structured logging** with Winston

### 📱 **Frontend Architecture**
- **React 18** with **Vite** for fast development
- **Wouter** for client-side routing
- **TanStack Query** for state management
- **Tailwind CSS** with component system
- **Error boundaries** and suspense wrappers

### 🔄 **Real-time Features**
- **WebSocket** support for live messaging
- **Server-sent events** for notifications
- **Real-time tracking** updates
- **Live chat** between users

## Service Communication

### Internal Communication
- **HTTP REST APIs** between services
- **Shared database** for consistency
- **Event-driven** architecture with Redis pub/sub
- **Service discovery** through Docker networking

### External Integrations
- **Stripe webhooks** for payment events
- **Email service** integration (SendGrid/Twilio)
- **Geolocation APIs** for route optimization
- **File storage** (AWS S3 or local filesystem)

## Data Flow

1. **User requests** → Load Balancer → API Gateway
2. **Authentication** → JWT validation → Service routing
3. **Business logic** → Service processing → Database operations
4. **Real-time updates** → WebSocket/SSE → Client updates
5. **Analytics** → Event tracking → Metrics collection
6. **Monitoring** → Health checks → Alert generation

## Scalability Considerations

- **Horizontal scaling** ready with containerization
- **Database connection pooling** with Prisma
- **Caching strategies** at multiple layers
- **CDN integration** for static assets
- **Microservice architecture** for independent scaling
- **Queue systems** ready for async processing

This architecture supports a production-ready crowdshipping platform with proper separation of concerns, comprehensive monitoring, and scalable deployment infrastructure designed to handle the core business flows of trip posting, package sending, intelligent matching, secure payments, and real-time communication.