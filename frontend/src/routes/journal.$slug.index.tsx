import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getJournal, navItemSlug, type Journal } from "@/lib/journals";
import { getArticlesByJournal, type Article } from "@/lib/mock-articles";
import { getXmlArticlesByJournal } from "@/lib/article-manifest";
import { xmlEntryToArticle } from "@/lib/article-utils";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { OJS_SUBMIT_URL } from "@/lib/ojs";
import { ArticleCard } from "@/components/article-card";

export const Route = createFileRoute("/journal/$slug/")({
  loader: ({ params }): { journal: Journal; articles: Article[] } => {
    const journal = getJournal(params.slug);
    if (!journal) throw notFound();
    const mockArticles = getArticlesByJournal(params.slug);
    const xmlArticles = getXmlArticlesByJournal(params.slug).map(xmlEntryToArticle);
    // XML makaleler önce (yeni), mock makaleler sonra; tarih sırasına göre sırala
    const all = [...xmlArticles, ...mockArticles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return { journal, articles: all };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.journal.name}` },
          { name: "description", content: loaderData.journal.scope.slice(0, 160) },
        ]
      : [{ title: "Journal" }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Journal not found.</p>
        <Link to="/journals" className="mt-4 inline-block text-accent hover:underline">
          ← All journals
        </Link>
      </div>
    </div>
  ),
  component: JournalHome,
});

// Sağ kenar çubuğu: öne çıkanlar (metriğe göre otomatik) + sayılar bölümü.
function JournalSidebar({ slug, articles }: { slug: string; articles: Article[] }) {
  // Öne çıkanlar: dergi makaleleri görüntülenme metriğine göre otomatik sıralanır.
  const highlights = [...articles]
    .sort((a, b) => b.metrics.views - a.metrics.views)
    .slice(0, 5);

  return (
    <div className="space-y-10 lg:sticky lg:top-8">
      {highlights.length > 0 && (
        <div>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Highlights
          </h2>
          <ul className="space-y-5">
            {highlights.map((a) => (
              <li key={a.id} className="border-b border-border pb-5 last:border-b-0 last:pb-0">
                {a.subject && (
                  <div className="mb-1.5 text-xs font-semibold text-accent">{a.subject}</div>
                )}
                <Link
                  to="/journal/$slug/article/$id"
                  params={{ slug, id: a.id }}
                  className="font-serif-display text-base font-bold leading-snug transition-colors hover:text-accent"
                >
                  {a.title}
                </Link>
                <div className="mt-1.5 text-xs text-muted-foreground">
                  {a.authors.map((au) => au.name).join(", ")}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          All issues
        </h2>
        <Link
          to="/journal/$slug/$section"
          params={{ slug, section: "articles" }}
          hash={navItemSlug("All issues")}
          className="text-sm font-medium text-accent hover:underline"
        >
          Browse all issues →
        </Link>
      </div>
    </div>
  );
}

function JournalHome() {
  const { journal, articles } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader journal={journal} />

      <header className="border-b border-border bg-secondary/30">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Open Access
            </div>
            <h1 className="mt-3 font-serif-display text-3xl font-bold tracking-tight sm:text-4xl">
              {journal.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{journal.scope}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {journal.subjects.map((s) => (
                <span key={s} className="rounded-full bg-background px-2.5 py-0.5 text-xs">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-5 text-xs text-muted-foreground">
              ISSN {journal.issn} · e-ISSN {journal.eissn}
            </div>
          </div>

          <div className="shrink-0 sm:pt-8">
            <a
              href={OJS_SUBMIT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Submit article
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1fr_18rem]">
        {/* Sol: son makaleler */}
        <div>
          <div className="mb-8">
            <h2 className="font-serif-display text-xl font-bold">Latest Articles</h2>
          </div>

          {articles.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No articles have been published in this journal yet.
            </p>
          ) : (
            <div>
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>

        {/* Sağ: öne çıkanlar + sayılar */}
        <aside className="lg:border-l lg:border-border lg:pl-8">
          <JournalSidebar slug={journal.slug} articles={articles} />
        </aside>
      </main>

      <SiteFooter />
    </div>
  );
}
