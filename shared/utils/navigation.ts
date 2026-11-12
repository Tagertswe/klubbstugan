// The menu (spec §5.8): a short top menu of grouped sections, the same in every
// theme, and the phone's bottom bar. Each destination appears once.

export interface MenuLink {
  label: string;
  to: string;
}

export interface MenuItem {
  label: string;
  to?: string;
  children?: MenuLink[];
}

export const MAIN_MENU: MenuItem[] = [
  { label: "Hem", to: "/" },
  {
    label: "Träna med oss",
    children: [
      { label: "Träningspass", to: "/traning" },
      { label: "Prova på", to: "/prova-pa" },
      { label: "Långpass", to: "/traning#langpass" },
      { label: "Torsdagsgruppen", to: "/traning#torsdagsgruppen" },
    ],
  },
  {
    label: "Tävla",
    children: [
      { label: "Våra lopp", to: "/tavla" },
      { label: "Jämjöhalvan", to: "/tavla/jamjohalvan" },
      { label: "Kustmaran", to: "/tavla/kustmaran" },
      { label: "Veteran-SM", to: "/tavla/veteran-sm" },
    ],
  },
  {
    label: "Föreningen",
    children: [
      { label: "Om föreningen", to: "/foreningen" },
      { label: "Bli medlem", to: "/foreningen#bli-medlem" },
      { label: "Styrelsen och kontakt", to: "/foreningen#styrelsen" },
    ],
  },
  { label: "Nyheter", to: "/nyheter" },
  { label: "Kalender", to: "/kalender" },
  { label: "Frågor & kontakt", to: "/fragor" },
];

export type BottomBarIcon = "home" | "calendar" | "feed" | "news" | "menu";

export interface BottomBarItem {
  label: string;
  icon: BottomBarIcon;
  /** Absent for "Meny", which opens the menu instead of navigating. */
  to?: string;
}

export const BOTTOM_BAR: BottomBarItem[] = [
  { label: "Hem", icon: "home", to: "/" },
  { label: "Kalender", icon: "calendar", to: "/kalender" },
  { label: "Flöde", icon: "feed", to: "/flodet" },
  { label: "Nyheter", icon: "news", to: "/nyheter" },
  { label: "Meny", icon: "menu" },
];

/** Every link target in the main menu, in order. */
export function menuDestinations(menu: MenuItem[] = MAIN_MENU): string[] {
  return menu.flatMap((item) => (item.children ? item.children.map((c) => c.to) : item.to ? [item.to] : []));
}

/** True when `path` is the item's page or one of its group's pages. */
export function isActive(item: MenuItem, path: string): boolean {
  const clean = path.split(/[?#]/)[0] || "/";
  const targets = item.children ? item.children.map((c) => c.to) : item.to ? [item.to] : [];
  return targets.some((to) => {
    const base = to.split("#")[0] || "/";
    return base === "/" ? clean === "/" : clean === base || clean.startsWith(`${base}/`);
  });
}
