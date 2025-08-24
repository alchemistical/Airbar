import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

// Database configuration with optimized settings
const databaseConfig = {
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"] as any
      : ["warn", "error"] as any,
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

export const prisma = globalThis.__prisma || new PrismaClient(databaseConfig);

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

// Performance monitoring
let queryCount = 0;
let totalQueryTime = 0;

if (process.env.NODE_ENV === "development") {
  // TODO: Migrate from deprecated $use to $extends when needed
  // Performance monitoring can be implemented with $extends API in newer Prisma versions
  console.log("📊 Database performance monitoring available in development");
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("❌ Database health check failed:", error);
    return false;
  }
}

// Connection management
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Verify connection with health check
    const isHealthy = await checkDatabaseHealth();
    if (!isHealthy) {
      throw new Error("Database health check failed");
    }
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log("✅ Database disconnected successfully");
  } catch (error) {
    console.error("❌ Error disconnecting from database:", error);
  }
}

// Graceful shutdown handlers
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Gracefully shutting down...");
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Gracefully shutting down...");
  await disconnectDatabase();
  process.exit(0);
});

process.on("beforeExit", async () => {
  console.log("Process is about to exit. Cleaning up database connections...");
  await disconnectDatabase();
});

export default prisma;
