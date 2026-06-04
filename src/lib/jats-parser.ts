// JATS XML → Article verisi dönüştürücü.
// DOMParser kullandığı için yalnızca tarayıcıda (useEffect içinde) çalışır.

import type { Article, Author, Figure, Reference } from "./mock-articles";
import type { XmlArticleEntry } from "./article-manifest";

export interface ParsedJats extends Article {
  bodyElement: Element;
  pdfUrl?: string;
}

const XLINK = "http://www.w3.org/1999/xlink";
const XML_NS = "http://www.w3.org/XML/1998/namespace";

// ── Yardımcılar ──────────────────────────────────────────────────────────────

function q(root: Element | Document, sel: string): string {
  try {
    return root.querySelector(sel)?.textContent?.trim() ?? "";
  } catch {
    return "";
  }
}

function qq(root: Element | Document, sel: string): Element[] {
  try {
    return Array.from(root.querySelectorAll(sel));
  } catch {
    return [];
  }
}

function xlinkHref(el: Element): string {
  return (
    el.getAttributeNS(XLINK, "href") ?? el.getAttribute("xlink:href") ?? ""
  );
}

function xmlLang(el: Element): string {
  return (
    el.getAttributeNS(XML_NS, "lang") ??
    el.getAttribute("xml:lang") ??
    el.getAttribute("lang") ??
    ""
  );
}

