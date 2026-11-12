import type { Activity, NextRace, RaceCard, TrainingDay } from "../../shared/types/content";
import {
  countdown,
  dateOnlyKey,
  dateTile,
  formatLongDate,
  formatShortDate,
  formatTime,
  localDateKey,
  relativeDayLabel,
} from "../../shared/utils/dates";


export interface EventRow {
  slug: string;
  title: string;
  type: "TRAINING" | "RACE" | "CLUB" | "OTHER";
  startsAt: Date;
  place: string;
  summary?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  url?: string | null;
}

export function toActivity(row: EventRow, now: Date): Activity {
  return {
    slug: row.slug,
    title: row.title,
    type: row.type,
    place: row.place,
    startsAt: row.startsAt.toISOString(),
    tile: dateTile(row.startsAt),
    time: formatTime(row.startsAt),
    relative: relativeDayLabel(row.startsAt, now),
  };
}

export function toRaceCard(row: EventRow, now: Date): RaceCard {
  return {
    slug: row.slug,
    title: row.title,
    place: row.place,
    summary: row.summary ?? null,
    imageUrl: row.imageUrl ?? null,
    imageAlt: row.imageAlt ?? null,
    url: row.url ?? null,
    startsAt: row.startsAt.toISOString(),
    dateLabel: formatLongDate(row.startsAt, now),
    isPast: row.startsAt.getTime() < now.getTime(),
  };
}

/**
 * Orders races for the home page: upcoming ones by date, then the most recent
 * past ones ("Avgjort"), so a race that just happened still shows its results.
 */
export function orderRaces<T extends { startsAt: Date; slug: string }>(rows: T[], now: Date): T[] {
  const upcoming = rows
    .filter((r) => r.startsAt >= now)
    .sort((a, b) => +a.startsAt - +b.startsAt || a.slug.localeCompare(b.slug));
  const past = rows.filter((r) => r.startsAt < now).sort((a, b) => +b.startsAt - +a.startsAt);
  return [...upcoming, ...past];
}

export function nextRace(rows: EventRow[], now: Date): NextRace | null {
  const upcoming = rows
    .filter((r) => r.type === "RACE" && r.startsAt > now)
    .sort((a, b) => +a.startsAt - +b.startsAt)[0];
  if (!upcoming) return null;
  return {
    slug: upcoming.slug,
    title: upcoming.title,
    dateLabel: formatLongDate(upcoming.startsAt, now),
    countdown: countdown(upcoming.startsAt, now),
  };
}

export interface TermPlanRowInput {
  date: Date;
  workout: string;
  note: string | null;
  group: { slug: string; name: string; description: string; accent: string; meetTime: string | null; sortOrder: number };
}

/** The first term-plan day from today on (club time), with its sessions in group order. */
export function nextTrainingDay(rows: TermPlanRowInput[], now: Date): TrainingDay | null {
  const today = localDateKey(now);
  const upcoming = rows.filter((r) => dateOnlyKey(r.date) >= today);
  if (upcoming.length === 0) return null;
  const firstKey = upcoming.map((r) => dateOnlyKey(r.date)).sort()[0]!;
  const day = upcoming
    .filter((r) => dateOnlyKey(r.date) === firstKey)
    .sort((a, b) => a.group.sortOrder - b.group.sortOrder);
  // A date-only value is UTC midnight; noon UTC is the same calendar day in Sweden.
  const labelDate = new Date(`${firstKey}T12:00:00Z`);
  return {
    date: firstKey,
    dateLabel: formatLongDate(labelDate, now),
    shortLabel: formatShortDate(labelDate),
    sessions: day.map(({ group, workout, note }) => ({
      group: {
        slug: group.slug,
        name: group.name,
        description: group.description,
        accent: group.accent,
        meetTime: group.meetTime,
      },
      workout,
      note,
    })),
  };
}
