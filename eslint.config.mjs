import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Seed scripts are plain Node.js CJS files — not part of the app bundle
    "prisma/seed.js",
    "prisma/seed-ds.js",
    "prisma/seed-patterns.js",
    "prisma/seed-problems.js",
    "prisma/seed-problems-v2.js",
  ]),
]);

export default eslintConfig;
