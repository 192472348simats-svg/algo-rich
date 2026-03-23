// test-connect.js — Neon Postgres connectivity diagnostic through Prisma

require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

function redactConnectionString(value) {
  if (!value) return "<missing>";

  try {
    const parsed = new URL(value);
    if (parsed.password) {
      parsed.password = "***";
    }
    if (parsed.username) {
      parsed.username = `${parsed.username.slice(0, 2)}***`;
    }
    return parsed.toString();
  } catch {
    return "<unparseable-uri>";
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  console.log("=== Algo Rich — Neon Postgres Connectivity Diagnostic ===\n");
  console.log("DATABASE_URL present:", !!databaseUrl);
  console.log("DIRECT_URL present:", !!directUrl);

  if (!databaseUrl) {
    console.error("\n[FATAL] DATABASE_URL is not set. Cannot continue.");
    process.exit(1);
  }

  if (!directUrl) {
    console.warn("\n[WARN] DIRECT_URL is not set. Migrations will fail even if runtime queries work.");
  }

  console.log("DATABASE_URL:", redactConnectionString(databaseUrl));
  if (directUrl) {
    console.log("DIRECT_URL:", redactConnectionString(directUrl));
  }

  const prisma = new PrismaClient();

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("\n[SUCCESS] Connected to Postgres and executed SELECT 1.");
    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("\n[FAIL] Could not connect to Postgres.");
    console.error("Message:", message);
    process.exit(2);
  } finally {
    await prisma.$disconnect();
  }
}

main();
