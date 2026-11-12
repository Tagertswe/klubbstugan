// Content packs on the command line (CLAUDE.md, Content packs).
//
//   npm run content -- check  pack.zip   validate only, nothing is written
//   npm run content -- import pack.zip   replace all site content with the pack
//   npm run content -- export pack.zip   write the current content as a pack
//
// Needs DATABASE_URL (except for check). Images go to $NUXT_UPLOADS_DIR/media
// (default ./uploads), which the /media route serves.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { strToU8, unzipSync, zipSync } from "fflate";
import { PrismaClient } from "../server/generated/prisma/client";
import {
  ContentPackError,
  applyContentRows,
  exportContentPack,
  mediaFileName,
  readContentPack,
  toContentRows,
} from "../server/utils/content-pack";

const uploadsDir = process.env.NUXT_UPLOADS_DIR ?? "./uploads";

function database(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

async function load(path: string) {
  const { pack, media } = readContentPack(unzipSync(new Uint8Array(await readFile(path))));
  const stored = new Map([...media].map(([ref, bytes]) => [ref, mediaFileName(ref, bytes)]));
  const rows = toContentRows(pack, (ref) => `/media/${stored.get(ref)}`);
  return { pack, media, stored, rows };
}

function summary(rows: Awaited<ReturnType<typeof load>>["rows"], images: number): string {
  return [
    `${rows.news.length} news items`,
    `${rows.events.length} events`,
    `${rows.trainingGroups.length} training groups`,
    `${rows.faq.length} FAQ items`,
    `${rows.sponsors.length} sponsors`,
    `${images} images`,
  ].join(", ");
}

async function check(path: string) {
  const { pack, media, rows } = await load(path);
  console.log(`OK: "${pack.name}" – ${summary(rows, media.size)}.`);
}

async function importPack(path: string) {
  const { pack, media, stored, rows } = await load(path);
  // Files first: if the database step fails, unused files are harmless; the
  // other way round the site would point at images that do not exist.
  await mkdir(join(uploadsDir, "media"), { recursive: true });
  for (const [ref, bytes] of media) await writeFile(join(uploadsDir, "media", stored.get(ref)!), bytes);
  const db = database();
  try {
    await applyContentRows(db, rows);
  } finally {
    await db.$disconnect();
  }
  console.log(`Imported "${pack.name}": ${summary(rows, media.size)}.`);
}

async function exportPack(path: string) {
  const db = database();
  try {
    const name = basename(path).replace(/\.zip$/i, "");
    const { pack, media } = await exportContentPack(db, (file) => readFile(join(uploadsDir, "media", file)), name);
    const files: Record<string, Uint8Array> = { "content.json": strToU8(`${JSON.stringify(pack, null, 2)}\n`) };
    for (const [ref, bytes] of media) files[ref] = bytes;
    await writeFile(path, zipSync(files, { level: 6 }));
    console.log(`Exported to ${path}: ${pack.news?.length} news items, ${pack.events?.length} events, ${media.size} images.`);
  } finally {
    await db.$disconnect();
  }
}

const [command, path] = process.argv.slice(2);
const commands: Record<string, (path: string) => Promise<void>> = { check, import: importPack, export: exportPack };

if (!command || !path || !commands[command]) {
  console.error("Usage: npm run content -- check|import|export <pack.zip>");
  process.exitCode = 2;
} else {
  commands[command](path).catch((error) => {
    console.error(error instanceof ContentPackError ? error.message : error);
    process.exitCode = 1;
  });
}
