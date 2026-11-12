// Swedish date labels. All calendar logic uses the club's time zone so the
// server (UTC in Docker) and the browser agree on what "i morgon" means.

export const CLUB_TIME_ZONE = "Europe/Stockholm";

const MONTHS_SHORT = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
const MONTHS_LONG = [
  "januari", "februari", "mars", "april", "maj", "juni",
  "juli", "augusti", "september", "oktober", "november", "december",
];
const WEEKDAYS = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];

interface LocalParts {
  year: number;
  month: number; // 1–12
  day: number;
  weekday: number; // 0 = Sunday
  hour: number;
  minute: number;
}

export function localParts(date: Date, timeZone = CLUB_TIME_ZONE): LocalParts {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: weekdayIndex,
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

/** "2026-11-09": the calendar date in the club's time zone. */
export function localDateKey(date: Date): string {
  const p = localParts(date);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/** The calendar date of a date-only database value (stored as UTC midnight). */
export function dateOnlyKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** The instant of a wall-clock time ("18:00") on a calendar date ("2026-11-10") in the club's time zone. */
export function clubInstant(dateKey: string, time: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number) as [number, number, number];
  const [hour, minute] = time.split(":").map(Number) as [number, number];
  const wanted = Date.UTC(year, month - 1, day, hour, minute);
  // Start from the wall-clock time read as UTC and correct by the zone offset;
  // a second pass settles days when daylight saving time changes.
  let guess = wanted;
  for (let i = 0; i < 2; i++) {
    const p = localParts(new Date(guess));
    guess += wanted - Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  }
  return new Date(guess);
}

/** Days between two calendar dates in the club's time zone (b − a). */
export function calendarDayDiff(a: Date, b: Date): number {
  const pa = localParts(a);
  const pb = localParts(b);
  const ua = Date.UTC(pa.year, pa.month - 1, pa.day);
  const ub = Date.UTC(pb.year, pb.month - 1, pb.day);
  return Math.round((ub - ua) / 86_400_000);
}

/** "10 nov" */
export function formatShortDate(date: Date): string {
  const p = localParts(date);
  return `${p.day} ${MONTHS_SHORT[p.month - 1]}`;
}

/** "tisdag 10 november" (with the year added when it is not the current one) */
export function formatLongDate(date: Date, now: Date = new Date()): string {
  const p = localParts(date);
  const base = `${WEEKDAYS[p.weekday]} ${p.day} ${MONTHS_LONG[p.month - 1]}`;
  return p.year === localParts(now).year ? base : `${base} ${p.year}`;
}

/** "18:00" */
export function formatTime(date: Date): string {
  const p = localParts(date);
  return `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
}

/** "I dag", "I morgon", or null for other days. */
export function relativeDayLabel(date: Date, now: Date): string | null {
  const diff = calendarDayDiff(now, date);
  if (diff === 0) return "I dag";
  if (diff === 1) return "I morgon";
  return null;
}

/** Day/month tile for lists: { day: "10", month: "nov" } */
export function dateTile(date: Date): { day: string; month: string } {
  const p = localParts(date);
  return { day: String(p.day), month: MONTHS_SHORT[p.month - 1]! };
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
}

/** Whole days, hours and minutes until target; zeros when it has passed. */
export function countdown(target: Date, now: Date): Countdown {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const totalMinutes = Math.floor(ms / 60_000);
  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}
