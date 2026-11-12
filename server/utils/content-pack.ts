// Content packs: the site's public content (settings, news, events, training,
// FAQ, sponsors) and its images in one zip, so a fresh deploy can be loaded
// with `npm run content -- import pack.zip` (CLAUDE.md, Content packs).
//
//   content.json   the content, validated by ContentPackSchema
//   media/…        images that content.json refers to as "media/<file>"
//
// A pack never holds members or any other personal data: the schema is strict,
// so a "members" key is an error. Importing replaces all content; members stay.
import { createHash } from "node:crypto";
import { z } from "zod";
import type { PrismaClient } from "../generated/prisma/client";
import { clubInstant, localDateKey, localParts } from "../../shared/utils/dates";

export const CONTENT_FORMAT = "klubbstugan-content";
export const CONTENT_VERSION = 1;
export const MEDIA_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};
export const MAX_MEDIA_BYTES = 15 * 1024 * 1024;

const DAY = 86_400_000;
const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase letters, digits and dashes");
const Instant = z.iso.datetime({ offset: true });
const Time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:MM");
const Visibility = z.enum(["PUBLIC", "MEMBERS"]);
/** "media/<file>" inside the pack, a path on the site ("/img/…") or an https URL. */
const ImageRef = z.string().refine((v) => /^media\/[^/]+$/.test(v) || (v.startsWith("/") && !v.startsWith("//")) || v.startsWith("https://"), {
  message: 'use "media/<file>", a site path ("/img/…") or an https:// URL',
});

/** Every image needs a description for screen readers. */
function withAlt<T extends { imageUrl?: string | null; imageAlt?: string | null }>(item: T, ctx: z.RefinementCtx) {
  if (item.imageUrl && !item.imageAlt?.trim()) ctx.addIssue({ code: "custom", path: ["imageAlt"], message: "an image needs imageAlt" });
}

const NewsSchema = z
  .strictObject({
    slug: Slug,
    title: z.string().min(1),
    excerpt: z.string(),
    body: z.string(),
    category: Slug,
    imageUrl: ImageRef.nullish(),
    imageAlt: z.string().nullish(),
    visibility: Visibility.optional(),
    authorName: z.string().nullish(),
    publishedAt: Instant.nullish(),
    unpublishAt: Instant.nullish(),
    pinnedUntil: Instant.nullish(),
  })
  .superRefine(withAlt);

const EventSchema = z
  .strictObject({
    slug: Slug,
    title: z.string().min(1),
    type: z.enum(["TRAINING", "RACE", "CLUB", "OTHER"]),
    startsAt: Instant,
    endsAt: Instant.nullish(),
    place: z.string(),
    summary: z.string().nullish(),
    imageUrl: ImageRef.nullish(),
    imageAlt: z.string().nullish(),
    url: z.url({ protocol: /^https?$/ }).nullish(),
    visibility: Visibility.optional(),
  })
  .superRefine(withAlt);

/** A weekly activity, expanded into events for `weeks` weeks from the import day. */
const RecurringSchema = z.strictObject({
  slug: Slug,
  title: z.string().min(1),
  type: z.enum(["TRAINING", "CLUB", "OTHER"]).default("TRAINING"),
  weekday: z.number().int().min(0).max(6),
  time: Time,
  place: z.string(),
  weeks: z.number().int().min(1).max(52).default(8),
});

const TrainingGroupSchema = z.strictObject({
  slug: Slug,
  name: z.string().min(1),
  description: z.string(),
  accent: z.enum(["ink", "orange", "purple"]),
  meetTime: Time.nullish(),
  sortOrder: z.number().int().optional(),
  plan: z.array(z.strictObject({ date: z.iso.date(), workout: z.string().min(1), note: z.string().nullish() })).default([]),
});

export const ContentPackSchema = z.strictObject({
  format: z.literal(CONTENT_FORMAT),
  version: z.literal(CONTENT_VERSION),
  name: z.string().min(1),
  /** theme, training.time, training.place, hero.image, hero.imageAlt, … */
  settings: z.record(z.string(), z.string()).default({}),
  newsCategories: z
    .array(z.strictObject({ slug: Slug, name: z.string().min(1), defaultVisibility: Visibility.optional(), sortOrder: z.number().int().optional() }))
    .default([]),
  news: z.array(NewsSchema).default([]),
  events: z.array(EventSchema).default([]),
  recurring: z.array(RecurringSchema).default([]),
  trainingGroups: z.array(TrainingGroupSchema).default([]),
  faq: z
    .array(
      z.strictObject({
        topic: z.string().min(1),
        question: z.string().min(1),
        answer: z.string().min(1),
        sortOrder: z.number().int().optional(),
        showOnHome: z.boolean().optional(),
      }),
    )
    .default([]),
  sponsors: z
    .array(z.strictObject({ name: z.string().min(1), logoUrl: ImageRef, url: z.url({ protocol: /^https?$/ }).nullish(), sortOrder: z.number().int().optional() }))
    .default([]),
});

