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
  language?: string;
  volume?: string;
  issue?: string;
  firstPage?: string;
  lastPage?: string;
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
  {
    id: "test-makale",
    journalSlug: "social-solutions",
    xmlPath: "/articles/social-solutions/2026/test-makale/main_jats.xml",
    pdfPath: "/articles/social-solutions/2026/test-makale/main.pdf",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim",
    subject: "Research",
    abstract:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    publishedAt: "2026-04-16",
    authorNames: ["Kaan Sevim", "Kaan Sevim"],
    doi: "10.70989/jss.123456",
    keywords: ["Early maladaptive schemas", "cyberbullying", "social support"],
    language: "en",
    volume: "1",
    issue: "1",
    firstPage: "1",
  },
];

export function findXmlArticle(id: string, journalSlug: string): XmlArticleEntry | undefined {
  return xmlArticles.find((e) => e.id === id && e.journalSlug === journalSlug);
}

export function getXmlArticlesByJournal(journalSlug: string): XmlArticleEntry[] {
  return xmlArticles.filter((e) => e.journalSlug === journalSlug);
}
