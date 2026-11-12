// Demo data for development, the demo site and e2e. No real member data, ever
// (CLAUDE.md). Club facts (places, races, fee) come from the public site;
// people are placeholders and images are neutral placeholders (real photos come
// in a private content pack: `npm run content -- import`). The seed is itself a
// content pack, loaded the same way, so every e2e run exercises the importer.
// Dates are relative to the day the seed runs, so the demo always has
// something coming up.
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../server/generated/prisma/client";
import { CONTENT_FORMAT, CONTENT_VERSION, ContentPackSchema, applyContentRows, toContentRows, type ContentPackInput } from "../server/utils/content-pack";
import { localDateKey, localParts } from "../shared/utils/dates";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const DAY = 86_400_000;
const now = new Date();
const inDays = (days: number) => new Date(now.getTime() + days * DAY).toISOString();
/** "YYYY-MM-DD" of the Tuesday `week` weeks from this week's (or today's) Tuesday. */
const tuesday = (week: number) => localDateKey(new Date(now.getTime() + (((2 - localParts(now).weekday + 7) % 7) + week * 7) * DAY));

const PLACEHOLDER = {
  hero: { imageUrl: "/img/placeholder/hero.svg", imageAlt: "Illustration av en löparbana i klubbens färger" },
  news: { imageUrl: "/img/placeholder/news.svg", imageAlt: "Illustration av en målgång med löparbanor" },
  kit: { imageUrl: "/img/placeholder/kit.svg", imageAlt: "Klubbdräktens ränder i svart, orange och lila" },
};

/** Six Tuesdays per group, from last week. */
const WORKOUTS: Record<string, string[]> = {
  langa: ["3 × 2 km i halvmaratonfart", "6 × 1 km, vila 1 min", "4 × 8 min tröskel", "Pyramid 1–2–3–2–1 min", "10 × 400 m", "3 × 2 km i halvmaratonfart"],
  korta: ["6 × 600 m, vila 75 s", "8 × 300 m", "5 × 3 min", "Fartlek 20 min", "4 × 800 m", "6 × 600 m, vila 75 s"],
  halsa: ["Gå–spring 3+1 min, styrka och balans", "Gå–spring 4+1 min", "Backar och balans", "Gå–spring 5+1 min", "Lugn distans och stretch", "Gå–spring 3+1 min, styrka och balans"],
};

