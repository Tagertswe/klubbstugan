import { describe, expect, it } from "vitest";
import { nextRace, nextTrainingDay, orderRaces, toActivity, toRaceCard, type EventRow, type TermPlanRowInput } from "./schedule";

const now = new Date("2026-11-09T12:00:00Z"); // Monday 13:00 in Stockholm

function event(overrides: Partial<EventRow>): EventRow {
  return { slug: "e", title: "Intervallträning", type: "TRAINING", startsAt: now, place: "Klubblokalen", ...overrides };
}

describe("toActivity", () => {
  it("adds a date tile, time and relative day", () => {
    expect(toActivity(event({ startsAt: new Date("2026-11-10T17:00:00Z") }), now)).toEqual({
      slug: "e",
      title: "Intervallträning",
      type: "TRAINING",
      place: "Klubblokalen",
      startsAt: "2026-11-10T17:00:00.000Z",
      tile: { day: "10", month: "nov" },
      time: "18:00",
      relative: "I morgon",
    });
  });
});

describe("races", () => {
  const kustmaran = event({ slug: "kustmaran", title: "Kustmaran", type: "RACE", startsAt: new Date("2027-07-03T09:00:00Z"), place: "Kristianopel" });
  const jamjo = event({ slug: "jamjohalvan", title: "Jämjöhalvan", type: "RACE", startsAt: new Date("2026-11-07T10:00:00Z"), place: "Jämjö" });
  const old = event({ slug: "gammalt", type: "RACE", startsAt: new Date("2025-11-08T10:00:00Z") });

  it("puts upcoming races first, then the most recent past ones", () => {
    expect(orderRaces([old, kustmaran, jamjo], now).map((r) => r.slug)).toEqual(["kustmaran", "jamjohalvan", "gammalt"]);
  });

  it("orders races on the same day by slug", () => {
    const vsm = event({ slug: "veteran-sm", type: "RACE", startsAt: kustmaran.startsAt });
    expect(orderRaces([vsm, kustmaran], now).map((r) => r.slug)).toEqual(["kustmaran", "veteran-sm"]);
  });

  it("marks past races and fills in missing optional fields", () => {
    expect(toRaceCard(jamjo, now)).toMatchObject({ isPast: true, dateLabel: "lördag 7 november", summary: null, url: null });
    expect(toRaceCard(kustmaran, now)).toMatchObject({ isPast: false, dateLabel: "lördag 3 juli 2027" });
  });

  it("counts down to the next race only", () => {
    const next = nextRace([jamjo, kustmaran, event({ type: "TRAINING", startsAt: new Date("2026-11-10T17:00:00Z") })], now);
    expect(next?.slug).toBe("kustmaran");
    expect(next?.countdown.days).toBe(235);
    expect(nextRace([jamjo], now)).toBeNull();
  });
});

describe("nextTrainingDay", () => {
  const group = (slug: string, sortOrder: number) => ({
    slug,
    name: slug,
    description: "",
    accent: "ink",
    meetTime: null,
    sortOrder,
  });
  const rows: TermPlanRowInput[] = [
    { date: new Date("2026-11-03T00:00:00Z"), workout: "Förra veckan", note: null, group: group("langa", 1) },
    { date: new Date("2026-11-10T00:00:00Z"), workout: "6 × 600 m", note: null, group: group("korta", 2) },
    { date: new Date("2026-11-10T00:00:00Z"), workout: "3 × 2 km", note: "i halvmaratonfart", group: group("langa", 1) },
    { date: new Date("2026-11-17T00:00:00Z"), workout: "Nästa vecka", note: null, group: group("langa", 1) },
  ];

  it("returns the first day from today, sessions in group order", () => {
    const day = nextTrainingDay(rows, now);
    expect(day?.date).toBe("2026-11-10");
    expect(day?.dateLabel).toBe("tisdag 10 november");
    expect(day?.shortLabel).toBe("10 nov");
    expect(day?.sessions.map((s) => s.workout)).toEqual(["3 × 2 km", "6 × 600 m"]);
  });

  it("includes today's session", () => {
    expect(nextTrainingDay(rows, new Date("2026-11-10T20:00:00Z"))?.date).toBe("2026-11-10");
  });

  it("returns null when the term plan has ended", () => {
    expect(nextTrainingDay(rows, new Date("2026-12-01T12:00:00Z"))).toBeNull();
  });
});
