# CLAUDE.md - AirBar Development Prompting Guide

This file provides structured prompting guidelines for Claude Code when working on the AirBar crowdshipping platform.

## 🏗️ Project Architecture

### Monorepo Structure
```
/
├── apps/
│   ├── api/          # Node.js/Express API with Prisma ORM
│   └── web/          # React/Vite frontend with TypeScript
├── packages/
│   ├── db/           # Prisma schema & database utilities
│   └── shared/       # Shared types, schemas, validation
├── prisma/           # Database schema & migrations
├── docs/             # Technical & product documentation
└── deploy/           # Deployment scripts & configurations
```

### Tech Stack
- **Backend**: Node.js, Express, Prisma, PostgreSQL, Redis, JWT Auth
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Playwright E2E, Jest unit tests
- **Infrastructure**: Docker, Docker Compose
- **Monorepo**: PNPM workspaces

## 🚀 Quick Start Commands

### Essential Commands
```bash
# Development (runs all services)
pnpm dev

# Individual services
pnpm dev:db    # Start PostgreSQL + Redis
pnpm dev:api   # API server (port 3001)
pnpm dev:web   # Web app (port 5173)

# Building
pnpm build              # Build all apps
pnpm build:packages     # Build shared packages first
pnpm build:prod         # Production build

# Testing
pnpm test              # Run all tests
pnpm test:e2e          # Playwright E2E tests
pnpm lint              # ESLint + Prettier
pnpm type-check        # TypeScript compilation

# Database
pnpm db:migrate        # Run Prisma migrations
pnpm db:seed           # Seed database
pnpm db:studio         # Prisma Studio (port 5556)
```

## 🎯 Development Workflows

### 1. Feature Development
When adding new features:
```
1. Use TodoWrite tool to plan implementation steps
2. Check existing patterns in similar features
3. Follow the established architecture:
   - API: /apps/api/src/features/{feature}/
   - Frontend: /apps/web/src/pages/ or /components/
   - Types: /packages/shared/src/types/
4. Update Prisma schema if database changes needed
5. Add tests where appropriate
6. Run lint & type-check before committing
```

### 2. Bug Fixes
```
1. Reproduce issue in development environment
2. Use Grep/Glob tools to locate relevant code
3. Check git history for related changes
4. Apply minimal fix following existing patterns
5. Test fix thoroughly
6. Run full test suite
```

### 3. Database Changes
```
1. Update prisma/schema.prisma
2. Run: pnpm db:migrate
3. Update shared types if needed
4. Update API endpoints
5. Update frontend components
6. Test migration on fresh database
```

## 📁 Key File Locations

### API Structure
```
apps/api/src/
├── features/
│   ├── auth/          # Authentication & JWT
│   ├── dashboard/     # Dashboard data & analytics
│   ├── trips/         # Trip management
│   ├── parcels/       # Package management
│   ├── booking/       # Match & booking logic
│   └── wallet/        # Payments & transactions
├── lib/
│   ├── prisma.ts      # Database client
│   └── db.ts          # Database utilities
├── middleware/        # Auth, rate limiting, error handling
└── server.ts          # Express app setup
```

### Frontend Structure
```
apps/web/src/
├── pages/             # Route components
├── components/        # Reusable components
│   ├── ui/            # Design system components
│   ├── auth/          # Auth-specific components
│   └── dashboard/     # Dashboard components
├── hooks/             # Custom React hooks
├── lib/               # Utilities (API client, etc.)
├── context/           # React context providers
└── types/             # TypeScript type definitions
```

### Database
```
prisma/
├── schema.prisma      # Main database schema
├── migrations/        # Migration history
└── seeds/             # Seed data scripts
```

## 🔧 Common Tasks & Patterns

### Adding New API Endpoint
```typescript
// 1. Define in apps/api/src/features/{feature}/controllers/
export const getFeatureData = async (req: Request, res: Response) => {
  // Implementation
};

// 2. Add route in apps/api/src/features/{feature}/routes/
router.get('/api/feature', authenticateToken, getFeatureData);

// 3. Update API client in apps/web/src/lib/api.ts
export const fetchFeatureData = () => api.get('/api/feature');
```

