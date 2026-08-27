// JATS XML → Article verisi dönüştürücü.
// DOMParser kullandığı için yalnızca tarayıcıda (useEffect içinde) çalışır.

import type {
  Article,
  Author,
  Figure,
  Reference,
  RefSegment,
} from "./mock-articles";
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

// ── Kaynakça yardımcıları ────────────────────────────────────────────────────

// APA'da italik olan alanlar (dergi/kitap adı ve cilt).
const ITALIC_TAGS = new Set(["source", "volume", "italic", "i", "em"]);
const URL_RE = /(https?:\/\/[^\s<>()]+|www\.[^\s<>()]+)/;

function collapse(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}

function pushSeg(
  out: RefSegment[],
  text: string,
  italic: boolean,
  href?: string
): void {
  if (!text) return;
  const last = out[out.length - 1];
  if (last && !last.href && !href && !!last.italic === italic) {
    last.text += text;
    return;
  }
  out.push({
    text,
    ...(italic ? { italic: true } : {}),
    ...(href ? { href } : {}),
  });
}

// Düz metindeki adresleri bağlantı parçasına ayırır.
function pushLinkified(out: RefSegment[], text: string, italic: boolean): void {
  const re = new RegExp(URL_RE.source, "g");
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const url = m[0].replace(/[.,;:)\]]+$/, "");
    if (!url) {
      re.lastIndex = m.index + m[0].length;
      continue;
    }
    pushSeg(out, text.slice(last, m.index), italic);
    pushSeg(out, url, italic, url.startsWith("http") ? url : `https://${url}`);
    last = m.index + url.length;
    re.lastIndex = last;
  }
  pushSeg(out, text.slice(last), italic);
}

// <mixed-citation> içeriğini olduğu gibi parçalara çevirir: metin PDF'tekiyle
// aynı kalır, yalnızca <source>/<volume> italiğe, adresler bağlantıya döner.
function citationSegments(el: Element): RefSegment[] {
  const out: RefSegment[] = [];

  const walk = (node: Node, italic: boolean): void => {
    if (node.nodeType === 3) {
      pushLinkified(out, (node.textContent ?? "").replace(/\s+/g, " "), italic);
      return;
    }
    if (node.nodeType !== 1) return;
    const e = node as Element;
    const tag = e.tagName.toLowerCase();

    if (tag === "ext-link" || tag === "uri") {
      const label = collapse(e.textContent ?? "");
      const raw = xlinkHref(e) || label;
      if (label) {
        pushSeg(
          out,
          label,
          italic,
          raw.startsWith("http") ? raw : `https://${raw}`
        );
      }
      return;
    }

    const inner = italic || ITALIC_TAGS.has(tag);
    Array.from(e.childNodes).forEach((c) => walk(c, inner));
  };

  Array.from(el.childNodes).forEach((c) => walk(c, false));

  if (out.length) {
    out[0].text = out[0].text.replace(/^\s+/, "");
    out[out.length - 1].text = out[out.length - 1].text.replace(/\s+$/, "");
  }
  return out.filter((seg) => seg.text.length > 0);
}

// "M. C." → "M. C." ; "Mehmet Cem" → "M. C."  (eski kod ilk harfi kırpıyordu)
function initials(given: string): string {
  return collapse(given)
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((w) => (w.length === 1 ? `${w}.` : `${w[0].toUpperCase()}.`))
    .join(" ");
}

function joinAuthors(names: string[], hasEtal: boolean): string {
  if (!names.length) return "";
  if (hasEtal) return `${names.join(", ")}, et al.`;
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")}, & ${names[names.length - 1]}`;
}

function xmlLang(el: Element): string {
  return (
    el.getAttributeNS(XML_NS, "lang") ??
    el.getAttribute("xml:lang") ??
    el.getAttribute("lang") ??
    ""
  );
}

