import { describe, expect, it } from "vitest";
import { mapLegacyPath } from "./legacy";

describe("mapLegacyPath", () => {
  it("ignores paths that are not old SvenskaLag addresses", () => {
    expect(mapLegacyPath("/")).toBeNull();
    expect(mapLegacyPath("/nyheter")).toBeNull();
    expect(mapLegacyPath("/teamblekingelfx/sida/1")).toBeNull();
  });

  it("sends the old club root to the home page", () => {
    expect(mapLegacyPath("/teamblekingelf")).toBe("/");
    expect(mapLegacyPath("/teamblekingelf/")).toBe("/");
  });

  it("maps known pages and news items", () => {
    expect(mapLegacyPath("/teamblekingelf/sida/94397/kustmaran")).toBe("/tavla/kustmaran");
    expect(mapLegacyPath("/teamblekingelf/sida/94060/medlemskap")).toBe("/foreningen#bli-medlem");
    expect(mapLegacyPath("/teamblekingelf/nyheter/2570302/langpass-holmsjo-3-oktober?x=1")).toBe(
      "/nyheter/langpass-holmsjo-3-oktober",
    );
  });

  it("falls back to the nearest section for unknown ids", () => {
    expect(mapLegacyPath("/teamblekingelf/sida/1/okand")).toBe("/");
    expect(mapLegacyPath("/teamblekingelf/nyheter/1/okand")).toBe("/nyheter");
    expect(mapLegacyPath("/teamblekingelf/nyheter")).toBe("/nyheter");
  });

  it("maps the other sections", () => {
    expect(mapLegacyPath("/TeamBlekingeLF/Kalender")).toBe("/kalender");
    expect(mapLegacyPath("/teamblekingelf/aktivitet/123/intervaller")).toBe("/kalender");
    expect(mapLegacyPath("/teamblekingelf/kontakt")).toBe("/fragor");
    expect(mapLegacyPath("/teamblekingelf/dokument")).toBe("/dokument");
    expect(mapLegacyPath("/teamblekingelf/bildgalleri")).toBe("/foreningen#bilder");
    expect(mapLegacyPath("/teamblekingelf/logga-in")).toBe("/logga-in");
    expect(mapLegacyPath("/teamblekingelf/login")).toBe("/logga-in");
    expect(mapLegacyPath("/teamblekingelf/blank/15")).toBe("/");
  });
});
