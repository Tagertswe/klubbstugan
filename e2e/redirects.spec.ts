import { expect, test } from "@playwright/test";

// Old SvenskaLag addresses keep working (spec §8, step 4).
const REDIRECTS: [string, string][] = [
  ["/teamblekingelf", "/"],
  ["/teamblekingelf/sida/94397/kustmaran", "/tavla/kustmaran"],
  ["/teamblekingelf/sida/94060/medlemskap", "/foreningen#bli-medlem"],
  ["/teamblekingelf/nyheter/2570302/langpass-holmsjo-3-oktober", "/nyheter/langpass-holmsjo-3-oktober"],
  ["/teamblekingelf/nyheter/999/okand", "/nyheter"],
  ["/teamblekingelf/kalender", "/kalender"],
  ["/teamblekingelf/kontakt", "/fragor"],
];

for (const [from, to] of REDIRECTS) {
  test(`${from} → ${to}`, async ({ request }) => {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(new URL(response.headers().location!, "http://x").pathname + (to.includes("#") ? `#${to.split("#")[1]}` : "")).toBe(to);
  });
}

test("following an old link lands on the new page", async ({ page }) => {
  await page.goto("/teamblekingelf/nyheter/2570302/langpass-holmsjo-3-oktober");
  await expect(page).toHaveURL(/\/nyheter\/langpass-holmsjo-3-oktober$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Långpass Holmsjö 3 oktober");
});
