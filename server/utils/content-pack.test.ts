import { describe, expect, it, vi } from "vitest";
import {
  CONTENT_FORMAT,
  ContentPackError,
  ContentPackSchema,
  MAX_MEDIA_BYTES,
  applyContentRows,
  expandRecurring,
  exportContentPack,
  mediaFileName,
  mediaType,
  readContentPack,
  safeMediaName,
  toContentRows,
  type ContentPackInput,
} from "./content-pack";

const bytes = (text: string) => new TextEncoder().encode(text);
const json = (value: unknown) => bytes(JSON.stringify(value));

const minimal: ContentPackInput = {
  format: CONTENT_FORMAT,
  version: 1,
  name: "Test",
  settings: { theme: "fart", "hero.image": "media/start.jpg", "hero.imageAlt": "Starten" },
  newsCategories: [{ slug: "tavling", name: "Tävling" }, { slug: "styrelsen", name: "Styrelsen", defaultVisibility: "MEMBERS" }],
  news: [
    {
      slug: "resultat",
      title: "Resultat",
      excerpt: "Kort",
      body: "Text",
      category: "tavling",
      imageUrl: "media/start.jpg",
      imageAlt: "Starten",
      publishedAt: "2026-11-08T10:00:00Z",
    },
  ],
  events: [{ slug: "jamjohalvan", title: "Jämjöhalvan", type: "RACE", startsAt: "2026-11-07T10:00:00Z", place: "Jämjö", url: "https://mittlopp.se" }],
  trainingGroups: [{ slug: "langa", name: "Långa", description: "10 km", accent: "ink", plan: [{ date: "2026-11-10", workout: "6 × 1 km" }] }],
  faq: [{ topic: "Medlemskap", question: "Vad kostar det?", answer: "650 kr." }],
  sponsors: [{ name: "Partner", logoUrl: "/img/partners/sponsor-1.jpg" }],
};

function zip(pack: unknown, extra: Record<string, Uint8Array> = { "media/start.jpg": bytes("jpeg") }, root = "") {
  const files: Record<string, Uint8Array> = { [`${root}content.json`]: json(pack) };
  for (const [name, data] of Object.entries(extra)) files[`${root}${name}`] = data;
  return files;
}

function problems(files: Record<string, Uint8Array>): string[] {
  try {
    readContentPack(files);
  } catch (error) {
    expect(error).toBeInstanceOf(ContentPackError);
    return (error as ContentPackError).problems;
  }
  throw new Error("expected the pack to be rejected");
}

describe("readContentPack", () => {
  it("reads a valid pack and the media it uses", () => {
    const { pack, media } = readContentPack(zip(minimal));
    expect(pack.name).toBe("Test");
    expect([...media.keys()]).toEqual(["media/start.jpg"]);
  });

  it("accepts a pack zipped with its folder", () => {
    const { media } = readContentPack({ "teamblekinge/": new Uint8Array(), ...zip(minimal, undefined, "teamblekinge/") });
    expect(media.get("media/start.jpg")).toEqual(bytes("jpeg"));
  });

  it("ignores macOS resource folders", () => {
    expect(() => readContentPack({ ...zip(minimal), "__MACOSX/._content.json": bytes("x") })).not.toThrow();
  });

  it("needs content.json with valid JSON", () => {
    expect(problems({ "media/start.jpg": bytes("x") })).toContain("content.json is missing");
    expect(problems({ "content.json": bytes("{nope") })[0]).toMatch(/not valid JSON/);
  });

  it("rejects personal data and unknown keys", () => {
    expect(problems(zip({ ...minimal, members: [{ name: "A" }] })).join()).toMatch(/members/);
  });

  it("rejects unsafe paths in the zip", () => {
    expect(problems({ ...zip(minimal), "../evil.jpg": bytes("x") })).toContain("unsafe path in zip: ../evil.jpg");
  });

  it("reports every problem at once", () => {
    const bad = {
      ...minimal,
      settings: { "hero.image": "media/missing.jpg" },
      news: [
        { ...minimal.news![0]!, category: "okand", imageUrl: "media/notes.txt" },
        { ...minimal.news![0]!, imageUrl: undefined },
      ],
    };
    expect(problems(zip(bad, { "media/notes.txt": bytes("x") }))).toEqual([
      'news: "resultat" appears twice',
      'news.resultat: unknown category "okand"',
      "settings: hero.image needs hero.imageAlt",
      "media/notes.txt: only .jpg, .jpeg, .png, .webp, .avif, .gif files",
      "media/missing.jpg is used but not in the zip",
    ]);
  });

  it("rejects an invalid hero image reference", () => {
    expect(problems(zip({ ...minimal, settings: { "hero.image": "//evil.example/x.jpg", "hero.imageAlt": "x" } }))).toEqual([
      "settings.hero.image: not a valid image reference",
    ]);
  });

  it("needs alt text for every image and safe references", () => {
    const bad = { ...minimal, events: [{ ...minimal.events![0]!, imageUrl: "//evil.example/x.jpg" }, { ...minimal.events![0]!, slug: "b", imageUrl: "/img/x.jpg" }] };
    const found = problems(zip(bad));
    expect(found.some((p) => p.startsWith("events.0.imageUrl"))).toBe(true);
    expect(found).toContain("events.1.imageAlt: an image needs imageAlt");
  });

  it("rejects duplicate dates in a term plan and oversized images", () => {
    const plan = [{ date: "2026-11-10", workout: "a" }, { date: "2026-11-10", workout: "b" }];
    const bad = { ...minimal, trainingGroups: [{ ...minimal.trainingGroups![0]!, plan }] };
    const big = new Uint8Array(MAX_MEDIA_BYTES + 1);
    expect(problems(zip(bad, { "media/start.jpg": big }))).toEqual([
      'trainingGroups.langa.plan: "2026-11-10" appears twice',
      "media/start.jpg is larger than 15 MB",
    ]);
  });
});