const pack: ContentPackInput = {
  format: CONTENT_FORMAT,
  version: CONTENT_VERSION,
  name: "Demo (seed)",
  settings: {
    theme: process.env.SEED_THEME ?? "klassisk",
    "training.time": "18:00",
    "training.place": "Klubblokalen, Tennvägen 11 A, Torskors",
    "hero.image": PLACEHOLDER.hero.imageUrl,
    "hero.imageAlt": PLACEHOLDER.hero.imageAlt,
  },
  // News categories (spec §5.2)
  newsCategories: [
    { slug: "tavling", name: "Tävling & resor" },
    { slug: "stafett", name: "Stafett", defaultVisibility: "MEMBERS" },
    { slug: "funktionarer", name: "Funktionärer" },
    { slug: "traning", name: "Träning" },
    { slug: "langpass", name: "Långpass" },
    { slug: "styrelsen", name: "Styrelsen", defaultVisibility: "MEMBERS" },
    { slug: "klubbklader", name: "Klubbkläder" },
    { slug: "torsdagsgruppen", name: "Torsdagsgruppen" },
  ],
  news: [
    {
      slug: "resultat-fran-jamjohalvan",
      title: "Resultat från Jämjöhalvan och Veteran-SM",
      excerpt: "Klubbens resultat från lördagen, med personbästan och årsbästan markerade.",
      body: "Sol, krispig höstluft och fullt i spåret. Stort tack till alla som sprang, hejade och jobbade som funktionärer!\n\nKlubbens resultat finns på loppets sida, med personbästan och årsbästan markerade. Bilder från dagen läggs i albumet under veckan.",
      ...PLACEHOLDER.news,
      category: "tavling",
      authorName: "[Namn], resultatansvarig",
      publishedAt: "2026-11-08T10:00:00Z",
    },
    {
      slug: "bestall-klubbklader-hos-trimtex",
      title: "Beställ klubbkläder hos Trimtex – nu är webbshopen öppen",
      excerpt: "Gå gärna ihop och beställ, så blir fraktkostnaden mindre.",
      body: "Nu kan du beställa klubbkläder från vår webbshop hos Trimtex. Gå gärna ihop och beställ, så blir fraktkostnaden mindre.\n\nKoden till webbshopen finns i medlemsnyheten om klubbkläder.",
      ...PLACEHOLDER.kit,
      category: "klubbklader",
      authorName: "[Namn], styrelsen",
      publishedAt: "2026-10-12T09:00:00Z",
      pinnedUntil: inDays(30),
    },
    {
      slug: "spring-veteran-sm-pa-hemmaplan",
      title: "Spring Veteran-SM på hemmaplan 7 november",
      excerpt: "VSM i halvmaraton går i samband med Jämjöhalvan.",
      body: "Veteran-SM i halvmaraton avgörs i år på hemmaplan, i samband med vår egen Jämjöhalvan lördag 7 november.\n\nDu anmäler dig till Jämjöhalvan och kryssar i \"Delta i VSM\". Det är obligatoriskt att tävla i klubbens tävlingsdräkt.",
      imageUrl: "/img/veteran-sm.jpg",
      imageAlt: "Veteran-SM 2026 Halvmaraton Jämjö",
      category: "tavling",
      authorName: "[Namn], styrelsen",
      publishedAt: "2026-10-20T09:00:00Z",
    },
    {
      slug: "langpass-holmsjo-3-oktober",
      title: "Långpass Holmsjö 3 oktober",
      excerpt: "Fyra skyltade distanser – 9, 13, 20 och 30 km – och grillen glöder när vi kommer tillbaka.",
      body: "Start vid Bredasjöns IP kl. 08.30. Fyra skyltade distanser: 9, 13, 20 och 30 km.\n\nGrillen glöder när vi kommer tillbaka. Ta med något att grilla!",
      imageUrl: "/img/holmsjo.jpg",
      imageAlt: "Höstfärger vid Bredasjön i Holmsjö",
      category: "langpass",
      authorName: "[Namn], tränare",
      publishedAt: "2026-09-25T09:00:00Z",
    },
    {
      slug: "hostkickoff-med-gasttranare",
      title: "Höstkickoff med gästtränare den 1 september",
      excerpt: "Tisdagsträningen blir något extra: en gästtränare håller i ett intervallpass där alla kan vara med.",
      body: "Tisdagsträningen blir något extra: en gästtränare håller i ett intervallpass där alla kan vara med.\n\nAlla är välkomna, gamla som nya medlemmar!",
      category: "traning",
      authorName: "[Namn], tränare",
      publishedAt: "2025-08-17T09:00:00Z",
    },
    {
      // Members only: must never show for visitors, in lists, the sitemap or by address.
      slug: "nytt-protokoll-styrelsemote",
      title: "Nytt protokoll från styrelsemöte",
      excerpt: "Beslut om årsmötets datum och budget för 2027.",
      body: "Protokollet finns under Dokument › Protokoll.",
      category: "styrelsen",
      authorName: "[Namn], sekreterare",
      visibility: "MEMBERS",
      publishedAt: "2026-11-02T09:00:00Z",
    },
    {
      slug: "vi-soker-lopare-till-kyrkstafetten",
      title: "Vi söker löpare till Kyrkstafetten",
      excerpt: "Anmäl dig med önskad sträcka och fart.",
      body: "Efter sista anmälningsdag gör vi lagen.",
      category: "stafett",
      authorName: "[Namn], stafettansvarig",
      visibility: "MEMBERS",
      publishedAt: "2026-10-26T18:40:00Z",
      pinnedUntil: inDays(20),
    },
  ],
  // Races
  events: [
    {
      slug: "jamjohalvan",
      title: "Jämjöhalvan",
      type: "RACE",
      startsAt: "2026-11-07T10:00:00Z",
      place: "Jämjö Kunskapscentrum",
      summary: "Breddlopp på en lättlöpt varvbana: 21,1 km, 10 km, 5 km och barnlopp, plus Jämjöhallenstafetten.",
      imageUrl: "/img/jamjohalvan.jpg",
      imageAlt: "Affisch för Jämjöhalvan 2026",
      url: "https://mittlopp.se",
    },
    {
      slug: "kustmaran",
      title: "Kustmaran & Kristianopel Runt",
      type: "RACE",
      startsAt: "2027-07-03T09:00:00Z",
      place: "Kristianopel",
      summary: "Löparfest för hela familjen, från 0,9 till 42,2 km, i ostkustens pärla. Anmälan öppnar i januari 2027.",
      ...PLACEHOLDER.hero,
    },
    {
      slug: "veteran-sm",
      title: "Veteran-SM i maraton",
      type: "RACE",
      startsAt: "2027-07-03T09:00:00Z",
      place: "Kristianopel",
      summary: "VSM i maraton avgörs på Kustmaran 2027. Halvmaratonet avgjordes på Jämjöhalvan 2026.",
    },
  ],
  // Weekly activities for the next five weeks
  recurring: [
    { slug: "halsagruppen", title: "Hälsagruppen", weekday: 2, time: "17:45", place: "Klubblokalen, Tennvägen 11 A", weeks: 5 },
    { slug: "intervaller", title: "Intervallträning", weekday: 2, time: "18:00", place: "Klubblokalen, Tennvägen 11 A", weeks: 5 },
    { slug: "torsdagsgruppen", title: "Torsdagsgruppen", weekday: 4, time: "10:00", place: "Tennvägen 11 A", weeks: 5 },
    { slug: "torsdagslopning", title: "Torsdagslöpning", weekday: 4, time: "17:30", place: "Västra Marks IP", weeks: 5 },
    { slug: "langpass", title: "Långpass", weekday: 6, time: "09:00", place: "Klubblokalen, Tennvägen 11 A", weeks: 5 },
  ],
  // Training groups and term plan (Tuesdays, from last week)
  trainingGroups: [
    { slug: "langa", name: "Långa gruppen", description: "Längre intervallpass för dig som är van. Du bör klara cirka 10 km löpning.", accent: "ink", sortOrder: 1 },
    { slug: "korta", name: "Korta gruppen", description: "Kortare intervallpass för dig som inte sprungit så länge. Du bör klara cirka 5 km löpning.", accent: "orange", sortOrder: 2 },
    { slug: "halsa", name: "Hälsagruppen", description: "Varva löpning med promenad, plus styrka och balans. Inga krav på att du tränat tidigare.", accent: "purple", meetTime: "17:45", sortOrder: 3 },
  ].map((group) => ({
    ...group,
    accent: group.accent as "ink" | "orange" | "purple",
    plan: WORKOUTS[group.slug]!.map((workout, i) => ({ date: tuesday(i - 1), workout })),
  })),
  faq: [
    { topic: "Medlemskap", sortOrder: 1, showOnHome: true, question: "Kan jag prova på innan jag blir medlem?", answer: "Ja, du får vara med på upp till tre träningspass innan du bestämmer dig – intervaller eller långpass, du väljer själv." },
    { topic: "Medlemskap", sortOrder: 2, showOnHome: true, question: "Vad kostar medlemskapet?", answer: "650 kr per person för 2026, oavsett när på året du går med." },
    { topic: "Medlemskap", sortOrder: 3, showOnHome: true, question: "Måste jag förnya medlemskapet varje år?", answer: "Nej. Du är medlem tills du säger upp medlemskapet – du betalar bara årets avgift." },
    { topic: "Träning", sortOrder: 1, showOnHome: true, question: "Är jag försäkrad när jag tränar med er?", answer: "Ja, i medlemsavgiften ingår en olycksfallsförsäkring som gäller på föreningens träningar." },
    { topic: "Träning", sortOrder: 2, question: "Vilken grupp ska jag välja?", answer: "Klarar du cirka 10 km springer du med Långa gruppen, cirka 5 km med Korta gruppen. Hälsagruppen passar dig som vill börja lugnt." },
    { topic: "Våra lopp", sortOrder: 1, question: "Var anmäler jag mig till Jämjöhalvan och Kustmaran?", answer: "Anmälan görs hos tidtagaren. Länken finns på respektive loppsida." },
  ],
  sponsors: [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    name: `Samarbetspartner ${n}`,
    logoUrl: `/img/partners/sponsor-${n}.${[2, 3, 5, 6].includes(n) ? "png" : "jpg"}`,
    sortOrder: n,
  })),
};

async function main() {
  const rows = toContentRows(ContentPackSchema.parse(pack), (ref) => ref, now);
  await applyContentRows(db, rows);
  await db.member.deleteMany();
  console.log(`Seeded ${rows.news.length} news items, ${rows.events.length} events, ${rows.trainingGroups.length} training groups.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
