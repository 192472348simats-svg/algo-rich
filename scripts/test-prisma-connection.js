/**
 * Database Connection Test Script
 * 
 * Purpose: Verify Neon PostgreSQL connectivity via Prisma
 * Usage:   npm run db:test
 *          OR: node scripts/test-prisma-connection.js
 * 
 * This script tests both DATABASE_URL and DIRECT_URL to help diagnose connection issues.
 * Works with Windows PowerShell (no shell escaping needed).
 */

const { PrismaClient } = require("@prisma/client");
const path = require("path");

// Load environment from .env.local (local dev) or .env (fallback)
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function testConnection() {
  console.log("================================================");
  console.log("  DATABASE CONNECTION TEST");
  console.log("================================================\n");

  console.log("Environment loaded:");
  console.log(`  Node: ${process.versions.node}`);
  console.log(`  NODE_ENV: ${process.env.NODE_ENV || "development"}`);
  console.log(`  DATABASE_URL: ${maskUrl(process.env.DATABASE_URL)}`);
  console.log(`  DIRECT_URL: ${maskUrl(process.env.DIRECT_URL)}`);
  console.log("");

  // Test 1: DATABASE_URL (typically pooler for production, direct for local)
  console.log("TEST 1: DATABASE_URL (runtime connection)");
  console.log("-".repeat(50));
  const prismaDatabaseUrl = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

  try {
    const startTime = Date.now();
    const result = await prismaDatabaseUrl.$queryRawUnsafe("SELECT NOW() as timestamp");
    const duration = Date.now() - startTime;

    console.log(`✓ SUCCESS (${duration}ms)`);
    console.log(`  Query: SELECT NOW()`);
    console.log(`  Result: ${result[0]?.timestamp}`);
  } catch (error) {
    console.log("✗ FAILED");
    console.log(`  Error: ${error.message.split("\n")[0]}`);
  } finally {
    await prismaDatabaseUrl.$disconnect();
  }

  console.log("");

  // Test 2: DIRECT_URL (always direct connection, used for migrations)
  console.log("TEST 2: DIRECT_URL (direct connection)");
  console.log("-".repeat(50));
  const prismaDirect = new PrismaClient({
    datasources: {
      db: { url: process.env.DIRECT_URL },
    },
  });

  try {
    const startTime = Date.now();
    const result = await prismaDirect.$queryRawUnsafe("SELECT NOW() as timestamp");
    const duration = Date.now() - startTime;

    console.log(`✓ SUCCESS (${duration}ms)`);
    console.log(`  Query: SELECT NOW()`);
    console.log(`  Result: ${result[0]?.timestamp}`);
  } catch (error) {
    console.log("✗ FAILED");
    console.log(`  Error: ${error.message.split("\n")[0]}`);
  } finally {
    await prismaDirect.$disconnect();
  }

  console.log("");
  console.log("================================================");
  console.log("TROUBLESHOOTING TIPS:");
  console.log("================================================");
  console.log("If both tests fail:");
  console.log("  1. Check Neon project status: https://neon.tech");
  console.log("  2. Verify credentials in .env.local haven't changed");
  console.log("  3. If on VPN/corporate network:");
  console.log("     - Port 5432 might be blocked");
  console.log("     - Try connecting via different network (phone hotspot)");
  console.log("  4. Check .env.local has DATABASE_URL and DIRECT_URL");
  console.log("");
  console.log("If DATABASE_URL fails but DIRECT_URL succeeds:");
  console.log("  - Pooler connection is blocked (expected on some networks)");
  console.log("  - Use DIRECT_URL for local dev (already set in .env.local)");
  console.log("");
  console.log("For Vercel deployment:");
  console.log("  - DATABASE_URL should use pooler (...-pooler...)");;
  console.log("  - DIRECT_URL should use direct (no -pooler)");
  console.log("  - Set both in Vercel dashboard → Settings → Environment Variables");
  console.log("");
}

/**
 * Mask sensitive parts of connection URL for safe logging
 */
function maskUrl(url) {
  if (!url) return "(not set)";
  const matches = url.match(/postgresql:\/\/(.+?):(.*?)@/);
  if (matches) {
    const [, user, password] = matches;
    return url.replace(
      `${user}:${password}@`,
      `${user}:${"*".repeat(Math.min(8, password.length))}@`
    );
  }
  return url.substring(0, 60) + "...";
}

// Run tests
testConnection().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
