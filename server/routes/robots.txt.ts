export default defineEventHandler((event) => {
  const site = useRuntimeConfig(event).public.siteUrl;
  setHeader(event, "content-type", "text/plain; charset=utf-8");
  return ["User-agent: *", "Disallow: /api/", "Disallow: /logga-in", `Sitemap: ${site}/sitemap.xml`, ""].join("\n");
});
