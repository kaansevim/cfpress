// Frontend ile OJS arasındaki sunucu tarafı köprü.
//
// Route loader'ları tarayıcıda da çalışabildiği için OJS'e doğrudan istek
// atılmaz; her şey createServerFn üzerinden sunucuda döner. API anahtarı ve
// OJS'in iç adresi böylece tarayıcıya hiç çıkmaz.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getJournal } from "../journals";
import type { OjsArticle, OjsJournalSettings } from "../ojs.server";

const slugInput = z.object({ slug: z.string().min(1) });

/** Listeye sitede sayılan görüntülenme/indirme değerlerini ekler. */
async function withMetrics(journalSlug: string, list: OjsArticle[]): Promise<OjsArticle[]> {
  try {
    const { getMany } = await import("../metrics.server");
    const counts = await getMany(journalSlug, list.map((a) => a.id));
    return list.map((a) => ({
      ...a,
      views: counts[a.id]?.views ?? 0,
      downloads: counts[a.id]?.downloads ?? 0,
    }));
  } catch {
    return list;
  }
}
const articleInput = z.object({ slug: z.string().min(1), id: z.string().min(1) });

/** Bir derginin yayınlanmış makaleleri. OJS erişilemezse boş dizi döner. */
export const getJournalArticles = createServerFn({ method: "GET" })
  .inputValidator(slugInput)
  .handler(async ({ data }): Promise<OjsArticle[]> => {
    const journal = getJournal(data.slug);
    if (!journal) return [];
    const { listArticles } = await import("../ojs.server");
    try {
      return await withMetrics(journal.slug, await listArticles(journal.ojsPath, journal.slug));
    } catch (error) {
      console.error("[ojs] makale listesi alınamadı:", error);
      return [];
    }
  });

/** Tüm dergilerin yayınlanmış makaleleri (anasayfa vitrini için). */
export const getAllArticles = createServerFn({ method: "GET" }).handler(
  async (): Promise<OjsArticle[]> => {
    const { journals } = await import("../journals");
    const { listArticles } = await import("../ojs.server");
    const lists = await Promise.all(
      journals.map((j) =>
        listArticles(j.ojsPath, j.slug)
          .then((list) => withMetrics(j.slug, list))
          .catch((error) => {
            console.error(`[ojs] ${j.slug} listesi alınamadı:`, error);
            return [] as OjsArticle[];
          }),
      ),
    );
    return lists.flat().sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  },
);

export interface ArticleWithXml {
  article: OjsArticle | null;
  /** Şekil adresleri mutlak hale getirilmiş JATS XML; yoksa null. */
  xml: string | null;
  /** XML alınamadıysa kullanıcıya gösterilecek kısa açıklama. */
  xmlError: string | null;
}

/** Tek makale + JATS XML içeriği. */
export const getArticleWithXml = createServerFn({ method: "GET" })
  .inputValidator(articleInput)
  .handler(async ({ data }): Promise<ArticleWithXml> => {
    const journal = getJournal(data.slug);
    if (!journal) return { article: null, xml: null, xmlError: null };

    const { getArticleById, fetchArticleXml } = await import("../ojs.server");

    let article: OjsArticle | null = null;
    try {
      article = await getArticleById(journal.ojsPath, journal.slug, data.id);
    } catch (error) {
      console.error("[ojs] makale alınamadı:", error);
      return { article: null, xml: null, xmlError: null };
    }
    if (!article) return { article: null, xml: null, xmlError: null };

    // Sayaç değerleri makale listesi önbelleğinde tutulmaz; her istekte
    // güncel değer okunur, yoksa makale sayfası hep 0 gösterirdi.
    [article] = await withMetrics(journal.slug, [article]);

    let xml: string | null = null;
    let xmlError: string | null = null;
    try {
      xml = await fetchArticleXml(article);
    } catch (error) {
      console.error("[ojs] XML alınamadı:", error);
      xmlError = "The full text could not be loaded. Please try the PDF version.";
    }

    return { article, xml, xmlError };
  });

/** Derginin OJS'teki metin ayarları. Alınamazsa boş nesne döner. */
export const getJournalSettings = createServerFn({ method: "GET" })
  .inputValidator(slugInput)
  .handler(async ({ data }): Promise<OjsJournalSettings> => {
    const journal = getJournal(data.slug);
    if (!journal) return {};
    const { getJournalSettings: load } = await import("../ojs.server");
    try {
      return await load(journal.ojsPath);
    } catch (error) {
      console.error("[ojs] dergi ayarları alınamadı:", error);
      return {};
    }
  });
