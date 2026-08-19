// Makale görüntüleme tipleri.
//
// GEÇMİŞ: Bu dosya adı "mock" olarak kaldı çünkü site geliştirilirken örnek
// makaleler burada tutuluyordu. Artık tüm makaleler OJS'ten geliyor
// (bkz. lib/ojs.server.ts). Burada yalnızca bileşenlerin paylaştığı tipler ve
// geriye dönük uyumluluk için boş koleksiyonlar var.
//
// Örnek/uydurma içerik BURAYA GERİ EKLENMEMELİDİR: yayınlanmış gibi görünen
// sahte makale, sahte yazar veya sahte DOI akademik güvenilirliği zedeler.

export interface Author {
  name: string;
  surname?: string;
  givenNames?: string;
  orcid: string;
  affiliation: string;
  isCorresponding?: boolean;
  email?: string;
  contributions?: string[];
}

export interface Figure {
  id: string;
  label: string;
  caption: string;
  placeholder: string;
}

export interface Reference {
  id: string;
  text: string;
}

export interface Article {
  id: string;
  journalSlug: string;
  subject: string;
  title: string;
  authors: Author[];
  abstract: string;
  publishedAt: string;
  doi: string;
  volume?: string;
  issue?: string;
  /** OJS'teki sayı kimliği — makaleleri sayılara göre gruplamak için. */
  issueId?: number;
  /** Sayının görünen adı, örn. "Vol. 1 No. 1 (2026)". */
  issueLabel?: string;
  fpage?: string;
  lpage?: string;
  journalTitle?: string;
  keywords: string[];
  content: string;
  figures: Figure[];
  references: Reference[];
  metrics: {
    views: number;
    downloads: number;
    citations: number;
  };
  funding?: string;
  dataAvailability?: string;
  info: {
    received: string;
    accepted: string;
    published: string;
    editor: string;
    license: string;
  };
}

/** Artık kullanılmıyor — makaleler OJS'ten gelir. Boş kalmalıdır. */
export const articles: Article[] = [];

export const getArticle = (id: string) => articles.find((a) => a.id === id);

export const getArticlesByJournal = (journalSlug: string) =>
  articles.filter((a) => a.journalSlug === journalSlug);
