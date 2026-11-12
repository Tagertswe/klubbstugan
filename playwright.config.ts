import { defineConfig, devices } from "@playwright/test";

// End-to-end tests against `nuxt dev` and a seeded Postgres database
// (scripts/e2e-local.sh locally, the `e2e` job in CI). Desktop, Android and iPhone,
// since the site is mobile first. Single worker: the specs share one database.
const PORT = Number(process.env.E2E_PORT ?? 3000);

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    locale: "sv-SE",
    timezoneId: "Europe/Stockholm",
  },

  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
    // Safari on iPhone: WebKit engine, iOS viewport and touch.
    { name: "iphone", use: { ...devices["iPhone 15"] } },
  ],

  webServer: {
    command: `npx nuxt dev --port ${PORT}`,
    url: `http://localhost:${PORT}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NUXT_PUBLIC_THEME_SWITCH: "true",
      NUXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
      // Holds media/e2e-test.png for the /media route test.
      NUXT_UPLOADS_DIR: "e2e/fixtures/uploads",
    },
  },
});
