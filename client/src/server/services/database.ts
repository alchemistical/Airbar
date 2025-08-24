import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

// Database configuration with optimized settings
const databaseConfig = {
  log:
    process.env.NODE_ENV === "development"
      ? (["query", "info", "warn", "error"] as const)
      : (["warn", "error"] as const),
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
  prisma.$use(async (params, next) => {
    const start = Date.now();
    const result = await next(params);
    const end = Date.now();

    queryCount++;
    totalQueryTime += end - start;

    // Log slow queries (>100ms)
    if (end - start > 100) {
      console.log(
        `🐌 Slow query detected: ${params.model}.${params.action} took ${end - start}ms`
      );
    }

    return result;
  });

  // Log performance stats every 100 queries
  prisma.$use(async (params, next) => {
    const result = await next(params);

    if (queryCount % 100 === 0) {
      console.log(
        `📊 Query performance: ${queryCount} queries, avg ${Math.round(totalQueryTime / queryCount)}ms`
      );
    }

    return result;
  });
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
