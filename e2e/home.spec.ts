import { expect, test } from "@playwright/test";
import { expectAccessible, useThemeFor } from "./helpers";

test.beforeEach(async ({ page }) => {
  await useThemeFor(page, "klassisk");
});

test("the home page says who we are and how to start", async ({ page }) => {
  await expect(page).toHaveTitle("Löparklubb i Karlskrona – Team Blekinge LF");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Löparklubb i Karlskrona – för alla typer av löpare");
  await expect(page.getByRole("link", { name: "Prova på gratis" })).toHaveAttribute("href", "/prova-pa");
  await expect(page.getByRole("main").getByRole("link", { name: "Bli medlem", exact: true })).toBeVisible();
});

test("it shows Viktigt nu, this week's training and the latest news", async ({ page }) => {
  const pinned = page.getByRole("region", { name: "Viktigt nu" });
  await expect(pinned.getByRole("link", { name: /Beställ klubbkläder hos Trimtex/ })).toBeVisible();

  const training = page.getByRole("region", { name: "Veckans träning" });
  await expect(training.getByRole("heading", { level: 3 })).toHaveCount(3);
  await expect(training).toContainText("Långa gruppen");
  await expect(training).toContainText("Hälsagruppen");
  await expect(training).toContainText("Samling 17:45");

  const news = page.getByRole("region", { name: "Senaste nytt" });
  await expect(news.getByRole("article")).toHaveCount(3);
  await expect(news).not.toContainText("protokoll");
});

test("upcoming activities, races and FAQ are on the page", async ({ page }) => {
  const activities = page.getByRole("region", { name: "Kommande aktiviteter" });
  await expect(activities.getByRole("listitem")).toHaveCount(5);

  const races = page.getByRole("region", { name: "Våra lopp" });
  await expect(races.getByRole("article")).toHaveCount(3);
  await expect(races.getByRole("article").first()).toContainText("Kustmaran");
  await expect(races).toContainText("Avgjort");

  const faq = page.getByRole("region", { name: "Vanliga frågor" });
  const question = faq.getByText("Vad kostar medlemskapet?");
  await question.click();
  await expect(faq.getByText("650 kr per person för 2026")).toBeVisible();
});

test("a news card opens the article", async ({ page }) => {
  await page.getByRole("region", { name: "Senaste nytt" }).getByRole("link", { name: /Resultat från Jämjöhalvan/ }).click();
  await expect(page).toHaveURL(/\/nyheter\/resultat-fran-jamjohalvan$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Resultat från Jämjöhalvan och Veteran-SM");
});

test("the home page has no accessibility violations", async ({ page }) => {
  await expectAccessible(page);
});
