import type { NewsCard } from "../../shared/types/content";
import { calendarDayDiff, formatShortDate } from "../../shared/utils/dates";


export interface NewsRow {
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  imageUrl: string | null;
  imageAlt: string | null;
  visibility: "PUBLIC" | "MEMBERS";
  authorName?: string | null;
  publishedAt: Date | null;
  pinnedUntil: Date | null;
  category: { slug: string; name: string };
}

/** Days a news item counts as "Ny". */
export const NEW_FOR_DAYS = 7;

/**
 * Prisma filter for news a logged-out visitor may see right now: public,
 * published, not yet unpublished, optionally in one category.
 */
export function publicNewsWhere(now: Date, categorySlug?: string) {
  return {
    visibility: "PUBLIC" as const,
    publishedAt: { lte: now },
    OR: [{ unpublishAt: null }, { unpublishAt: { gt: now } }],
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };
}

export function isPinned(row: Pick<NewsRow, "pinnedUntil">, now: Date): boolean {
  return row.pinnedUntil !== null && row.pinnedUntil.getTime() > now.getTime();
}

export function toNewsCard(row: NewsRow, now: Date): NewsCard {
  const published = row.publishedAt;
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    membersOnly: row.visibility === "MEMBERS",
    category: row.category,
    publishedAt: published ? published.toISOString() : null,
    dateLabel: published ? formatShortDate(published) : "",
    isNew: published ? calendarDayDiff(published, now) < NEW_FOR_DAYS : false,
    isPinned: isPinned(row, now),
  };
}