### Adding New React Component
```typescript
// 1. Check existing components for patterns
// 2. Use TypeScript interfaces from packages/shared
// 3. Follow naming conventions (PascalCase)
// 4. Use design system components from components/ui/
// 5. Add to appropriate index.ts if creating in new directory
```

### Database Model Changes
```sql
-- 1. Update prisma/schema.prisma
-- 2. Generate migration: pnpm db:migrate
-- 3. Update shared types in packages/shared/src/types/
-- 4. Update API controllers to use new fields
-- 5. Update frontend components
```

## 🚦 Quality Gates

### Before Committing
- [ ] TypeScript compilation: `pnpm type-check`
- [ ] Linting passes: `pnpm lint`
- [ ] Tests pass: `pnpm test`
- [ ] Build succeeds: `pnpm build`
- [ ] E2E tests (if UI changes): `pnpm test:e2e`

### Code Standards
- Use TypeScript strict mode
- Follow existing code patterns and naming conventions
- Prefer existing utility functions over creating new ones
- Use shared types from packages/shared
- Follow React best practices (hooks, composition)
- Use Prisma for all database operations

## 🗃️ Important Context

### Authentication
- JWT-based auth with refresh tokens
- Session management via UserSession model
- Auth context in React app
- Protected routes use authentication middleware

### Database
- PostgreSQL with Prisma ORM
- Multi-tenant architecture (users, trips, packages, matches)
- Soft deletes where appropriate
- Proper indexing for performance

### Deployment
- Docker containerization
- Separate staging and production environments
- Environment-specific configurations
- Health check endpoints for monitoring

## 🎨 UI/UX Guidelines

### Design System
- Use components from `/components/ui/`
- Tailwind CSS for styling
- Responsive design (mobile-first)
- Accessibility compliance (WCAG guidelines)
- Framer Motion for animations

### User Experience
- Loading states for all async operations
- Error boundaries for graceful failure handling
- Proper form validation with user feedback
- Progressive Web App features

## 🐛 Debugging & Troubleshooting

### Common Issues
1. **Database Connection**: Check PostgreSQL is running (`pnpm dev:db`)
2. **API Errors**: Check server logs and database connectivity
3. **Build Failures**: Run `pnpm clean` and reinstall dependencies
4. **TypeScript Errors**: Ensure types are up-to-date after schema changes
5. **E2E Test Failures**: Verify app is running on correct ports

### Useful Debugging Commands
```bash
# Check database tables
pnpm db:studio

# View API logs
docker-compose -f docker-compose.dev.yml logs -f api

# Check service status
docker-compose -f docker-compose.dev.yml ps

# Clean build
pnpm clean && pnpm install
```

## 📋 Project Status & Context

### Current State
- **Architecture**: Monorepo with React frontend + Node.js API
- **Authentication**: JWT-based with session management
- **Database**: PostgreSQL with comprehensive Prisma schema
- **UI**: Professional design with animated components
- **Testing**: E2E testing with Playwright
- **Performance**: Optimized with code splitting and lazy loading

### Recent Major Changes
- Migrated from Drizzle to Prisma ORM
- Consolidated duplicate components (removed v1, kept v2)
- Implemented JWT authentication system
- Added comprehensive dashboard with analytics
- Enhanced mobile responsiveness
- Added PWA capabilities

### Key Features
- User authentication & profile management
- Trip posting and package sending
- Smart matching algorithm
- Real-time messaging
- Payment processing & escrow
- Review and rating system
- Dispute resolution
- Analytics and reporting

## 🎯 When Working on This Project

1. **Always use TodoWrite** for multi-step tasks
2. **Check existing patterns** before implementing new solutions
3. **Follow the established architecture** and file organization
4. **Run quality checks** before committing
5. **Update documentation** if making architectural changes
6. **Test thoroughly** across different user flows
7. **Consider mobile experience** for all UI changes

---

*This guide should be updated as the project evolves. When adding new major features or changing architecture, please update the relevant sections.*