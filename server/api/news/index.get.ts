import { z } from "zod";
import { publicNewsWhere, toNewsCard } from "../../utils/news";

const Query = z.object({
  kategori: z.string().max(60).optional(),
  ar: z.coerce.number().int().min(2000).max(2100).optional(),
});

// Public news, newest first, with category and year filters.
export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, Query.parse);
  const db = useDb();
  const now = new Date();
  const where = {
    ...publicNewsWhere(now, query.kategori),
    ...(query.ar
      ? { AND: [{ publishedAt: { gte: new Date(Date.UTC(query.ar, 0, 1)) } }, { publishedAt: { lt: new Date(Date.UTC(query.ar + 1, 0, 1)) } }] }
      : {}),
  };

  const [categories, items, years] = await Promise.all([
    db.newsCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    db.newsItem.findMany({ where, include: { category: true }, orderBy: { publishedAt: "desc" }, take: 50 }),
    db.newsItem.findMany({ where: publicNewsWhere(now), select: { publishedAt: true } }),
  ]);

  const yearList = [...new Set(years.map((y) => y.publishedAt!.getUTCFullYear()))].sort((a, b) => b - a);

  return {
    categories: categories.map(({ slug, name }) => ({ slug, name })),
    years: yearList,
    items: items.map((row) => toNewsCard(row, now)),
  };
});
