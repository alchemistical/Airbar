-- Initialize Airbar Database
-- This script runs automatically when the PostgreSQL container starts for the first time

\echo 'Starting Airbar database initialization...'

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Set timezone globally
ALTER DATABASE airbar_dev SET timezone TO 'UTC';

-- Grant permissions to the application user
GRANT ALL PRIVILEGES ON DATABASE airbar_dev TO airbar_user;

-- Create schemas for better organization
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Grant schema permissions
GRANT ALL ON SCHEMA auth TO airbar_user;
GRANT ALL ON SCHEMA app TO airbar_user; 
GRANT ALL ON SCHEMA analytics TO airbar_user;

-- Set search path for the user
ALTER USER airbar_user SET search_path = public, auth, app, analytics;

-- Create basic audit trail functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create session management table for development
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

-- Create index for session cleanup
CREATE INDEX IF NOT EXISTS idx_session_expire ON session(expire);

-- Grant permissions on session table
GRANT ALL ON TABLE session TO airbar_user;

\echo 'Airbar database initialization completed successfully!'