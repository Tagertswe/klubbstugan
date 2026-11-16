# Klubbstugan

The new website and member area for **Team Blekinge LF**, a running club in Karlskrona.
It replaces the club's SvenskaLag.se site with one place the club controls: a public site,
and later a member area with members-only news, a members' feed, a calendar with sign-ups,
results and documents.

The UI is in Swedish; the code, comments and commit messages are in English.

**Status:** the first slice of phase 1 is built: the public site in three themes (Klassisk,
Fart and Klubbdräkt), with unit, component and end-to-end tests. Login and the member area
are next. See [`docs/spec.md`](docs/spec.md) §9 for the plan and what works today.

## Stack

Nuxt 4 (Vue 3, TypeScript), Nitro server routes, PostgreSQL 17 with Prisma 7, Docker Compose.
Vitest for unit and component tests, Playwright (Chromium and WebKit, desktop and phone) for
end-to-end tests. No third-party scripts, no tracking, no cookie banner.

## Getting started

Needs Node 24 and Docker.

```bash
npm install                     # also generates the Prisma client
docker compose up -d db         # Postgres on 127.0.0.1:5433
export DATABASE_URL=postgresql://klubbstugan:klubbstugan@localhost:5433/klubbstugan
npx prisma migrate dev          # apply migrations
npx prisma db seed              # placeholder demo content
npm run dev                     # http://localhost:3000
```

Try the themes with `/?tema=fart` or `/?tema=klubbdrakt`.

## Tests

```bash
npm run lint
npm run typecheck
npm run test:coverage           # Vitest, with coverage thresholds
npm run test:e2e:local          # Playwright against a separate klubbstugan_e2e database
```

## Content packs

This repo holds only placeholder texts and images. A deploy's real content (news, events,
training groups, FAQ, sponsors, photos) is loaded from a **content pack**: a zip with a
`content.json` and a `media/` folder. Packs never contain member data.

```bash
npm run content -- check  pack.zip    # validate only
npm run content -- import pack.zip    # replace all site content with the pack
npm run content -- export pack.zip    # write the current content as a pack
```

`e2e/fixtures/content-pack/` is a small example. Club packs are kept out of the repo.

## Deploy

```bash
docker compose up -d --build
docker compose run --rm -v "$PWD/pack.zip:/tmp/pack.zip:ro" migrate \
  npm run -s content -- import /tmp/pack.zip
```

Set `DB_PASSWORD` and `NUXT_PUBLIC_SITE_URL` for the server; see `.env.example`.

## Documentation

- [`docs/spec.md`](docs/spec.md): the product spec, the source of truth for *what* to build.
- [`CLAUDE.md`](CLAUDE.md): how the repo is laid out, tested and deployed.
