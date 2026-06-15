import { Mail } from "lucide-react";
import type { Author } from "@/lib/mock-articles";

// eLife tarzı yazar bloğu: sorumlu yazar zarf ikonu, ORCID yeşil nokta rozeti.
export function ArticleAuthors({ authors }: { authors: Author[] }) {
  return (
    <div className="mt-6 space-y-2 border-y border-border py-5">
      {authors.map((a) => (
        <div key={a.orcid} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
          <span className="font-semibold">{a.name}</span>
          {a.isCorresponding && (
            <span
              className="inline-flex items-center gap-1 text-xs text-accent"
              title="Corresponding author"
            >
              <Mail className="h-3 w-3" /> Corresponding author
            </span>
          )}
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
    </div>
  );
}

// "Makale ve Yazar Bilgisi" sekmesi için ayrıntılı yazar/katkı listesi.
export function AuthorContributions({ authors }: { authors: Author[] }) {
  return (
    <div className="space-y-5">
      {authors.map((a) => (
        <div key={a.orcid} className="rounded-lg border border-border p-4">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-semibold">{a.name}</span>
            {a.isCorresponding && a.email && (
              <a href={`mailto:${a.email}`} className="text-xs text-accent hover:underline">
                {a.email}
              </a>
            )}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{a.affiliation}</div>
          <a
            href={`https://orcid.org/${a.orcid}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-accent"
          >
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--color-orcid)" }}
            />
            {a.orcid}
          </a>
          {a.contributions && a.contributions.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Katkılar
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {a.contributions.map((c) => (
                  <span key={c} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
