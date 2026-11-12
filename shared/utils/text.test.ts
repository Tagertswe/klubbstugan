import { describe, expect, it } from "vitest";
import { paragraphs, slugify, truncate } from "./text";

describe("slugify", () => {
  it("makes readable Swedish slugs", () => {
    expect(slugify("Långpass Holmsjö 3 oktober")).toBe("langpass-holmsjo-3-oktober");
    expect(slugify("Beställ klubbkläder hos Trimtex – nu är webbshopen öppen!")).toBe(
      "bestall-klubbklader-hos-trimtex-nu-ar-webbshopen-oppen",
    );
    expect(slugify("  Café & Été  ")).toBe("cafe-ete");
  });
});

describe("paragraphs", () => {
  it("splits on blank lines and joins wrapped lines", () => {
    expect(paragraphs("Första stycket\nfortsätter här.\n\n  Andra stycket.  \n\n\n")).toEqual([
      "Första stycket fortsätter här.",
      "Andra stycket.",
    ]);
  });

  it("returns nothing for empty text", () => {
    expect(paragraphs("  \n\n ")).toEqual([]);
  });
});

describe("truncate", () => {
  it("keeps short text as it is", () => {
    expect(truncate("Kort text", 20)).toBe("Kort text");
  });

  it("cuts on a word boundary and adds an ellipsis", () => {
    expect(truncate("Start vid Bredasjöns IP kl. 08.30 med fyra distanser", 30)).toBe("Start vid Bredasjöns IP kl.…");
  });

  it("cuts mid-word when there is no reasonable space", () => {
    expect(truncate("Superlångtordutanmellanslag", 10)).toBe("Superlång…");
  });
});
