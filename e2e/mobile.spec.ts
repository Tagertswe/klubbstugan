import { expect, test } from "@playwright/test";
import { THEME_IDS } from "../shared/utils/themes";
import { gotoReady, isPhone, useThemeFor } from "./helpers";

// Phone layout checks, run on Android (Pixel 7) and iPhone (WebKit).
const PAGES = ["/", "/nyheter", "/nyheter/langpass-holmsjo-3-oktober", "/kalender", "/traning", "/prova-pa", "/tavla", "/tavla/kustmaran", "/foreningen", "/fragor", "/logga-in"];

test.beforeEach(({ page }) => {
  test.skip(!isPhone(page), "phone only");
});

for (const theme of THEME_IDS) {
  test(`${theme}: no page scrolls sideways`, async ({ page }) => {
    await useThemeFor(page, theme);
    for (const path of PAGES) {
      await gotoReady(page, path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} is wider than the screen`).toBeLessThanOrEqual(0);
    }
  });
}

test("the bottom bar never covers the end of the page", async ({ page }) => {
  await gotoReady(page, "/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const bar = await page.getByRole("navigation", { name: "Snabbmeny" }).boundingBox();
  const lastLine = await page.locator(".site-footer .bottom").boundingBox();
  expect(bar && lastLine).toBeTruthy();
  expect(lastLine!.y + lastLine!.height).toBeLessThanOrEqual(bar!.y);
});

test("the page behind the open menu stays still", async ({ page }) => {
  await gotoReady(page, "/");
  const bar = page.getByRole("navigation", { name: "Snabbmeny" });
  await bar.getByRole("button", { name: "Meny" }).click();
  await expect(page.getByRole("dialog", { name: "Meny" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");

  await page.getByRole("button", { name: "Stäng menyn" }).click();
  await expect(page.getByRole("dialog", { name: "Meny" })).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
});

test("the viewport lets the layout use the whole iPhone screen", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute("content", /viewport-fit=cover/);
});
