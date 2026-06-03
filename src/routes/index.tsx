import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { articles } from "@/lib/mock-articles";
import { journals } from "@/lib/journals";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Akademik Yayın Platformu — Açık Erişimli Türkçe Dergiler" },
      { name: "description", content: "Birden çok hakemli, açık erişimli akademik derginin yönetildiği Türkçe yayın platformu." },
      { property: "og:title", content: "Akademik Yayın Platformu" },
      { property: "og:description", content: "Hakemli, açık erişimli Türkçe akademik dergiler tek çatı altında." },
    ],
  }),
  component: HomePage,
});

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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Açık Erişim · Hakemli · Türkçe
          </div>
          <h1 className="font-serif-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Bilgi, paylaşıldıkça değer kazanır.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Birden çok hakemli, açık erişimli akademik derginin yönetildiği bir yayın platformu — tüm dergilere ve son araştırmalara tek çatı altından ulaşın.
          </p>
        </div>
      </section>

      {/* Dergiler */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-bold">Dergiler</h2>
            <Link to="/journals" className="text-sm font-medium text-accent hover:underline">
              Tümünü gör →
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

      {/* Son makaleler */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif-display text-xl font-bold">Son Makaleler</h2>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Makale, yazar, anahtar kelime..."
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Aramanızla eşleşen makale bulunamadı.
          </p>
        ) : (
          <div>
            {filtered.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
