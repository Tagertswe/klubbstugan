import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";
import type { ThemeId } from "../shared/utils/themes";

/** WCAG 2.2 AA (spec §5.8): no axe violations on the current page. */
export async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
  expect(summary, "axe violations").toEqual([]);
}

/** Chooses a theme the way a visitor does, through ?tema=. */
export async function useThemeFor(page: Page, theme: ThemeId, path = "/") {
  await page.goto(`${path}?tema=${theme}`);
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
}

export function isPhone(page: Page): boolean {
  return (page.viewportSize()?.width ?? 1280) < 1024;
}

/** Opens a page and waits until Vue has hydrated it, so clicks are handled. */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
}
