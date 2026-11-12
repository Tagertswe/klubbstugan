import { expect, test } from "@playwright/test";
import { expectAccessible } from "./helpers";

const PAGES: [string, string][] = [
  ["/kalender", "Kalender"],
  ["/traning", "Träna med oss"],
  ["/prova-pa", "Prova på"],
  ["/tavla", "Våra lopp"],
  ["/tavla/jamjohalvan", "Jämjöhalvan"],
  ["/foreningen", "Föreningen"],
  ["/fragor", "Frågor och kontakt"],
  ["/logga-in", "Logga in"],
];

for (const [path, heading] of PAGES) {
  test(`${path} renders without login and is accessible`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expectAccessible(page);
  });
}

test("the training page shows groups and the term plan", async ({ page }) => {
  await page.goto("/traning");
  await expect(page.getByRole("region", { name: "Grupperna" }).getByRole("article")).toHaveCount(3);
  const plan = page.getByRole("table");
  await expect(plan.getByRole("columnheader")).toHaveText(["Datum", "Långa gruppen", "Korta gruppen", "Hälsagruppen"]);
  expect(await plan.getByRole("row").count()).toBeGreaterThan(4);
});

test("a past race offers results, an upcoming one counts down", async ({ page }) => {
  await page.goto("/tavla/jamjohalvan");
  await expect(page.getByRole("heading", { name: "Resultat" })).toBeVisible();
  await page.goto("/tavla/kustmaran");
  await expect(page.getByRole("heading", { name: /Start om \d+ dagar/ })).toBeVisible();
});

test("unknown pages get a helpful 404", async ({ page }) => {
  const response = await page.goto("/finns-inte");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sidan finns inte");
  await expect(page.getByRole("main").getByRole("link", { name: "Nyheter" })).toBeVisible();
  const race = await page.goto("/tavla/finns-inte");
  expect(race?.status()).toBe(404);
});

test("the health check reports the database", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(await response.json()).toEqual({ status: "ok", database: "ok" });
});