const EN_MONTHS = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(el: Element | null): string {
  if (!el) return "";
  const d = el.querySelector("day")?.textContent?.trim() ?? "";
  const m = parseInt(el.querySelector("month")?.textContent ?? "0");
  const y = el.querySelector("year")?.textContent?.trim() ?? "";
  return `${d} ${EN_MONTHS[m] ?? ""} ${y}`.trim();
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
    "Research";

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
      surname,
      givenNames: given,
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
  const published = `${pubDay} ${EN_MONTHS[parseInt(pubMonth)] ?? ""} ${pubYear}`.trim();

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
  //
  // KURAL: <ref> içinde <mixed-citation> varsa dizgi ODUR — PDF'te basılan APA
  // metninin birebir aynısı XML'e gömülüdür (bkz. latex2xml.py). Ön yüz burada
  // yeniden dizgi KURMAZ, yalnızca italik/bağlantı biçimlendirmesi yapar.
  // <element-citation> makine okunur metadata'dır; aşağıdaki üretici sadece
  // mixed-citation'ı olmayan eski XML'ler için yedektir.
  const references: Reference[] = qq(doc, "ref-list ref").map((ref) => {
    const id = ref.getAttribute("id") ?? "";

    const mc = ref.querySelector("mixed-citation");
    if (mc) {
      const segments = citationSegments(mc);
      const text = segments.map((seg) => seg.text).join("");
      if (text) return { id, text, segments };
    }

    const ec = ref.querySelector("element-citation");
    if (!ec) return { id, text: collapse(ref.textContent ?? "") };

    const names = qq(ec, 'person-group[person-group-type="author"] name').map(
      (n) => {
        const sur = n.querySelector("surname")?.textContent?.trim() ?? "";
        const g = n.querySelector("given-names")?.textContent?.trim() ?? "";
        return g ? `${sur}, ${initials(g)}` : sur;
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

    const segments: RefSegment[] = [];
    const add = (t: string) => pushSeg(segments, t, false);

    const authorStr = joinAuthors(names, hasEtal);
    if (authorStr) add(`${authorStr} `);
    if (year) add(`(${year}). `);
    if (artTitle) add(/[.!?]$/.test(artTitle) ? `${artTitle} ` : `${artTitle}. `);
    if (source) pushSeg(segments, source, true);
    if (volume) {
      if (source) add(", ");
      pushSeg(segments, volume, true);
      if (issue) add(`(${issue})`);
    }
    if (fpage) add(`, ${fpage}${lpage ? `–${lpage}` : ""}`);
    if (source || volume || fpage) add(".");
    if (doiRef) {
      const url = doiRef.startsWith("http")
        ? doiRef
        : `https://doi.org/${doiRef}`;
      add(" ");
      pushSeg(segments, url, false, url);
    }

    if (segments.length) {
      segments[0].text = segments[0].text.replace(/^\s+/, "");
      segments[segments.length - 1].text = segments[
        segments.length - 1
      ].text.replace(/\s+$/, "");
    }
    const clean = segments.filter((seg) => seg.text.length > 0);
    return { id, text: clean.map((seg) => seg.text).join(""), segments: clean };
  });

  // Finansman
  const funding =
    doc.querySelector("funding-statement")?.textContent?.trim() || undefined;

  // Veri erişilebilirliği
  const dataAvailability =
    q(doc, 'sec[sec-type="data-availability"] p') ||
    q(doc, 'custom-meta meta-value') ||
    undefined;

  const journalTitle = q(doc, "journal-title-group > journal-title");
  const volume = q(meta, "volume");
  const issue = q(meta, "issue");
  // Sayfa numaraları ÖNCE OJS kaydından (Pages alanı) alınır — atıf kutusu da
  // aynı kaynağı kullanıyor. XML'de genelde yalnızca <fpage> bulunuyor, son
  // sayfa dizgi sırasında hesaplandığı için oraya yazılmıyor.
  const fpage = entry.firstPage || q(meta, "fpage");
  const lpage = entry.lastPage || q(meta, "lpage");

  return {
    id: entry.id,
    journalSlug: entry.journalSlug,
    subject,
    title,
    authors,
    abstract,
    publishedAt,
    doi,
    volume,
    issue,
    fpage,
    lpage,
    journalTitle,
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