export type ContentPack = z.infer<typeof ContentPackSchema>;
export type ContentPackInput = z.input<typeof ContentPackSchema>;

export class ContentPackError extends Error {
  constructor(public readonly problems: string[]) {
    super(`Invalid content pack:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    this.name = "ContentPackError";
  }
}

/** The content type for a media file name, or null if packs may not carry it. */
export function mediaType(name: string): string | null {
  const dot = name.lastIndexOf(".");
  return dot < 0 ? null : (MEDIA_TYPES[name.slice(dot).toLowerCase()] ?? null);
}

/** Stored file name: a content hash first, so a changed image gets a new address and can be cached for good. */
export function mediaFileName(ref: string, bytes: Uint8Array): string {
  const base = ref.slice(ref.lastIndexOf("/") + 1).toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^[-.]+/, "");
  return `${createHash("sha256").update(bytes).digest("hex").slice(0, 12)}-${base}`;
}

/** A safe file name for the /media route, or null for anything that could leave the uploads folder. */
export function safeMediaName(param: string | undefined): string | null {
  if (!param || !/^[a-z0-9][a-z0-9._-]*$/.test(param) || param.includes("..")) return null;
  return mediaType(param) ? param : null;
}

/** Image references in a pack, so they can be checked and rewritten in one place. */
function imageRefs(pack: ContentPack): string[] {
  return [
    ...pack.news.map((n) => n.imageUrl),
    ...pack.events.map((e) => e.imageUrl),
    ...pack.sponsors.map((s) => s.logoUrl),
    pack.settings["hero.image"],
  ].filter((ref): ref is string => !!ref);
}

export interface ReadPack {
  pack: ContentPack;
  /** "media/x.jpg" → bytes, for every media file the content uses */
  media: Map<string, Uint8Array>;
}

/**
 * Validates the files of an unzipped pack. Accepts content.json at the top or
 * inside one folder (what `zip -r pack.zip folder` makes). Collects every
 * problem, so one run shows everything to fix.
 */
export function readContentPack(files: Record<string, Uint8Array>): ReadPack {
  const names = Object.keys(files).filter((n) => !n.endsWith("/") && !n.startsWith("__MACOSX/"));
  const problems: string[] = [];
  for (const name of names) {
    if (name.startsWith("/") || name.split("/").includes("..")) problems.push(`unsafe path in zip: ${name}`);
  }
  const manifest = names.find((n) => n === "content.json" || /^[^/]+\/content\.json$/.test(n));
  if (!manifest) throw new ContentPackError([...problems, "content.json is missing"]);
  const root = manifest.slice(0, -"content.json".length);

  let json: unknown;
  try {
    json = JSON.parse(new TextDecoder().decode(files[manifest]));
  } catch (error) {
    throw new ContentPackError([...problems, `content.json is not valid JSON: ${(error as Error).message}`]);
  }
  const parsed = ContentPackSchema.safeParse(json);
  if (!parsed.success) {
    throw new ContentPackError([...problems, ...parsed.error.issues.map((i) => `${i.path.join(".") || "content.json"}: ${i.message}`)]);
  }
  const pack = parsed.data;

  const duplicates = (label: string, keys: string[]) => {
    const seen = new Set<string>();
    for (const key of keys) {
      if (seen.has(key)) problems.push(`${label}: "${key}" appears twice`);
      seen.add(key);
    }
  };
  duplicates("newsCategories", pack.newsCategories.map((c) => c.slug));
  duplicates("news", pack.news.map((n) => n.slug));
  duplicates("events", pack.events.map((e) => e.slug));
  duplicates("recurring", pack.recurring.map((r) => r.slug));
  duplicates("trainingGroups", pack.trainingGroups.map((g) => g.slug));
  for (const group of pack.trainingGroups) duplicates(`trainingGroups.${group.slug}.plan`, group.plan.map((p) => p.date));

  const categories = new Set(pack.newsCategories.map((c) => c.slug));
  for (const item of pack.news) {
    if (!categories.has(item.category)) problems.push(`news.${item.slug}: unknown category "${item.category}"`);
  }
  if (pack.settings["hero.image"] && !pack.settings["hero.imageAlt"]?.trim()) problems.push("settings: hero.image needs hero.imageAlt");
  const heroImage = pack.settings["hero.image"];
  if (heroImage && !ImageRef.safeParse(heroImage).success) problems.push(`settings.hero.image: not a valid image reference`);

  const media = new Map<string, Uint8Array>();
  for (const ref of new Set(imageRefs(pack))) {
    if (!ref.startsWith("media/")) continue;
    const bytes = files[root + ref];
    if (!bytes) problems.push(`${ref} is used but not in the zip`);
    else if (!mediaType(ref)) problems.push(`${ref}: only ${Object.keys(MEDIA_TYPES).join(", ")} files`);
    else if (bytes.byteLength > MAX_MEDIA_BYTES) problems.push(`${ref} is larger than ${MAX_MEDIA_BYTES / 1024 / 1024} MB`);
    else media.set(ref, bytes);
  }

  if (problems.length) throw new ContentPackError(problems);
  return { pack, media };
}

export interface ContentRows {
  settings: { key: string; value: string }[];
  newsCategories: { slug: string; name: string; defaultVisibility: "PUBLIC" | "MEMBERS"; sortOrder: number }[];
  news: (Omit<ContentPack["news"][number], "category" | "publishedAt" | "unpublishAt" | "pinnedUntil"> & {
    categorySlug: string;
    publishedAt: Date | null;
    unpublishAt: Date | null;
    pinnedUntil: Date | null;
  })[];
  events: (Omit<ContentPack["events"][number], "startsAt" | "endsAt"> & { startsAt: Date; endsAt: Date | null })[];
  trainingGroups: (Omit<ContentPack["trainingGroups"][number], "plan"> & { plan: { date: Date; workout: string; note: string | null }[] })[];
  faq: ContentPack["faq"];
  sponsors: ContentPack["sponsors"];
}

/** Weekly activities as dated events, `weeks` weeks from `now` (today included). */
export function expandRecurring(recurring: ContentPack["recurring"], now: Date): ContentRows["events"] {
  const today = localParts(now).weekday;
  const events: ContentRows["events"] = [];
  for (const r of recurring) {
    for (let week = 0; week < r.weeks; week++) {
      const offset = ((r.weekday - today + 7) % 7) + week * 7;
      const dateKey = localDateKey(new Date(now.getTime() + offset * DAY));
      events.push({
        slug: `${r.slug}-${dateKey}`,
        title: r.title,
        type: r.type,
        startsAt: clubInstant(dateKey, r.time),
        endsAt: null,
        place: r.place,
      });
    }
  }
  return events;
}

/**
 * Database rows for a validated pack. `mediaUrl` maps "media/x.jpg" to where
 * the file was stored ("/media/<hash>-x.jpg"); other references pass through.
 */
export function toContentRows(pack: ContentPack, mediaUrl: (ref: string) => string, now = new Date()): ContentRows {
  const image = <T extends string | null | undefined>(ref: T) => (ref?.startsWith("media/") ? mediaUrl(ref) : ref);
  const date = (value: string | null | undefined) => (value ? new Date(value) : null);
  const settings = { ...pack.settings };
  if (settings["hero.image"]) settings["hero.image"] = image(settings["hero.image"]);

  return {
    settings: Object.entries(settings).map(([key, value]) => ({ key, value })),
    newsCategories: pack.newsCategories.map((c, i) => ({
      slug: c.slug,
      name: c.name,
      defaultVisibility: c.defaultVisibility ?? "PUBLIC",
      sortOrder: c.sortOrder ?? i,
    })),
    news: pack.news.map(({ category, ...item }) => ({
      ...item,
      categorySlug: category,
      imageUrl: image(item.imageUrl),
      publishedAt: date(item.publishedAt),
      unpublishAt: date(item.unpublishAt),
      pinnedUntil: date(item.pinnedUntil),
    })),
    events: [
      ...pack.events.map((e) => ({ ...e, imageUrl: image(e.imageUrl), startsAt: new Date(e.startsAt), endsAt: date(e.endsAt) })),
      ...expandRecurring(pack.recurring, now),
    ],
    trainingGroups: pack.trainingGroups.map(({ plan, ...group }, i) => ({
      ...group,
      sortOrder: group.sortOrder ?? i + 1,
      plan: plan.map((row) => ({ date: new Date(`${row.date}T00:00:00Z`), workout: row.workout, note: row.note ?? null })),
    })),
    faq: pack.faq,
    sponsors: pack.sponsors.map((s) => ({ ...s, logoUrl: image(s.logoUrl)! })),
  };
}

type Db = Pick<PrismaClient, "$transaction">;

/** Replaces all site content with `rows` in one transaction. Members are never touched. */
export async function applyContentRows(db: Db, rows: ContentRows): Promise<void> {
  await db.$transaction(async (tx) => {
    await tx.termPlanRow.deleteMany();
    await tx.trainingGroup.deleteMany();
    await tx.newsItem.deleteMany();
    await tx.newsCategory.deleteMany();
    await tx.event.deleteMany();
    await tx.faqItem.deleteMany();
    await tx.sponsor.deleteMany();
    await tx.siteSetting.deleteMany();

    await tx.siteSetting.createMany({ data: rows.settings });
    const categoryIds: Record<string, string> = {};
    for (const category of rows.newsCategories) {
      categoryIds[category.slug] = (await tx.newsCategory.create({ data: category })).id;
    }
    for (const { categorySlug, ...item } of rows.news) {
      await tx.newsItem.create({ data: { ...item, categoryId: categoryIds[categorySlug]! } });
    }
    await tx.event.createMany({ data: rows.events });
    for (const { plan, ...group } of rows.trainingGroups) {
      const { id } = await tx.trainingGroup.create({ data: group });
      await tx.termPlanRow.createMany({ data: plan.map((row) => ({ ...row, groupId: id })) });
    }
    await tx.faqItem.createMany({ data: rows.faq });
    await tx.sponsor.createMany({ data: rows.sponsors });
  }, { timeout: 60_000 });
}

type ExportDb = Pick<PrismaClient, "siteSetting" | "newsCategory" | "newsItem" | "event" | "trainingGroup" | "faqItem" | "sponsor">;

/**
 * The current content as a pack. Images stored under /media/ go into the pack
 * as media/<file> (read with `readMedia`); other references are kept as they are.
 * Recurring activities come out as the dated events they were expanded into.
 */
export async function exportContentPack(
  db: ExportDb,
  readMedia: (name: string) => Promise<Uint8Array>,
  name: string,
): Promise<{ pack: ContentPackInput; media: Map<string, Uint8Array> }> {
  const media = new Map<string, Uint8Array>();
  const ref = async <T extends string | null>(url: T): Promise<T | string> => {
    if (!url?.startsWith("/media/")) return url;
    const file = url.slice("/media/".length);
    const key = `media/${file}`;
    if (!media.has(key)) media.set(key, await readMedia(file));
    return key;
  };
  const iso = (d: Date | null) => d?.toISOString() ?? null;

  const [settings, categories, news, events, groups, faq, sponsors] = await Promise.all([
    db.siteSetting.findMany({ orderBy: { key: "asc" } }),
    db.newsCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    db.newsItem.findMany({ include: { category: true }, orderBy: { publishedAt: "desc" } }),
    db.event.findMany({ orderBy: { startsAt: "asc" } }),
    db.trainingGroup.findMany({ include: { sessions: { orderBy: { date: "asc" } } }, orderBy: { sortOrder: "asc" } }),
    db.faqItem.findMany({ orderBy: [{ topic: "asc" }, { sortOrder: "asc" }] }),
    db.sponsor.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const settingsOut: Record<string, string> = {};
  for (const s of settings) settingsOut[s.key] = s.key === "hero.image" ? ((await ref(s.value)) as string) : s.value;

  const pack: ContentPackInput = {
    format: CONTENT_FORMAT,
    version: CONTENT_VERSION,
    name,
    settings: settingsOut,
    newsCategories: categories.map(({ slug, name, defaultVisibility, sortOrder }) => ({ slug, name, defaultVisibility, sortOrder })),
    news: [],
    events: [],
    trainingGroups: groups.map(({ slug, name, description, accent, meetTime, sortOrder, sessions }) => ({
      slug,
      name,
      description,
      accent: accent as "ink" | "orange" | "purple",
      meetTime,
      sortOrder,
      plan: sessions.map((s) => ({ date: s.date.toISOString().slice(0, 10), workout: s.workout, note: s.note })),
    })),
    faq: faq.map(({ topic, question, answer, sortOrder, showOnHome }) => ({ topic, question, answer, sortOrder, showOnHome })),
    sponsors: [],
  };
  for (const n of news) {
    pack.news!.push({
      slug: n.slug,
      title: n.title,
      excerpt: n.excerpt,
      body: n.body,
      category: n.category.slug,
      imageUrl: await ref(n.imageUrl),
      imageAlt: n.imageAlt,
      visibility: n.visibility,
      authorName: n.authorName,
      publishedAt: iso(n.publishedAt),
      unpublishAt: iso(n.unpublishAt),
      pinnedUntil: iso(n.pinnedUntil),
    });
  }
  for (const e of events) {
    pack.events!.push({
      slug: e.slug,
      title: e.title,
      type: e.type,
      startsAt: e.startsAt.toISOString(),
      endsAt: iso(e.endsAt),
      place: e.place,
      summary: e.summary,
      imageUrl: await ref(e.imageUrl),
      imageAlt: e.imageAlt,
      url: e.url,
      visibility: e.visibility,
    });
  }
  for (const s of sponsors) pack.sponsors!.push({ name: s.name, logoUrl: (await ref(s.logoUrl)) as string, url: s.url, sortOrder: s.sortOrder });

  return { pack, media };
}
