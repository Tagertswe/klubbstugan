import { toNewsCard, publicNewsWhere } from "../utils/news";
import { heroImage } from "../utils/settings";
import { nextRace, nextTrainingDay, orderRaces, toActivity, toRaceCard } from "../utils/schedule";

// Everything the home page shows, in one request.
export default defineEventHandler(async () => {
  const db = useDb();
  const now = new Date();
  const since = new Date(now.getTime() - 60 * 86_400_000);

  const [news, pinned, activities, races, termPlan, faq, sponsors, settings] = await Promise.all([
    db.newsItem.findMany({
      where: publicNewsWhere(now),
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    db.newsItem.findMany({
      where: { ...publicNewsWhere(now), pinnedUntil: { gt: now } },
      include: { category: true },
      orderBy: { pinnedUntil: "asc" },
      take: 3,
    }),
    db.event.findMany({
      where: { visibility: "PUBLIC", startsAt: { gte: now }, type: { not: "RACE" } },
      orderBy: { startsAt: "asc" },
      take: 5,
    }),
    db.event.findMany({
      where: { visibility: "PUBLIC", type: "RACE", startsAt: { gte: since } },
      orderBy: { startsAt: "asc" },
    }),
    db.termPlanRow.findMany({
      where: { date: { gte: new Date(now.getTime() - 86_400_000) } },
      include: { group: true },
      orderBy: { date: "asc" },
      take: 12,
    }),
    db.faqItem.findMany({ where: { showOnHome: true }, orderBy: { sortOrder: "asc" }, take: 4 }),
    db.sponsor.findMany({ orderBy: { sortOrder: "asc" } }),
    getSettings(() => db.siteSetting.findMany()),
  ]);

  return {
    pinned: pinned.map((row) => toNewsCard(row, now)),
    news: news.map((row) => toNewsCard(row, now)),
    activities: activities.map((row) => toActivity(row, now)),
    races: orderRaces(races, now)
      .slice(0, 3)
      .map((row) => toRaceCard(row, now)),
    nextRace: nextRace(races, now),
    training: nextTrainingDay(termPlan, now),
    trainingTime: settings["training.time"] ?? "18:00",
    trainingPlace: settings["training.place"] ?? "Klubblokalen, Tennvägen 11 A, Torskors",
    hero: heroImage(settings),
    faq: faq.map(({ id, question, answer }) => ({ id, question, answer })),
    sponsors: sponsors.map(({ id, name, logoUrl, url }) => ({ id, name, logoUrl, url })),
  };
});
