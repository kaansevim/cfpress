// JATS görüntüleyicisinin beklediği makale kaydı.
//
// Bu kayıtlar artık elle yazılmaz: OJS'ten gelen veriden
// article-utils.ts içindeki ojsToXmlEntry() ile üretilir.

export interface XmlArticleEntry {
  id: string;
  journalSlug: string;
  xmlPath: string;
  pdfPath?: string;
  // Listeleme kartı için gereken temel bilgiler
  // (Bunları JATS XML'inizdeki <front> bölümünden kopyalayın)
  title: string;
  subject: string;
  abstract: string;
  publishedAt: string;        // YYYY-MM-DD
  authorNames: string[];      // ["Dr. Ayşe Yılmaz", "Prof. Dr. Mehmet Demir"]
  doi: string;
  keywords: string[];
  language?: string;
  volume?: string;
  issue?: string;
  firstPage?: string;
  lastPage?: string;
}

/** Artık kullanılmıyor — makaleler OJS'ten gelir. Boş kalmalıdır. */
export const xmlArticles: XmlArticleEntry[] = [];

export function findXmlArticle(id: string, journalSlug: string): XmlArticleEntry | undefined {
  return xmlArticles.find((e) => e.id === id && e.journalSlug === journalSlug);
}

export function getXmlArticlesByJournal(journalSlug: string): XmlArticleEntry[] {
  return xmlArticles.filter((e) => e.journalSlug === journalSlug);
}
