import { orderRaces, toRaceCard } from "../../utils/schedule";

export default defineEventHandler(async () => {
  const now = new Date();
  const rows = await useDb().event.findMany({ where: { visibility: "PUBLIC", type: "RACE" } });
  return orderRaces(rows, now).map((row) => toRaceCard(row, now));
});
