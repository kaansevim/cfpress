import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getJournal, navItemSlug, type Journal } from "@/lib/journals";
import { getArticlesByJournal, type Article } from "@/lib/mock-articles";
import { getXmlArticlesByJournal } from "@/lib/article-manifest";
import { xmlEntryToArticle } from "@/lib/article-utils";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { OJS_SUBMIT_URL } from "@/lib/ojs";
import { ArticleCard } from "@/components/article-card";
import { Pointer } from "lucide-react";

// Yeni canlı görünüm ayrı tutulur. `false` yapıldığında önceki klasik alan geri gelir.
const USE_VIBRANT_JOURNAL_HERO = true;

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

function ClassicJournalHero({ journal }: { journal: Journal }) {
  return (
    <header className="border-b border-border bg-accent/5">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-[10rem_1fr] sm:items-start lg:grid-cols-[12rem_1fr_auto] lg:gap-10 lg:py-16">
        <img
          src={journal.coverImage}
          alt={`${journal.name} cover`}
          width="1130"
          height="1600"
          className="aspect-[1130/1600] w-36 rounded-sm object-cover shadow-lg sm:w-full"
        />
        <div className="min-w-0 sm:pt-2">
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
            e-ISSN {journal.eissn}
          </div>
        </div>

        <div className="shrink-0 sm:col-start-2 lg:col-start-auto lg:pt-8">
          <a
            href={OJS_SUBMIT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Submit your article
            <Pointer className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </header>
  );
}

function VibrantJournalHero({ journal }: { journal: Journal }) {
  return (
    <header
      className="relative isolate overflow-hidden text-white"
      style={{
        background: `linear-gradient(125deg, ${journal.theme.heroFrom} 0%, ${journal.theme.heroTo} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -right-24 -top-40 h-[30rem] w-[30rem] rounded-full border border-white/20"
      />
      <div
        aria-hidden
        className="absolute -right-4 -top-20 h-72 w-72 rounded-full border border-white/15"
      />
      <div
        aria-hidden
        className="absolute bottom-10 right-[18%] h-20 w-20 rounded-full bg-white/10"
      />
      <div
        aria-hidden
        className="absolute -bottom-28 left-[32%] h-64 w-64 rounded-full border border-white/10"
      />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-[10rem_1fr] sm:items-center lg:grid-cols-[12rem_1fr_auto] lg:gap-10 lg:py-16">
        <img
          src={journal.coverImage}
          alt={`${journal.name} cover`}
          width="1130"
          height="1600"
          className="aspect-[1130/1600] w-36 rounded-sm object-cover shadow-2xl ring-1 ring-white/40 sm:w-full"
        />

        <div className="min-w-0">
          <div className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            Open Access
          </div>
          <h1 className="mt-4 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
            {journal.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {journal.scope}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {journal.subjects.map((s) => (
              <span
                key={s}
                className="rounded-full bg-white/95 px-3 py-1 text-xs font-medium shadow-sm"
                style={{ color: journal.theme.heroFrom }}
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-5 text-xs font-medium tracking-wide text-white/70">
            e-ISSN {journal.eissn}
          </div>
        </div>

        <div className="shrink-0 sm:col-start-2 lg:col-start-auto">
          <a
            href={OJS_SUBMIT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white bg-[#ffffff] px-6 text-sm font-semibold shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-[#ffffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ color: journal.theme.heroFrom }}
          >
            Submit your article
            <Pointer className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>

      <div className="h-2 bg-white/15" style={{ borderTop: `1px solid ${journal.theme.accent}` }} />
    </header>
  );
}

function JournalHome() {
  const { journal, articles } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader journal={journal} />

      {USE_VIBRANT_JOURNAL_HERO ? (
        <VibrantJournalHero journal={journal} />
      ) : (
        <ClassicJournalHero journal={journal} />
      )}

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
