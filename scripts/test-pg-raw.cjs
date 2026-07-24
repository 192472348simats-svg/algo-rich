const { Client } = require("pg");

const c = new Client({
  host: "aws-0-ap-southeast-1.pooler.supabase.com",
  port: 6543,
  user: "postgres.quftrkabzakcazbpnimb",
  password: process.env.DB_PASS || "C8iyRbyIV6EPHfwi",
  database: "postgres",
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

c.connect()
  .then(() => {
    console.log("✅ CONNECTED via raw pg!");
    return c.query("SELECT version()");
  })
  .then((r) => {
    console.log("✅ PG Version:", r.rows[0].version.split(" ").slice(0, 2).join(" "));
  })
  .catch((e) => {
    console.error("❌ Error:", e.message);
    console.error("   Code:", e.code);
  })
  .finally(() => c.end());
