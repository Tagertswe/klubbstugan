import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import KitStripes from "~/components/KitStripes.vue";
import SpeedLines from "~/components/SpeedLines.vue";
import ThemeSwitch from "~/components/ThemeSwitch.vue";
import TitleMarker from "~/components/TitleMarker.vue";
import { setTheme } from "./helpers";

describe("useTheme", () => {
  beforeEach(() => setTheme("klassisk"));

  it("exposes the id and the matching config", () => {
    const { id, config } = useTheme();
    expect(id.value).toBe("klassisk");
    expect(config.value.heroVariant).toBe("split");
    setTheme("klubbdrakt");
    expect(config.value.newsCardVariant).toBe("overlay");
  });

  it("falls back to Klassisk for an unknown id", () => {
    useState("theme").value = "neon";
    expect(useTheme().config.value.id).toBe("klassisk");
  });
});

describe("ThemeSwitch", () => {
  it("links to every theme on the current page and marks the active one", async () => {
    setTheme("fart");
    const wrapper = await mountSuspended(ThemeSwitch, { route: "/nyheter" });
    const links = wrapper.findAll("a");
    expect(links.map((a) => a.text())).toEqual(["Klassisk", "Fart", "Klubbdräkt"]);
    expect(links.map((a) => a.attributes("href"))).toEqual([
      "/nyheter?tema=klassisk",
      "/nyheter?tema=fart",
      "/nyheter?tema=klubbdrakt",
    ]);
    expect(links.map((a) => a.attributes("aria-current"))).toEqual([undefined, "true", undefined]);
  });
});

describe("decorations", () => {
  it("shows speed lines only in Fart", async () => {
    setTheme("fart");
    expect((await mountSuspended(SpeedLines)).find("[data-decoration='speed-lines']").exists()).toBe(true);
    setTheme("klubbdrakt");
    expect((await mountSuspended(SpeedLines)).find("[data-decoration='speed-lines']").exists()).toBe(false);
  });

  it("shows kit stripes only in Klubbdräkt, in the requested position and size", async () => {
    setTheme("klubbdrakt");
    const stripes = await mountSuspended(KitStripes, { props: { position: "left", size: "s" } });
    expect(stripes.classes()).toEqual(expect.arrayContaining(["kit-stripes--left", "kit-stripes--s"]));
    const defaults = await mountSuspended(KitStripes);
    expect(defaults.classes()).toEqual(expect.arrayContaining(["kit-stripes--right", "kit-stripes--m"]));
    setTheme("fart");
    expect((await mountSuspended(KitStripes)).find("[data-decoration='kit-stripes']").exists()).toBe(false);
  });

  it("draws the title marker in Fart and Klubbdräkt, not in Klassisk", async () => {
    setTheme("klassisk");
    expect((await mountSuspended(TitleMarker)).find(".marker").exists()).toBe(false);
    setTheme("fart");
    expect((await mountSuspended(TitleMarker)).classes()).toEqual(expect.arrayContaining(["marker--fart", "marker--accent"]));
    setTheme("klubbdrakt");
    const purple = await mountSuspended(TitleMarker, { props: { color: "brand-2" } });
    expect(purple.classes()).toEqual(expect.arrayContaining(["marker--klubbdrakt", "marker--brand-2"]));
  });
});
