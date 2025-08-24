# Database Migration Procedures - Sprint 1

## Overview
Standardized procedures for database migrations using Prisma ORM with PostgreSQL.

## Migration System Setup

### Current Configuration
- **ORM**: Prisma v6.14.0
- **Database**: PostgreSQL (development: airbar_dev)
- **Migration Location**: `packages/db/migrations/` and `prisma/migrations/`
- **Schema Location**: `prisma/schema.prisma`

## Migration Commands

### Development Workflow

#### 1. Generate Prisma Client
```bash
# After schema changes, regenerate client
pnpm --filter @airbar/db db:generate
```

#### 2. Apply Schema Changes (Development)
```bash
# Push schema directly to dev database (no migration files)
pnpm --filter @airbar/db db:push

# Alternative: Create and apply migration (recommended for production)
pnpm --filter @airbar/db db:migrate
```

#### 3. Create New Migration
```bash
# When schema changes need to be persisted
pnpm --filter @airbar/db db:migrate

# This will:
# 1. Compare schema with database
# 2. Generate migration SQL
# 3. Apply migration
# 4. Update _prisma_migrations table
```

#### 4. View Database
```bash
# Open Prisma Studio
pnpm --filter @airbar/db db:studio
```

### Production Deployment

#### 1. Pre-deployment Validation
```bash
# Validate schema
npx prisma validate --schema=prisma/schema.prisma

# Generate migration SQL (dry run)
npx prisma migrate diff \
  --from-schema-datamodel=prisma/schema.prisma \
  --to-schema-datasource=prisma/schema.prisma
```

#### 2. Deploy Migration
```bash
# Apply pending migrations to production
npx prisma migrate deploy --schema=prisma/schema.prisma
```

#### 3. Post-deployment
```bash
# Generate fresh client in production
npx prisma generate --schema=prisma/schema.prisma
```

## Rollback Procedures

### Database Rollback Options

#### Option 1: Migration Rollback (Recommended)
```sql
-- Prisma doesn't support automatic rollback
-- Manual rollback by reversing migration SQL

-- Example: To rollback migration 20250823215720_init_production_schema
-- 1. Connect to database
-- 2. Run reverse SQL commands
-- 3. Delete migration record from _prisma_migrations

DELETE FROM "_prisma_migrations" 
WHERE migration_name = '20250823215720_init_production_schema';
```

#### Option 2: Database Restore (Emergency)
```bash
# Restore from backup
pg_restore -d airbar_dev backup_file.sql

# Resync Prisma migrations table
npx prisma migrate resolve --applied "MIGRATION_NAME"
```

#### Option 3: Schema Reset (Development Only)
```bash
# WARNING: This will delete all data
npx prisma migrate reset

# Follow prompts to confirm data loss
# This will:
# 1. Drop database
# 2. Create fresh database  
# 3. Apply all migrations
# 4. Run seed if configured
```

## Safety Procedures

### Pre-Migration Checklist
- [ ] **Backup Database**: Create backup before major changes
- [ ] **Test Migration**: Run on development/staging first
- [ ] **Review SQL**: Examine generated migration SQL
- [ ] **Check Dependencies**: Verify no breaking changes
- [ ] **Validate Schema**: Ensure schema is valid

### Backup Commands
```bash
# Create database backup
pg_dump airbar_dev > backup_$(date +%Y%m%d_%H%M%S).sql

# Create schema-only backup
pg_dump -s airbar_dev > schema_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Migration Testing
```bash
# Test migration on copy of production data
createdb airbar_test
pg_dump airbar_production | psql airbar_test

# Test migration
DATABASE_URL="postgresql://user:pass@localhost:5432/airbar_test" \
  npx prisma migrate deploy
```

## Common Migration Scenarios

### Adding New Table
1. Update `prisma/schema.prisma`
2. Run `pnpm --filter @airbar/db db:migrate`
3. Name migration descriptively (e.g., "add_user_preferences_table")

### Adding New Column
1. Add column to model in schema
2. Consider default values for existing records
3. Run migration
4. Update application code to use new column

### Removing Column (Breaking Change)
1. **Phase 1**: Make column nullable, deploy code that doesn't use column
2. **Phase 2**: Remove column from schema and run migration
3. This avoids downtime during deployment

### Renaming Column/Table
```prisma
// Use @@map and @map for database-level names
model User {
  newName String @map("old_name")
  @@map("users")
}
```

## Environment-Specific Configurations

### Development
- Use `db:push` for quick schema iteration
- Use `db:migrate` when changes need to be preserved
- Database resets are acceptable for data loss

### Staging
- Always use `db:migrate` 
- Test all migrations before production
- Mirror production data structure

### Production
- Only use `migrate deploy`
- Never use `db:push` or `migrate reset`
- Always backup before migrations
- Use blue-green deployment for zero downtime

## Monitoring and Validation

### Post-Migration Checks
```bash
# Verify migration applied
npx prisma migrate status

# Check database schema
\d+ table_name  # In psql

# Validate data integrity
SELECT COUNT(*) FROM critical_tables;
```

### Troubleshooting

#### Migration Failed
1. Check migration logs
2. Verify database connection
3. Check for schema conflicts
4. Review migration SQL for errors

#### Schema Drift Detected
```bash
# Reset migration state (development only)
npx prisma migrate reset

# Or resolve specific migration
npx prisma migrate resolve --applied "MIGRATION_NAME"
```

## Best Practices

### Schema Design
- Use descriptive model and field names
- Add comments for complex business logic
- Use appropriate data types
- Consider performance implications of indexes

### Migration Naming
- Use descriptive names: `add_user_kyc_fields`
- Include issue/feature numbers: `feat_123_payment_integration`
- Use consistent format: `YYYY-MM-DD_description`

### Code Integration
- Update application code after schema changes
- Update tests to reflect schema changes
- Document breaking changes in migration comments
- Use transactions for complex data migrations

This document provides the foundation for safe, reliable database migrations throughout the platform lifecycle.