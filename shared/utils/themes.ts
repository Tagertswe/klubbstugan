// The three looks of the site (spec §5.8.1). Markup is shared; a theme is CSS
// custom properties plus this config.

export const THEME_IDS = ["klassisk", "fart", "klubbdrakt"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export type HeroVariant = "split" | "fullBleed";
export type NewsCardVariant = "side" | "overlay";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  heroVariant: HeroVariant;
  newsCardVariant: NewsCardVariant;
  decorations: {
    sectionEdges: boolean;
    speedLines: boolean;
    kitStripes: boolean;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  klassisk: {
    id: "klassisk",
    name: "Klassisk",
    description: "Ljus och lugn, närmast dagens hemsida.",
    heroVariant: "split",
    newsCardVariant: "side",
    decorations: { sectionEdges: false, speedLines: false, kitStripes: false },
  },
  fart: {
    id: "fart",
    name: "Fart",
    description: "Mörk och sportig med sneda kanter och fartlinjer.",
    heroVariant: "split",
    newsCardVariant: "side",
    decorations: { sectionEdges: true, speedLines: true, kitStripes: false },
  },
  klubbdrakt: {
    id: "klubbdrakt",
    name: "Klubbdräkt",
    description: "Bilden först, med klubbdräktens ränder i orange och lila.",
    heroVariant: "fullBleed",
    newsCardVariant: "overlay",
    decorations: { sectionEdges: false, speedLines: false, kitStripes: true },
  },
};

export const THEME_COOKIE = "tema";

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}

export interface ThemeSources {
  /** ?tema= in the address; only honoured when the theme switch is enabled */
  query?: unknown;
  cookie?: unknown;
  memberPreference?: unknown;
  siteDefault?: unknown;
  allowQuery: boolean;
}

/**
 * Picks the theme in the order of spec §5.8.1: address (demo only), cookie,
 * the member's saved choice, the site default, then "klassisk".
 */
export function resolveTheme(sources: ThemeSources): ThemeId {
  const candidates = [
    sources.allowQuery ? sources.query : undefined,
    sources.cookie,
    sources.memberPreference,
    sources.siteDefault,
  ];
  for (const candidate of candidates) {
    if (isThemeId(candidate)) return candidate;
  }
  return "klassisk";
}
