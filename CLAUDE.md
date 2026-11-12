# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Klubbstugan** (working name, repo `klubbstugan`) is the new website and member area for
Team Blekinge LF, a running club in Karlskrona. It replaces the club's
SvenskaLag.se site with one place the club controls: a public site, a member area with
members-only news and Klubbflödet (a members' feed for runs, photos and questions that
replaces the Facebook group), structured club data
(calendar with sign-up, training plans, results with computed records, relay teams,
documents), and notifications so nobody has to check a feed.

It is the third sibling in a family of club tools: **startskottet** (marketing; fires the
starting gun), **finishline** (`~/repos/finishline`, race photo collection), and this one,
the clubhouse where members meet.

**Status (2026-11-09):** the first slice of phase 1 is built: the public site in three themes, with
tests (spec §9.1 lists what works and what does not yet). The product spec `docs/spec.md` is the
source of truth for *what* to build; this file is the source of truth for *how the repo is laid
out, tested and deployed*. Read both before building.

**Spec before code.** Writing or changing `docs/spec.md` (or a change spec under `docs/`)
is never by itself permission to implement it. Implement only when explicitly told to.

## Boundaries (spec §6.1, decision 11, preliminary)

Three concerns, three homes, loosely coupled:

| Concern | Lives in | This repo's role |
|---|---|---|
| Member register (membership) | **This repo, for now** (decided 2026-11-09; decision 11 set aside) | Own register: name, contact details, member type, status. A migration from SvenskaLag/Idrottsarenan may come later, so keep an import path. **Never stores personal identity numbers**, no field for them, ever |
| LOK-stöd reporting | Idrottsarenan | Keeps attendance for its own use and municipal grants; may push LOK activities via RF API later |
| Everything else on the website | **This repo** | Public site, member area, news, Klubbflödet, events, results, documents, group e-mail |

- Own login: e-mail one-time link plus optional passkeys. Members do not use IdrottsID
  today and must not need Freja+ to read members' news. "Log in with IdrottsID" is a possible
  later add-on, never a requirement.
- RF APIs are not open to individual clubs yet. Keep any RF integration behind one module
  (`server/utils/rf/`) with a manual CSV import as the default implementation.
- No chat of any kind (decided). Nyheter (official news, public or members-only) and
  Klubbflödet (members' posts and löprundor) both use posts with comments; no live
  messaging, no direct messages.

**Deployment target for now:** a demo at `https://klubbstugan.appzma.com`, on a server a club
member provides (spec §10, decisions 2 and 8). The goal is to demonstrate a replacement for the
current site; production hosting and the move of `teamblekinge.nu` come later.
`teamblekinge.appzma.com` is a fellow member's separate demo (design inspiration for the Fart
theme), not this repo.

## Stack

**Nuxt 4 (Vue 3, TypeScript, Composition API, `<script setup>`) + Nitro server routes +
PostgreSQL + Prisma + Docker Compose.** This is finishline's Next.js shape translated to
Vue: one repo, one app, frontend and backend side by side, server-rendered pages.

Versions in use: Node 24, Nuxt 4.6, Vue 3.5, Prisma 7.10 with `@prisma/adapter-pg`,
PostgreSQL 17, Vitest 5, Playwright 1.65, TypeScript 6.0.

- **Prisma.** Pin `prisma` and `@prisma/client` to the same 7.x version. npm's `latest` tag on
  `prisma` points at an 8.0 pre-release.
- **TypeScript.** Stay on 6.x: TypeScript 7 is the native compiler and `vue-tsc` does not
  support it yet.

Why these choices rather than copying finishline one to one:

- **Nuxt, not a Vite SPA plus a separate API.** Public pages must be server-rendered for
  search engines (spec §5.9, member survey F1) and fast on phones, and the theme must be in
  the first byte of HTML. Nuxt gives SSR, file routing and a backend (`server/`) in one
  deploy, like Next.js does for finishline.
- **PostgreSQL, not SQLite** (finishline uses SQLite). This app has many tables, concurrent
  writers (comments, sign-ups), and needs full-text search over news, feed and documents
  (`to_tsvector('swedish', …)`). Postgres runs in Compose, port bound to 127.0.0.1.
