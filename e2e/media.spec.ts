import { expect, test } from "@playwright/test";

// Images from content packs are served from the uploads folder under /media
// (playwright.config.ts points it at e2e/fixtures/uploads).
test("serves an imported image with a long cache", async ({ request }) => {
  const response = await request.get("/media/e2e-test.png");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("image/png");
  expect(response.headers()["cache-control"]).toContain("immutable");
  expect((await response.body()).subarray(1, 4).toString()).toBe("PNG");
  expect((await request.head("/media/e2e-test.png")).status()).toBe(200);
});

test("serves nothing outside the uploads folder", async ({ request }) => {
  for (const path of ["/media/missing.png", "/media/..%2F..%2Fpackage.json", "/media/.env", "/media/notes.txt", "/media/..%2F.env", "/media/%2E%2E%2Fpackage.json"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test("the home page photo comes from the site settings", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero img").first()).toHaveAttribute("src", "/img/placeholder/hero.svg");
});
