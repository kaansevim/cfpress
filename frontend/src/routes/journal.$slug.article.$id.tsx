import { useState, useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, FileText, Loader2 } from "lucide-react";
import { type Article } from "@/lib/mock-articles";
import { getJournal, type Journal } from "@/lib/journals";
import { extractHeadings, formatDate, slugify, type Heading } from "@/lib/article-utils";
import type { XmlArticleEntry } from "@/lib/article-manifest";
import { ojsToArticle, ojsToXmlEntry } from "@/lib/article-utils";
import { getArticleWithXml } from "@/lib/api/journal.functions";
import { recordDownload, recordView } from "@/lib/api/metrics.functions";
import { parseJats, type ParsedJats } from "@/lib/jats-parser";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ArticleBody } from "@/components/article-body";
import { JatsBody, RenderFig, RenderTableWrap } from "@/components/jats-body";
import { MockFigure } from "@/components/mock-figure";
import { ArticleToc } from "@/components/article/article-toc";
import { ArticleAuthors, AuthorContributions } from "@/components/article/article-authors";
import { ArticleActions } from "@/components/article/article-actions";
import { MetricsStrip, MetricsCards } from "@/components/article/article-metrics";
import { ArticleReaderLayout } from "@/components/article/article-reader-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { absoluteSiteUrl } from "@/lib/seo";

// Yeni okuyucu beğenilmezse false yapılarak mevcut görünüm anında geri getirilebilir.
const USE_ARTICLE_READER_V2 = true;

// ── Loader ────────────────────────────────────────────────────────────────────

// "xml": JATS tam metni var — okuyucuda tam metin gösterilir.
// "mock": yalnızca PDF var — özet ve PDF bağlantısı gösterilir.
type LoaderData =
  | { kind: "mock"; journal: Journal; article: Article }
  | {
      kind: "xml";
      journal: Journal;
      entry: XmlArticleEntry;
      xml: string | null;
      xmlError: string | null;
      metrics: Article["metrics"];
    };

export const Route = createFileRoute("/journal/$slug/article/$id")({
  loader: async ({ params }): Promise<LoaderData> => {
    const journal = getJournal(params.slug);
    if (!journal) throw notFound();

    // Makale ve JATS XML'i sunucu tarafında OJS'ten alınır.
    const { article: ojsArticle, xml, xmlError } = await getArticleWithXml({
      data: { slug: params.slug, id: params.id },
    });
    if (!ojsArticle) throw notFound();

    const entry = ojsToXmlEntry(ojsArticle);
    const metrics = {
      views: ojsArticle.views ?? 0,
      downloads: ojsArticle.downloads ?? 0,
      citations: 0,
    };
    if (entry && xml) return { kind: "xml", journal, entry, xml, xmlError, metrics };

    // XML yoksa (yalnızca PDF yüklenmişse) özet görünümü gösterilir.
    return { kind: "mock", journal, article: ojsToArticle(ojsArticle) };
  },

  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article" }] };
    const journal = loaderData.journal;
    const source = loaderData.kind === "mock" ? loaderData.article : loaderData.entry;
    const title = source.title;
    const authors =
      loaderData.kind === "mock"
        ? loaderData.article.authors.map((author) => author.name)
        : loaderData.entry.authorNames;
    const pdfUrl = loaderData.kind === "xml" ? loaderData.entry.pdfPath : undefined;
    const volume = loaderData.kind === "mock" ? loaderData.article.volume : loaderData.entry.volume;
    const issue = loaderData.kind === "mock" ? loaderData.article.issue : loaderData.entry.issue;
    const firstPage = loaderData.kind === "mock" ? loaderData.article.fpage : loaderData.entry.firstPage;
    const lastPage = loaderData.kind === "mock" ? loaderData.article.lpage : loaderData.entry.lastPage;
    const language = loaderData.kind === "xml" ? loaderData.entry.language : undefined;
    const description = source.abstract.slice(0, 160);
    const canonicalUrl = absoluteSiteUrl(`/journal/${journal.slug}/article/${source.id}`);

    return {
      meta: [
        { title: `${title} — ${journal.name}` },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image:alt", content: `${title} — ${journal.name}` },
        { property: "article:published_time", content: source.publishedAt },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "citation_title", content: title },
        ...authors.map((author) => ({ name: "citation_author", content: author })),
        { name: "citation_journal_title", content: journal.name },
        { name: "citation_publication_date", content: source.publishedAt },
        { name: "citation_doi", content: source.doi },
        ...(journal.eissn ? [{ name: "citation_eIssn", content: journal.eissn }] : []),
        { name: "citation_abstract", content: source.abstract },
        { name: "citation_keywords", content: source.keywords.join("; ") },
        ...(language ? [{ name: "citation_language", content: language }] : []),
        ...(volume ? [{ name: "citation_volume", content: volume }] : []),
        ...(issue ? [{ name: "citation_issue", content: issue }] : []),
        ...(firstPage ? [{ name: "citation_firstpage", content: firstPage }] : []),
        ...(lastPage ? [{ name: "citation_lastpage", content: lastPage }] : []),
        ...(pdfUrl ? [{ name: "citation_pdf_url", content: pdfUrl }] : []),
        { name: "DC.type", content: "Text" },
        { name: "DC.title", content: title },
        ...authors.map((author) => ({ name: "DC.creator", content: author })),
        { name: "DC.date", content: source.publishedAt },
        { name: "DC.identifier", content: `doi:${source.doi}` },
        { name: "DC.source", content: journal.name },
        { name: "DC.format", content: "text/html" },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl },
        ...(pdfUrl
          ? [
            {
              rel: "alternate",
              type: "application/pdf",
              href: pdfUrl,
              title: "Full text PDF",
            },
            ]
          : []),
      ],
    };
  },

  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Article not found.</p>
        <Link to="/journals" className="mt-4 inline-block text-accent hover:underline">
          ← Journals
        </Link>
      </div>
    </div>
  ),

  component: ArticlePage,
});