- **Prisma Migrate, not `db push`.** Real member data lives here for years; schema changes
  go through committed migrations (`prisma migrate dev` locally, `prisma migrate deploy` in
  the `migrate` service and CI).
- **Prisma 7 specifics:**
  - `prisma.config.ts` holds the schema path, the migrations path, the seed command
    (`tsx prisma/seed.ts`) and the database URL.
  - Prisma 7 does **not** read `.env`: `DATABASE_URL` must be in the environment.
  - The `prisma-client` generator writes to `server/generated/prisma` (git-ignored, created by
    `postinstall`).
  - The client is created with `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`
    in `server/utils/db.ts` (`useDb()`). The app reads the URL from `NUXT_DATABASE_URL`
    (runtime config), falling back to `DATABASE_URL`.
- **Auth (next step, not built):** `nuxt-auth-utils` (sealed cookie sessions, built-in
  WebAuthn for passkeys) plus our own magic-link flow: a random token, stored hashed with expiry
  (15 min) and single use, sent by e-mail.
- **E-mail (not built):** SMTP via `nodemailer` to an EU transactional provider with
  SPF/DKIM/DMARC on the club domain. Mailpit captures all mail in development and e2e.
- **UI:** plain Vue components and CSS custom properties; no component framework. Fonts
  self-hosted via `@fontsource/inter` and `@fontsource/barlow-condensed` (no Google Fonts, no
  third-party scripts, no cookie banner; spec §7).
- **Validation:** `zod` (v4) for query and body parsing in API handlers
  (`getValidatedQuery(event, Schema.parse)`); shared schemas go in `shared/`.
- **Swedish UI, English code.** All user-facing text in Swedish; identifiers, comments and
  commit messages in English.

Conventions carried over from finishline:
- Node 24, `~/*`/`@/*` aliases (Nuxt defaults), and `#shared/*` for `shared/`.
- Server-only logic is never imported from `app/`. Types the app needs live in `shared/types/`.
- ESLint flat config (`@nuxt/eslint`).
- Unit tests next to the code as `*.test.ts`, except component tests (see Testing).
- `MOCK_*` env flags so e2e never calls real external services.

## Repository layout

```
app/                        # Frontend (Nuxt 4 srcDir)
  app.vue                   # Sets <html data-theme> from useTheme()
  error.vue                 # Helpful 404 / error page inside the normal layout
  layouts/default.vue       # Skip link, header, main#innehall, footer, bottom bar, phone menu
  pages/                    # index, nyheter/ (index, [slug]), kalender, traning, prova-pa,
                            #   tavla/ (index, [slug]), foreningen, fragor, logga-in (placeholder),
                            #   flodet + dokument (redirect to login until auth exists)
  components/               # SiteHeader, MainMenu, MobileMenu, BottomBar, SiteFooter, ThemeSwitch,
                            #   HeroSection, PinnedStrip, NewsCard, TrainingWeek, ActivityList,
                            #   RaceCard, FaqList, SponsorRow, CountdownBox, DateTile, PageTitle,
                            #   AppIcon, TitleMarker, decorations: SpeedLines, KitStripes
  composables/useTheme.ts   # Theme id (useState "theme") and its config
  plugins/theme.server.ts   # Copies the server's theme decision into state before render
  plugins/hydrated.client.ts# Sets <html data-hydrated> once Vue has hydrated (e2e waits for it)
  assets/css/               # tokens.css (brand), themes/{klassisk,fart,klubbdrakt}.css, base.css
server/                     # Backend (Nitro)
  api/                      # health, home, news/ (index, [slug]), events/, races/ (index, [slug]),
                            #   training, faq. Later: auth/, feed/, documents/, results/, admin/, cron/
  routes/                   # robots.txt, sitemap.xml, nyheter/rss.xml
  middleware/               # 01.legacy-redirects (301 from old SvenskaLag paths), 02.theme
  utils/                    # db.ts (useDb), news.ts, schedule.ts, settings.ts — pure logic unit tested
  generated/prisma/         # Generated Prisma client (git-ignored)
shared/
  utils/                    # themes, navigation (menu + bottom bar), dates (Stockholm time),
                            #   text (slugify, paragraphs), legacy (old URL mapping), contrast (WCAG)
  types/content.ts          # API response shapes used by app/ and server/
prisma/
  schema.prisma
  migrations/               # Committed migrations (first: init)
  seed.ts                   # Demo data for dev and e2e, written as a content pack (no real member data, ever)
prisma.config.ts            # Prisma 7 config: schema, migrations, seed, DATABASE_URL
e2e/                        # Playwright specs + helpers.ts (axe, gotoReady, useThemeFor)
test/
  *.test.ts                 # Cross-cutting unit tests (theme tokens and contrast)
  nuxt/                     # Component and composable tests (Nuxt environment) + helpers.ts
public/img/                 # Club mark, wordmark, photos without identifiable people, partners/ (sponsor
                            #   logos), placeholder/ (neutral SVGs used until a content pack is imported)
docs/spec.md                # Product spec (source of truth for what to build)
scripts/e2e-local.sh        # Playwright locally against a throwaway database
scripts/content.ts          # Content packs: check | import | export (npm run content -- …)
content-packs/              # Private packs with the club's real photos (git- and docker-ignored)
e2e/fixtures/               # uploads/ for the /media test, content-pack/ for the CI import smoke test
.github/workflows/ci.yml
Dockerfile, .dockerignore, docker-compose.yml, .env.example, tsconfig.json (references .nuxt/*)
```

