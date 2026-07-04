import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getJournal, journalNav, navItemSlug, type Journal } from "@/lib/journals";
import { getArticlesByJournal, type Article } from "@/lib/mock-articles";
import { getXmlArticlesByJournal } from "@/lib/article-manifest";
import { xmlEntryToArticle } from "@/lib/article-utils";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ArticleCard } from "@/components/article-card";

const VALID = new Set(["about", "articles", "for-authors"]);

export const Route = createFileRoute("/journal/$slug/$section")({
  loader: ({ params }): { journal: Journal; articles: Article[]; section: string } => {
    const journal = getJournal(params.slug);
    if (!journal || !VALID.has(params.section)) throw notFound();
    const mockArticles = getArticlesByJournal(params.slug);
    const xmlArticles = getXmlArticlesByJournal(params.slug).map(xmlEntryToArticle);
    const all = [...xmlArticles, ...mockArticles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return { journal, articles: all, section: params.section };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Journal" }] };
    const group = journalNav.find((g) => g.section === loaderData.section);
    return { meta: [{ title: `${group?.label ?? ""} — ${loaderData.journal.name}` }] };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Page not found.</p>
        <Link to="/journals" className="mt-4 inline-block text-accent hover:underline">
          ← All journals
        </Link>
      </div>
    </div>
  ),
  component: SectionPage,
});

function SectionPage() {
  const { journal, articles, section } = Route.useLoaderData();
  const group = journalNav.find((g) => g.section === section)!;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader journal={journal} />

      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <Link
            to="/journal/$slug"
            params={{ slug: journal.slug }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {journal.name}
          </Link>
          <h1 className="mt-2 font-serif-display text-3xl font-bold tracking-tight">
            {group.label}
          </h1>
        </div>
      </header>

      {section === "articles" ? (
        <main className="mx-auto max-w-3xl px-6 py-12">
          {articles.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No articles have been published in this journal yet.
            </p>
          ) : (
            articles.map((a) => <ArticleCard key={a.id} article={a} />)
          )}
        </main>
      ) : (
        <main className="mx-auto max-w-3xl px-6 py-12">
          {/* ÇEKİRDEK TUR: alt başlıklar liste olarak; gerçek içerik 2. turda eklenecek. */}
          <p className="mb-8 text-muted-foreground">
            The subsections of this page are listed below. Content is being prepared.
          </p>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {group.items.map((item) => (
              <li key={item} id={navItemSlug(item)} className="scroll-mt-24">
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="font-medium">{item}</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Coming soon
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </main>
      )}

      <SiteFooter />
    </div>
  );
}
