// XML makale kaydı.
// Yeni makale eklemek için bu listeye bir nesne ekleyin,
// ve public/articles/[dergi-slug]/[yıl]/[id]/ klasörüne
// article.xml (ve varsa article.pdf) dosyalarını koyun.

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
}

export const xmlArticles: XmlArticleEntry[] = [
  {
    id: "jss-2025-0001",
    journalSlug: "social-solutions",
    xmlPath: "/articles/social-solutions/2025/0001/article.xml",
    // — Listeleme bilgileri —
    title: "Türkiye'de Tarımsal Mikrobiyom Çeşitliliğinin Toprak Verimliliği Üzerindeki Etkisi",
    subject: "Toplum Sağlığı & Çevre",
    abstract:
      "Bu çalışma, Anadolu'nun farklı iklim kuşaklarında bulunan tarım topraklarındaki mikrobiyom çeşitliliğini metagenomik yaklaşımlarla incelemiş ve bu çeşitliliğin toprak verimliliği parametreleri ile güçlü bir korelasyon gösterdiğini ortaya koymuştur.",
    publishedAt: "2025-03-14",
    authorNames: ["Dr. Ayşe Yılmaz", "Prof. Dr. Mehmet Demir"],
    doi: "10.62847/akademik.2025.0001",
    keywords: ["mikrobiyom", "toprak verimliliği", "metagenomik", "Anadolu"],
  },
];

export function findXmlArticle(id: string, journalSlug: string): XmlArticleEntry | undefined {
  return xmlArticles.find((e) => e.id === id && e.journalSlug === journalSlug);
}

export function getXmlArticlesByJournal(journalSlug: string): XmlArticleEntry[] {
  return xmlArticles.filter((e) => e.journalSlug === journalSlug);
}
