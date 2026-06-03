import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getArticle, type Article } from "@/lib/mock-articles";
import { getJournal, type Journal } from "@/lib/journals";
import { extractHeadings, formatDate } from "@/lib/article-utils";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ArticleBody } from "@/components/article-body";
import { MockFigure } from "@/components/mock-figure";
import { ArticleToc } from "@/components/article/article-toc";
import { ArticleAuthors, AuthorContributions } from "@/components/article/article-authors";
import { ArticleActions } from "@/components/article/article-actions";
import { MetricsStrip, MetricsCards } from "@/components/article/article-metrics";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/journal/$slug/article/$id")({
  loader: ({ params }): { journal: Journal; article: Article } => {
    const journal = getJournal(params.slug);
    const article = getArticle(params.id);
    if (!journal || !article || article.journalSlug !== params.slug) throw notFound();
    return { journal, article };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.article.title} — ${loaderData.journal.name}` },
          { name: "description", content: loaderData.article.abstract.slice(0, 160) },
          { property: "og:title", content: loaderData.article.title },
          { property: "og:description", content: loaderData.article.abstract.slice(0, 160) },
        ]
      : [{ title: "Makale" }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Makale bulunamadı.</p>
        <Link to="/journals" className="mt-4 inline-block text-accent hover:underline">
          ← Dergiler
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-12 text-center">
      <p>Bir hata oluştu: {error.message}</p>
    </div>
  ),
  component: ArticlePage,
});

const tabTrigger =
  "rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none";

function ArticlePage() {
  const { journal, article } = Route.useLoaderData();
  const headings = extractHeadings(article.content);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader journal={journal} />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <Link
          to="/journal/$slug/$section"
          params={{ slug: journal.slug, section: "articles" }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {journal.name}
        </Link>
      </div>

      <Tabs defaultValue="full-text" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Üst sekme barı (eLife tarzı alt-çizgili) */}
        <div className="overflow-x-auto border-b border-border">
          <TabsList className="h-auto justify-start gap-1 rounded-none bg-transparent p-0">
            <TabsTrigger value="full-text" className={tabTrigger}>
              Tam Metin
            </TabsTrigger>
            <TabsTrigger value="figures" className={tabTrigger}>
              Şekiller ve Veriler
            </TabsTrigger>
            <TabsTrigger value="info" className={tabTrigger}>
              Makale ve Yazar Bilgisi
            </TabsTrigger>
            <TabsTrigger value="metrics" className={tabTrigger}>
              Metrikler
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ----------------------------- Tam Metin ---------------------------- */}
        <TabsContent value="full-text">
          <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12">
            <ArticleToc headings={headings} />

            <article>
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <span className="text-accent">{article.subject}</span>
                <span>·</span>
                <span>Araştırma Makalesi</span>
                <span>·</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>

              <div className="article-prose">
                <h1>{article.title}</h1>
              </div>

              <ArticleAuthors authors={article.authors} />

              <div className="mt-5 flex flex-col gap-4 border-b border-border pb-5">
                <MetricsStrip metrics={article.metrics} />
                <ArticleActions article={article} />
                <a
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-sm text-accent hover:underline"
                >
                  doi.org/{article.doi} <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <section className="mt-8">
                <h2 className="mb-3 font-serif-display text-xl font-bold">Özet</h2>
                <p className="article-prose text-[1.0625rem] leading-relaxed">{article.abstract}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.keywords.map((k) => (
                    <span key={k} className="rounded-full bg-secondary px-3 py-1 text-xs">
                      {k}
                    </span>
                  ))}
                </div>
              </section>

              <div className="article-prose mt-10">
                <ArticleBody content={article.content} figures={article.figures} />
              </div>
            </article>
          </div>
        </TabsContent>

        {/* -------------------------- Şekiller ve Veriler --------------------- */}
        <TabsContent value="figures">
          <div className="mx-auto max-w-3xl space-y-10 py-4">
            {article.figures.map((f) => (
              <figure key={f.id}>
                <MockFigure figure={f} />
                <figcaption className="mt-2 text-sm">
                  <span className="font-semibold">{f.label}.</span>{" "}
                  <span className="text-muted-foreground">{f.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </TabsContent>

        {/* ----------------------- Makale ve Yazar Bilgisi -------------------- */}
        <TabsContent value="info">
          <div className="mx-auto max-w-3xl space-y-10 py-4">
            <section>
              <h2 className="mb-4 font-serif-display text-xl font-bold">Yazarlar ve Katkılar</h2>
              <AuthorContributions authors={article.authors} />
            </section>

            {article.funding && (
              <section>
                <h2 className="mb-2 font-serif-display text-xl font-bold">Finansman</h2>
                <p className="text-sm text-muted-foreground">{article.funding}</p>
              </section>
            )}

            {article.dataAvailability && (
              <section>
                <h2 className="mb-2 font-serif-display text-xl font-bold">Veri Erişilebilirliği</h2>
                <p className="text-sm text-muted-foreground">{article.dataAvailability}</p>
              </section>
            )}

            <section>
              <h2 className="mb-3 font-serif-display text-xl font-bold">Yayın Bilgisi</h2>
              <dl className="space-y-3 text-sm">
                <InfoRow label="Geliş Tarihi" value={article.info.received} />
                <InfoRow label="Kabul Tarihi" value={article.info.accepted} />
                <InfoRow label="Yayın Tarihi" value={article.info.published} />
                <InfoRow label="Sorumlu Editör" value={article.info.editor} />
                <InfoRow label="Lisans" value={article.info.license} />
                <InfoRow label="DOI" value={article.doi} mono />
              </dl>
            </section>

            <section>
              <h2 className="mb-3 font-serif-display text-xl font-bold">Kaynakça</h2>
              <ol className="space-y-3 text-sm">
                {article.references.map((r, i) => (
                  <li key={r.id} className="flex gap-3">
                    <span className="font-mono text-xs text-muted-foreground">[{i + 1}]</span>
                    <span>{r.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </TabsContent>

        {/* ------------------------------ Metrikler --------------------------- */}
        <TabsContent value="metrics">
          <div className="mx-auto max-w-3xl py-6">
            <MetricsCards metrics={article.metrics} />
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Metrikler düzenli olarak güncellenir.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <SiteFooter />
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2 last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-xs" : "text-right font-medium"}>{value}</dd>
    </div>
  );
}
