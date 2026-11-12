import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearSettingsCache, getSettings, heroImage } from "./settings";

describe("getSettings", () => {
  beforeEach(() => clearSettingsCache());

  it("loads settings as a key/value object", async () => {
    const load = vi.fn().mockResolvedValue([{ key: "theme", value: "fart" }]);
    expect(await getSettings(load, 1_000)).toEqual({ theme: "fart" });
  });

  it("reuses the cached values for a minute", async () => {
    const load = vi.fn().mockResolvedValue([{ key: "theme", value: "fart" }]);
    await getSettings(load, 1_000);
    await getSettings(load, 30_000);
    expect(load).toHaveBeenCalledTimes(1);
    await getSettings(load, 61_001);
    expect(load).toHaveBeenCalledTimes(2);
  });
});

describe("heroImage", () => {
  it("uses the photo from the content pack", () => {
    expect(heroImage({ "hero.image": "/media/abc-start.jpg", "hero.imageAlt": "Starten" })).toEqual({ imageUrl: "/media/abc-start.jpg", imageAlt: "Starten" });
  });

  it("falls back to the neutral placeholder", () => {
    expect(heroImage({}).imageUrl).toBe("/img/placeholder/hero.svg");
    expect(heroImage({}).imageAlt).not.toBe("");
  });
});
