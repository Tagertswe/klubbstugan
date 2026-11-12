import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Images imported with a content pack (server/utils/content-pack.ts), served
// from the uploads folder. Names start with a content hash, so a changed image
// gets a new address and each file can be cached for good.
export default defineEventHandler(async (event) => {
  assertMethod(event, ["GET", "HEAD"]);
  const name = safeMediaName(getRouterParam(event, "name"));
  if (!name) throw createError({ statusCode: 404 });
  const dir = useRuntimeConfig(event).uploadsDir;
  const bytes = await readFile(join(dir, "media", name)).catch(() => null);
  if (!bytes) throw createError({ statusCode: 404 });
  setResponseHeaders(event, {
    "content-type": mediaType(name)!,
    "cache-control": "public, max-age=31536000, immutable",
    "x-content-type-options": "nosniff",
  });
  return bytes;
});
