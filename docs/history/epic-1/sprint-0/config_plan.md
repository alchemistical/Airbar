# Configuration Cleanup Plan - Sprint 0

## Overview
This plan addresses the configuration inconsistencies identified in the audit while maintaining safety and avoiding breaking changes.

## Phase 1: Root Configuration Standardization

### 1.1 TypeScript Configuration Consolidation
```bash
# Update root tsconfig.json to reflect current monorepo structure
# Remove legacy client/ references
# Standardize path mappings for packages
```

**Files to modify:**
- `tsconfig.json` - Fix include paths and path mappings
- `drizzle.config.ts` - Update schema path to packages structure

### 1.2 Enable Strict TypeScript in API
```bash
# Update apps/api/tsconfig.json to enable strict mode
# Fix any type errors that emerge
# Align with web app standards
```

**Risk**: May reveal type errors that need fixing
**Mitigation**: Fix incrementally, one module at a time

## Phase 2: Centralized Tooling Configuration

### 2.1 Root ESLint Configuration
```bash
# Create .eslintrc.json at root
# Establish consistent linting rules across all packages
# Configure workspace-specific overrides
```

### 2.2 Root Prettier Configuration
```bash
# Standardize .prettierrc.json at root
# Ensure consistent formatting across codebase
# Update package.json lint-staged to use root config
```

## Phase 3: Environment Configuration Cleanup

### 3.1 Environment File Consolidation
- Keep `.env.development` as the primary dev config
- Update `.env.example` to match development template
- Ensure `.env` (local) doesn't conflict with development settings

### 3.2 Docker Configuration Verification
- Verify all docker-compose files use appropriate env files
- Ensure development containers use development credentials

## Phase 4: Build System Optimization

### 4.1 Package.json Scripts Audit
```bash
# Verify all workspace scripts function correctly
# Test build, lint, and type-check commands
# Ensure docker scripts use correct compose files
```

### 4.2 Dependency Cleanup
```bash
# Check for duplicate dependencies across packages
# Hoist common dependencies to root where appropriate
# Remove unused dependencies
```

## Implementation Commands

### Root TypeScript Fix:
```bash
# 1. Update root tsconfig.json paths
cat > tsconfig.json << 'EOF'
{
  "extends": "./tsconfig.base.json",
  "include": [],
  "references": [
    { "path": "./apps/api" },
    { "path": "./apps/web" },
    { "path": "./packages/shared" },
    { "path": "./packages/db" }
  ]
}
EOF
```

### Drizzle Configuration Fix:
```bash
# 2. Update drizzle.config.ts schema path
sed -i 's|"./shared/schema.ts"|"./packages/shared/src/schema/index.ts"|' drizzle.config.ts
```

### API TypeScript Strictness:
```bash
# 3. Enable strict mode in API
sed -i 's/"strict": false/"strict": true/' apps/api/tsconfig.json
sed -i 's/"noImplicitAny": false/"noImplicitAny": true/' apps/api/tsconfig.json
sed -i 's/"strictNullChecks": false/"strictNullChecks": true/' apps/api/tsconfig.json
```

### Root ESLint Config:
```bash
# 4. Create root ESLint configuration
cat > .eslintrc.json << 'EOF'
{
  "root": true,
  "extends": ["@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json"]
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  },
  "overrides": [
    {
      "files": ["apps/web/**/*"],
      "extends": ["plugin:react/recommended", "plugin:react-hooks/recommended"]
    }
  ]
}
EOF
```

### Root Prettier Config:
```bash
# 5. Create root Prettier configuration  
cat > .prettierrc.json << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF
```

## Validation Steps

### 1. TypeScript Compilation
```bash
pnpm type-check  # Should pass without errors
```

### 2. Linting
```bash
pnpm lint  # Should pass with new standards
```

### 3. Build Process
```bash
pnpm build  # Should complete successfully
```

### 4. Development Environment
```bash
pnpm dev  # Should start all services
```

### 5. Database Connection Test
```bash
# Test database connectivity with updated configs
pnpm db:studio  # Should connect to development database
```

## Rollback Plan

If issues arise:
```bash
git checkout -- tsconfig.json drizzle.config.ts apps/api/tsconfig.json
git clean -fd  # Remove any new config files
```

## Success Criteria

- ✅ All TypeScript configurations use consistent, strict settings
- ✅ Build and type-check commands pass without errors
- ✅ Development environment starts successfully
- ✅ Database connections work with updated configurations
- ✅ Linting passes with centralized configuration
- ✅ No breaking changes to existing functionality

## Timeline

- **Phase 1**: 30 minutes (TypeScript fixes)
- **Phase 2**: 20 minutes (Tooling configs) 
- **Phase 3**: 15 minutes (Environment cleanup)
- **Phase 4**: 15 minutes (Build verification)
- **Total**: ~90 minutes

## Dependencies

- All changes confined to configuration files
- No external service dependencies
- Can be executed in isolated branch
- Minimal risk of breaking existing functionality