import { toActivity } from "../../utils/schedule";

// Upcoming public events for the calendar, grouped by month on the page.
export default defineEventHandler(async () => {
  const now = new Date();
  const rows = await useDb().event.findMany({
    where: { visibility: "PUBLIC", startsAt: { gte: new Date(now.getTime() - 3 * 3_600_000) } },
    orderBy: { startsAt: "asc" },
    take: 100,
  });
  return rows.map((row) => ({ ...toActivity(row, now), summary: row.summary }));
});
