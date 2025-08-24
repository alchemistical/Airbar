# Database Schema Audit Report - Sprint 1

## Executive Summary
🚨 **CRITICAL FINDING**: Dual ORM conflict detected - Prisma and Drizzle both present with conflicting schemas.
✅ **RECOMMENDATION**: Standardize on Prisma (more comprehensive, production-ready).

## Database Schema Analysis

### Current State Overview
The project has **two conflicting ORM setups**:

#### 1. Prisma ORM (Recommended - Production Ready)
- **Location**: `packages/db/`, `prisma/`
- **Schema**: `prisma/schema.prisma` (comprehensive)
- **Status**: ✅ Complete with proper relationships, enums, migrations
- **Migration**: Existing production migration dated 2025-08-23
- **Tables**: 15+ tables with full relationships

#### 2. Drizzle ORM (Legacy - Incomplete)
- **Location**: `packages/shared/src/schema.ts`, `drizzle.config.ts`
- **Schema**: Basic tables without proper relationships
- **Status**: ⚠️ Incomplete, mismatched with actual database
- **Migration**: No proper migration system
- **Tables**: 8 basic tables

## Critical Schema Conflicts

### Prisma Schema (Production)
```sql
-- Modern schema with:
- UUID primary keys (TEXT/cuid)
- Comprehensive enums (KYCStatus, LocationType, etc.)
- Proper relationships with foreign keys
- Advanced features (profiles, sessions, locations, etc.)
- 15+ tables with full business logic
```

### Drizzle Schema (Legacy)
```sql  
-- Basic schema with:
- Serial integer primary keys
- Text status fields (no enums)
- Missing relationships and constraints
- Only 8 basic tables
- Incomplete business logic
```

## Database Migration Status

### Prisma Migrations
- ✅ **packages/db/migrations/**: Properly structured migration
- ✅ **prisma/migrations/**: Identical production migration  
- ✅ **Migration Lock**: Proper versioning in place

### Drizzle Migrations
- ❌ **Root migrations/**: Empty/missing
- ❌ **No baseline migration**: Drizzle config points to non-existent migrations

## ORM Configuration Analysis

### Prisma Configuration
```json
// packages/db/package.json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push", 
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^6.14.0",
    "prisma": "^6.14.0"
  }
}
```

### Drizzle Configuration
```typescript
// drizzle.config.ts
export default defineConfig({
  out: "./migrations",
  schema: "./packages/shared/src/schema.ts", // MISMATCH!
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL }
});
```

## Code Dependencies Analysis

### API Dependencies
- Uses Drizzle imports in `apps/api/src/` files
- Database queries expect Drizzle schema structure
- Type definitions based on Drizzle types

### Shared Package Dependencies  
- `packages/shared/src/schema.ts` exports Drizzle definitions
- Type exports expect Drizzle structure
- Validation schemas based on Drizzle

## Risk Assessment

### HIGH RISK Issues
- 🚨 **Schema Mismatch**: Production DB uses Prisma schema, code expects Drizzle
- 🚨 **Migration Conflicts**: Two different migration systems
- 🚨 **Type Mismatches**: API code will fail with current production schema

### MEDIUM RISK Issues
- ⚠️ **Development Confusion**: Two ORMs confuse developers
- ⚠️ **Deployment Issues**: Unclear which schema to use in production
- ⚠️ **Data Integrity**: Risk of schema drift

## Recommended Resolution Strategy

### Option 1: Standardize on Prisma (RECOMMENDED)
**Advantages:**
- ✅ Production-ready comprehensive schema
- ✅ Proper migration system already in place
- ✅ Better TypeScript integration  
- ✅ More robust feature set
- ✅ Active development and community

**Required Changes:**
- Remove Drizzle configuration and schema files
- Update API code to use Prisma client
- Update shared types to use Prisma types
- Ensure all imports use Prisma

**Effort:** Medium (2-3 days)

### Option 2: Standardize on Drizzle (NOT RECOMMENDED)
**Disadvantages:**  
- ❌ Need to recreate comprehensive schema
- ❌ No existing production migration
- ❌ Less mature ecosystem
- ❌ Need to rebuild relationships and enums

**Effort:** High (1-2 weeks)

## Database Safety Status
- ✅ **Development Safety**: All DATABASE_URLs confirmed dev-only
- ✅ **Production Isolation**: Separate environment configurations
- ✅ **Backup Capability**: Migration rollback available

## Files Requiring Changes (Prisma Standardization)

### Files to Remove/Update:
- `drizzle.config.ts` - Remove
- `packages/shared/src/schema.ts` - Replace with Prisma types
- `apps/api/src/**/*.ts` - Update imports from Drizzle to Prisma
- Root `package.json` - Remove Drizzle dependencies

### Files to Keep:
- `prisma/schema.prisma` - Production schema
- `packages/db/` - Prisma client package  
- `packages/db/migrations/` - Production migrations

## Next Steps
1. **Decision Required**: Confirm Prisma standardization
2. **Create Migration Plan**: Detailed code update strategy
3. **Update Dependencies**: Remove Drizzle, ensure Prisma
4. **Test Migration**: Verify all functionality works
5. **Documentation Update**: Update all references

## Estimated Timeline
- **Planning**: 4 hours
- **Implementation**: 16-24 hours  
- **Testing**: 8 hours
- **Total**: 2-3 days

This standardization is **critical for production stability** and must be completed before any new feature development.