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
      "An interdisciplinary journal publishing original research that develops practical, evidence-based responses to pressing social problems. Coverage spans social work, social policy, community health, education, and sustainable development.",
    issn: "0000-0001",
    eissn: "0000-0002",
    subjects: ["Social Work", "Social Policy", "Community Health", "Education", "Sustainable Development"],
  },
  {
    slug: "cognitive-formation",
    name: "Journal of Cognitive Formation",
    shortName: "JCF",
    scope:
      "Publishes theoretical and experimental work on cognition, learning, and the mechanisms by which knowledge is formed — including research on artificial intelligence, language, and human–machine interaction.",
    issn: "0000-0003",
    eissn: "0000-0004",
    subjects: ["Cognitive Science", "Artificial Intelligence", "Learning", "Linguistics"],
  },
  {
    slug: "economic-change-future",
    name: "Journal of Economic Change and Future",
    shortName: "JECF",
    scope:
      "Devoted to the study of structural economic change and its long-run consequences. The journal welcomes research on urbanization, environmental economics, and forward-looking policy analysis.",
    issn: "0000-0005",
    eissn: "0000-0006",
    subjects: ["Economics", "Urbanization", "Environment", "Public Policy"],
  },
  {
    slug: "community-foundations",
    name: "Journal of Community & Foundations",
    shortName: "JCFo",
    scope:
      "Publishes community-based research and scholarship on civil society, philanthropy, and local governance, with particular attention to the role of foundations and voluntary organizations in social life.",
    issn: "0000-0007",
    eissn: "0000-0008",
    subjects: ["Community Studies", "Civil Society", "Philanthropy", "Local Governance"],
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
