// OJS ile sunucu tarafı iletişim. Yalnızca sunucuda çalışır (.server.ts).
//
// Neden sunucu tarafı: OJS 3.5'in REST API'si anonim erişime kapalı, bir API
// anahtarı istiyor. Anahtar tarayıcıya asla gitmemeli. Ayrıca OJS başka bir
// alan adında olduğu için tarayıcıdan doğrudan istek CORS'a takılır.
//
// Ortam değişkenleri (.env):
//   OJS_INTERNAL_URL : Konteynerler arası adres (varsayılan http://ojs)
//   OJS_PUBLIC_URL   : Okuyucuya verilecek adres (varsayılan https://dergi.cf.org.tr)
//   OJS_API_TOKEN    : OJS'te Profil → API Anahtarı'ndan üretilir
//
// NOT: OJS_INTERNAL_URL kullanılacaksa OJS ayarında allowed_hosts listesine
// "ojs" eklenmelidir, aksi halde OJS isteği reddeder.

import process from "node:process";

export interface OjsFigure {
  /** XML içinde geçen dosya adı (örn. "fig1.png") */
  name: string;
  /** Herkese açık indirme adresi */
  url: string;
  mimetype: string;
}

/** OJS'ten normalize edilmiş makale kaydı. */
export interface OjsArticle {
  id: string;
  journalSlug: string;
  ojsPath: string;
  title: string;
  subject: string;
  abstract: string;
  publishedAt: string;
  authorNames: string[];
  doi: string;
  keywords: string[];
  language?: string;
  volume?: string;
  issue?: string;
  firstPage?: string;
  lastPage?: string;
  issueId?: number;
  issueLabel?: string;
  /** Herkese açık JATS XML adresi (yoksa undefined) */
  xmlPath?: string;
  /** Herkese açık PDF adresi (yoksa undefined) */
  pdfPath?: string;
  /** OJS'teki makale sayfası */
  ojsUrl: string;
  figures: OjsFigure[];
  /** Sitede sayılan görüntülenme (metrics.server.ts doldurur). */
  views?: number;
  /** Sitede sayılan indirme (metrics.server.ts doldurur). */
  downloads?: number;
}

export interface OjsIssue {
  id: number;
  volume?: string;
  number?: string;
  year?: string;
  label: string;
  datePublished?: string;
}

/* ----------------------------- Yapılandırma ------------------------------ */

function config() {
  const internal = (process.env.OJS_INTERNAL_URL ?? "http://ojs").replace(/\/+$/, "");
  const publicBase = (
    process.env.OJS_PUBLIC_URL ??
    process.env.VITE_OJS_URL ??
    "https://dergi.cf.org.tr"
  ).replace(/\/+$/, "");
  return { internal, publicBase, token: process.env.OJS_API_TOKEN ?? "" };
}

/** Entegrasyon yapılandırılmış mı? Anahtar yoksa site sessizce boş içerik gösterir. */
export function isOjsConfigured(): boolean {
  return Boolean(config().token);
}

/* -------------------------------- Önbellek -------------------------------- */

const TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { at: number; value: unknown }>();

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T;
  const value = await load();
  cache.set(key, { at: Date.now(), value });
  return value;
}

/* ------------------------------- İstemci ---------------------------------- */

