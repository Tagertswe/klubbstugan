import { describe, expect, it } from "vitest";
import { BOTTOM_BAR, MAIN_MENU, isActive, menuDestinations } from "./navigation";

describe("MAIN_MENU", () => {
  it("has the grouped top menu from the spec, in order", () => {
    expect(MAIN_MENU.map((i) => i.label)).toEqual([
      "Hem", "Träna med oss", "Tävla", "Föreningen", "Nyheter", "Kalender", "Frågor & kontakt",
    ]);
  });

  it("lists each destination once (F5)", () => {
    const all = menuDestinations();
    expect(new Set(all).size).toBe(all.length);
  });

  it("gives every item either a link or children", () => {
    for (const item of MAIN_MENU) expect(Boolean(item.to) !== Boolean(item.children)).toBe(true);
  });

  it("skips items without a target", () => {
    expect(menuDestinations([{ label: "Tom" }])).toEqual([]);
  });
});

describe("BOTTOM_BAR", () => {
  it("is Hem, Kalender, Flöde, Nyheter, Meny", () => {
    expect(BOTTOM_BAR.map((i) => i.label)).toEqual(["Hem", "Kalender", "Flöde", "Nyheter", "Meny"]);
    expect(BOTTOM_BAR.at(-1)?.to).toBeUndefined();
  });
});

describe("isActive", () => {
  const home = MAIN_MENU[0]!;
  const compete = MAIN_MENU[2]!;
  const news = MAIN_MENU[4]!;

  it("matches the home page only on /", () => {
    expect(isActive(home, "/")).toBe(true);
    expect(isActive(home, "/nyheter")).toBe(false);
  });

  it("matches sub-pages and ignores query and hash", () => {
    expect(isActive(news, "/nyheter/resultat?x=1")).toBe(true);
    expect(isActive(compete, "/tavla/kustmaran#anmalan")).toBe(true);
    expect(isActive(compete, "/tavlingar")).toBe(false);
  });

  it("never matches an item without targets", () => {
    expect(isActive({ label: "Tom" }, "/")).toBe(false);
  });
});
