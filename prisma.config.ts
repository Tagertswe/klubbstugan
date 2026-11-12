import { defineConfig } from "prisma/config";

// Prisma 7 no longer reads .env by itself. DATABASE_URL comes from the shell,
// docker compose, CI or scripts/e2e-local.sh. `prisma generate` does not need
// a reachable database, so a placeholder keeps `npm install` working without one.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://placeholder@localhost:5432/placeholder",
  },
});
