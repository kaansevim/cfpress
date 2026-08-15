// Çok-dergili platform veri modeli.
// NOT: Dergi adları kullanıcı tarafından verildi. ISSN/kapsam metinleri GEÇİCİ
// placeholder'dır — kullanıcı netleştirince güncellenecek.

export interface Journal {
  slug: string;
  name: string;
  shortName: string;
  coverImage: string;
  theme: {
    heroFrom: string;
    heroTo: string;
    accent: string;
  };
  scope: string;
  eissn?: string;
  subjects: string[];
}

export const journals: Journal[] = [
  {
    slug: "social-solutions",
    name: "Journal of Social Solutions",
    shortName: "JSS",
    coverImage: "/journals/social-solutions/cover.png",
    theme: { heroFrom: "#102f4f", heroTo: "#1f5f91", accent: "#8fc7f2" },
    scope:
      "An interdisciplinary journal publishing original research that develops practical, evidence-based responses to pressing social problems. Coverage spans social work, social policy, community health, education, and sustainable development.",
    eissn: "0000-0002",
    subjects: ["Social Work", "Social Policy", "Community Health", "Education", "Sustainable Development"],
  },
  {
    slug: "cognitive-formation",
    name: "Journal of Cognitive Formation",
    shortName: "JCF",
    coverImage: "/journals/cognitive-formation/cover.png",
    theme: { heroFrom: "#2f1d40", heroTo: "#664483", accent: "#d0afea" },
    scope:
      "Publishes theoretical and experimental work on cognition, learning, and the mechanisms by which knowledge is formed — including research on artificial intelligence, language, and human–machine interaction.",
    eissn: "0000-0004",
    subjects: ["Cognitive Science", "Artificial Intelligence", "Learning", "Linguistics"],
  },
  {
    slug: "economic-change-future",
    name: "Journal of Economic Change and Future",
    shortName: "JECF",
    coverImage: "/journals/economic-change-future/cover.png",
    theme: { heroFrom: "#432600", heroTo: "#8a5615", accent: "#f0b65f" },
    scope:
      "Devoted to the study of structural economic change and its long-run consequences. The journal welcomes research on urbanization, environmental economics, and forward-looking policy analysis.",
    eissn: "0000-0006",
    subjects: ["Economics", "Urbanization", "Environment", "Public Policy"],
  },
  {
    slug: "community-foundations",
    name: "Journal of Community & Foundations",
    shortName: "JCFo",
    coverImage: "/journals/community-foundations/cover.png",
    theme: { heroFrom: "#4c211b", heroTo: "#954b40", accent: "#f2a191" },
    scope:
      "Publishes community-based research and scholarship on civil society, philanthropy, and local governance, with particular attention to the role of foundations and voluntary organizations in social life.",
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
