import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getArticle, type Article } from "@/lib/mock-articles";
import { SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/article/$id")({
  loader: ({ params }): { article: Article } => {
    const article = getArticle(params.id);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.article.title} — Akademik Dergi` },
          { name: "description", content: loaderData.article.abstract.slice(0, 160) },
          { property: "og:title", content: loaderData.article.title },
          { property: "og:description", content: loaderData.article.abstract.slice(0, 160) },
        ]
      : [{ title: "Makale — Akademik Dergi" }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Makale bulunamadı.</p>
        <Link to="/" className="mt-4 inline-block text-accent hover:underline">
          ← Ana sayfa
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

type Tab = "figures" | "references" | "info";

function renderMarkdown(md: string) {
  const blocks = md.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return <h2 key={i}>{block.replace(/^## /, "")}</h2>;
    }
    if (block.startsWith("### ")) {
      return <h3 key={i}>{block.replace(/^### /, "")}</h3>;
    }
    if (block.startsWith("> ")) {
      return <blockquote key={i}>{block.replace(/^> /, "")}</blockquote>;
    }
    // inline bold
    const parts = block.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i}>
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j}>{p.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{p}</span>
          ),
        )}
      </p>
    );
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ArticlePage() {
  const { article } = Route.useLoaderData() as { article: Article };
  const [tab, setTab] = useState<Tab>("figures");

  const tabs: { id: Tab; label: string }[] = [
    { id: "figures", label: "Şekiller & Tablolar" },
    { id: "references", label: "Kaynakça" },
    { id: "info", label: "Makale Bilgisi" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-6 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Tüm makaleler
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:grid lg:grid-cols-5 lg:gap-12">
        {/* Left: article content (60% ~= 3/5) */}
        <article className="lg:col-span-3">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <span>Araştırma Makalesi</span>
            <span>·</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <div className="article-prose">
            <h1>{article.title}</h1>
          </div>

          <div className="mt-6 space-y-2 border-y border-border py-5">
            {article.authors.map((a) => (
              <div key={a.orcid} className="flex flex-wrap items-baseline gap-x-3 text-sm">
                <span className="font-semibold">{a.name}</span>
                <span className="text-muted-foreground">{a.affiliation}</span>
                <a
                  href={`https://orcid.org/${a.orcid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-accent"
                >
                  <span
                    aria-hidden
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: "var(--color-orcid)" }}
                  />
                  {a.orcid}
                </a>
              </div>
            ))}
            <div className="pt-2 text-sm">
              <a
                href={`https://doi.org/${article.doi}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-accent hover:underline"
              >
                doi.org/{article.doi} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="mb-3 font-serif-display text-xl font-bold">Özet</h2>
            <p className="article-prose text-[1.0625rem] leading-relaxed">
              {article.abstract}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.keywords.map((k) => (
                <span key={k} className="rounded-full bg-secondary px-3 py-1 text-xs">
                  {k}
                </span>
              ))}
            </div>
          </section>

          <div className="article-prose mt-12">{renderMarkdown(article.content)}</div>
        </article>

        {/* Right: sticky panel (40% ~= 2/5) */}
        <aside className="mt-12 lg:col-span-2 lg:mt-0">
          <div className="lg:sticky lg:top-8">
            <div className="rounded-lg border border-border bg-card">
              <div className="flex border-b border-border">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
                      tab === t.id
                        ? "border-b-2 border-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-5">
                {tab === "figures" && (
                  <div className="space-y-6">
                    {article.figures.map((f) => (
                      <figure key={f.id}>
                        <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-border bg-secondary/40 text-center text-sm text-muted-foreground">
                          [{f.placeholder}]
                        </div>
                        <figcaption className="mt-2 text-sm">
                          <span className="font-semibold">{f.label}.</span>{" "}
                          <span className="text-muted-foreground">{f.caption}</span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}

                {tab === "references" && (
                  <ol className="space-y-3 text-sm">
                    {article.references.map((r, i) => (
                      <li key={r.id} className="flex gap-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          [{i + 1}]
                        </span>
                        <span className="text-foreground">{r.text}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {tab === "info" && (
                  <dl className="space-y-3 text-sm">
                    <InfoRow label="Geliş Tarihi" value={article.info.received} />
                    <InfoRow label="Kabul Tarihi" value={article.info.accepted} />
                    <InfoRow label="Yayın Tarihi" value={article.info.published} />
                    <InfoRow label="Sorumlu Editör" value={article.info.editor} />
                    <InfoRow label="Lisans" value={article.info.license} />
                    <InfoRow label="DOI" value={article.doi} mono />
                  </dl>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
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
