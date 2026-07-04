import { createFileRoute, Link } from "@tanstack/react-router";
import { journals } from "@/lib/journals";
import { getArticlesByJournal } from "@/lib/mock-articles";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/journals")({
  head: () => ({
    meta: [
      { title: "Journals — CF Open" },
      { name: "description", content: "All open access academic journals published on the platform." },
    ],
  }),
  component: JournalsPage,
});

function JournalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight">Journals</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            The peer-reviewed, open access journals published on CF Open.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {journals.map((j) => {
            const count = getArticlesByJournal(j.slug).length;
            return (
              <Link
                key={j.slug}
                to="/journal/$slug"
                params={{ slug: j.slug }}
                className="group flex flex-col rounded-lg border border-border p-6 transition-colors hover:border-accent"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-serif-display text-xl font-bold leading-snug transition-colors group-hover:text-accent">
                    {j.name}
                  </h2>
                  <span className="shrink-0 text-xs uppercase tracking-widest text-muted-foreground">
                    {j.shortName}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{j.scope}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {j.subjects.map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  {count} {count === 1 ? "article" : "articles"} · e-ISSN {j.eissn}
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
