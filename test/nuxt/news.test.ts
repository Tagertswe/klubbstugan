import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import NewsCard from "~/components/NewsCard.vue";
import PinnedStrip from "~/components/PinnedStrip.vue";
import { newsCard, setTheme } from "./helpers";

describe("NewsCard", () => {
  it("puts the image beside the text in Klassisk, with excerpt and link", async () => {
    setTheme("klassisk");
    const wrapper = await mountSuspended(NewsCard, { props: { item: newsCard() } });
    expect(wrapper.attributes("data-variant")).toBe("side");
    expect(wrapper.find("img.image").attributes("alt")).toBe("Barnloppet");
    expect(wrapper.find("a").attributes("href")).toBe("/nyheter/resultat");
    expect(wrapper.text()).toContain("Klubbens resultat.");
    expect(wrapper.text()).toContain("Tävling & resor · 8 nov");
  });

  it("sets the headline over the photo in Klubbdräkt and drops the excerpt", async () => {
    setTheme("klubbdrakt");
    const wrapper = await mountSuspended(NewsCard, { props: { item: newsCard(), large: true } });
    expect(wrapper.attributes("data-variant")).toBe("overlay");
    expect(wrapper.classes()).toContain("news-card--large");
    expect(wrapper.text()).not.toContain("Klubbens resultat.");
  });

  it("falls back to the side layout when there is no photo", async () => {
    setTheme("klubbdrakt");
    const wrapper = await mountSuspended(NewsCard, { props: { item: newsCard({ imageUrl: null, imageAlt: null }) } });
    expect(wrapper.attributes("data-variant")).toBe("side");
    expect(wrapper.find(".placeholder").exists()).toBe(true);
  });

  it("lets the caller choose the variant", async () => {
    setTheme("klassisk");
    const wrapper = await mountSuspended(NewsCard, { props: { item: newsCard(), variant: "overlay" } });
    expect(wrapper.attributes("data-variant")).toBe("overlay");
  });

  it("marks members-only and new items, and copes with a missing alt text", async () => {
    setTheme("klassisk");
    const wrapper = await mountSuspended(NewsCard, {
      props: { item: newsCard({ membersOnly: true, isNew: true, imageAlt: null, dateLabel: "" }) },
    });
    expect(wrapper.find(".lock").text()).toBe("Medlemmar");
    expect(wrapper.find(".new").text()).toBe("Ny");
    expect(wrapper.find("img.image").attributes("alt")).toBe("");
    expect(wrapper.text()).not.toContain(" · ");
  });
});

describe("PinnedStrip", () => {
  it("lists pinned news under Viktigt nu", async () => {
    const wrapper = await mountSuspended(PinnedStrip, { props: { items: [newsCard({ slug: "trimtex", title: "Beställ klubbkläder" })] } });
    expect(wrapper.find("h2").text()).toBe("Viktigt nu");
    expect(wrapper.find("a").attributes("href")).toBe("/nyheter/trimtex");
  });

  it("renders nothing when nothing is pinned", async () => {
    const wrapper = await mountSuspended(PinnedStrip, { props: { items: [] } });
    expect(wrapper.find("section").exists()).toBe(false);
  });
});
