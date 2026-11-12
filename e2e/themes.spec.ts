import { expect, test } from "@playwright/test";
import { THEME_IDS } from "../shared/utils/themes";
import { expectAccessible, gotoReady, useThemeFor } from "./helpers";

for (const theme of THEME_IDS) {
  test.describe(`theme ${theme}`, () => {
    test("is chosen from the footer, remembered and rendered on the server", async ({ page, request }) => {
      await gotoReady(page, "/");
      await page.getByRole("navigation", { name: "Utseende" }).locator(`[data-theme-option="${theme}"]`).click();
      await expect(page).toHaveURL(/\/$/);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator(`[data-theme-option="${theme}"]`)).toHaveAttribute("aria-current", "true");
      // Let the page finish loading before leaving it (WebKit logs aborted module imports otherwise).
      await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");

      await page.goto("/nyheter");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      // The first byte of HTML already carries the theme: no flash of the wrong look.
      const html = await (await request.get("/", { headers: { cookie: `tema=${theme}` } })).text();
      expect(html).toMatch(new RegExp(`<html[^>]*data-theme="${theme}"`));
    });

    test("home and news pages have no accessibility violations", async ({ page }) => {
      await useThemeFor(page, theme, "/");
      await expectAccessible(page);
      await page.goto("/nyheter");
      await expectAccessible(page);
    });
  });
}

test("each theme brings its own layout", async ({ page }) => {
  await useThemeFor(page, "klassisk");
  await expect(page.locator(".hero")).toHaveAttribute("data-variant", "split");
  await expect(page.locator("[data-decoration]")).toHaveCount(0);

  await useThemeFor(page, "fart");
  await expect(page.locator("[data-decoration='speed-lines']").first()).toBeAttached();

  await useThemeFor(page, "klubbdrakt");
  await expect(page.locator(".hero")).toHaveAttribute("data-variant", "fullBleed");
  await expect(page.locator("[data-decoration='kit-stripes']").first()).toBeAttached();
  await expect(page.locator("[data-variant='overlay']").first()).toBeVisible();
});

test("an unknown theme in the address is ignored", async ({ page }) => {
  await useThemeFor(page, "fart");
  await page.goto("/?tema=neon");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "fart");
});