## Data model

Built (first migration `init`):
- `SiteSetting` (key/value: `theme`, `training.time`, `training.place`).
- `Member` (name, e-mail, member type, status, `themePreference`).
- `NewsCategory` (default visibility) and `NewsItem` (public or members, `publishedAt`,
  `unpublishAt`, `pinnedUntil`, plain-text body).
- `Event` (type TRAINING/RACE/CLUB/OTHER, visibility).
- `TrainingGroup` (accent `ink` | `orange` | `purple`) and `TermPlanRow` (date-only).
- `FaqItem` (topic, `showOnHome`) and `Sponsor`.

To come, from spec §5:

- **Identity & access:** `LoginToken` (hashed, expiry, used), `Passkey`, `Role` assignments
  (member, organiser, moderator, coach, results manager, board, admin), `Group`
  (Torsdagsgruppen, Tränare) with membership, `MemberImport` log; `Member` gains phone,
  optional `rfPersonId`, `publishResults`.
- **News:** `NewsItem` gains optional `eventId`/`documentId`; `Comment` (one reply level),
  `Like`, `Follow`, `ReadMarker`.
- **Klubbflödet:** `FeedPost` (text, media, link; optional group), `RunPost` details (date,
  time, place, distance, pace) with `RunParticipant` ("Jag hänger med"), comments and likes
  shared with news, `Report`.
- **Notifications:** per-member, per-news-category preference plus feed settings (immediate,
  daily, weekly, off; e-mail, web push), `PushSubscription`, `OutboundEmail`.
- **Events:** `Place`, `SignUp` with `SignUpQuestion`/answers, waiting list,
  `VolunteerShift`, `Attendance` (LOK flag), relay `Team` / `Leg` assignments.
- **Results:** `Race`, `Result` (distance, discipline, time, places, source), approval state;
  year-best and all-time lists are computed, never stored by hand.
- **Content:** `Page` (owner role, review date, status) with `PageVersion` (draft, published,
  history), `Fact` (shared values such as fee and training times), `Award`, `Album` (links),
  `Folder` / `Document` (access level, stable slug, versions), `LegacyRedirect` (old SvenskaLag
  path to new path; today the mapping is code in `shared/utils/legacy.ts`).

Dates: instants are stored in UTC and shown in Europe/Stockholm (`shared/utils/dates.ts`).
`TermPlanRow.date` is a date-only column and is compared by calendar date (`dateOnlyKey`), never
by instant.

## Design tokens and themes (spec §5.8, §5.8.1)

Brand tokens in `app/assets/css/tokens.css`, shared by every theme:

```css
--tb-ink: #221E1F;        /* header, primary text, dark buttons */
--tb-orange: #EE8915;     /* accent backgrounds; dark text on it, never white */
--tb-orange-text: #A85400;/* orange for text and links on white (4.5:1) */
--tb-purple: #5B2A86;     /* second accent; white text on it */
--tb-purple-deep: #3B1A5A;
--tb-surface: #FFFFFF;
--tb-ground: #F4F2F0;
--tb-line: #E4E0DC;
--tb-muted: #5F5754;
```

