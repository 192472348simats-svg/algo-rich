import nextVitals from "eslint-config-next/core-web-vitals.js";

const eslintConfig = [
  nextVitals,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "prisma/seed.js",
      "prisma/seed-ds.js",
      "prisma/seed-patterns.js",
      "prisma/seed-problems.js",
      "prisma/seed-problems-v2.js",
    ],
  },
];

export default eslintConfig;
