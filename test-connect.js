// test-connect.js — MongoDB connectivity diagnostic
// Run with: node test-connect.js
const path = require("path");

// Load .env.local first (Next.js style), then .env fallback
try {
  require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });
} catch {
  // dotenv not installed — try to load manually
  const fs = require("fs");
  const envPath = path.resolve(__dirname, ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
    console.log("[env] Loaded .env.local manually");
  }
}

const { MongoClient } = require("mongodb");

(async () => {
  const uri = process.env.MONGODB_URI;
  const dbUrl = process.env.DATABASE_URL;

  console.log("=== Algo Rich — MongoDB Connectivity Diagnostic ===\n");
  console.log("MONGODB_URI present:", !!uri);
  console.log("DATABASE_URL present:", !!dbUrl);

  if (!uri) {
    console.error("\n[FATAL] MONGODB_URI is not set. Cannot continue.");
    process.exit(1);
  }

  console.log("MONGODB_URI length:", uri.length);

  // Detect special chars in password portion that need URL-encoding
  try {
    const parsed = new URL(uri);
    const password = parsed.password || "";
    const specialChars = [...new Set(password.split("").filter(c => /[@:%/#+?=&]/.test(c)))];
    console.log("URI host:", parsed.hostname);
    console.log("URI database:", parsed.pathname.replace("/", ""));
    console.log(
      "Password special chars needing URL-encoding:",
      specialChars.length > 0 ? specialChars.join(", ") : "none"
    );
  } catch (e) {
    console.warn("[warn] Could not parse URI as URL:", e.message);
  }

  console.log("\n--- Attempting MongoClient connection (timeout: 10s) ---");
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();
    console.log("[OK] client.connect() succeeded");

    const pingResult = await client.db().admin().command({ ping: 1 });
    console.log("[OK] ping result:", JSON.stringify(pingResult));

    const dbList = await client.db().admin().listDatabases({ nameOnly: true });
    const names = dbList.databases.map((d) => d.name);
    console.log("[OK] visible databases:", names.join(", ") || "(none)");
  } catch (err) {
    console.error("\n[FAIL] Connection error:");
    console.error("  message:", err && err.message ? err.message : String(err));
    console.error("  code   :", err && err.code);
    console.error("  name   :", err && err.name);
    if (err && err.cause) console.error("  cause  :", err.cause.message || err.cause);
    console.error("\nFull error:");
    console.error(err);
  } finally {
    await client.close().catch(() => {});
    console.log("\n[done] client closed");
  }
})();
