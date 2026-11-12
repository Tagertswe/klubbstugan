#!/usr/bin/env bash
#
# Runs the Playwright suite locally against a throwaway database, as finishline
# does. Needs only `docker compose up -d db`. CI provisions its own database
# (.github/workflows/ci.yml, job `e2e`). Never touches the dev database.
#
# Extra arguments go to Playwright:
#   npm run test:e2e:local -- e2e/news.spec.ts
#   npm run test:e2e:local -- --project=phone
set -euo pipefail
cd "$(dirname "$0")/.."

DB_PORT="${DB_PORT:-5433}"
export DATABASE_URL="postgresql://klubbstugan:${DB_PASSWORD:-klubbstugan}@localhost:${DB_PORT}/klubbstugan_e2e"
export NUXT_DATABASE_URL="$DATABASE_URL"
export E2E_PORT="${E2E_PORT:-3200}"

if ! docker compose ps db --format '{{.Health}}' 2>/dev/null | grep -q healthy; then
  echo "Starting Postgres (docker compose up -d db)…"
  docker compose up -d db >/dev/null
  until docker compose ps db --format '{{.Health}}' | grep -q healthy; do sleep 1; done
fi

# A separate database for e2e, created on first run. Migrations are applied
# with `migrate deploy` (as in CI) and the seed replaces the demo data, so
# every run starts from the same state without dropping anything else.
if ! docker compose exec -T db psql -U klubbstugan -d postgres -tAc \
  "SELECT 1 FROM pg_database WHERE datname = 'klubbstugan_e2e'" | grep -q 1; then
  docker compose exec -T db createdb -U klubbstugan klubbstugan_e2e
fi
npx prisma migrate deploy >/dev/null
npx prisma db seed >/dev/null

exec npx playwright test "$@"
