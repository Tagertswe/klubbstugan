import { dateOnlyKey, formatShortDate } from "../../shared/utils/dates";
import { nextTrainingDay } from "../utils/schedule";

// Training groups and the rest of the term plan.
export default defineEventHandler(async () => {
  const db = useDb();
  const now = new Date();
  const [groups, rows] = await Promise.all([
    db.trainingGroup.findMany({ orderBy: { sortOrder: "asc" } }),
    db.termPlanRow.findMany({
      where: { date: { gte: new Date(now.getTime() - 86_400_000) } },
      include: { group: true },
      orderBy: [{ date: "asc" }],
    }),
  ]);
  const byDate = new Map<string, { date: string; label: string; sessions: Record<string, string> }>();
  for (const row of rows) {
    const key = dateOnlyKey(row.date);
    const entry = byDate.get(key) ?? { date: key, label: formatShortDate(new Date(`${key}T12:00:00Z`)), sessions: {} };
    entry.sessions[row.group.slug] = row.workout;
    byDate.set(key, entry);
  }
  return {
    groups: groups.map(({ slug, name, description, accent, meetTime }) => ({ slug, name, description, accent, meetTime })),
    next: nextTrainingDay(rows, now),
    plan: [...byDate.values()],
  };
});
