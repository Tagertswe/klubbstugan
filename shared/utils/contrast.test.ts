import { describe, expect, it } from "vitest";
import { contrastRatio, parseHex, relativeLuminance } from "./contrast";

describe("parseHex", () => {
  it("reads six-digit and three-digit colours, with or without #", () => {
    expect(parseHex("#EE8915")).toEqual([238, 137, 21]);
    expect(parseHex("fff")).toEqual([255, 255, 255]);
  });

  it("throws on anything that is not a hex colour", () => {
    expect(() => parseHex("orange")).toThrow("Not a hex colour");
    expect(() => parseHex("#12345")).toThrow();
  });
});

describe("contrastRatio", () => {
  it("is 21 for black on white and 1 for equal colours", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#5B2A86", "#5B2A86")).toBeCloseTo(1, 5);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#221E1F", "#EE8915")).toBeCloseTo(contrastRatio("#EE8915", "#221E1F"), 10);
  });

  it("confirms the brand pairs the design relies on", () => {
    expect(contrastRatio("#A85400", "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#221E1F", "#EE8915")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#FFFFFF", "#5B2A86")).toBeGreaterThanOrEqual(4.5);
    // White on orange is not readable: the reason orange always carries dark text.
    expect(contrastRatio("#FFFFFF", "#EE8915")).toBeLessThan(4.5);
  });
});

describe("relativeLuminance", () => {
  it("is 0 for black and 1 for white", () => {
    expect(relativeLuminance("#000")).toBe(0);
    expect(relativeLuminance("#fff")).toBeCloseTo(1, 10);
  });
});
