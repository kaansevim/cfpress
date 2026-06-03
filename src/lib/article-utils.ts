import type { Article } from "@/lib/mock-articles";

// Türkçe karakterleri ASCII anchor'a indirger (TOC id'leri için).
const TR_MAP: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
  Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
};

export function slugify(text: string): string {
  return text
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => TR_MAP[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface Heading {
  id: string;
  text: string;
}

// İçerikteki "## " başlıklarını TOC için çıkarır.
export function extractHeadings(content: string): Heading[] {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.replace(/^##\s+/, "").trim();
      return { id: slugify(text), text };
    });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function authorsBibTeX(article: Article): string {
  return article.authors.map((a) => a.name).join(" and ");
}

export function toBibTeX(article: Article): string {
  const year = new Date(article.publishedAt).getFullYear();
  const key = `${slugify(article.authors[0]?.name ?? "anon").split("-")[0]}${year}`;
  return [
    `@article{${key},`,
    `  title   = {${article.title}},`,
    `  author  = {${authorsBibTeX(article)}},`,
    `  year    = {${year}},`,
    `  doi     = {${article.doi}},`,
    `  note    = {Akademik Yayın Platformu}`,
    `}`,
  ].join("\n");
}

export function toRIS(article: Article): string {
  const year = new Date(article.publishedAt).getFullYear();
  const lines = ["TY  - JOUR"];
  for (const a of article.authors) lines.push(`AU  - ${a.name}`);
  lines.push(`TI  - ${article.title}`);
  lines.push(`PY  - ${year}`);
  lines.push(`DO  - ${article.doi}`);
  lines.push(`AB  - ${article.abstract}`);
  for (const k of article.keywords) lines.push(`KW  - ${k}`);
  lines.push("ER  - ");
  return lines.join("\n");
}

// APA tarzı düz metin alıntı.
export function toAPA(article: Article): string {
  const year = new Date(article.publishedAt).getFullYear();
  const names = article.authors.map((a) => a.name).join(", ");
  return `${names} (${year}). ${article.title}. https://doi.org/${article.doi}`;
}