const TR_MONTHS = [
  "", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function formatDate(el: Element | null): string {
  if (!el) return "";
  const d = el.querySelector("day")?.textContent?.trim() ?? "";
  const m = parseInt(el.querySelector("month")?.textContent ?? "0");
  const y = el.querySelector("year")?.textContent?.trim() ?? "";
  return `${d} ${TR_MONTHS[m] ?? ""} ${y}`.trim();
}

// ── Ana parser ────────────────────────────────────────────────────────────────

export function parseJats(xmlText: string, entry: XmlArticleEntry): ParsedJats {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");

  const err = doc.querySelector("parsererror");
  if (err) throw new Error("XML ayrıştırma hatası: " + err.textContent?.slice(0, 120));

  const meta = doc.querySelector("article-meta");
  if (!meta) throw new Error("<article-meta> bulunamadı");

  // DOI
  const doi = q(meta, 'article-id[pub-id-type="doi"]');

  // Başlık
  const title = q(meta, "title-group article-title") || entry.id;

  // Konu
  const subject =
    q(meta, 'subj-group[subj-group-type="discipline"] subject') ||
    q(meta, 'subj-group[subj-group-type="heading"] subject') ||
    "Araştırma Makalesi";

  // Kurumlar haritası
  const affMap = new Map<string, string>();
  qq(meta, "aff").forEach((aff) => {
    const id = aff.getAttribute("id") ?? "";
    const inst = aff.querySelector("institution")?.textContent?.trim() ?? "";
    const dept = aff.querySelector("addr-line")?.textContent?.trim() ?? "";
    affMap.set(id, [inst, dept].filter(Boolean).join(", "));
  });

  // Yazışma e-postası
  const corrEmail = meta
    .querySelector("author-notes corresp email")
    ?.textContent?.trim();

  // Yazarlar
  const authors: Author[] = qq(
    meta,
    'contrib-group > contrib[contrib-type="author"]'
  ).map((c) => {
    const surname = c.querySelector("name surname")?.textContent?.trim() ?? "";
    const given = c.querySelector("name given-names")?.textContent?.trim() ?? "";
    const degrees = c.querySelector("degrees")?.textContent?.trim() ?? "";
    const name = [degrees, given, surname].filter(Boolean).join(" ");

    const orcidRaw =
      c
        .querySelector('contrib-id[contrib-id-type="orcid"]')
        ?.textContent?.trim() ?? "";
    const orcid = orcidRaw.replace("https://orcid.org/", "") || "0000-0000-0000-0000";

    const isCorresponding = c.getAttribute("corresp") === "yes";
    const affRid = c.querySelector('xref[ref-type="aff"]')?.getAttribute("rid") ?? "";

    return {
      name,
      orcid,
      affiliation: affMap.get(affRid) ?? "",
      isCorresponding,
      email: isCorresponding ? corrEmail : undefined,
    };
  });

  // Öz
  const abstractEls = qq(meta, "abstract").filter(
    (a) => !a.tagName.toLowerCase().startsWith("trans")
  );
  const trAbstract =
    abstractEls.find((a) => xmlLang(a) === "tr") ??
    abstractEls.find((a) => xmlLang(a) === "") ??
    abstractEls[0] ??
    null;
  const abstract = trAbstract
    ? qq(trAbstract, "p")
        .map((p) => p.textContent?.trim())
        .filter(Boolean)
        .join(" ")
    : "";

  // Anahtar kelimeler
  const kwdGroups = qq(meta, "kwd-group");
  const kwdGroup =
    kwdGroups.find((g) => xmlLang(g) === "tr") ??
    kwdGroups.find((g) => xmlLang(g) === "") ??
    kwdGroups[0] ??
    null;
  const keywords = kwdGroup
    ? qq(kwdGroup, "kwd").map((k) => k.textContent?.trim() ?? "")
    : [];

  // Yayın tarihi
  const pubYear = q(meta, "pub-date year");
  const pubMonth = (q(meta, "pub-date month") || "1").padStart(2, "0");
  const pubDay = (q(meta, "pub-date day") || "1").padStart(2, "0");
  const publishedAt = pubYear
    ? `${pubYear}-${pubMonth}-${pubDay}`
    : entry.id.slice(-10);

  // Geliş / kabul tarihleri
  const received = formatDate(
    meta.querySelector('history date[date-type="received"]')
  );
  const accepted = formatDate(
    meta.querySelector('history date[date-type="accepted"]')
  );
  const published = `${pubDay} ${TR_MONTHS[parseInt(pubMonth)] ?? ""} ${pubYear}`.trim();

  // Editör
  const editorC = doc.querySelector(
    'contrib-group[content-type="section-editor"] contrib'
  );
  const editorName = editorC
    ? [
        editorC.querySelector("degrees")?.textContent?.trim(),
        editorC.querySelector("given-names")?.textContent?.trim(),
        editorC.querySelector("surname")?.textContent?.trim(),
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  // Lisans
  const licenseEl = doc.querySelector("license");
  const licHref = licenseEl ? xlinkHref(licenseEl) : "";
  const license = licHref.includes("by/4.0")
    ? "CC BY 4.0"
    : licHref.includes("by/3.0")
      ? "CC BY 3.0"
      : "CC BY 4.0";

  // Body elementi
  const bodyElement = doc.querySelector("body");
  if (!bodyElement) throw new Error("<body> bulunamadı");

  // Şekiller
  const figures: Figure[] = qq(bodyElement, "fig").map((fig) => {
    const id = fig.getAttribute("id") ?? "";
    const label = fig.querySelector("label")?.textContent?.trim() ?? "";
    const captionTitle = fig.querySelector("caption title")?.textContent?.trim() ?? "";
    const captionP = fig.querySelector("caption p")?.textContent?.trim() ?? "";
    const graphicEl = fig.querySelector("graphic");
    const src = graphicEl ? xlinkHref(graphicEl) : "";
    return {
      id,
      label,
      caption: [captionTitle, captionP].filter(Boolean).join(". "),
      placeholder: src || label,
    };
  });

  // Kaynaklar
  const references: Reference[] = qq(doc, "ref-list ref").map((ref) => {
    const id = ref.getAttribute("id") ?? "";
    const ec = ref.querySelector("element-citation");
    if (!ec) return { id, text: ref.textContent?.trim() ?? "" };

    const names = qq(ec, 'person-group[person-group-type="author"] name').map(
      (n) => {
        const s = n.querySelector("surname")?.textContent?.trim() ?? "";
        const g = n.querySelector("given-names")?.textContent?.trim() ?? "";
        return g ? `${s}, ${g[0]}.` : s;
      }
    );
    const hasEtal = !!ec.querySelector("etal");
    const year = q(ec, "year");
    const artTitle = q(ec, "article-title");
    const source = q(ec, "source");
    const volume = q(ec, "volume");
    const issue = q(ec, "issue");
    const fpage = q(ec, "fpage");
    const lpage = q(ec, "lpage");
    const doiRef = q(ec, 'pub-id[pub-id-type="doi"]');

    const parts: string[] = [];
    if (names.length) parts.push(names.join(", ") + (hasEtal ? " vd." : ""));
    if (year) parts.push(`(${year})`);
    if (artTitle) parts.push(artTitle);
    if (source) parts.push(source);
    if (volume) parts.push(`${volume}${issue ? `(${issue})` : ""}`);
    if (fpage) parts.push(`${fpage}${lpage ? `–${lpage}` : ""}`);
    if (doiRef) parts.push(`doi:${doiRef}`);

    return { id, text: parts.join(". ") };
  });

  // Finansman
  const funding =
    doc.querySelector("funding-statement")?.textContent?.trim() || undefined;

  // Veri erişilebilirliği
  const dataAvailability =
    q(doc, 'sec[sec-type="data-availability"] p') ||
    q(doc, 'custom-meta meta-value') ||
    undefined;

  return {
    id: entry.id,
    journalSlug: entry.journalSlug,
    subject,
    title,
    authors,
    abstract,
    publishedAt,
    doi,
    keywords,
    content: "",
    figures,
    references,
    metrics: { views: 0, downloads: 0, citations: 0 },
    funding,
    dataAvailability,
    info: { received, accepted, published, editor: editorName, license },
    bodyElement,
    pdfUrl: entry.pdfPath,
  };
}
