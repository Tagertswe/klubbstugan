import { describe, expect, it } from "vitest";
import {
  calendarDayDiff,
  clubInstant,
  countdown,
  dateTile,
  formatLongDate,
  formatShortDate,
  dateOnlyKey,
  formatTime,
  localDateKey,
  localParts,
  relativeDayLabel,
} from "./dates";

// 2026-11-09 is a Monday. 17:00 UTC is 18:00 in Stockholm (CET, UTC+1).
const monday = new Date("2026-11-09T17:00:00Z");
const tuesdayEvening = new Date("2026-11-10T17:00:00Z");

describe("localParts", () => {
  it("converts to Stockholm time", () => {
    expect(localParts(monday)).toEqual({ year: 2026, month: 11, day: 9, weekday: 1, hour: 18, minute: 0 });
  });

  it("handles summer time (UTC+2)", () => {
    expect(localParts(new Date("2027-07-03T09:00:00Z")).hour).toBe(11);
  });
});

describe("calendar labels", () => {
  it("formats short and long dates in Swedish", () => {
    expect(formatShortDate(tuesdayEvening)).toBe("10 nov");
    expect(formatLongDate(tuesdayEvening, monday)).toBe("tisdag 10 november");
    expect(formatLongDate(new Date("2027-07-03T09:00:00Z"), monday)).toBe("lördag 3 juli 2027");
    expect(formatTime(tuesdayEvening)).toBe("18:00");
    expect(dateTile(tuesdayEvening)).toEqual({ day: "10", month: "nov" });
  });

  it("says I dag and I morgon by calendar day, not by 24 hours", () => {
    expect(relativeDayLabel(new Date("2026-11-09T22:30:00Z"), monday)).toBe("I dag"); // 23:30 local
    expect(relativeDayLabel(new Date("2026-11-09T23:30:00Z"), monday)).toBe("I morgon"); // 00:30 local next day
    expect(relativeDayLabel(tuesdayEvening, monday)).toBe("I morgon");
    expect(relativeDayLabel(new Date("2026-11-12T16:30:00Z"), monday)).toBeNull();
    expect(calendarDayDiff(monday, new Date("2026-11-08T12:00:00Z"))).toBe(-1);
  });
});

describe("countdown", () => {
  it("splits the time left into days, hours and minutes", () => {
    const target = new Date(monday.getTime() + ((2 * 24 + 3) * 60 + 4) * 60_000 + 59_000);
    expect(countdown(target, monday)).toEqual({ days: 2, hours: 3, minutes: 4 });
  });

  it("stops at zero once the target has passed", () => {
    expect(countdown(new Date("2026-01-01T00:00:00Z"), monday)).toEqual({ days: 0, hours: 0, minutes: 0 });
  });
});

describe("date keys", () => {
  it("gives the Stockholm calendar date for instants", () => {
    expect(localDateKey(new Date("2026-11-09T23:30:00Z"))).toBe("2026-11-10");
    expect(localDateKey(monday)).toBe("2026-11-09");
  });

  it("reads date-only values as stored", () => {
    expect(dateOnlyKey(new Date("2026-11-10T00:00:00Z"))).toBe("2026-11-10");
  });
});

describe("clubInstant", () => {
  it("reads a wall-clock time in Stockholm, winter and summer", () => {
    expect(clubInstant("2026-11-10", "18:00").toISOString()).toBe("2026-11-10T17:00:00.000Z");
    expect(clubInstant("2027-07-03", "11:00").toISOString()).toBe("2027-07-03T09:00:00.000Z");
  });

  it("handles the days daylight saving time changes", () => {
    expect(clubInstant("2027-03-28", "10:00").toISOString()).toBe("2027-03-28T08:00:00.000Z");
    expect(clubInstant("2026-10-25", "10:00").toISOString()).toBe("2026-10-25T09:00:00.000Z");
  });
});
