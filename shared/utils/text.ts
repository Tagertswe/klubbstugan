// Small text helpers shared by server and app.

const REPLACEMENTS: Record<string, string> = { å: "a", ä: "a", ö: "o", é: "e", ü: "u" };

/** "Långpass Holmsjö 3 oktober" → "langpass-holmsjo-3-oktober" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[åäöéü]/g, (c) => REPLACEMENTS[c] ?? c)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Splits plain text into paragraphs on blank lines, trimming each. */
export function paragraphs(body: string): string[] {
  return body
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);
}

/** Shortens text to at most max characters on a word boundary, adding "…". */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
