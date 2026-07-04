import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { articles, type Article } from "@/lib/mock-articles";
import { journals, getJournal } from "@/lib/journals";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CF Open — Open Access Academic Journals" },
      { name: "description", content: "A publishing platform hosting peer-reviewed, open access academic journals." },
      { property: "og:title", content: "CF Open" },
      { property: "og:description", content: "Peer-reviewed, open access academic journals under one roof." },
    ],
  }),
  component: HomePage,
});

/**
 * Soyut "akademik büyüme" grafiği: yükselen sütunlar (araştırma çıktısı),
 * düğüm noktaları ve bunları bağlayan bir eğilim çizgisi (bilgi ağı).
 */
function HeroGraphic() {
  return (
    <svg
      viewBox="0 0 380 320"
      width="380"
      height="320"
      role="img"
      aria-label="Abstract illustration of growing research output"
      className="hidden select-none lg:block"
    >
      {/* Yükselen sütunlar */}
      <rect x="36" y="196" width="44" height="104" rx="22" fill="#0b70b9" opacity="0.18" />
      <rect x="118" y="148" width="44" height="152" rx="22" fill="#0b70b9" opacity="0.38" />
      <rect x="200" y="96" width="44" height="204" rx="22" fill="#0b70b9" opacity="0.62" />
      <rect x="282" y="40" width="44" height="260" rx="22" fill="#0b70b9" />

      {/* Eğilim çizgisi */}
      <path
        d="M58 176 L140 128 L222 76 L304 20"
        fill="none"
        stroke="#e8a33d"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Düğümler */}
      <circle cx="58" cy="176" r="9" fill="#e8a33d" />
      <circle cx="140" cy="128" r="9" fill="#e8a33d" />
      <circle cx="222" cy="76" r="9" fill="#e8a33d" />
      <circle cx="304" cy="20" r="9" fill="#e8a33d" />

      {/* Serbest noktalar */}
      <circle cx="20" cy="120" r="6" fill="#0b70b9" opacity="0.3" />
      <circle cx="96" cy="60" r="5" fill="#0b70b9" opacity="0.22" />
      <circle cx="352" cy="130" r="6" fill="#0b70b9" opacity="0.3" />
      <circle cx="330" cy="250" r="5" fill="#0b70b9" opacity="0.2" />
    </svg>
  );
}

/**
 * Öne çıkanlar kenar çubuğu (eLife "Highlights" mantığı).
 * Makaleler görüntülenme metriğine göre sıralanır — kurgu tamamen metrik
 * odaklı olduğundan yeni içerik/metrik geldikçe liste otomatik güncellenir.
 */
function Highlights({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  return (
    <div className="lg:sticky lg:top-8">
      <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        Highlights
      </h2>
      <ul className="space-y-5">
        {articles.map((a) => {
          const journal = getJournal(a.journalSlug);
          return (
            <li key={a.id} className="border-b border-border pb-5 last:border-b-0 last:pb-0">
              {(a.subject || journal) && (
                <div className="mb-1.5 text-xs font-semibold text-accent">
                  {a.subject ?? journal?.name}
                </div>
              )}
              <Link
                to="/journal/$slug/article/$id"
                params={{ slug: a.journalSlug, id: a.id }}
                className="font-serif-display text-base font-bold leading-snug transition-colors hover:text-accent"
              >
                {a.title}
              </Link>
              <div className="mt-1.5 text-xs text-muted-foreground">
                {a.authors.map((au) => au.name).join(", ")}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function HomePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.abstract.toLowerCase().includes(q) ||
        a.authors.some((au) => au.name.toLowerCase().includes(q)) ||
        a.keywords.some((k) => k.toLowerCase().includes(q)),
    );
  }, [query]);

  // Öne çıkanlar: makale metriklerine (görüntülenme) göre otomatik sıralanır.
  // Yeni makale eklendikçe / metrikler değiştikçe liste kendiliğinden güncellenir.
  const mostRead = useMemo(
    () => [...articles].sort((a, b) => b.metrics.views - a.metrics.views).slice(0, 5),
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent/5">
        <SiteHeader flush />

        <section>
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-12 sm:pb-24 sm:pt-16 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Open Access
              </div>
              <h1 className="font-serif-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                Research for a changing world.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                CF Open is home to four peer-reviewed, open access journals spanning the social
                sciences — from social policy and cognitive science to economics and community
                research. Every article is freely available to read, download, and cite.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/journals"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Browse the journals
                </Link>
                <Link
                  to="/about"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Learn more about CF Open
                </Link>
              </div>
            </div>

            <HeroGraphic />
          </div>
        </section>
      </div>

      {/* Dergiler */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-bold">Journals</h2>
            <Link to="/journals" className="text-sm font-medium text-accent hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {journals.map((j) => (
              <Link
                key={j.slug}
                to="/journal/$slug"
                params={{ slug: j.slug }}
                className="group rounded-lg border border-border p-5 transition-colors hover:border-accent"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif-display text-lg font-bold leading-snug transition-colors group-hover:text-accent">
                    {j.name}
                  </h3>
                  <span className="shrink-0 text-xs uppercase tracking-widest text-muted-foreground">
                    {j.shortName}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{j.scope}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Son makaleler + öne çıkanlar */}
      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1fr_18rem]">
        {/* Sol: son makaleler + arama */}
        <div>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-serif-display text-xl font-bold">Latest Articles</h2>
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, authors, keywords..."
                className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No articles match your search.
            </p>
          ) : (
            <div>
              {filtered.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>

        {/* Sağ: öne çıkanlar (en çok okunanlar) */}
        <aside className="lg:border-l lg:border-border lg:pl-8">
          <Highlights articles={mostRead} />
        </aside>
      </main>

      <SiteFooter />
    </div>
  );
}
