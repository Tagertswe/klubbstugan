import { expect, test } from "@playwright/test";
import { gotoReady, isPhone } from "./helpers";

test("desktop: the grouped menu opens and leads to a race page", async ({ page }) => {
  test.skip(isPhone(page), "desktop menu");
  await gotoReady(page, "/");
  const menu = page.getByRole("navigation", { name: "Huvudmeny" });
  const group = menu.getByRole("button", { name: "Tävla" });
  await group.click();
  await expect(group).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(group).toHaveAttribute("aria-expanded", "false");
  await expect(group).toBeFocused();

  await group.click();
  await menu.getByRole("link", { name: "Kustmaran" }).click();
  await expect(page).toHaveURL(/\/tavla\/kustmaran$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kustmaran & Kristianopel Runt");
  await expect(menu.getByRole("button", { name: "Tävla" })).toHaveClass(/active/);
});

test("desktop: the bottom bar is hidden", async ({ page }) => {
  test.skip(isPhone(page), "desktop only");
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Snabbmeny" })).toBeHidden();
});

test("phone: the bottom bar navigates and Meny opens the full menu", async ({ page }) => {
  test.skip(!isPhone(page), "phone only");
  await gotoReady(page, "/");
  const bar = page.getByRole("navigation", { name: "Snabbmeny" });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole("link", { name: "Hem" })).toHaveAttribute("aria-current", "page");

  await bar.getByRole("link", { name: "Kalender" }).click();
  await expect(page).toHaveURL(/\/kalender$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kalender");
  await expect(bar.getByRole("link", { name: "Kalender" })).toHaveAttribute("aria-current", "page");

  await bar.getByRole("button", { name: "Meny" }).click();
  const dialog = page.getByRole("dialog", { name: "Meny" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Stäng menyn" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await bar.getByRole("button", { name: "Meny" }).click();
  await dialog.getByRole("link", { name: "Prova på" }).click();
  await expect(page).toHaveURL(/\/prova-pa$/);
  await expect(dialog).toBeHidden();
});

test("Klubbflödet asks visitors to log in first", async ({ page }) => {
  await page.goto("/flodet");
  await expect(page).toHaveURL(/\/logga-in\?next=\/flodet$/);
  await expect(page.getByText("Du kommer till /flodet när du har loggat in.")).toBeVisible();
});

test("the skip link jumps to the content", async ({ page }) => {
  test.skip(isPhone(page), "keyboard");
  await gotoReady(page, "/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Hoppa till innehållet" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#innehall$/);
});
