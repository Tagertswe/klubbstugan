import { describe, expect, it } from "vitest";
import { isPinned, publicNewsWhere, toNewsCard, type NewsRow } from "./news";

const now = new Date("2026-11-09T12:00:00Z");

function row(overrides: Partial<NewsRow> = {}): NewsRow {
  return {
    slug: "resultat-jamjohalvan",
    title: "Resultat från Jämjöhalvan",
    excerpt: "Klubbens resultat.",
    imageUrl: "/img/placeholder/news.svg",
    imageAlt: "Barnloppet",
    visibility: "PUBLIC",
    publishedAt: new Date("2026-11-08T10:00:00Z"),
    pinnedUntil: null,
    category: { slug: "tavling", name: "Tävling & resor" },
    ...overrides,
  };
}

describe("publicNewsWhere", () => {
  it("limits to public, published and not yet unpublished news", () => {
    expect(publicNewsWhere(now)).toEqual({
      visibility: "PUBLIC",
      publishedAt: { lte: now },
      OR: [{ unpublishAt: null }, { unpublishAt: { gt: now } }],
    });
  });

  it("adds a category filter when asked", () => {
    expect(publicNewsWhere(now, "stafett")).toMatchObject({ category: { slug: "stafett" } });
  });
});

describe("isPinned", () => {
  it("is pinned until the date passes", () => {
    expect(isPinned({ pinnedUntil: new Date("2026-11-20T00:00:00Z") }, now)).toBe(true);
    expect(isPinned({ pinnedUntil: new Date("2026-11-01T00:00:00Z") }, now)).toBe(false);
    expect(isPinned({ pinnedUntil: null }, now)).toBe(false);
  });
});

describe("toNewsCard", () => {
  it("maps a row to what the page shows", () => {
    expect(toNewsCard(row(), now)).toEqual({
      slug: "resultat-jamjohalvan",
      title: "Resultat från Jämjöhalvan",
      excerpt: "Klubbens resultat.",
      imageUrl: "/img/placeholder/news.svg",
      imageAlt: "Barnloppet",
      membersOnly: false,
      category: { slug: "tavling", name: "Tävling & resor" },
      publishedAt: "2026-11-08T10:00:00.000Z",
      dateLabel: "8 nov",
      isNew: true,
      isPinned: false,
    });
  });

  it("marks members-only, pinned and older items", () => {
    const card = toNewsCard(
      row({
        visibility: "MEMBERS",
        publishedAt: new Date("2026-10-12T10:00:00Z"),
        pinnedUntil: new Date("2026-12-01T00:00:00Z"),
      }),
      now,
    );
    expect(card).toMatchObject({ membersOnly: true, isNew: false, isPinned: true, dateLabel: "12 okt" });
  });

  it("copes with an unpublished draft", () => {
    expect(toNewsCard(row({ publishedAt: null }), now)).toMatchObject({ publishedAt: null, dateLabel: "", isNew: false });
  });
});
