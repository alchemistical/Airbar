# Monorepo Duplication Audit - Sprint 2

## Executive Summary
🚨 **CRITICAL DUPLICATION FOUND**: Extensive code duplication across 4+ directory structures causing confusion, maintenance burden, and potential consistency issues.

## Major Duplications Identified

### 1. Complete Frontend Duplication
**CRITICAL ISSUE**: `client/` directory is identical duplicate of `apps/web/src/`

```
client/src/                     ↔ apps/web/src/
├── App.tsx                       ├── App.tsx
├── components/                   ├── components/
├── pages/                        ├── pages/
├── hooks/                        ├── hooks/
├── lib/                          ├── lib/
└── marketing/                    └── marketing/
```
**Impact**: Double maintenance, confusion about canonical source, 2x storage

### 2. Backend API Duplication  
**ISSUE**: Legacy `server/` directory duplicates `apps/api/src/`

```
server/                         ↔ apps/api/src/
├── controllers/                  ├── features/*/controllers/
├── middleware/                   ├── middleware/
├── routes/                       ├── features/*/routes/
├── db.ts                         ├── lib/db.ts
└── storage.ts                    └── lib/storage.ts
```
**Impact**: API logic scattered across two locations

### 3. Shared Code Triple Duplication
**CRITICAL**: Shared utilities exist in 3 locations

```
shared/                         ↔ packages/shared/src/    ↔ apps/api/src/shared/
├── auth-schema.ts                ├── auth-schema.ts        ├── auth-schema.ts
├── schema.ts                     ├── schema.ts             ├── schema.ts
└── auth-validation.ts            ├── schemas/              ├── cacheService.ts
                                  └── types/                └── [services...]
```
**Impact**: Triple maintenance, version drift risk

### 4. Configuration File Duplication

#### Root Level Config Chaos
```
# Multiple config files at root
├── tailwind.config.ts          # Duplicate of apps/web/tailwind.config.ts
├── vite.config.ts              # Duplicate of apps/web/vite.config.ts
├── vite.config.js              # Legacy version
├── postcss.config.js           # Duplicate of apps/web/postcss.config.js  
├── prettier.config.cjs         # Should be .prettierrc.json (Sprint 0)
└── vitest.config.ts            # Orphaned test config
```

#### Content Duplication
```
content/                        ↔ apps/web/content/
├── faq.json                      ├── faq.json
└── tokens.json                   └── tokens.json
```

### 5. Docker & Infrastructure Duplication
```
# Root level (legacy)           ↔ # Proper monorepo structure
├── docker-compose.dev.yml       ├── infra/compose.dev.yml
├── docker-compose.*.yml         ├── apps/api/Dockerfile
└── auth_migration.sql           ├── apps/web/Dockerfile
                                 └── infra/docker/
```

## Dependency Analysis

### Package.json Files
- ✅ `./package.json` - Root workspace config (correct)
- ✅ `apps/api/package.json` - API dependencies (correct)
- ✅ `apps/web/package.json` - Web dependencies (correct)
- ✅ `packages/shared/package.json` - Shared utilities (correct)
- ✅ `packages/db/package.json` - Database package (correct)
- ❌ No orphaned package.json files found

### TypeScript Configurations
- ✅ `tsconfig.base.json` - Base config (correct)
- ✅ `tsconfig.json` - Root project references (correct)
- ✅ Package-specific tsconfigs (correct)
- ❌ No orphaned tsconfig files

## Storage Impact Analysis

### Disk Usage by Duplication
```bash
# Estimated duplicated storage (excluding node_modules)
client/                     ~15MB
server/                     ~3MB
shared/                     ~2MB
apps/api/src/shared/        ~5MB
Root config files          ~500KB
Content duplication         ~100KB
TOTAL WASTE:                ~25MB
```

### Line Count Duplication
- **Frontend**: ~50,000 lines duplicated (client ↔ apps/web)
- **Backend**: ~8,000 lines duplicated (server ↔ apps/api)
- **Shared**: ~2,000 lines triple-duplicated
- **TOTAL**: ~60,000+ duplicated lines

## Risk Assessment

### HIGH RISK Issues
- 🚨 **Source of Truth**: Unclear which directory contains canonical code
- 🚨 **Version Drift**: Changes in one location not reflected in duplicates
- 🚨 **Development Confusion**: Developers editing wrong files
- 🚨 **Build Issues**: Multiple config files may conflict

### MEDIUM RISK Issues
- ⚠️ **Maintenance Burden**: Multiple locations to update
- ⚠️ **Deployment Complexity**: Unclear which files are used
- ⚠️ **Code Review**: Difficult to track changes across duplicates

## Current Monorepo Structure Assessment

### ✅ CORRECT Structure (Keep)
```
apps/
├── api/                    # API application
└── web/                    # Web application

packages/
├── shared/                 # Shared utilities & types  
└── db/                     # Database & Prisma client

docs/                       # Documentation
infra/                      # Infrastructure configs
```

### ❌ LEGACY Structure (Remove)
```
client/                     # DELETE: Duplicate of apps/web
server/                     # DELETE: Legacy API
shared/                     # DELETE: Superseded by packages/shared
content/                    # DELETE: Duplicate of apps/web/content
Root config files          # CONSOLIDATE: Move to appropriate packages
```

## Cleanup Strategy Priority

### Phase 1: Critical Duplications (HIGH PRIORITY)
1. **Remove `client/` directory** - Complete duplicate
2. **Remove `server/` directory** - Legacy API
3. **Remove root `shared/` directory** - Superseded by packages/shared
4. **Clean `apps/api/src/shared/`** - Use packages/shared instead

### Phase 2: Configuration Cleanup (MEDIUM PRIORITY)  
1. **Consolidate root config files** - Move to appropriate packages
2. **Remove duplicate content** - Use canonical source
3. **Clean up legacy build configs**

### Phase 3: Optimization (LOW PRIORITY)
1. **Dependency hoisting** - Move common deps to root
2. **Script standardization** - Consistent npm scripts
3. **Build optimization** - Remove unused configs

## Expected Benefits

### Storage Savings
- **~25MB** immediate disk space savings
- **~60,000** lines of code reduction
- **Faster** git operations and builds

### Developer Experience
- **Clear** source of truth for each module
- **Reduced** cognitive load
- **Faster** development cycles

### Maintenance
- **Single** location per feature
- **Consistent** versioning
- **Simplified** deployment

## Implementation Plan
1. **Backup verification** - Ensure no unique code in duplicate dirs
2. **Progressive removal** - Remove directories in safe order
3. **Import updates** - Fix any broken imports
4. **Build validation** - Ensure all packages still build
5. **Documentation update** - Update project structure docs

This cleanup is **essential for long-term maintainability** and will significantly improve developer experience.