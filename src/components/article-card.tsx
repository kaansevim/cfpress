import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/mock-articles";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group border-b border-border py-8 last:border-b-0">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <span>{formatDate(article.publishedAt)}</span>
        {article.keywords.slice(0, 2).map((k) => (
          <span key={k} className="rounded-full bg-secondary px-2 py-0.5 normal-case tracking-normal">
            {k}
          </span>
        ))}
      </div>

      <Link to="/article/$id" params={{ id: article.id }} className="block">
        <h2 className="font-serif-display text-2xl font-bold leading-tight transition-colors group-hover:text-accent sm:text-3xl">
          {article.title}
        </h2>
      </Link>

      <div className="mt-2 text-sm text-muted-foreground">
        {article.authors.map((a) => a.name).join(", ")}
      </div>

      <p className="article-prose mt-4 line-clamp-3 text-base">
        {article.abstract}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <Link
          to="/article/$id"
          params={{ id: article.id }}
          className="font-medium text-accent hover:underline"
        >
          Makaleyi oku →
        </Link>
        <a
          href={`https://doi.org/${article.doi}`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          doi.org/{article.doi}
        </a>
      </div>
    </article>
  );
}
