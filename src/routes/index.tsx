import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { articles } from "@/lib/mock-articles";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Akademik Dergi — Açık Erişimli Türkçe Akademik Yayın Platformu" },
      { name: "description", content: "Hakemli, açık erişimli Türkçe akademik makaleler. Tüm bilim dallarından son araştırmaları keşfedin." },
      { property: "og:title", content: "Akademik Dergi" },
      { property: "og:description", content: "Hakemli, açık erişimli Türkçe akademik yayın platformu." },
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
            Bilim, herkesin erişimine açık olmalı.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Akademik Dergi; tüm disiplinlerden Türkçe araştırmaları, ücretsiz ve etkileşimli bir okuma deneyimiyle bilim topluluğuna sunar.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="font-serif-display text-xl font-bold">Son Makaleler</h2>
          <div className="relative w-full max-w-xs">
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
