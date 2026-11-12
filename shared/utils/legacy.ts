// Old SvenskaLag addresses → new pages (spec §8, step 4). Exact paths come
// first, then patterns. Unknown old paths fall back to the nearest section so
// old links never end on an error page.

const CLUB = "teamblekingelf";

/** Known pages, by SvenskaLag page id. */
export const LEGACY_PAGES: Record<string, string> = {
  "94056": "/traning",
  "94058": "/tavla",
  "94060": "/foreningen#bli-medlem",
  "94169": "/tavla/jamjohalvan",
  "94397": "/tavla/kustmaran",
  "129220": "/tavla/veteran-sm",
};

/** Known news items, by SvenskaLag news id. */
export const LEGACY_NEWS: Record<string, string> = {
  "2579039": "/nyheter/bestall-klubbklader-hos-trimtex",
  "2570302": "/nyheter/langpass-holmsjo-3-oktober",
  "2549507": "/nyheter/hostkickoff-med-gasttranare",
};

/**
 * Returns the new path for an old SvenskaLag path, or null when the path is
 * not an old address. Query strings are ignored.
 */
export function mapLegacyPath(input: string): string | null {
  const path = (input.split(/[?#]/)[0] ?? "").replace(/\/+$/, "").toLowerCase();
  if (path === `/${CLUB}`) return "/";
  if (!path.startsWith(`/${CLUB}/`)) return null;
  const rest = path.slice(CLUB.length + 2).split("/");
  const [section, id] = rest;

  switch (section) {
    case "sida":
      return (id && LEGACY_PAGES[id]) || "/";
    case "nyheter":
      return (id && LEGACY_NEWS[id]) || "/nyheter";
    case "kalender":
    case "aktivitet":
      return "/kalender";
    case "kontakt":
      return "/fragor";
    case "dokument":
      return "/dokument";
    case "bildgalleri":
      return "/foreningen#bilder";
    case "login":
    case "logga-in":
      return "/logga-in";
    default:
      return "/";
  }
}
