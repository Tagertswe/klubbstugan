import { publicNewsWhere } from "../../utils/news";

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

// RSS for public news only (spec §5.2).
export default defineEventHandler(async (event) => {
  const site = useRuntimeConfig(event).public.siteUrl;
  const rows = await useDb().newsItem.findMany({
    where: publicNewsWhere(new Date()),
    orderBy: { publishedAt: "desc" },
    take: 30,
  });
  const items = rows
    .map(
      (row) =>
        `<item><title>${escapeXml(row.title)}</title><link>${escapeXml(`${site}/nyheter/${row.slug}`)}</link>` +
        `<guid>${escapeXml(`${site}/nyheter/${row.slug}`)}</guid><pubDate>${row.publishedAt!.toUTCString()}</pubDate>` +
        `<description>${escapeXml(row.excerpt)}</description></item>`,
    )
    .join("");
  setHeader(event, "content-type", "application/rss+xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Team Blekinge LF – Nyheter</title><link>${escapeXml(`${site}/nyheter`)}</link><description>Nyheter från Team Blekinge Löparförening</description><language>sv</language>${items}</channel></rss>\n`;
});
