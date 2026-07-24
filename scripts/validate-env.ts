/**
 * Environment Variable Validation Script
 * 
 * Ensures all required environment variables are set and have correct formats
 * before starting the development server or building the application.
 */

import { parse, config } from "dotenv";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// Load .env.local first
config({ path: ".env.local" });

const requiredVars = [
  "DATABASE_URL",
  "DIRECT_URL",
  "AUTH_SECRET",
  "NEXTAUTH_URL",
  "ADMIN_EMAILS",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY"
];

function validate() {
  console.log("🔍 Validating environment variables...");
  
  // Try to load from .env file first
  let envVars: Record<string, string> = { ...process.env } as Record<string, string>;
  try {
    const envFile = readFileSync(join(process.cwd(), ".env"), "utf-8");
    const parsed = parse(envFile);
    envVars = { ...envVars, ...parsed };
  } catch (err) {
    // .env file might not exist in some environments (e.g. CI), that's okay
  }

  const missing = requiredVars.filter(v => !envVars[v]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  }

  // Format validations
  if (!envVars.DATABASE_URL.startsWith("postgresql://") && !envVars.DATABASE_URL.startsWith("postgres://")) {
    console.error("❌ DATABASE_URL must be a valid PostgreSQL connection string.");
    process.exit(1);
  }

  if (envVars.AUTH_SECRET.length < 32) {
    console.error("❌ AUTH_SECRET should be at least 32 characters long for security.");
    process.exit(1);
  }

  try {
    new URL(envVars.NEXTAUTH_URL);
  } catch (err) {
    console.error("❌ NEXTAUTH_URL must be a valid URL.");
    process.exit(1);
  }

  const adminEmails = envVars.ADMIN_EMAILS.split(",").map(e => e.trim());
  const invalidEmails = adminEmails.filter(e => !e.includes("@") || !e.includes("."));
  if (invalidEmails.length > 0) {
    console.error("❌ ADMIN_EMAILS contains invalid email formats:", invalidEmails.join(", "));
    process.exit(1);
  }

  console.log("✅ Environment validation successful.");
}

validate();
