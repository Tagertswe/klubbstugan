import { describe, expect, it } from "vitest";
import { THEMES, THEME_IDS, isThemeId, resolveTheme } from "./themes";

describe("isThemeId", () => {
  it("accepts the three theme ids", () => {
    for (const id of THEME_IDS) expect(isThemeId(id)).toBe(true);
  });

  it("rejects anything else", () => {
    for (const value of ["", "Klassisk", "dark", undefined, null, 3, ["fart"]]) {
      expect(isThemeId(value)).toBe(false);
    }
  });
});

describe("resolveTheme", () => {
  it("falls back to klassisk when nothing is set", () => {
    expect(resolveTheme({ allowQuery: true })).toBe("klassisk");
  });

  it("uses the site default before the fallback", () => {
    expect(resolveTheme({ siteDefault: "fart", allowQuery: false })).toBe("fart");
  });

  it("prefers the member's choice over the site default", () => {
    expect(resolveTheme({ memberPreference: "klubbdrakt", siteDefault: "fart", allowQuery: false })).toBe(
      "klubbdrakt",
    );
  });

  it("prefers the cookie over the member's saved choice", () => {
    expect(
      resolveTheme({ cookie: "fart", memberPreference: "klubbdrakt", siteDefault: "klassisk", allowQuery: false }),
    ).toBe("fart");
  });

  it("uses ?tema= first, but only when the theme switch is enabled", () => {
    const sources = { query: "klubbdrakt", cookie: "fart" };
    expect(resolveTheme({ ...sources, allowQuery: true })).toBe("klubbdrakt");
    expect(resolveTheme({ ...sources, allowQuery: false })).toBe("fart");
  });

  it("skips invalid values at every level", () => {
    expect(
      resolveTheme({ query: "neon", cookie: "x", memberPreference: "", siteDefault: "fart", allowQuery: true }),
    ).toBe("fart");
  });
});

describe("THEMES", () => {
  it("has a config for every id, keyed by its own id", () => {
    for (const id of THEME_IDS) expect(THEMES[id].id).toBe(id);
  });

  it("gives every theme a Swedish name and description", () => {
    for (const id of THEME_IDS) {
      expect(THEMES[id].name.length).toBeGreaterThan(2);
      expect(THEMES[id].description.length).toBeGreaterThan(10);
    }
  });
});
