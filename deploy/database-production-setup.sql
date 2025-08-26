-- AirBar Production Database Setup Script
-- =========================================
-- Run this script to initialize production database with proper security

-- Create production database user with limited privileges
CREATE USER airbar_prod WITH PASSWORD 'REPLACE_WITH_SECURE_PASSWORD';

-- Create production database
CREATE DATABASE airbar_production WITH 
  OWNER airbar_prod
  ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE 'en_US.UTF-8'
  TEMPLATE template0;

-- Grant necessary privileges
GRANT CONNECT ON DATABASE airbar_production TO airbar_prod;

-- Switch to production database
\c airbar_production;

-- Grant schema privileges
GRANT CREATE ON SCHEMA public TO airbar_prod;
GRANT USAGE ON SCHEMA public TO airbar_prod;

-- Grant sequence privileges (required for auto-increment fields)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO airbar_prod;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO airbar_prod;

-- Grant table privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO airbar_prod;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO airbar_prod;

-- Enable extensions for production features
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";     -- Encryption functions
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- Performance monitoring

-- Create backup user with read-only access
CREATE USER airbar_backup WITH PASSWORD 'REPLACE_WITH_BACKUP_PASSWORD';
GRANT CONNECT ON DATABASE airbar_production TO airbar_backup;
GRANT USAGE ON SCHEMA public TO airbar_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO airbar_backup;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO airbar_backup;

-- Security: Revoke public access
REVOKE ALL ON DATABASE airbar_production FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- Performance: Enable query statistics collection
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;

-- Connection and resource limits for production
ALTER USER airbar_prod CONNECTION LIMIT 50;
ALTER USER airbar_backup CONNECTION LIMIT 5;

-- Create indexes for performance (will be handled by Prisma migrations)
-- but add some database-level optimizations

-- Enable row-level security for enhanced data protection
ALTER DATABASE airbar_production SET row_security = on;

COMMIT;