describe("media names", () => {
  it("knows which files a pack may carry", () => {
    expect(mediaType("a.JPG")).toBe("image/jpeg");
    expect(mediaType("a.webp")).toBe("image/webp");
    expect(mediaType("a.svg")).toBeNull();
    expect(mediaType("noext")).toBeNull();
  });

  it("prefixes stored files with a content hash", () => {
    const name = mediaFileName("media/Start Kustmaran.JPG", bytes("jpeg"));
    expect(name).toMatch(/^[0-9a-f]{12}-start-kustmaran.jpg$/);
    expect(mediaFileName("media/x.jpg", bytes("other"))).not.toBe(mediaFileName("media/x.jpg", bytes("jpeg")));
  });

  it("only serves plain image names from the uploads folder", () => {
    expect(safeMediaName("0123abcd-start.jpg")).toBe("0123abcd-start.jpg");
    expect(safeMediaName(undefined)).toBeNull();
    expect(safeMediaName("..")).toBeNull();
    expect(safeMediaName("a..jpg")).toBeNull();
    expect(safeMediaName(".env")).toBeNull();
    expect(safeMediaName("a/b.jpg")).toBeNull();
    expect(safeMediaName("notes.txt")).toBeNull();
  });
});

describe("toContentRows", () => {
  const now = new Date("2026-11-09T12:00:00Z"); // a Monday
  const pack = ContentPackSchema.parse({
    ...minimal,
    recurring: [{ slug: "intervaller", title: "Intervaller", weekday: 2, time: "18:00", place: "Klubblokalen", weeks: 2 }],
  });
  const rows = toContentRows(pack, (ref) => `/media/abc-${ref.slice(6)}`, now);

  it("points pack images at the stored files and keeps other references", () => {
    expect(rows.news[0]!.imageUrl).toBe("/media/abc-start.jpg");
    expect(rows.settings).toContainEqual({ key: "hero.image", value: "/media/abc-start.jpg" });
    expect(rows.sponsors[0]!.logoUrl).toBe("/img/partners/sponsor-1.jpg");
  });

  it("fills in defaults and dates", () => {
    expect(rows.newsCategories.map((c) => [c.slug, c.defaultVisibility, c.sortOrder])).toEqual([
      ["tavling", "PUBLIC", 0],
      ["styrelsen", "MEMBERS", 1],
    ]);
    expect(rows.news[0]!.categorySlug).toBe("tavling");
    expect(rows.news[0]!.publishedAt).toEqual(new Date("2026-11-08T10:00:00Z"));
    expect(rows.news[0]!.pinnedUntil).toBeNull();
    expect(rows.trainingGroups[0]!.sortOrder).toBe(1);
    expect(rows.trainingGroups[0]!.plan).toEqual([{ date: new Date("2026-11-10T00:00:00Z"), workout: "6 × 1 km", note: null }]);
  });

  it("expands weekly activities into dated events", () => {
    const training = rows.events.filter((e) => e.type === "TRAINING");
    expect(training.map((e) => [e.slug, e.startsAt.toISOString()])).toEqual([
      ["intervaller-2026-11-10", "2026-11-10T17:00:00.000Z"],
      ["intervaller-2026-11-17", "2026-11-17T17:00:00.000Z"],
    ]);
  });

  it("keeps clock time across the change to summer time and includes today", () => {
    const events = expandRecurring(
      ContentPackSchema.parse({ ...minimal, recurring: [{ slug: "langpass", title: "Långpass", weekday: 6, time: "09:00", place: "X", weeks: 2 }] }).recurring,
      new Date("2027-03-20T06:00:00Z"),
    );
    expect(events.map((e) => e.startsAt.toISOString())).toEqual(["2027-03-20T08:00:00.000Z", "2027-03-27T08:00:00.000Z"]);
    expect(events[0]!.type).toBe("TRAINING");
  });
});

