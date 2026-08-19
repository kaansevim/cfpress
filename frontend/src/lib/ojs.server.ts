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

import { Buffer } from "node:buffer";
import process from "node:process";

export interface OjsFigure {
  /** XML içinde geçen dosya adı (örn. "fig1.png") */
  name: string;
  /** Herkese açık indirme adresi */
  url: string;
  mimetype: string;
}

/** Makale yazarı. ORCID yalnızca OJS'te kayıtlıysa dolar. */
export interface OjsAuthor {
  name: string;
  /** Sadece numara (örn. "0000-0002-1825-0097"); OJS tam adres verir, kısaltılır. */
  orcid: string;
  affiliation: string;
  email: string;
  isCorresponding: boolean;
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
  /** Yazar ayrıntıları (ORCID, kurum, e-posta). OJS boş bıraktıysa alanlar boş. */
  authors: OjsAuthor[];
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

/** OJS'teki dergi ayarlarından siteye yansıyan alanlar. */
export interface OjsJournalSettings {
  about?: string;
  description?: string;
  openAccessPolicy?: string;
  copyrightNotice?: string;
  licenseTerms?: string;
  competingInterests?: string;
  authorGuidelines?: string;
  submissionChecklist?: string;
  reviewGuidelines?: string;
  privacyStatement?: string;
  publisherInstitution?: string;
  publisherUrl?: string;
  onlineIssn?: string;
  printIssn?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAffiliation?: string;
  mailingAddress?: string;
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

  // NEDEN SORGU PARAMETRESİ: OJS'in önündeki Apache, `Authorization` başlığını
  // PHP'ye iletmiyor (CGIPassAuth kapalı), bu yüzden Bearer ile istek 401
  // dönüyor. OJS anahtarı `apiToken` parametresiyle de kabul ediyor ve bu yol
  // sunucuda ek ayar gerektirmiyor. Başlık yine de gönderiliyor: sunucu ayarı
  // ileride değişirse o yol da çalışır.
  const sep = endpoint.includes("?") ? "&" : "?";
  const url =
    `${internal}/index.php/${ojsPath}/api/v1/${endpoint}` +
    `${sep}apiToken=${encodeURIComponent(token)}`;

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

/* ------------------------------ Dergi ayarları ---------------------------- */

/**
 * Ayarları çekebilmek için derginin sayısal kimliği gerekiyor; API bunu
 * yalnızca yanıtların içinde veriyor. Sayı veya makale listesinden okunur.
 */
async function contextId(ojsPath: string): Promise<number | null> {
  return cached(`contextId:${ojsPath}`, async () => {
    for (const endpoint of ["issues?count=1", "submissions?count=1"]) {
      try {
        const data = await ojsGet<{ items?: Array<Record<string, unknown>> }>(ojsPath, endpoint);
        const first = data.items?.[0];
        const id = Number(first?.journalId ?? first?.contextId);
        if (Number.isFinite(id) && id > 0) return id;
      } catch {
        /* diğerini dene */
      }
    }
    return null;
  });
}

/**
 * Derginin OJS'teki metin ayarları. Alınamazsa boş nesne döner; sitede
 * koddaki varsayılan metinler gösterilir, sayfa asla boş kalmaz.
 */
export async function getJournalSettings(ojsPath: string): Promise<OjsJournalSettings> {
  if (!isOjsConfigured()) return {};
  return cached(`settings:${ojsPath}`, async () => {
    const id = await contextId(ojsPath);
    if (!id) return {};

    let raw: Record<string, unknown>;
    try {
      raw = await ojsGet<Record<string, unknown>>(ojsPath, `contexts/${id}`);
    } catch (error) {
      console.error("[ojs] dergi ayarları alınamadı:", error);
      return {};
    }

    const text = (key: string) => {
      const value = loc(raw[key]);
      return value.trim() ? value : undefined;
    };
    const plain = (key: string) => {
      const value = raw[key];
      if (typeof value === "string" && value.trim()) return value.trim();
      const localized = loc(value);
      return localized.trim() ? localized.trim() : undefined;
    };

    // OJS kontrol listesini maddeler dizisi olarak tutar (sürüme göre düz metin
    // ya da {content} nesnesi). İki biçimi de <ul> listesine çeviririz.
    const checklist = (() => {
      const items = locArray(raw["submissionChecklist"])
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") {
            const o = item as Record<string, unknown>;
            return loc(o.content ?? o.title);
          }
          return "";
        })
        .map((item) => item.trim())
        .filter(Boolean);
      if (items.length) return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
      return text("submissionChecklist");
    })();