Mobile first from 360 px, bottom bar below 1024 px, grouped top menu from 1024 px, tap
targets at least 44 px, WCAG 2.2 AA.

Three themes: `klassisk` (default), `fart` and `klubbdrakt`. The markup is shared, and each theme
is **CSS custom properties plus a small config**. A theme never needs its own pages or components.

- **Semantic tokens**, set per theme in `app/assets/css/themes/<id>.css` under
  `:root[data-theme="<id>"]`. `klassisk.css` also sets them on plain `:root`, as the fallback.
  - Colours: `--c-bg`, `--c-surface`, `--c-text`, `--c-muted`, `--c-line`, `--c-link`,
    `--c-accent`, `--c-on-accent`, `--c-brand-2`, `--c-on-brand-2`, `--c-header-*`, `--c-hero-*`,
    `--c-band-*`, `--c-label-*`, `--c-footer-*`.
  - Fonts: `--font-body`, `--font-display`, `--display-case`, `--display-weight`,
    `--display-tracking`.
  - Shape: `--radius-card`, `--radius-button`, `--radius-label`, `--skew`, `--tilt`,
    `--edge-start`, `--edge-end` (slanted section edges via `clip-path`; 0 means straight),
    `--card-shadow`.

  Components use semantic tokens. They use brand tokens only for fixed club colours, such as
  the training group colours and the kit stripes. They never use raw hex values.
- **Registry:** `shared/utils/themes.ts` (`THEMES`, `THEME_IDS`). Per theme it holds:
  - the Swedish name and description;
  - `heroVariant` (`split` | `fullBleed`) and `newsCardVariant` (`side` | `overlay`);
  - which decorations are on (`sectionEdges`, `speedLines`, `kitStripes`).
- **Decorations** are `aria-hidden` components that render nothing when the theme turns them off:
  - `<SpeedLines>`: a background pattern, not separate elements. Rotated elements behind text
    break axe's contrast check and can cross text on phones.
  - `<KitStripes>`.
  - `<TitleMarker>`: the mark before headings.

  Slanted section edges are pure CSS through `--edge-end`.
- **Choosing the theme:** server middleware `02.theme` decides, using `resolveTheme()`:
  1. `?tema=`, only when `runtimeConfig.public.themeSwitch` is on. It sets the `tema` cookie and
     redirects (303) to the same address without the parameter.
  2. The `tema` cookie.
  3. The member's saved preference (once login exists).
  4. `SiteSetting.theme`, cached for 60 s.
  5. `NUXT_DEFAULT_THEME`.
  6. `klassisk`.

  `plugins/theme.server.ts` copies the result into state, and `app.vue` writes `<html data-theme>`,
  so the server render is already right and nothing flashes. The footer `ThemeSwitch` uses plain
  links (full reload), not client navigation.
- **Fonts:** Barlow Condensed is bundled, but browsers only download it when Klubbdräkt uses it.

## Testing

Every new or changed piece of code gets unit tests where feasible, and every user-facing
flow gets Playwright coverage. A change is not done until `npm run test:coverage`,
`npm run lint`, `npm run typecheck` and `npm run test:e2e:local` all pass.

- **Vitest** (`vitest.config.ts`) has two projects:
  - `unit` (Node): `shared/**/*.test.ts`, `server/**/*.test.ts`, `test/*.test.ts`. Pure logic:
    - theme resolution, menu data, Swedish dates in Stockholm time, slugs, old URL mapping;
    - news and schedule mapping, the settings cache;
    - `test/theme-tokens.test.ts`, which checks that every theme defines every semantic token
      and that every declared text/background pair meets WCAG AA.
  - `nuxt` (Nuxt runtime, happy-dom): `test/nuxt/**/*.test.ts`, using `mountSuspended` from
    `@nuxt/test-utils/runtime`. `test/nuxt/helpers.ts` has `setTheme()` and fixture builders.
    Component tests live here, **not** next to the components, because Nuxt registers `.ts` files
    under `app/components/` as components.