describe("applyContentRows", () => {
  it("replaces all content in one transaction and never touches members", async () => {
    const calls: string[] = [];
    let id = 0;
    const model = (name: string) =>
      Object.fromEntries(
        ["deleteMany", "createMany", "create"].map((method) => [
          method,
          vi.fn(async (args?: { data: unknown }) => {
            calls.push(`${name}.${method}`);
            return method === "create" ? { id: `${name}-${++id}`, ...(args!.data as object) } : { count: 0 };
          }),
        ]),
      );
    const tx = Object.fromEntries(
      ["termPlanRow", "trainingGroup", "newsItem", "newsCategory", "event", "faqItem", "sponsor", "siteSetting", "member"].map((n) => [n, model(n)]),
    );
    const create = tx.newsItem!.create!;
    const db = { $transaction: vi.fn(async (fn: (t: typeof tx) => Promise<void>) => fn(tx)) };

    const rows = toContentRows(ContentPackSchema.parse(minimal), (ref) => `/media/${ref}`, new Date("2026-11-09T12:00:00Z"));
    await applyContentRows(db as never, rows);

    expect(db.$transaction).toHaveBeenCalledOnce();
    expect(calls.slice(0, 8).every((c) => c.endsWith(".deleteMany"))).toBe(true);
    expect(calls.some((c) => c.startsWith("member."))).toBe(false);
    expect(create).toHaveBeenCalledWith({ data: expect.objectContaining({ slug: "resultat", categoryId: "newsCategory-1" }) });
    expect(calls).toContain("termPlanRow.createMany");
  });
});

describe("exportContentPack", () => {
  const db = {
    siteSetting: { findMany: async () => [{ key: "hero.image", value: "/media/abc-start.jpg" }, { key: "hero.imageAlt", value: "Starten" }, { key: "theme", value: "fart" }] },
    newsCategory: { findMany: async () => [{ slug: "tavling", name: "Tävling", defaultVisibility: "PUBLIC", sortOrder: 0 }] },
    newsItem: {
      findMany: async () => [
        {
          slug: "resultat", title: "Resultat", excerpt: "", body: "Text", category: { slug: "tavling" },
          imageUrl: "/media/abc-start.jpg", imageAlt: "Starten", visibility: "PUBLIC", authorName: null,
          publishedAt: new Date("2026-11-08T10:00:00Z"), unpublishAt: null, pinnedUntil: null,
        },
      ],
    },
    event: {
      findMany: async () => [
        { slug: "jamjo", title: "Jämjö", type: "RACE", startsAt: new Date("2026-11-07T10:00:00Z"), endsAt: null, place: "Jämjö", summary: null, imageUrl: "/img/jamjohalvan.jpg", imageAlt: "Affisch", url: null, visibility: "PUBLIC" },
      ],
    },
    trainingGroup: {
      findMany: async () => [
        { slug: "langa", name: "Långa", description: "", accent: "ink", meetTime: null, sortOrder: 1, sessions: [{ date: new Date("2026-11-10T00:00:00Z"), workout: "6 × 1 km", note: null }] },
      ],
    },
    faqItem: { findMany: async () => [{ topic: "T", question: "Q", answer: "A", sortOrder: 1, showOnHome: true }] },
    sponsor: { findMany: async () => [{ name: "P", logoUrl: "/media/def-logo.png", url: null, sortOrder: 1 }] },
  };

  it("writes the content and its uploaded images as a pack that imports again", async () => {
    const readMedia = vi.fn(async (name: string) => bytes(name));
    const { pack, media } = await exportContentPack(db as never, readMedia, "backup");

    expect(pack.settings!["hero.image"]).toBe("media/abc-start.jpg");
    expect(pack.news![0]!.imageUrl).toBe("media/abc-start.jpg");
    expect(pack.events![0]!.imageUrl).toBe("/img/jamjohalvan.jpg");
    expect(pack.sponsors![0]!.logoUrl).toBe("media/def-logo.png");
    expect(pack.trainingGroups![0]!.plan).toEqual([{ date: "2026-11-10", workout: "6 × 1 km", note: null }]);
    expect([...media.keys()]).toEqual(["media/abc-start.jpg", "media/def-logo.png"]);
    expect(readMedia).toHaveBeenCalledTimes(2);

    const files: Record<string, Uint8Array> = { "content.json": json(pack) };
    for (const [ref, data] of media) files[ref] = data;
    expect(readContentPack(files).pack.name).toBe("backup");
  });
});
