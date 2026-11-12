import { countdown } from "../../../shared/utils/dates";
import { toRaceCard } from "../../utils/schedule";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") ?? "";
  const row = await useDb().event.findFirst({ where: { slug, type: "RACE", visibility: "PUBLIC" } });
  if (!row) throw createError({ statusCode: 404, statusMessage: "Loppet finns inte" });
  const now = new Date();
  return { ...toRaceCard(row, now), countdown: countdown(row.startsAt, now) };
});
