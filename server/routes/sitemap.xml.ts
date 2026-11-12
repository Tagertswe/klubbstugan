import { publicNewsWhere } from "../utils/news";

const STATIC_PATHS = ["/", "/nyheter", "/kalender", "/traning", "/prova-pa", "/tavla", "/foreningen", "/fragor"];

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

// Only public pages; members-only content never appears here (spec §7).
export default defineEventHandler(async (event) => {
  const site = useRuntimeConfig(event).public.siteUrl;
  const db = useDb();
  const now = new Date();
  const [news, races] = await Promise.all([
    db.newsItem.findMany({ where: publicNewsWhere(now), select: { slug: true, updatedAt: true } }),
    db.event.findMany({ where: { type: "RACE", visibility: "PUBLIC" }, select: { slug: true } }),
  ]);
  const urls = [
    ...STATIC_PATHS.map((path) => `<url><loc>${escapeXml(site + path)}</loc></url>`),
    ...news.map((n) => `<url><loc>${escapeXml(`${site}/nyheter/${n.slug}`)}</loc><lastmod>${n.updatedAt.toISOString()}</lastmod></url>`),
    ...races.map((r) => `<url><loc>${escapeXml(`${site}/tavla/${r.slug}`)}</loc></url>`),
  ];
  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>\n`;
});
