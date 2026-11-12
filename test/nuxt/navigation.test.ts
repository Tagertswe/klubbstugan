import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import BottomBar from "~/components/BottomBar.vue";
import MainMenu from "~/components/MainMenu.vue";
import MobileMenu from "~/components/MobileMenu.vue";
import SiteFooter from "~/components/SiteFooter.vue";
import SiteHeader from "~/components/SiteHeader.vue";

describe("MainMenu", () => {
  it("shows the top menu and marks the current section", async () => {
    const wrapper = await mountSuspended(MainMenu, { route: "/nyheter" });
    const tops = wrapper.findAll(".top");
    expect(tops.map((t) => t.text())).toEqual(["Hem", "Träna med oss", "Tävla", "Föreningen", "Nyheter", "Kalender", "Frågor & kontakt"]);
    expect(wrapper.find("a[aria-current='page']").text()).toBe("Nyheter");
  });

  it("opens a group, closes it with Escape and returns focus", async () => {
    const wrapper = await mountSuspended(MainMenu, { route: "/", attachTo: document.body });
    const button = wrapper.find("button[data-group='1']");
    expect(button.attributes("aria-expanded")).toBe("false");
    await button.trigger("click");
    expect(button.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find("#menu-group-1").isVisible()).toBe(true);
    await wrapper.find("nav").trigger("keydown", { key: "Escape" });
    expect(button.attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button.element);
    await wrapper.find("nav").trigger("keydown", { key: "Escape" });
    wrapper.unmount();
  });

  it("toggles a group closed, and closes on an outside click or a chosen link", async () => {
    const wrapper = await mountSuspended(MainMenu, { route: "/", attachTo: document.body });
    const button = wrapper.find("button[data-group='2']");
    await button.trigger("click");
    await button.trigger("click");
    expect(button.attributes("aria-expanded")).toBe("false");
    await button.trigger("click");
    document.body.click();
    await nextTick();
    expect(button.attributes("aria-expanded")).toBe("false");
    await button.trigger("click");
    await wrapper.find("#menu-group-2 a").trigger("click");
    expect(button.attributes("aria-expanded")).toBe("false");
    await button.trigger("click");
    wrapper.find("#menu-group-2 a").element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    wrapper.unmount();
  });

  it("accepts a custom menu", async () => {
    const wrapper = await mountSuspended(MainMenu, { props: { items: [{ label: "Test", to: "/test" }] } });
    expect(wrapper.findAll(".top")).toHaveLength(1);
  });
});

describe("MobileMenu", () => {
  it("renders nothing while closed", async () => {
    const wrapper = await mountSuspended(MobileMenu, { props: { open: false } });
    expect(wrapper.find("[role='dialog']").exists()).toBe(false);
  });

  it("lists every group and closes from the button, the backdrop, Escape and a link", async () => {
    const wrapper = await mountSuspended(MobileMenu, { props: { open: false }, attachTo: document.body });
    await wrapper.setProps({ open: true });
    await nextTick();
    expect(wrapper.find("[role='dialog']").attributes("aria-modal")).toBe("true");
    expect(wrapper.findAll(".group-label").map((g) => g.text())).toEqual(["Träna med oss", "Tävla", "Föreningen"]);
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Stäng menyn");
    await wrapper.find(".close").trigger("click");
    await wrapper.find(".backdrop").trigger("click");
    await wrapper.find(".backdrop").trigger("keydown", { key: "Escape" });
    await wrapper.find(".link").trigger("click");
    await wrapper.find(".group-label + ul .link").trigger("click");
    await wrapper.find(".login").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(6);
    await wrapper.setProps({ open: false });
    wrapper.unmount();
  });
});

describe("BottomBar", () => {
  it("has five tabs, marks the current one and opens the menu", async () => {
    const wrapper = await mountSuspended(BottomBar, { route: "/kalender" });
    expect(wrapper.findAll(".tab").map((t) => t.text())).toEqual(["Hem", "Kalender", "Flöde", "Nyheter", "Meny"]);
    expect(wrapper.find("[aria-current='page']").text()).toBe("Kalender");
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("menu")).toHaveLength(1);
  });

  it("marks Hem only on the home page", async () => {
    const wrapper = await mountSuspended(BottomBar, { route: "/" });
    expect(wrapper.find("[aria-current='page']").text()).toBe("Hem");
  });
});

describe("SiteHeader and SiteFooter", () => {
  it("has the logo, a login link and the main menu", async () => {
    const wrapper = await mountSuspended(SiteHeader);
    expect(wrapper.find("img").attributes("alt")).toBe("Team Blekinge Löparförening");
    expect(wrapper.find("a.login").attributes("href")).toBe("/logga-in");
    expect(wrapper.find("nav[aria-label='Huvudmeny']").exists()).toBe(true);
  });

  it("shows the theme switch when the demo enables it", async () => {
    const wrapper = await mountSuspended(SiteFooter);
    expect(wrapper.find("nav[aria-label='Utseende']").exists()).toBe(true);
    useRuntimeConfig().public.themeSwitch = false;
    const hidden = await mountSuspended(SiteFooter);
    expect(hidden.find("nav[aria-label='Utseende']").exists()).toBe(false);
    useRuntimeConfig().public.themeSwitch = true;
  });
});
