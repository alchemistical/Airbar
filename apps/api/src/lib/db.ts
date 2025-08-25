// Re-export Prisma client for legacy compatibility
// TODO: Migrate all imports to use prisma.ts directly
import { prisma, connectToDatabase, checkDatabaseHealth } from './prisma';

if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV !== "development") {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?"
    );
  }
  // Use a mock database URL for development
  process.env.DATABASE_URL = "postgresql://localhost:5432/airbar_dev";
}

// Legacy export for backward compatibility
export const db = prisma;
export { prisma, connectToDatabase, checkDatabaseHealth };
