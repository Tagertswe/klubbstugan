import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import AppIcon from "~/components/AppIcon.vue";
import FaqList from "~/components/FaqList.vue";
import HeroSection from "~/components/HeroSection.vue";
import PageTitle from "~/components/PageTitle.vue";
import SponsorRow from "~/components/SponsorRow.vue";
import { setTheme } from "./helpers";

const hero = { imageUrl: "/media/abc123-start.jpg", imageAlt: "Löpare i starten på Kustmaran" };
const race = { slug: "kustmaran", title: "Kustmaran", dateLabel: "lördag 3 juli 2027", countdown: { days: 235, hours: 1, minutes: 2 } };

describe("HeroSection", () => {
  it("puts the photo beside the text with a countdown in Klassisk and Fart", async () => {
    setTheme("fart");
    const wrapper = await mountSuspended(HeroSection, { props: { nextRace: race, hero } });
    expect(wrapper.attributes("data-variant")).toBe("split");
    expect(wrapper.find("h1").text()).toBe("Löparklubb i Karlskrona – för alla typer av löpare");
    expect(wrapper.find(".countdown").exists()).toBe(true);
    expect(wrapper.find(".backdrop").exists()).toBe(false);
    expect(wrapper.find(".photo").attributes("src")).toBe(hero.imageUrl);
  });

  it("skips the countdown when no race is coming up", async () => {
    setTheme("klassisk");
    const wrapper = await mountSuspended(HeroSection, { props: { nextRace: null, hero } });
    expect(wrapper.find(".countdown").exists()).toBe(false);
  });

  it("uses a full-width photo in Klubbdräkt", async () => {
    setTheme("klubbdrakt");
    const wrapper = await mountSuspended(HeroSection, { props: { nextRace: race, hero } });
    expect(wrapper.attributes("data-variant")).toBe("fullBleed");
    expect(wrapper.find(".backdrop").attributes("alt")).toBe(hero.imageAlt);
    expect(wrapper.find(".backdrop").attributes("src")).toBe(hero.imageUrl);
    expect(wrapper.find(".countdown").exists()).toBe(false);
  });
});

describe("FaqList", () => {
  const items = [
    { id: "1", question: "Vad kostar det?", answer: "650 kr." },
    { id: "2", question: "Får jag prova?", answer: "Ja." },
  ];

  it("shows questions as expandable answers, the first one open when asked", async () => {
    const wrapper = await mountSuspended(FaqList, { props: { items, openFirst: true } });
    const details = wrapper.findAll("details");
    expect(details.map((d) => d.find("summary").text())).toEqual(["Vad kostar det?", "Får jag prova?"]);
    expect(details[0]!.attributes("open")).toBeDefined();
    expect(details[1]!.attributes("open")).toBeUndefined();
  });
});

describe("SponsorRow", () => {
  it("links logos that have an address and hides the section when empty", async () => {
    const wrapper = await mountSuspended(SponsorRow, {
      props: {
        sponsors: [
          { id: "1", name: "Med länk", logoUrl: "/a.png", url: "https://example.se" },
          { id: "2", name: "Utan länk", logoUrl: "/b.png", url: null },
        ],
      },
    });
    expect(wrapper.find("a").attributes("href")).toBe("https://example.se");
    expect(wrapper.findAll("img").map((i) => i.attributes("alt"))).toEqual(["Med länk", "Utan länk"]);
    const empty = await mountSuspended(SponsorRow, { props: { sponsors: [] } });
    expect(empty.find("section").exists()).toBe(false);
  });
});

describe("PageTitle and AppIcon", () => {
  it("shows the title, an optional lead and slot content", async () => {
    const wrapper = await mountSuspended(PageTitle, { props: { title: "Nyheter", lead: "Från styrelsen." }, slots: { default: () => "Extra" } });
    expect(wrapper.find("h1").text()).toBe("Nyheter");
    expect(wrapper.find("p").text()).toBe("Från styrelsen.");
    expect(wrapper.text()).toContain("Extra");
    const bare = await mountSuspended(PageTitle, { props: { title: "Kalender" } });
    expect(bare.find("p").exists()).toBe(false);
  });

  it("draws known icons, hidden from screen readers, and nothing for unknown names", async () => {
    const icon = await mountSuspended(AppIcon, { props: { name: "home", size: 24 } });
    expect(icon.attributes("aria-hidden")).toBe("true");
    expect(icon.attributes("width")).toBe("24");
    expect(icon.find("path").attributes("d")).not.toBe("");
    const unknown = await mountSuspended(AppIcon, { props: { name: "okand" } });
    expect(unknown.attributes("width")).toBe("20");
    expect(unknown.find("path").attributes("d")).toBe("");
  });
});
