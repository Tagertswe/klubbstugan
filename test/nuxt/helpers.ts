import type { ThemeId } from "#shared/utils/themes";
import type { NewsCard, RaceCard } from "#shared/types/content";

/** Sets the theme the way the server plugin does, before mounting. */
export function setTheme(id: ThemeId) {
  useState<ThemeId>("theme").value = id;
}

export function newsCard(overrides: Partial<NewsCard> = {}): NewsCard {
  return {
    slug: "resultat",
    title: "Resultat från Jämjöhalvan",
    excerpt: "Klubbens resultat.",
    imageUrl: "/img/placeholder/news.svg",
    imageAlt: "Barnloppet",
    membersOnly: false,
    category: { slug: "tavling", name: "Tävling & resor" },
    publishedAt: "2026-11-08T10:00:00.000Z",
    dateLabel: "8 nov",
    isNew: false,
    isPinned: false,
    ...overrides,
  };
}

export function raceCard(overrides: Partial<RaceCard> = {}): RaceCard {
  return {
    slug: "kustmaran",
    title: "Kustmaran",
    place: "Kristianopel",
    summary: "Löparfest för hela familjen.",
    imageUrl: "/img/placeholder/hero.svg",
    imageAlt: "Löpare",
    url: null,
    startsAt: "2027-07-03T09:00:00.000Z",
    dateLabel: "lördag 3 juli 2027",
    isPast: false,
    ...overrides,
  };
}