async function ojsGet<T>(ojsPath: string, endpoint: string): Promise<T> {
  const { internal, token } = config();
  const url = `${internal}/index.php/${ojsPath}/api/v1/${endpoint}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`OJS ${res.status} — ${endpoint}`);
  return (await res.json()) as T;
}

/* ------------------------------ Yardımcılar ------------------------------- */

/** OJS çok dilli alanları {en: "..."} biçiminde döner. */
function loc(value: unknown, locale = "en"): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const map = value as Record<string, unknown>;
    const picked = map[locale] ?? Object.values(map).find((v) => typeof v === "string" && v);
    return typeof picked === "string" ? picked : "";
  }
  return "";
}

function locArray(value: unknown, locale = "en"): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const map = value as Record<string, unknown>;
    const picked = map[locale] ?? Object.values(map).find((v) => Array.isArray(v));
    return Array.isArray(picked) ? picked : [];
  }
  return [];
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/* ------------------------------- Bölümler --------------------------------- */

async function sectionTitles(ojsPath: string): Promise<Map<number, string>> {
  return cached(`sections:${ojsPath}`, async () => {
    const map = new Map<number, string>();
    try {
      const data = await ojsGet<{ items?: Array<Record<string, unknown>> }>(ojsPath, "sections?count=100");
      for (const s of data.items ?? []) {
        const id = Number(s.id);
        const title = loc(s.title) || loc(s.abbrev);
        if (Number.isFinite(id) && title) map.set(id, title);
      }
    } catch {
      // Bölüm adı kritik değil; alınamazsa boş geçilir.
    }
    return map;
  });
}

/* --------------------------------- Sayılar -------------------------------- */

export async function listIssues(ojsPath: string): Promise<OjsIssue[]> {
  return cached(`issues:${ojsPath}`, async () => {
    const data = await ojsGet<{ items?: Array<Record<string, unknown>> }>(ojsPath, "issues?count=100");
    return (data.items ?? [])
      .filter((i) => i.published !== false)
      .map((i) => ({
        id: Number(i.id),
        volume: i.volume != null ? String(i.volume) : undefined,
        number: i.number != null ? String(i.number) : undefined,
        year: i.year != null ? String(i.year) : undefined,
        label: String(i.identification ?? loc(i.title) ?? ""),
        datePublished: typeof i.datePublished === "string" ? i.datePublished : undefined,
      }));
  });
}

/* -------------------------------- Makaleler ------------------------------- */

function buildArticle(
  submissionId: number,
  pub: Record<string, unknown>,
  opts: {
    ojsPath: string;
    journalSlug: string;
    publicBase: string;
    sections: Map<number, string>;
    issues: OjsIssue[];
  },
): OjsArticle {
  const { ojsPath, journalSlug, publicBase, sections, issues } = opts;
  const base = `${publicBase}/index.php/${ojsPath}`;

  const galleys = Array.isArray(pub.galleys) ? (pub.galleys as Array<Record<string, unknown>>) : [];
  const findGalley = (label: string) =>
    galleys.find((g) => String(g.label ?? "").trim().toUpperCase() === label);

  const pdfGalley = findGalley("PDF");
  const xmlGalley = findGalley("XML");

  const figures: OjsFigure[] = [];
  if (xmlGalley) {
    const file = xmlGalley.file as Record<string, unknown> | undefined;
    const deps = Array.isArray(file?.dependentFiles)
      ? (file!.dependentFiles as Array<Record<string, unknown>>)
      : [];
    for (const d of deps) {
      const name = loc(d.name);
      const id = Number(d.id);
      if (!name || !Number.isFinite(id)) continue;
      figures.push({
        name,
        url: `${base}/article/download/${submissionId}/${Number(xmlGalley.id)}/${id}`,
        mimetype: String(d.mimetype ?? ""),
      });
    }
  }

  const authors = Array.isArray(pub.authors) ? (pub.authors as Array<Record<string, unknown>>) : [];
  const authorNames = authors.length
    ? authors.map((a) => String(a.fullName ?? `${loc(a.givenName)} ${loc(a.familyName)}`).trim())
    : String(pub.authorsString ?? "")
        .split(",")
        .map((s) => s.replace(/\(.*?\)/g, "").trim())
        .filter(Boolean);

  const issueId = pub.issueId != null ? Number(pub.issueId) : undefined;
  const issue = issues.find((i) => i.id === issueId);

  const pages = typeof pub.pages === "string" ? pub.pages : "";
  const [firstPage, lastPage] = pages.includes("-") ? pages.split("-", 2) : [pages, ""];

  const doiObject = pub.doiObject as Record<string, unknown> | null | undefined;

  return {
    id: String(submissionId),
    journalSlug,
    ojsPath,
    title: loc(pub.fullTitle) || loc(pub.title),
    subject: sections.get(Number(pub.sectionId)) ?? "",
    abstract: stripHtml(loc(pub.abstract)),
    publishedAt: String(pub.datePublished ?? "").slice(0, 10),
    authorNames,
    doi: doiObject ? String(doiObject.doi ?? "") : "",
    keywords: locArray(pub.keywords)
      .map((k) => (typeof k === "string" ? k : String((k as Record<string, unknown>)?.name ?? "")))
      .filter(Boolean),
    language: typeof pub.locale === "string" ? pub.locale : undefined,
    volume: issue?.volume,
    issue: issue?.number,
    firstPage: firstPage || undefined,
    lastPage: lastPage || undefined,
    issueId,
    issueLabel: issue?.label,
    xmlPath: xmlGalley ? `${base}/article/download/${submissionId}/${Number(xmlGalley.id)}` : undefined,
    pdfPath: pdfGalley ? `${base}/article/download/${submissionId}/${Number(pdfGalley.id)}` : undefined,
    ojsUrl: `${base}/article/view/${submissionId}`,
    figures,
  };
}

/** Bir derginin yayınlanmış makaleleri (yeniden eskiye). */
export async function listArticles(ojsPath: string, journalSlug: string): Promise<OjsArticle[]> {
  if (!isOjsConfigured()) return [];
  return cached(`articles:${ojsPath}`, async () => {
    const { publicBase } = config();
    const [sections, issues, list] = await Promise.all([
      sectionTitles(ojsPath),
      listIssues(ojsPath).catch(() => [] as OjsIssue[]),
      ojsGet<{ items?: Array<Record<string, unknown>> }>(
        ojsPath,
        "submissions?status=3&count=100",
      ),
    ]);

    const items = list.items ?? [];
    const results = await Promise.all(
      items.map(async (sub) => {
        const submissionId = Number(sub.id);
        const pubs = Array.isArray(sub.publications)
          ? (sub.publications as Array<Record<string, unknown>>)
          : [];
        const current =
          pubs.find((p) => Number(p.id) === Number(sub.currentPublicationId)) ?? pubs[0];
        if (!current) return null;

        // Liste ucundaki publication özeti; özet/anahtar kelime/yazar için
        // detay ucu gerekiyor. Alınamazsa özet veriyle devam edilir.
        let full = current;
        try {
          full = await ojsGet<Record<string, unknown>>(
            ojsPath,
            `submissions/${submissionId}/publications/${Number(current.id)}`,
          );
        } catch {
          /* özet veriyle devam */
        }

        return buildArticle(submissionId, full, {
          ojsPath,
          journalSlug,
          publicBase,
          sections,
          issues,
        });
      }),
    );

    return results
      .filter((a): a is OjsArticle => a !== null)
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  });
}

export async function getArticleById(
  ojsPath: string,
  journalSlug: string,
  id: string,
): Promise<OjsArticle | null> {
  const all = await listArticles(ojsPath, journalSlug);
  return all.find((a) => a.id === id) ?? null;
}

/* ------------------------- JATS XML (şekil adresleri) --------------------- */

/**
 * XML içindeki göreli şekil adlarını OJS'in herkese açık adresleriyle değiştirir.
 * Böylece görüntüleyici tarafında ek bir çözümleme mantığına gerek kalmaz.
 */
export function rewriteFigureHrefs(xml: string, figures: OjsFigure[]): string {
  let out = xml;
  for (const fig of figures) {
    const escaped = fig.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // href="fig1.png" ve href="path/fig1.png" biçimlerini yakalar
    const re = new RegExp(`(xlink:href|href)="([^"]*\\/)?${escaped}"`, "gi");
    out = out.replace(re, `$1="${fig.url}"`);
  }
  return out;
}

/** Makalenin JATS XML'ini indirir ve şekil adreslerini mutlak hale getirir. */
export async function fetchArticleXml(article: OjsArticle): Promise<string | null> {
  if (!article.xmlPath) return null;
  return cached(`xml:${article.ojsPath}:${article.id}`, async () => {
    const res = await fetch(article.xmlPath!, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`XML ${res.status}`);
    return rewriteFigureHrefs(await res.text(), article.figures);
  });
}
