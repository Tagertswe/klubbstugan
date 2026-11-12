import { expect, test } from "@playwright/test";
import { expectAccessible, gotoReady } from "./helpers";

test("the news page lists public news only", async ({ page }) => {
  await page.goto("/nyheter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nyheter");
  const list = page.getByRole("region", { name: "Senaste nyheterna" });
  const articles = list.getByRole("article");
  await expect(articles).toHaveCount(5);
  await expect(articles.filter({ hasText: /protokoll|Kyrkstafetten/i })).toHaveCount(0);
  await expect(page.getByText("Fler nyheter är bara för medlemmar.")).toBeVisible();
});

test("news can be filtered by category and year", async ({ page }) => {
  await gotoReady(page, "/nyheter");
  await page.getByRole("navigation", { name: "Kategorier" }).getByRole("link", { name: "Långpass" }).click();
  await expect(page).toHaveURL(/kategori=langpass/);
  const list = page.getByRole("region", { name: "Senaste nyheterna" });
  await expect(list.getByRole("article")).toHaveCount(1);
  await expect(list).toContainText("Långpass Holmsjö 3 oktober");

  await page.getByRole("navigation", { name: "Kategorier" }).getByRole("link", { name: "Stafett" }).click();
  await expect(page.getByText("Inga nyheter i den här kategorin än.")).toBeVisible();

  await page.goto("/nyheter?ar=2025");
  await expect(list.getByRole("article")).toHaveCount(1);
  await expect(list).toContainText("Höstkickoff");
});

test("an article shows text, author and more news", async ({ page }) => {
  await page.goto("/nyheter/langpass-holmsjo-3-oktober");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Långpass Holmsjö 3 oktober");
  await expect(page.getByText("[Namn], tränare")).toBeVisible();
  await expect(page.getByText("Grillen glöder när vi kommer tillbaka.")).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Mer från Nyheter" }).getByRole("listitem")).toHaveCount(4);
  await expectAccessible(page);
});

test("members-only news is hidden from visitors everywhere", async ({ page, request }) => {
  const response = await page.goto("/nyheter/nytt-protokoll-styrelsemote");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sidan finns inte");

  const api = await request.get("/api/news/nytt-protokoll-styrelsemote");
  expect(api.status()).toBe(404);
  for (const path of ["/sitemap.xml", "/nyheter/rss.xml", "/api/news"]) {
    const body = await (await request.get(path)).text();
    expect(body, path).not.toContain("nytt-protokoll-styrelsemote");
    expect(body, path).not.toContain("kyrkstafetten");
  }
});

test("RSS and the sitemap list public news", async ({ request }) => {
  const rss = await request.get("/nyheter/rss.xml");
  expect(rss.headers()["content-type"]).toContain("application/rss+xml");
  expect(await rss.text()).toContain("/nyheter/langpass-holmsjo-3-oktober");

  const sitemap = await request.get("/sitemap.xml");
  const xml = await sitemap.text();
  expect(xml).toContain("/nyheter/resultat-fran-jamjohalvan");
  expect(xml).toContain("/tavla/kustmaran");

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap:");
  expect(robots).toContain("Disallow: /api/");
});
