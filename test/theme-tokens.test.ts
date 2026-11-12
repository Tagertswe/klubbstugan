// Every theme must define every semantic token, and every text/background pair
// a component uses must pass WCAG 2.2 AA (spec §5.8.1).
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "../shared/utils/contrast";
import { THEME_IDS } from "../shared/utils/themes";

export const SEMANTIC_TOKENS = [
  "--c-bg", "--c-surface", "--c-text", "--c-muted", "--c-line", "--c-link",
  "--c-accent", "--c-on-accent", "--c-brand-2", "--c-on-brand-2",
  "--c-header-bg", "--c-header-fg", "--c-header-muted",
  "--c-hero-bg", "--c-hero-fg", "--c-hero-muted",
  "--c-band-bg", "--c-band-fg", "--c-label-bg", "--c-label-fg",
  "--c-footer-bg", "--c-footer-fg",
  "--font-body", "--font-display", "--display-case", "--display-weight", "--display-tracking",
  "--radius-card", "--radius-button", "--radius-label",
  "--skew", "--tilt", "--edge-start", "--edge-end", "--card-shadow",
] as const;

/** [foreground, background, minimum ratio] — 4.5 for body text. */
const PAIRS: [string, string, number][] = [
  ["--c-text", "--c-bg", 4.5],
  ["--c-text", "--c-surface", 4.5],
  ["--c-muted", "--c-surface", 4.5],
  ["--c-muted", "--c-bg", 4.5],
  ["--c-link", "--c-surface", 4.5],
  ["--c-link", "--c-bg", 4.5],
  ["--c-on-accent", "--c-accent", 4.5],
  ["--c-on-brand-2", "--c-brand-2", 4.5],
  ["--c-header-fg", "--c-header-bg", 4.5],
  ["--c-header-muted", "--c-header-bg", 4.5],
  ["--c-hero-fg", "--c-hero-bg", 4.5],
  ["--c-hero-muted", "--c-hero-bg", 4.5],
  ["--c-band-fg", "--c-band-bg", 4.5],
  ["--c-label-fg", "--c-label-bg", 4.5],
  ["--c-footer-fg", "--c-footer-bg", 4.5],
];

function readTokens(id: string): Record<string, string> {
  const css = readFileSync(resolve(__dirname, `../app/assets/css/themes/${id}.css`), "utf8");
  const tokens: Record<string, string> = {};
  for (const match of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    tokens[match[1]!] = match[2]!.trim();
  }
  return tokens;
}

describe.each(THEME_IDS)("theme %s", (id) => {
  const tokens = readTokens(id);

  it("is scoped to its data-theme attribute", () => {
    const css = readFileSync(resolve(__dirname, `../app/assets/css/themes/${id}.css`), "utf8");
    expect(css).toContain(`:root[data-theme="${id}"]`);
  });

  it("defines every semantic token", () => {
    const missing = SEMANTIC_TOKENS.filter((token) => !(token in tokens));
    expect(missing).toEqual([]);
  });

  it.each(PAIRS)("%s on %s meets %d:1", (fg, bg, min) => {
    const ratio = contrastRatio(tokens[fg]!, tokens[bg]!);
    expect(ratio, `${fg} ${tokens[fg]} on ${bg} ${tokens[bg]} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
  });
});
