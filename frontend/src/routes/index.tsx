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
function LegacyHeroGraphic() {
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

const USE_RADAR_HERO = true;

/**
 * CF Open'ın iç içe halka formundan esinlenen alternatif araştırma radarı.
 * Eski grafik yukarıda korunur; USE_RADAR_HERO ile tek adımda geri dönülebilir.
 */
function RadarHeroGraphic() {
  const centerX = 210;
  const centerY = 174;
  const radius = 118;
  const angles = Array.from({ length: 6 }, (_, index) => (Math.PI * 2 * index) / 6 - Math.PI / 2);
  const point = (angle: number, value: number) =>
    `${centerX + Math.cos(angle) * radius * value},${centerY + Math.sin(angle) * radius * value}`;
  const primarySignal = [0.9, 0.67, 0.94, 0.72, 0.58, 0.82];
  const secondarySignal = [0.56, 0.84, 0.64, 0.88, 0.75, 0.61];

  return (
    <svg
      viewBox="0 0 420 360"
      width="420"
      height="360"
      role="img"
      aria-label="Modern radar analysis illustration representing open research"
      className="home-hero-visual hidden select-none lg:block"
    >
      <defs>
        <linearGradient id="radar-signal" x1="118" y1="65" x2="316" y2="286" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0068b7" stopOpacity="0.96" />
          <stop offset="0.58" stopColor="#0b85c8" stopOpacity="0.78" />
          <stop offset="1" stopColor="#55bde5" stopOpacity="0.48" />
        </linearGradient>
        <linearGradient id="radar-orbit" x1="52" y1="42" x2="362" y2="308" gradientUnits="userSpaceOnUse">
          <stop stopColor="#79c9ec" />
          <stop offset="0.55" stopColor="#0878bc" />
          <stop offset="1" stopColor="#124d7b" />
        </linearGradient>
        <filter id="radar-soft-shadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#0b5d91" floodOpacity="0.16" />
        </filter>
      </defs>

      <g fill="none" stroke="url(#radar-orbit)" strokeLinecap="round">
        <circle
          cx={centerX}
          cy={centerY}
          r="154"
          strokeWidth="1.5"
          strokeOpacity="0.14"
          strokeDasharray="720 250"
          transform={`rotate(-38 ${centerX} ${centerY})`}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r="143"
          strokeWidth="7"
          strokeOpacity="0.1"
          strokeDasharray="260 640"
          transform={`rotate(24 ${centerX} ${centerY})`}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r="132"
          strokeWidth="2"
          strokeOpacity="0.22"
          strokeDasharray="510 320"
          transform={`rotate(-82 ${centerX} ${centerY})`}
        />
      </g>

      <g fill="none" stroke="#164f78">
        {[0.25, 0.5, 0.75, 1].map((level) => (
          <polygon
            key={level}
            points={angles.map((angle) => point(angle, level)).join(" ")}
            strokeOpacity={level === 1 ? 0.28 : 0.14}
            strokeWidth={level === 1 ? 1.4 : 1}
          />
        ))}
        {angles.map((angle, index) => (
          <line
            key={index}
            x1={centerX}
            y1={centerY}
            x2={centerX + Math.cos(angle) * radius}
            y2={centerY + Math.sin(angle) * radius}
            strokeOpacity="0.12"
          />
        ))}
      </g>

      <polygon
        points={angles.map((angle, index) => point(angle, primarySignal[index])).join(" ")}
        fill="url(#radar-signal)"
        stroke="#075f99"
        strokeWidth="2.5"
        strokeLinejoin="round"
        filter="url(#radar-soft-shadow)"
      />

      <polygon
        points={angles.map((angle, index) => point(angle, secondarySignal[index])).join(" ")}
        fill="none"
        stroke="#ee9d2d"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />

      {angles.map((angle, index) => {
        const [primaryX, primaryY] = point(angle, primarySignal[index]).split(",").map(Number);
        const [secondaryX, secondaryY] = point(angle, secondarySignal[index]).split(",").map(Number);
        return (
          <g key={index}>
            <circle cx={primaryX} cy={primaryY} r="6" fill="#eef8fc" stroke="#086aa7" strokeWidth="2.4" />
            <circle cx={secondaryX} cy={secondaryY} r="4.2" fill="#ee9d2d" />
          </g>
        );
      })}

      <g fill="none" stroke="#eaf7fc" strokeLinecap="round">
        <circle cx={centerX} cy={centerY} r="31" fill="#0b4e7d" stroke="#0b4e7d" />
        <circle cx={centerX} cy={centerY} r="22" strokeWidth="2" strokeOpacity="0.62" strokeDasharray="105 34" />
        <circle cx={centerX} cy={centerY} r="14" strokeWidth="2" strokeOpacity="0.82" strokeDasharray="64 24" />
        <circle cx={centerX} cy={centerY} r="5" fill="#ee9d2d" stroke="none" />
      </g>

      <g fill="#0b70b9">
        <circle cx="52" cy="104" r="4" opacity="0.22" />
        <circle cx="74" cy="282" r="7" opacity="0.13" />
        <circle cx="354" cy="72" r="6" opacity="0.16" />
        <circle cx="375" cy="246" r="4" opacity="0.28" />
      </g>

      <g stroke="#0b70b9" strokeWidth="1.5" strokeOpacity="0.3">
        <path d="M52 104h34" />
        <path d="M334 72h20" />
        <path d="M343 246h32" />
      </g>
    </svg>
  );
}

/**
 * Küçük ekranlarda ana görselin daha sessiz bir karşılığı.
 * Metinle yarışmaması için sinyal sayısı azaltılmış ve filigran gibi kullanılmıştır.
 */
function MobileRadarWatermark() {
  return (
    <svg
      viewBox="0 0 240 240"
      aria-hidden="true"
      className="home-hero-watermark pointer-events-none absolute -right-20 top-20 h-56 w-56 select-none sm:-right-16 lg:hidden"
    >
      <g fill="none" stroke="#0b70b9">
        <circle cx="120" cy="120" r="102" strokeWidth="1.5" strokeOpacity="0.22" strokeDasharray="360 280" />
        <circle cx="120" cy="120" r="91" strokeWidth="5" strokeOpacity="0.13" strokeDasharray="150 430" />
        <polygon points="120,32 196,76 196,164 120,208 44,164 44,76" strokeOpacity="0.24" />
        <polygon points="120,62 170,91 170,149 120,178 70,149 70,91" strokeOpacity="0.16" />
        <path d="M120 32v176M44 76l152 88M196 76L44 164" strokeOpacity="0.11" />
      </g>

      <polygon
        points="120,48 178,87 184,157 120,186 61,154 73,93"
        fill="#0878bc"
        fillOpacity="0.22"
        stroke="#0878bc"
        strokeWidth="2"
        strokeOpacity="0.38"
      />

      <g fill="none" stroke="#0b4e7d" strokeLinecap="round">
        <circle cx="120" cy="120" r="25" fill="#0b70b9" fillOpacity="0.2" strokeOpacity="0.22" />
        <circle cx="120" cy="120" r="17" strokeWidth="2" strokeOpacity="0.38" strokeDasharray="78 29" />
        <circle cx="120" cy="120" r="10" strokeWidth="2" strokeOpacity="0.52" strokeDasharray="42 21" />
      </g>
      <circle cx="120" cy="120" r="4" fill="#ee9d2d" fillOpacity="0.72" />
    </svg>
  );
}

function HomeHeroGraphic() {
  return USE_RADAR_HERO ? <RadarHeroGraphic /> : <LegacyHeroGraphic />;
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

        <section className="relative overflow-hidden">
          <MobileRadarWatermark />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-12 sm:pb-24 sm:pt-16 lg:grid-cols-[1fr_auto]">
            <div className="home-hero-copy relative z-10">
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

            <HomeHeroGraphic />
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
                className="group grid grid-cols-[4.5rem_1fr] gap-4 overflow-hidden rounded-lg border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-sm"
              >
                <img
                  src={j.coverImage}
                  alt={`${j.name} cover`}
                  width="1130"
                  height="1600"
                  loading="lazy"
                  className="aspect-[1130/1600] w-full rounded-sm object-cover shadow-sm"
                />
                <div className="min-w-0 py-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif-display text-lg font-bold leading-snug transition-colors group-hover:text-accent">
                      {j.name}
                    </h3>
                    <span className="shrink-0 pt-1 text-xs uppercase tracking-widest text-muted-foreground">
                      {j.shortName}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{j.scope}</p>
                </div>
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
