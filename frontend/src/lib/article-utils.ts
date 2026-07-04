import type { Article, Author } from "@/lib/mock-articles";
import type { XmlArticleEntry } from "@/lib/article-manifest";

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
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getAuthorLast(a: Author): string {
  if (a.surname) return a.surname;
  return a.name.split(" ").pop() || "";
}

function getAuthorFirst(a: Author): string {
  if (a.givenNames) return a.givenNames;
  const parts = a.name.split(" ").filter(Boolean);
  if (parts.length > 1) return parts.slice(0, -1).join(" ");
  return "";
}

function formatAuthorsAPA(authors: Author[]): string {
  if (!authors || authors.length === 0) return "Anonymous";
  const formatted = authors.map((a) => {
    const last = getAuthorLast(a);
    const first = getAuthorFirst(a);
    let initial = "";
    if (first) {
      initial = first.split(" ").map(n => n[0] + ".").join(" ");
    }
    return `${last}${initial ? `, ${initial}` : ""}`;
  });
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]}, & ${formatted[1]}`;
  return formatted.slice(0, -1).join(", ") + `, & ${formatted[formatted.length - 1]}`;
}

export function toAPA(article: Article): string {
  const year = new Date(article.publishedAt).getFullYear() || "n.d.";
  const authorsStr = formatAuthorsAPA(article.authors);
  let res = `${authorsStr} (${year}). ${article.title}.`;
  
  const journalInfo = [];
  if (article.journalTitle) {
    let volIss = article.journalTitle;
    if (article.volume) {
      let vi = article.volume;
      if (article.issue) vi += `(${article.issue})`;
      volIss += `, ${vi}`;
    }
    journalInfo.push(volIss);
  } else {
    journalInfo.push("CF Open");
  }
  
  if (article.fpage) {
    let pages = article.fpage;
    if (article.lpage) pages += `-${article.lpage}`;
    journalInfo.push(pages);
  }
  
  if (journalInfo.length > 0) {
    res += ` ${journalInfo.join(", ")}.`;
  }
  
  if (article.doi) {
    res += ` https://doi.org/${article.doi}`;
  }
  return res;
}

function formatAuthorsChicago(authors: Author[]): string {
  if (!authors || authors.length === 0) return "Anonymous";
  if (authors.length === 1) {
    const a = authors[0];
    const last = getAuthorLast(a);
    const first = getAuthorFirst(a);
    return `${last}${first ? `, ${first}` : ""}`;
  }
  const formatted = authors.map((a, i) => {
    const last = getAuthorLast(a);
    const first = getAuthorFirst(a);
    if (i === 0) return `${last}${first ? `, ${first}` : ""}`;
    return `${first} ${last}`.trim();
  });
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
  return formatted.slice(0, -1).join(", ") + `, and ${formatted[formatted.length - 1]}`;
}

export function toChicago(article: Article): string {
  const year = new Date(article.publishedAt).getFullYear() || "n.d.";
  const authorsStr = formatAuthorsChicago(article.authors);
  let res = `${authorsStr}. ${year}. "${article.title}."`;
  
  if (article.journalTitle) {
    res += ` ${article.journalTitle}`;
    if (article.volume) res += ` ${article.volume}`;
    if (article.issue) res += ` (${article.issue})`;
    if (article.fpage) {
      res += `: ${article.fpage}`;
      if (article.lpage) res += `-${article.lpage}`;
    }
    res += ".";
  } else {
    res += ` CF Open.`;
  }
  
  if (article.doi) {
    res += ` https://doi.org/${article.doi}`;
  }
  return res;
}

export function toBibTeX(article: Article): string {
  const year = new Date(article.publishedAt).getFullYear() || "unknown";
  const firstAuthorLast = getAuthorLast(article.authors[0] || { name: "anon", orcid: "", affiliation: "" });
  const key = `${slugify(firstAuthorLast).split("-")[0]}${year}`;
  
  const authorsBib = article.authors.map(a => {
    const last = getAuthorLast(a);
    const first = getAuthorFirst(a);
    return `${last}, ${first}`;
  }).join(" and ");

  const lines = [
    `@article{${key},`,
    `  title   = {${article.title}},`,
    `  author  = {${authorsBib}},`,
    `  year    = {${year}},`,
  ];
  if (article.journalTitle) lines.push(`  journal = {${article.journalTitle}},`);
  if (article.volume) lines.push(`  volume  = {${article.volume}},`);
  if (article.issue) lines.push(`  number  = {${article.issue}},`);
  if (article.fpage) {
    let pages = article.fpage;
    if (article.lpage) pages += `--${article.lpage}`;
    lines.push(`  pages   = {${pages}},`);
  }
  if (article.doi) lines.push(`  doi     = {${article.doi}},`);
  lines.push(`  note    = {CF Open}`);
  lines.push(`}`);
  return lines.join("\n");
}

export function toRIS(article: Article): string {
  const year = new Date(article.publishedAt).getFullYear() || "unknown";
  const lines = ["TY  - JOUR"];
  for (const a of article.authors) {
    const last = getAuthorLast(a);
    const first = getAuthorFirst(a);
    lines.push(`AU  - ${last}, ${first}`);
  }
  lines.push(`TI  - ${article.title}`);
  if (article.journalTitle) lines.push(`T2  - ${article.journalTitle}`);
  lines.push(`PY  - ${year}`);
  if (article.volume) lines.push(`VL  - ${article.volume}`);
  if (article.issue) lines.push(`IS  - ${article.issue}`);
  if (article.fpage) lines.push(`SP  - ${article.fpage}`);
  if (article.lpage) lines.push(`EP  - ${article.lpage}`);
  if (article.doi) lines.push(`DO  - ${article.doi}`);
  lines.push(`AB  - ${article.abstract}`);
  for (const k of article.keywords) lines.push(`KW  - ${k}`);
  lines.push("ER  - ");
  return lines.join("\n");
}

// XML manifest girişini listeleme kartı için Article nesnesine dönüştürür.
// Tam makale içeriği (body) yoktur — yalnızca listeleme ve kart için yeterlidir.
export function xmlEntryToArticle(e: XmlArticleEntry): Article {
  return {
    id: e.id,
    journalSlug: e.journalSlug,
    subject: e.subject,
    title: e.title,
    authors: e.authorNames.map((name) => ({ name, orcid: "", affiliation: "" })),
    abstract: e.abstract,
    publishedAt: e.publishedAt,
    doi: e.doi,
    keywords: e.keywords,
    content: "",
    figures: [],
    references: [],
    metrics: { views: 0, downloads: 0, citations: 0 },
    info: { received: "", accepted: "", published: "", editor: "", license: "CC BY 4.0" },
  };
}
