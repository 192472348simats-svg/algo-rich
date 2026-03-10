import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Creates a PrismaClient instance with the appropriate adapter.
 *
 * - In production or when USE_NEON_ADAPTER=true, uses the Neon serverless
 *   adapter (@prisma/adapter-neon) for optimal performance on serverless
 *   platforms (e.g. Vercel + Neon).
 * - In all other environments (local dev), uses the standard PrismaClient
 *   with a direct connection (supports SQLite or PostgreSQL via DATABASE_URL).
 */
function createPrismaClient() {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.USE_NEON_ADAPTER === "true"
  ) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL environment variable is not set. " +
          "Provide a Neon PostgreSQL connection string to start the application."
      );
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter });
  }
  // Standard client for local development
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
