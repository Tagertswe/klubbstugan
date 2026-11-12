// Shapes the API returns and the pages render. Shared so app/ never imports
// server code.
import type { Countdown } from "../utils/dates";

export interface NewsCard {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  imageAlt: string | null;
  membersOnly: boolean;
  category: { slug: string; name: string };
  publishedAt: string | null;
  dateLabel: string;
  isNew: boolean;
  isPinned: boolean;
}

export type EventType = "TRAINING" | "RACE" | "CLUB" | "OTHER";

export interface Activity {
  slug: string;
  title: string;
  type: EventType;
  place: string;
  startsAt: string;
  tile: { day: string; month: string };
  time: string;
  /** "I dag", "I morgon" or null */
  relative: string | null;
}

export interface RaceCard {
  slug: string;
  title: string;
  place: string;
  summary: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  url: string | null;
  startsAt: string;
  dateLabel: string;
  isPast: boolean;
}

export interface HeroImage {
  imageUrl: string;
  imageAlt: string;
}

export interface NextRace {
  slug: string;
  title: string;
  dateLabel: string;
  countdown: Countdown;
}

export interface TrainingSession {
  group: { slug: string; name: string; description: string; accent: string; meetTime: string | null };
  workout: string;
  note: string | null;
}

export interface TrainingDay {
  date: string;
  dateLabel: string;
  shortLabel: string;
  sessions: TrainingSession[];
}