// ── Sekme stili ───────────────────────────────────────────────────────────────

const tabTrigger =
  "rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none";

// ── Bileşen ───────────────────────────────────────────────────────────────────

function ArticlePage() {
  const loaderData = Route.useLoaderData();
  const { journal } = loaderData;

  const [activeTab, setActiveTab] = useState("full-text");

  // XML makaleler için client-side parse durumu
  const [parsedJats, setParsedJats] = useState<ParsedJats | null>(null);
  const [jatsLoading, setJatsLoading] = useState(loaderData.kind === "xml");
  const [jatsError, setJatsError] = useState<string | null>(null);

  const xmlEntry = loaderData.kind === "xml" ? loaderData.entry : null;
  const xmlSource = loaderData.kind === "xml" ? loaderData.xml : null;

  // XML sunucu tarafında indirilip şekil adresleri mutlak hale getirildi;
  // burada yalnızca tarayıcıda ayrıştırılıyor (DOMParser gerekiyor).
  useEffect(() => {
    if (!xmlEntry) return;
    if (!xmlSource) {
      setJatsError("The full text could not be loaded.");
      setJatsLoading(false);
      return;
    }
    try {
      const parsed = parseJats(xmlSource, xmlEntry);
      // Sayaç değerleri XML'de değil sitede tutuluyor.
      if (loaderData.kind === "xml") parsed.metrics = loaderData.metrics;
      // SAYFA ARALIĞI: OJS'teki "Pages" alanı XML'e üstün gelir. Dizgi
      // programı son sayfayı kendisi hesapladığı için XML'de çoğu zaman
      // yalnızca ilk sayfa oluyor; editör aralığı OJS'e yazınca atıf
      // biçimleri (APA, BibTeX, RIS) tam sayfa aralığını gösterir.
      if (xmlEntry.firstPage) parsed.fpage = xmlEntry.firstPage;
      if (xmlEntry.lastPage) parsed.lpage = xmlEntry.lastPage;
      setParsedJats(parsed);
      setJatsError(null);
    } catch (e) {
      setJatsError(e instanceof Error ? e.message : "The article could not be displayed.");
    }
    setJatsLoading(false);
  }, [xmlEntry, xmlSource, loaderData]);

  // ── Metrikler ───────────────────────────────────────────────────────────
  // Okuyucu cf.org.tr'de olduğu için sayım burada yapılır; OJS bu ziyaretleri
  // göremez. Sayaç hata verirse sayfa etkilenmez.
  const articleId = loaderData.kind === "xml" ? loaderData.entry.id : loaderData.article.id;
  const journalSlug = journal.slug;

  useEffect(() => {
    void recordView({ data: { slug: journalSlug, id: articleId } }).catch(() => {});
  }, [journalSlug, articleId]);

  // Sayfadaki bütün indirme bağlantılarını (PDF, XML) tek yerden yakalar,
  // böylece her düğmeye ayrı ayrı kod eklemek gerekmez.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest('a[href*="/article/download/"]')) return;
      void recordDownload({ data: { slug: journalSlug, id: articleId } }).catch(() => {});
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [journalSlug, articleId]);

  // Görüntülenecek makale verisi: XML yüklendiyse parsedJats, değilse mock
  const article: Article | ParsedJats =
    loaderData.kind === "mock" ? loaderData.article : (parsedJats as ParsedJats);

  // Yükleme ekranı
  if (loaderData.kind === "xml" && jatsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader journal={journal} />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm">Loading article…</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  // Hata ekranı
  if (loaderData.kind === "xml" && jatsError) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader journal={journal} />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-12 text-center">
          <p className="font-semibold text-destructive">Failed to load article</p>
          <p className="text-sm text-muted-foreground">{jatsError}</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  // article henüz yüklenmediyse (beklenmedik durum)
  if (!article) return null;

  const headings =
    loaderData.kind === "mock"
      ? extractHeadings((article as Article).content)
      : extractHeadingsFromJats(parsedJats!.bodyElement);

  const isXml = loaderData.kind === "xml";
  const pdfUrl = isXml ? (parsedJats as ParsedJats).pdfUrl : undefined;

  if (USE_ARTICLE_READER_V2) {
    return (
      <ArticleReaderLayout
        journal={journal}
        article={article}
        headings={headings}
        isXml={isXml}
        parsedJats={parsedJats}
        xmlEntry={xmlEntry}
        pdfUrl={pdfUrl}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader journal={journal} />

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <Link
          to="/journal/$slug"
          params={{ slug: journal.slug }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {journal.name}
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Sekme barı */}
        <div className="overflow-x-auto border-b border-border">
          <TabsList className="h-auto justify-start gap-1 rounded-none bg-transparent p-0">
            <TabsTrigger value="full-text" className={tabTrigger}>
              Full article
            </TabsTrigger>
            <TabsTrigger value="figures" className={tabTrigger}>
              Table & figure
            </TabsTrigger>
            <TabsTrigger value="references" className={tabTrigger}>
              References
            </TabsTrigger>
            <TabsTrigger value="info" className={tabTrigger}>
              Article info
            </TabsTrigger>
            <TabsTrigger value="metrics" className={tabTrigger}>
              Metrics
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── Tam Metin ── */}
        <TabsContent value="full-text">
          <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12">
            <ArticleToc headings={headings} />

            <article>
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <span className="text-accent">{article.subject}</span>
                <span>·</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>

              <div className="article-prose">
                <h1>{article.title}</h1>
              </div>

              <ArticleAuthors authors={article.authors} />

              <div className="mt-5 flex flex-col gap-4 border-b border-border pb-5">
                <MetricsStrip metrics={article.metrics} />
                <ArticleActions
                  article={article}
                  pdfUrl={pdfUrl}
                  journalSlug={journalSlug}
                  articleId={articleId}
                />
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {article.doi && (
                    <div className="flex items-center gap-4">
                      <a
                        href={`https://doi.org/${article.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-sm text-accent hover:underline"
                      >
                        doi.org/{article.doi}{" "}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <div className="h-4 w-px bg-border"></div>
                      <a
                        href={`https://crossmark.crossref.org/dialog/?doi=${article.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center transition-opacity hover:opacity-80"
                        title="Check for updates"
                      >
                        <img 
                          src="/crossmark.svg" 
                          alt="Crossmark logo" 
                          className="h-[22px] w-auto" 
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Abstract */}
              <section className="mt-8">
                <h2 className="mb-3 font-serif-display text-xl font-bold">Abstract</h2>
                <p className="article-prose text-[1.0625rem] leading-relaxed">
                  {article.abstract}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.keywords.map((k) => (
                    <span key={k} className="rounded-full bg-secondary px-3 py-1 text-xs">
                      {k}
                    </span>
                  ))}
                </div>
              </section>

              {/* Makale gövdesi */}
              <div className="article-prose mt-10">
                {isXml && parsedJats ? (
                  <JatsBody bodyElement={parsedJats.bodyElement} basePath={xmlEntry?.xmlPath ? xmlEntry.xmlPath.substring(0, xmlEntry.xmlPath.lastIndexOf("/") + 1) : ""} />
                ) : (
                  <ArticleBody
                    content={(article as Article).content}
                    figures={(article as Article).figures}
                  />
                )}
              </div>

              {/* References at the bottom of Full Text */}
              {article.references.length > 0 && (
                <section className="mt-16 border-t border-border pt-8">
                  <h2 className="mb-6 font-serif-display text-2xl font-bold">References</h2>
                  <ol className="space-y-4 text-sm">
                    {article.references.map((r, i) => (
                      <li key={r.id} id={r.id} className="flex gap-4 scroll-mt-24">
                        <span className="font-mono text-xs text-muted-foreground pt-0.5">
                          [{i + 1}]
                        </span>
                        <span className="leading-relaxed">{r.text}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </article>
          </div>
        </TabsContent>

        {/* ── Şekiller ── */}
        <TabsContent value="figures">
          <div className="mx-auto max-w-3xl space-y-10 py-4">
            {isXml && parsedJats ? (
              Array.from(parsedJats.bodyElement.querySelectorAll("fig, table-wrap")).length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  Bu makalede şekil veya tablo bulunmamaktadır.
                </p>
              ) : (
                Array.from(parsedJats.bodyElement.querySelectorAll("fig, table-wrap")).map((el, i) => {
                  const basePath = xmlEntry?.xmlPath ? xmlEntry.xmlPath.substring(0, xmlEntry.xmlPath.lastIndexOf("/") + 1) : "";
                  return el.tagName.toLowerCase() === "fig" ? 
                    <RenderFig key={i} el={el} idSuffix="-tab" basePath={basePath} /> : 
                    <RenderTableWrap key={i} el={el} idSuffix="-tab" />;
                })
              )
            ) : (
              article.figures.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  Bu makalede şekil bulunmamaktadır.
                </p>
              ) : (
                article.figures.map((f) => (
                  <figure key={f.id} className="mb-10">
                    <MockFigure figure={f} />
                    <figcaption className="mt-2 text-sm">
                      <span className="font-semibold">{f.label}.</span>{" "}
                      <span className="text-muted-foreground">{f.caption}</span>
                    </figcaption>
                  </figure>
                ))
              )
            )}
          </div>
        </TabsContent>

        {/* ── Makale ve Yazar Bilgisi ── */}
        <TabsContent value="info">
          <div className="mx-auto max-w-3xl space-y-10 py-4">
            <section>
              <h2 className="mb-4 font-serif-display text-xl font-bold">
                Authors and Contributions
              </h2>
              <AuthorContributions authors={article.authors} />
            </section>

            {article.funding && (
              <section>
                <h2 className="mb-2 font-serif-display text-xl font-bold">Funding</h2>
                <p className="text-sm text-muted-foreground">{article.funding}</p>
              </section>
            )}

            {article.dataAvailability && (
              <section>
                <h2 className="mb-2 font-serif-display text-xl font-bold">
                  Data Availability
                </h2>
                <p className="text-sm text-muted-foreground">{article.dataAvailability}</p>
              </section>
            )}

            <section>
              <h2 className="mb-3 font-serif-display text-xl font-bold">Publication Info</h2>
              <dl className="space-y-3 text-sm">
                <InfoRow label="Received" value={article.info.received} />
                <InfoRow label="Accepted" value={article.info.accepted} />
                <InfoRow label="Published" value={article.info.published} />
                <InfoRow label="Handling Editor" value={article.info.editor} />
                <InfoRow label="License" value={article.info.license} />
                {article.doi && (
                  <InfoRow label="DOI" value={article.doi} mono />
                )}
              </dl>
            </section>
          </div>
        </TabsContent>

        {/* ── References ── */}
        <TabsContent value="references">
          <div className="mx-auto max-w-3xl space-y-10 py-4">
            {article.references.length > 0 ? (
              <section>
                <ol className="space-y-4 text-sm">
                  {article.references.map((r, i) => (
                    <li key={`ref-tab-${r.id}`} id={`ref-tab-${r.id}`} className="flex gap-4">
                      <span className="font-mono text-xs text-muted-foreground pt-0.5">
                        [{i + 1}]
                      </span>
                      <span className="leading-relaxed">{r.text}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                No references available.
              </p>
            )}
          </div>
        </TabsContent>

        {/* ── Metrikler ── */}
        <TabsContent value="metrics">
          <div className="mx-auto max-w-3xl py-6">
            <MetricsCards metrics={article.metrics} />
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Metrics are updated regularly.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <SiteFooter />
    </div>
  );
}

// ── Yardımcılar ───────────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2 last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-xs" : "text-right font-medium"}>{value}</dd>
    </div>
  );
}

// JATS <body> elementinden TOC için Heading[] çıkartır (sadece üst seviye sec)
function extractHeadingsFromJats(bodyEl: Element): Heading[] {
  return Array.from(bodyEl.children)
    .filter((c) => c.tagName.toLowerCase() === "sec")
    .flatMap((sec) => {
      const titleEl = Array.from(sec.children).find(
        (c) => c.tagName.toLowerCase() === "title"
      );
      if (!titleEl) return [];
      const text = titleEl.textContent?.trim() ?? "";
      const id = sec.getAttribute("id") ?? slugify(text);
      return [{ id, text }];
    });
}
