// Site settings with a short in-memory cache, so the theme lookup on every
// request does not hit the database each time.
import type { HeroImage } from "../../shared/types/content";

const TTL_MS = 60_000;
let cache: { at: number; values: Record<string, string> } | undefined;

export async function getSettings(
  load: () => Promise<{ key: string; value: string }[]>,
  now = Date.now(),
): Promise<Record<string, string>> {
  if (cache && now - cache.at < TTL_MS) return cache.values;
  const rows = await load();
  cache = { at: now, values: Object.fromEntries(rows.map((r) => [r.key, r.value])) };
  return cache.values;
}

/** The home page photo: set by a content pack (hero.image), else the neutral placeholder. */
export function heroImage(settings: Record<string, string>): HeroImage {
  return settings["hero.image"]
    ? { imageUrl: settings["hero.image"], imageAlt: settings["hero.imageAlt"] ?? "" }
    : { imageUrl: "/img/placeholder/hero.svg", imageAlt: "Illustration av en löparbana i klubbens färger" };
}

export function clearSettingsCache(): void {
  cache = undefined;
}