- **Coverage:** v8, over `shared/`, `server/utils/` (except `db.ts`), `app/components/` and
  `app/composables/`. Thresholds: lines, functions and statements 90 %, branches 85 %. Currently
  about 99 %. Pages and API handlers are covered by e2e, not by unit coverage.
- **API tests against a database** (Testcontainers or the Compose `db` on a separate database
  name) are planned for handlers with real logic, starting with login. Today the handlers are thin
  and covered by e2e.
- **E2E: Playwright** (`playwright.config.ts`, `e2e/*.spec.ts`) runs against `nuxt dev` with a
  seeded Postgres database.
  - **Projects:** `desktop` (Desktop Chrome), `phone` (Pixel 7, Chromium) and `iphone` (iPhone 15,
    WebKit, the engine of every iOS browser). Specs that only make sense on one size skip
    themselves with `isPhone(page)`. `e2e/mobile.spec.ts` checks the phone layout: no sideways
    scroll on any page in any theme, the bottom bar never covers the footer, and the page behind
    the open menu is locked.
  - **WebKit on Linux** needs `libmanette-0.2-0`, `libhidapi-hidraw0` and `libbacktrace0`
    (`sudo npx playwright install-deps webkit`). CI installs them with `--with-deps`. Without
    sudo, the three libraries can be unpacked (`apt-get download`, `dpkg -x`) into
    `~/.cache/ms-playwright/webkit-*/minibrowser-wpe/sys/lib/`. `LD_LIBRARY_PATH` does not work,
    because the MiniBrowser wrapper overwrites it.
  - **Wait for hydration before you click or leave a page.** WebKit logs aborted module imports
    as `NUXT_E1005` / `VUE_ROUTER_R0011` on the dev server when a test navigates away mid-load.
  - **Single worker,** since the specs share one database.
  - **`e2e/helpers.ts`:**
    - `expectAccessible(page)`: axe, WCAG 2.0/2.1/2.2 A and AA;
    - `gotoReady(page, path)`: waits for `<html data-hydrated>` before clicking, so clicks never
      land on un-hydrated server HTML;
    - `useThemeFor(page, theme)`.
  - **Covered:** home content, every theme chosen from the footer and rendered on the server, axe
    on every public page in every theme, news filters and articles, members-only items never
    leaking (page, API, RSS, sitemap), desktop menu with keyboard, phone bottom bar and menu
    sheet, old URL redirects, 404s, health, `/media` (served with a long cache, nothing outside
    the uploads folder), the hero image from settings.
  - **Next flows to add:** magic-link login (with `MOCK_EMAIL=true`, reading the link from the
    capture), members-only news with pinning and a comment, a löprunda with "Jag hänger med",
    event sign-up with questions and waiting list, document upload with "Meddela medlemmarna".
- **`scripts/e2e-local.sh`** (what `npm run test:e2e:local` runs):
  - starts `db` if needed;
  - creates a separate `klubbstugan_e2e` database on first run;
  - runs `prisma migrate deploy` and the seed;
  - runs Playwright on port 3200, or `E2E_PORT`.

  It never uses `prisma migrate reset`. Prisma blocks that command when an AI agent runs it, and a
  reset is not needed: the seed replaces the demo data itself.

## Dev workflow

```bash
npm install                                   # also runs prisma generate + nuxt prepare
docker compose up -d db                       # Postgres 17 on 127.0.0.1:5433 (5432 is often taken)
export DATABASE_URL=postgresql://klubbstugan:klubbstugan@localhost:5433/klubbstugan
npx prisma migrate dev                        # apply migrations (and create new ones)
npx prisma db seed                            # demo data
npm run dev                                   # http://localhost:3000
npm run lint
npm run typecheck                             # nuxt typecheck, plus tsc for scripts/ and prisma/ (tsconfig.scripts.json)
npm run content -- check pack.zip             # validate a content pack (also import, export)
npm test                                      # vitest run (both projects)
npm run test:coverage                         # with thresholds
npm run test:e2e:local                        # Playwright against klubbstugan_e2e
```

- **The root `.env`** is the owner's private file. It is not in `KEY=value` format and is not
  the app's config, so don't read, print or overwrite it. Use `export`, or copy
  `.env.example` to a new name.
