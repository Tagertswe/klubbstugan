import { paragraphs } from "../../../shared/utils/text";
import { formatLongDate } from "../../../shared/utils/dates";
import { publicNewsWhere, toNewsCard } from "../../utils/news";

// One public news item. Members-only items answer 404 to visitors, so their
// existence is not revealed (spec §7).
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") ?? "";
  const db = useDb();
  const now = new Date();
  const row = await db.newsItem.findFirst({
    where: { ...publicNewsWhere(now), slug },
    include: { category: true },
  });
  if (!row) throw createError({ statusCode: 404, statusMessage: "Nyheten finns inte" });

  const more = await db.newsItem.findMany({
    where: { ...publicNewsWhere(now), slug: { not: slug } },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  return {
    ...toNewsCard(row, now),
    authorName: row.authorName,
    longDate: row.publishedAt ? formatLongDate(row.publishedAt, now) : "",
    paragraphs: paragraphs(row.body),
    more: more.map((item) => toNewsCard(item, now)),
  };
});
