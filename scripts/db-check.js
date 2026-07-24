const { PrismaClient } = require("@prisma/client");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const DB_URL = process.env.DATABASE_URL;
const DIRECT_URL = process.env.DIRECT_URL;

function extractHost(url) {
  try { return new URL(url).hostname; } catch { return url; }
}

console.log("\n=== DB CONNECTION CHECK ===");
console.log("DATABASE_URL host :", DB_URL ? extractHost(DB_URL) : "NOT SET");
console.log("DIRECT_URL host   :", DIRECT_URL ? extractHost(DIRECT_URL) : "NOT SET");
console.log("");

async function tryConnect(label, url) {
  console.log("Testing: " + label);
  const client = new PrismaClient({ datasources: { db: { url } } });
  const start = Date.now();
  try {
    const res = await client.$queryRawUnsafe("SELECT NOW() as ts, version() as v");
    console.log("  ✅ SUCCESS in " + (Date.now() - start) + "ms");
    console.log("  Time: " + res[0].ts);
    console.log("  PG  : " + String(res[0].v).slice(0, 60));
    const users = await client.$queryRawUnsafe("SELECT COUNT(*) as n FROM \"User\"");
    console.log("  Users in DB: " + users[0].n);
  } catch (err) {
    console.log("  ❌ FAILED in " + (Date.now() - start) + "ms");
    console.log("  Code   : " + (err.code || "N/A"));
    console.log("  Message: " + err.message);
    if (err.meta) console.log("  Meta   :", JSON.stringify(err.meta));
  } finally {
    await client.$disconnect();
  }
  console.log("");
}

(async () => {
  await tryConnect("DATABASE_URL (pooler)", DB_URL);
  await tryConnect("DIRECT_URL", DIRECT_URL);
})();