    return {
      about: text("about"),
      description: text("description"),
      openAccessPolicy: text("openAccessPolicy"),
      copyrightNotice: text("copyrightNotice"),
      licenseTerms: text("licenseTerms"),
      competingInterests: text("competingInterests"),
      authorGuidelines: text("authorGuidelines"),
      submissionChecklist: checklist,
      reviewGuidelines: text("reviewGuidelines"),
      privacyStatement: text("privacyStatement"),
      publisherInstitution: plain("publisherInstitution"),
      publisherUrl: plain("publisherUrl"),
      onlineIssn: plain("onlineIssn"),
      printIssn: plain("printIssn"),
      contactName: plain("contactName"),
      contactEmail: plain("contactEmail"),
      contactPhone: plain("contactPhone"),
      contactAffiliation: text("contactAffiliation"),
      mailingAddress: text("mailingAddress"),
    };
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

  const rawAuthors = Array.isArray(pub.authors)
    ? (pub.authors as Array<Record<string, unknown>>)
    : [];

  // Sorumlu yazar OJS'te yayının primaryContactId alanıyla işaretlenir.
  const primaryContactId = pub.primaryContactId != null ? Number(pub.primaryContactId) : null;

  const authorList: OjsAuthor[] = rawAuthors.map((a) => ({
    name: String(a.fullName ?? `${loc(a.givenName)} ${loc(a.familyName)}`).trim(),
    // OJS ORCID'i tam adres olarak saklar; sitede sadece numara gösterilir.
    orcid: String(a.orcid ?? "")
      .replace(/^https?:\/\/(sandbox\.)?orcid\.org\//, "")
      .trim(),
    affiliation: stripHtml(loc(a.affiliation)),
    email: typeof a.email === "string" ? a.email : "",
    isCorresponding: primaryContactId != null && Number(a.id) === primaryContactId,
  }));

  const authorNames = authorList.length
    ? authorList.map((a) => a.name)
    : String(pub.authorsString ?? "")
        .split(",")
        .map((s) => s.replace(/\(.*?\)/g, "").trim())
        .filter(Boolean);

  // Yazar dizisi boşsa (eski kayıtlar) en azından isimlerden bir liste kurulur.
  const authors: OjsAuthor[] = authorList.length
    ? authorList
    : authorNames.map((name) => ({
        name,
        orcid: "",
        affiliation: "",
        email: "",
        isCorresponding: false,
      }));

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
    authors,
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

/* ------------------------------- PDF görüntü ------------------------------ */

/** Sitede gösterilecek PDF'in üst sınırı. Üstündeki dosyalar tarayıcıya
 *  gömülmez; okuyucuya doğrudan indirme bağlantısı verilir. */
const PDF_MAX_BYTES = 30 * 1024 * 1024;

export interface OjsPdf {
  /** PDF içeriği base64. Tarayıcı bunu blob'a çevirip gömülü gösterir. */
  base64: string;
  filename: string;
  bytes: number;
}

/**
 * Makalenin PDF'ini sunucu tarafında indirir.
 *
 * NEDEN ARADAN GEÇİRİYORUZ: OJS galley dosyalarını her zaman
 * `Content-Disposition: attachment` ile veriyor, yani adres doğrudan bir
 * çerçeveye konduğunda tarayıcı dosyayı indiriyor, göstermiyor. İçeriği
 * buradan alıp okuyucuya blob olarak vererek PDF'i sayfanın içinde
 * açabiliyoruz. Ayrıca okuyucu OJS'e hiç gitmemiş oluyor.
 */
export async function fetchArticlePdf(article: OjsArticle): Promise<OjsPdf | null> {
  if (!article.pdfPath) return null;
  return cached(`pdf:${article.ojsPath}:${article.id}`, async () => {
    const res = await fetch(article.pdfPath!, { signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new Error(`PDF ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength > PDF_MAX_BYTES) {
      throw new Error(`PDF too large (${buffer.byteLength} bytes)`);
    }

    return {
      base64: buffer.toString("base64"),
      filename: `${article.ojsPath}-${article.id}.pdf`,
      bytes: buffer.byteLength,
    };
  });
}
