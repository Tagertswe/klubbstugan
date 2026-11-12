import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import ActivityList from "~/components/ActivityList.vue";
import CountdownBox from "~/components/CountdownBox.vue";
import DateTile from "~/components/DateTile.vue";
import RaceCard from "~/components/RaceCard.vue";
import TrainingWeek from "~/components/TrainingWeek.vue";
import type { Activity, TrainingDay } from "#shared/types/content";
import { raceCard } from "./helpers";

const activity = (overrides: Partial<Activity> = {}): Activity => ({
  slug: "a",
  title: "Intervallträning",
  type: "TRAINING",
  place: "Klubblokalen",
  startsAt: "2026-11-10T17:00:00.000Z",
  tile: { day: "10", month: "nov" },
  time: "18:00",
  relative: "I morgon",
  ...overrides,
});

describe("ActivityList", () => {
  it("shows date tile, relative day, time and place", async () => {
    const wrapper = await mountSuspended(ActivityList, { props: { items: [activity(), activity({ slug: "b", relative: null })] } });
    const rows = wrapper.findAll("li");
    expect(rows[0]!.text()).toContain("I morgon 18:00 · Klubblokalen");
    expect(rows[1]!.text()).toContain("18:00 · Klubblokalen");
    expect(rows[1]!.text()).not.toContain("I morgon");
    expect(wrapper.find("h2").text()).toBe("Kommande aktiviteter");
  });

  it("says so when the calendar is empty, with a custom title", async () => {
    const wrapper = await mountSuspended(ActivityList, { props: { items: [], title: "På gång" } });
    expect(wrapper.find("h2").text()).toBe("På gång");
    expect(wrapper.text()).toContain("Inga aktiviteter inlagda just nu.");
  });
});

describe("DateTile and CountdownBox", () => {
  it("shows day and month", async () => {
    const wrapper = await mountSuspended(DateTile, { props: { day: "12", month: "nov" } });
    expect(wrapper.text()).toBe("12nov");
  });

  it("shows days, hours and minutes to the race", async () => {
    const wrapper = await mountSuspended(CountdownBox, {
      props: { race: { slug: "kustmaran", title: "Kustmaran", dateLabel: "", countdown: { days: 235, hours: 21, minutes: 4 } } },
    });
    expect(wrapper.find(".count-label").text()).toBe("Kustmaran · start om");
    expect(wrapper.findAll("dd").map((d) => d.text())).toEqual(["235", "21", "4"]);
  });
});

describe("RaceCard", () => {
  it("links an upcoming race to its page", async () => {
    const wrapper = await mountSuspended(RaceCard, { props: { race: raceCard() } });
    expect(wrapper.text()).toContain("lördag 3 juli 2027 · Kristianopel");
    expect(wrapper.find("a").attributes("href")).toBe("/tavla/kustmaran");
    expect(wrapper.find("a").text()).toContain("Till loppet");
  });

  it("offers results for a race that has happened, and a placeholder without a photo", async () => {
    const wrapper = await mountSuspended(RaceCard, {
      props: { race: raceCard({ isPast: true, imageUrl: null, imageAlt: null, summary: null }) },
    });
    expect(wrapper.text()).toContain("Avgjort lördag 3 juli 2027");
    expect(wrapper.find("a").text()).toContain("Resultat och bilder");
    expect(wrapper.find(".placeholder").exists()).toBe(true);
    expect(wrapper.find(".summary").exists()).toBe(false);
  });

  it("uses an empty alt when the photo has no description", async () => {
    const wrapper = await mountSuspended(RaceCard, { props: { race: raceCard({ imageAlt: null }) } });
    expect(wrapper.find("img.image").attributes("alt")).toBe("");
  });
});

describe("TrainingWeek", () => {
  const training: TrainingDay = {
    date: "2026-11-10",
    dateLabel: "tisdag 10 november",
    shortLabel: "10 nov",
    sessions: [
      { group: { slug: "langa", name: "Långa gruppen", description: "Cirka 10 km.", accent: "ink", meetTime: null }, workout: "3 × 2 km", note: null },
      { group: { slug: "halsa", name: "Hälsagruppen", description: "Lugnt.", accent: "purple", meetTime: "17:45" }, workout: "Gå–spring", note: null },
      { group: { slug: "x", name: "Okänd", description: "", accent: "teal", meetTime: null }, workout: "Fartlek", note: null },
    ],
  };

  it("shows the day, time, place and one card per group", async () => {
    const wrapper = await mountSuspended(TrainingWeek, { props: { training, time: "18:00", place: "Klubblokalen" } });
    expect(wrapper.find(".when").text()).toBe("tisdag 10 november · 18:00 · Klubblokalen");
    const cards = wrapper.findAll("article");
    expect(cards).toHaveLength(3);
    expect(cards[1]!.text()).toContain("Samling 17:45");
    expect(cards[1]!.attributes("style")).toContain("var(--tb-purple)");
    expect(cards[2]!.attributes("style")).toContain("var(--tb-ink)");
  });

  it("says when the term plan is not out yet", async () => {
    const wrapper = await mountSuspended(TrainingWeek, { props: { training: null, time: "18:00", place: "" } });
    expect(wrapper.text()).toContain("Terminsplanen för nästa termin kommer snart.");
  });
});
