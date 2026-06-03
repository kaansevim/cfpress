import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getJournal, type Journal } from "@/lib/journals";
import { getArticlesByJournal, type Article } from "@/lib/mock-articles";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ArticleCard } from "@/components/article-card";

export const Route = createFileRoute("/journal/$slug/")({
  loader: ({ params }): { journal: Journal; articles: Article[] } => {
    const journal = getJournal(params.slug);
    if (!journal) throw notFound();
    return { journal, articles: getArticlesByJournal(params.slug) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.journal.name}` },
          { name: "description", content: loaderData.journal.scope.slice(0, 160) },
        ]
      : [{ title: "Dergi" }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Dergi bulunamadı.</p>
        <Link to="/journals" className="mt-4 inline-block text-accent hover:underline">
          ← Tüm dergiler
        </Link>
      </div>
    </div>
  ),
  component: JournalHome,
});

function JournalHome() {
  const { journal, articles } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader journal={journal} />

      <header className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Açık Erişim · Hakemli Dergi
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
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif-display text-xl font-bold">Son Makaleler</h2>
          <Link
            to="/journal/$slug/$section"
            params={{ slug: journal.slug, section: "articles" }}
            className="text-sm font-medium text-accent hover:underline"
          >
            Tüm makaleler →
          </Link>
        </div>

        {articles.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Bu dergide henüz makale yayımlanmadı.
          </p>
        ) : (
          <div>
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