- **Old addresses:** on the dev server, try `/teamblekingelf/sida/94397/kustmaran` → 301.
- **Themes:** try `/?tema=fart` or `/?tema=klubbdrakt`.

## Docker

Three-stage Dockerfile in finishline's shape:
1. `deps`: `npm ci --ignore-scripts`, `openssl`.
2. `build`: `prisma generate`, `nuxt build`. Doubles as the one-off migrate image.
3. `runner`: Node 24 slim. Copies `.output/`, runs as a non-root user with a `HEALTHCHECK` on
   `/api/health`.

`docker-compose.yml` (project name `klubbstugan`):

- `db`: Postgres 17, volume `db-data`, port `127.0.0.1:${DB_PORT:-5433}`.
- `migrate`: one-off `npx prisma migrate deploy`. `web` waits for it to finish.
- `web`: the app on `${WEB_PORT:-3000}`. Database through `NUXT_DATABASE_URL`, theme switch and
  default from `NUXT_PUBLIC_THEME_SWITCH` / `NUXT_DEFAULT_THEME`. Volume `uploads`.
- `mailpit`: development and e2e only (`profiles: [dev]`).
- To come with notifications: `scheduler`, a small curl loop (startskottet's publisher pattern)
  calling `/api/cron/digests`, `/api/cron/unpin` and `/api/cron/reminders`, authorised with
  `CRON_SECRET`.

Demo server: `docker compose up -d --build`, behind the server's reverse proxy for
`klubbstugan.appzma.com`, with `NUXT_PUBLIC_SITE_URL=https://klubbstugan.appzma.com` and a real
`DB_PASSWORD`. Load the content with a content pack (below); `npx prisma db seed` gives the
placeholder demo instead.
Back up `db-data` (pg_dump) and `uploads`, encrypted, in the EU (spec §7).

## Content packs

The repo is public, so it holds only placeholder content: neutral SVGs in `public/img/placeholder/`
and texts with `[Namn]`. The club's real photos and texts live in a **content pack**, a zip that a
deploy is loaded with:

```
content.json   # format "klubbstugan-content", version 1: settings, newsCategories, news, events,
               #   recurring (weekly activities), trainingGroups with plan, faq, sponsors
media/…        # images that content.json refers to as "media/<file>" (jpg, png, webp, avif, gif)
```

- **Code:**
  - `server/utils/content-pack.ts` holds the zod schema, validation, conversion to rows, the
    database write and export.
  - `scripts/content.ts` is the command-line tool.
  - `server/routes/media/[name].ts` serves the images.
- **Commands:**
  - `npm run content -- check pack.zip` validates and writes nothing. It reports every problem in
    one run: missing images, alt text, unknown categories, duplicates, unsafe paths.
  - `npm run content -- import pack.zip` writes images to `$NUXT_UPLOADS_DIR/media/` and replaces
    all content in one transaction. **Members are never touched.**
  - `npm run content -- export pack.zip` writes the current content as a pack.
- **Rules:**
  - The schema is strict: a pack can't carry members or any other personal data, and unknown keys
    are an error.
  - Every image needs alt text.
- **Images:**
  - Stored names start with a content hash (`1f1582bcf29b-kustmaran.jpg`), so they are served with
    `immutable` caching, and a changed image gets a new address.
  - The `/media` route accepts plain file names only (no `..`, no slashes) and only image types.
- **Hero picture:** the home page photo is the setting `hero.image` / `hero.imageAlt`. Without
  one, the hero uses `public/img/placeholder/hero.svg`.
- **Settings cache:** settings are cached for 60 s, so a running server shows a new hero and theme
  within a minute of an import.
- **Recurring activities** are expanded into dated events at import time (`weeks`, default 8),
  in Stockholm time across daylight saving time. Re-import, or export, edit and import, to move
  the window forward.
- **The seed is a content pack** (`prisma/seed.ts`) and goes through the same `toContentRows` and
  `applyContentRows`, so every dev seed and e2e run exercises the importer.
- **On the demo server:**
  ```bash
  docker compose run --rm -v "$PWD/teamblekinge.zip:/tmp/pack.zip:ro" migrate \
    npm run -s content -- import /tmp/pack.zip
  ```
  `migrate` and `web` share the `uploads` volume.
- **Keep packs private.**
  - `content-packs/` and `*.zip` are git- and docker-ignored. Never commit a pack, and never put
    photos of identifiable people (children above all) in `public/`.
  - The club's pack is built from `content-packs/teamblekinge/` (see its README).

## Environment (`.env.example`)

```bash
DATABASE_URL=postgresql://klubbstugan:klubbstugan@localhost:5433/klubbstugan   # Prisma CLI and seed
DB_PASSWORD=klubbstugan               # used by docker compose
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_PUBLIC_THEME_SWITCH=true         # footer theme switch and ?tema= (demo)
NUXT_DEFAULT_THEME=klassisk           # when no cookie and no SiteSetting
NUXT_UPLOADS_DIR=./uploads            # content-pack images; /app/uploads (volume) in Docker
# Later: NUXT_SESSION_PASSWORD, SMTP_*, MAIL_FROM, WEBAUTHN_RP_ID, VAPID_*, CRON_SECRET, MOCK_EMAIL
```

## CI (`.github/workflows/ci.yml`, mirrors finishline)

- `verify`: `npm ci` (generates the Prisma client), lint, typecheck, `test:coverage`, build.
- `e2e`: Postgres 17 service container, `prisma migrate deploy`, seed, install Chromium,
  `npm run test:e2e`, upload the Playwright report on failure.
- `docker-smoke-test`:
  - `docker compose build` and start `web` (with `db` and `migrate`);
  - curl `/api/health` and `/`, which must carry `data-theme`;
  - `/flodet` must give 302 and an old SvenskaLag path 301;
  - import `e2e/fixtures/content-pack/` through the `migrate` image, then check the imported news
    page and that the hero image is served from `/media`;
  - dump the logs on failure.

## Pitfalls found while building

- **Scoped CSS leaks into child roots.** A component's root element also gets the parent's
  scope. A page rule like `.side { flex-direction: column }` therefore hits a child whose root
  has class `side`. Give component roots and their modifiers prefixed names
  (`news-card--side`), and avoid generic class names on pages (`.faq-section`, not `.faq`).
- **Don't re-export `shared/types` from `server/utils`.** Nuxt auto-imports both and warns about
  duplicates; import types from `#shared/types/content`.
- **Template whitespace.** In `<template v-if>x </template>` the trailing space is dropped. Build
  joined strings in the expression instead (`[a, b].filter(Boolean).join(" ")`).
- **Icon-only links need an `aria-label`.** Hiding the text with `display: none` on small screens
  removes the accessible name; axe in the phone project catches this.
- **Horizontally scrolling regions** (tables) need `tabindex="0"`, `role="region"` and a label.
- **Routes named `x.get.ts` answer GET only**, so HEAD gets a 404, and proxies and link checkers
  send HEAD. File routes such as `/media` use `x.ts` with `assertMethod(event, ["GET", "HEAD"])`.
- **`.gitignore` patterns without a leading slash match at any depth.** `uploads` also hid
  `e2e/fixtures/uploads`, so the rule is now `/uploads`.
- **iPhone:**
  - The viewport has `viewport-fit=cover`, so fixed and edge elements must pad with
    `env(safe-area-inset-*)`. This covers `.container`, the bottom bar, the footer and the menu
    sheet.
  - Use `dvh`, with a `vh` fallback, for heights tied to the screen.
  - Lock `<html>` overflow while a sheet is open.
  - Keep form fields at 16 px or larger, or iOS zooms in when they get focus.

## Build order

Follow the phases in spec §9. Done: first slice of phase 1 (spec §9.1). Next in phase 1:
- content migration and the full old-address table;
- iCal feed;
- admin "Utseende" and page editing (spec §5.7);
- structured data.

Then:
- phase 2, the member area: login, members' news, Klubbflödet, e-mail notifications;
- events and sign-ups;
- relay teams;
- results;
- training, documents, Torsdagsgruppen, sponsors;
- web push.

## Git

- Branch from the default branch after pulling, named `dev/tagertswe/<feature>`.
- Never commit, push or open a PR unless asked; never commit to `main` directly.
- Never commit secrets, `.env`, real member data or exports from SvenskaLag/Idrottsarenan.
