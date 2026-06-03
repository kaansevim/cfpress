// Çok-dergili platform veri modeli.
// NOT: Dergi adları kullanıcı tarafından verildi. ISSN/kapsam metinleri GEÇİCİ
// placeholder'dır — kullanıcı netleştirince güncellenecek.

export interface Journal {
  slug: string;
  name: string;
  shortName: string;
  scope: string;
  issn?: string;
  eissn?: string;
  subjects: string[];
}

export const journals: Journal[] = [
  {
    slug: "social-solutions",
    name: "Journal of Social Solutions",
    shortName: "JSS",
    scope:
      "Toplumsal sorunlara disiplinler arası ve uygulanabilir çözümler üreten özgün araştırmaları yayımlar. Sosyal politika, toplum sağlığı, eğitim ve sürdürülebilir kalkınma odaklıdır.",
    issn: "0000-0001",
    eissn: "0000-0002",
    subjects: ["Sosyal Politika", "Toplum Sağlığı", "Eğitim", "Sürdürülebilir Kalkınma"],
  },
  {
    slug: "cognitive-formation",
    name: "Journal of Cognitive Formation",
    shortName: "JCF",
    scope:
      "Bilişsel bilimler, öğrenme, yapay zekâ ve insan-makine etkileşimi alanlarında kuramsal ve deneysel çalışmalara yer verir.",
    issn: "0000-0003",
    eissn: "0000-0004",
    subjects: ["Bilişsel Bilim", "Yapay Zekâ", "Öğrenme", "Dilbilim"],
  },
  {
    slug: "economic-change-future",
    name: "Journal of Economic Change and Future",
    shortName: "JECF",
    scope:
      "Ekonomik dönüşüm, kentleşme, çevre ekonomisi ve geleceğe yönelik politika araştırmalarını kapsar.",
    issn: "0000-0005",
    eissn: "0000-0006",
    subjects: ["Ekonomi", "Kentleşme", "Çevre", "Politika"],
  },
  {
    slug: "community-foundations",
    name: "Journal of Community & Foundations",
    shortName: "JCFo",
    scope:
      "Topluluk temelli araştırmalar, sivil toplum, vakıf çalışmaları ve yerel yönetişim üzerine çalışmaları yayımlar.",
    issn: "0000-0007",
    eissn: "0000-0008",
    subjects: ["Topluluk", "Sivil Toplum", "Yerel Yönetişim"],
  },
];

export const getJournal = (slug: string) => journals.find((j) => j.slug === slug);

// Dergi seviyesindeki header açılır menü yapısı (escienceediting.org düzeniyle).
// ÇEKİRDEK TUR: alt öğeler görünür; her biri ilgili bölüm sayfasına (section)
// yönlendirir. Gerçek tekil içerik sayfaları 2. turda eklenecek.
export interface NavSection {
  label: string;
  section: "about" | "articles" | "for-authors";
  items: string[];
}

export const journalNav: NavSection[] = [
  {
    label: "About",
    section: "about",
    items: [
      "Aims and scope",
      "About the journal",
      "Abstracting and indexing services",
      "Editorial board",
      "Best practice",
      "Journal management team",
      "Publishing credentials",
      "Open access",
      "Readership",
      "Subscription information",
      "Mass media",
      "Disclaimer",
      "Contact us",
    ],
  },
  {
    label: "Browse articles",
    section: "articles",
    items: [
      "All issues",
      "Ahead-of print articles",
      "Current issue",
      "Most read articles",
      "Most cited articles",
      "Funded articles",
      "Past issue",
      "Search",
      "Metrics",
      "Author index",
    ],
  },
  {
    label: "For authors and reviewers",
    section: "for-authors",
    items: [
      "Instructions for authors",
      "Research and publication ethics",
      "Editorial policy",
      "For reviewers",
      "E-submission",
      "Checklist",
      "Copyright transfer agreement",
      "Conflict of interest form",
      "Article processing charge",
    ],
  },
];

// Bir alt-menü etiketini URL anchor'ına çevirir (2. turda tekil sayfalara bağlanacak).
export const navItemSlug = (item: string) =>
  item
    .toLowerCase()
    .replace(/&/g, "ve")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
