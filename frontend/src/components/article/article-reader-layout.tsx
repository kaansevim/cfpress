import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  Pointer,
  Search,
  UserRound,
} from "lucide-react";
import type { Article, Author } from "@/lib/mock-articles";
import type { Journal } from "@/lib/journals";
import type { XmlArticleEntry } from "@/lib/article-manifest";
import type { ParsedJats } from "@/lib/jats-parser";
import type { Heading } from "@/lib/article-utils";
import { formatDate } from "@/lib/article-utils";
import { navItemSlug } from "@/lib/journals";
import { OJS_SUBMIT_URL } from "@/lib/ojs";
import { cn } from "@/lib/utils";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ArticleBody } from "@/components/article-body";
import { JatsBody } from "@/components/jats-body";
import { ArticleActions } from "@/components/article/article-actions";
import { AuthorContributions } from "@/components/article/article-authors";
import { MetricsCards } from "@/components/article/article-metrics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ReaderPanel = "sections" | "figures" | "references";

interface ArticleReaderLayoutProps {
  journal: Journal;
  article: Article;
  headings: Heading[];
  isXml: boolean;
  parsedJats: ParsedJats | null;
  xmlEntry: XmlArticleEntry | null;
  pdfUrl?: string;
}

interface FigureLink {
  id: string;
  label: string;
  caption: string;
  kind: "figure" | "table";
  imageSrc?: string;
}

function AuthorDialog({ author }: { author: Author }) {
  const query = encodeURIComponent(author.name);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-b border-foreground/35 font-semibold leading-relaxed transition-colors hover:border-accent hover:text-accent"
        >
          {author.name}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogDescription className="flex items-center gap-2 font-semibold text-accent">
            <UserRound className="h-4 w-4" />
            {author.isCorresponding ? "Corresponding author" : "Author information"}
          </DialogDescription>
          <DialogTitle className="font-serif-display text-2xl">{author.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {author.affiliation && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {author.affiliation}
            </p>
          )}

          <div className="flex flex-wrap gap-3 border-y border-border py-4 text-sm">
            {author.email && (
              <a
                href={`mailto:${author.email}`}
                className="inline-flex items-center gap-2 font-medium text-accent hover:underline"
              >
                <Mail className="h-4 w-4" /> {author.email}
              </a>
            )}
            {author.orcid && author.orcid !== "0000-0000-0000-0000" && (
              <a
                href={`https://orcid.org/${author.orcid}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-accent"
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: "var(--color-orcid)" }}
                />
                {author.orcid}
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold">Search author:</span>
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${query}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-accent hover:underline"
            >
              <Search className="h-3.5 w-3.5" /> PubMed
            </a>
            <a
              href={`https://scholar.google.com/scholar?q=${query}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-accent hover:underline"
            >
              Google Scholar <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReaderSidebar({
  headings,
  figures,
  references,
}: {
  headings: Heading[];
  figures: FigureLink[];
  references: Article["references"];
}) {
  const [panel, setPanel] = useState<ReaderPanel>("sections");
  const [activeHeading, setActiveHeading] = useState(headings[0]?.id ?? "abstract");
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const visualFigures = figures.filter((figure) => figure.kind === "figure");
  const tables = figures.filter((figure) => figure.kind === "table");
  const [selectedFigureId, setSelectedFigureId] = useState(visualFigures[0]?.id ?? "");
  const selectedFigure =
    visualFigures.find((figure) => figure.id === selectedFigureId) ?? visualFigures[0];

  useEffect(() => {
    const targets = [
      document.getElementById("abstract"),
      ...headings.map((heading) => document.getElementById(heading.id)),
    ].filter((target): target is HTMLElement => target !== null);

    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveHeading(visible[0].target.id);
      },
      { rootMargin: "-22% 0% -68% 0%", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [headings]);

  const tabs: Array<{ id: ReaderPanel; label: string; count?: number }> = [
    { id: "sections", label: "Sections" },
    { id: "figures", label: "Figures", count: visualFigures.length },
    { id: "references", label: "References", count: references.length },
  ];

  return (
    <aside className="order-first min-w-0 lg:order-none">
      <div className="rounded-xl border border-border bg-card shadow-sm lg:sticky lg:top-6">
        <button
          type="button"
          onClick={() => setMobileExpanded((expanded) => !expanded)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold lg:hidden"
          aria-expanded={mobileExpanded}
        >
          Article navigation
          {mobileExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <div
          className={cn(
            "grid grid-cols-3 border-b border-border",
            !mobileExpanded && "hidden lg:grid",
          )}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPanel(tab.id)}
              className={cn(
                "min-w-0 border-b-2 px-2 py-3 text-xs font-semibold transition-colors sm:text-sm",
                panel === tab.id
                  ? "border-accent bg-background text-[#17324a]"
                  : "border-transparent bg-secondary/45 text-[#075f99] hover:bg-secondary/70 hover:text-[#053f68]",
              )}
            >
              {tab.label}
              {typeof tab.count === "number" && tab.count > 0 && (
                <span className="ml-1 text-[10px] text-muted-foreground">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        <div
          className={cn(
            "max-h-72 overflow-y-auto p-4 lg:max-h-[calc(100vh-10rem)]",
            !mobileExpanded && "hidden lg:block",
          )}
        >
          {panel === "sections" && (
            <nav aria-label="Article sections">
              <ul className="space-y-1 text-sm">
                {[{ id: "abstract", text: "Abstract" }, ...headings].map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      onClick={() => setMobileExpanded(false)}
                      className={cn(
                        "block rounded-md border-l-2 px-3 py-2 font-semibold leading-snug no-underline transition-colors",
                        activeHeading === heading.id
                          ? "border-[#087acc] bg-[#e7f2f9] font-bold text-[#073f69]"
                          : "border-transparent text-[#075f99] hover:bg-[#eef6fb] hover:text-[#053f68]",
                      )}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {panel === "figures" && (
            <div className="space-y-4 text-sm">
              {selectedFigure ? (
                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  {selectedFigure.imageSrc ? (
                    <img
                      src={selectedFigure.imageSrc}
                      alt={selectedFigure.caption || selectedFigure.label}
                      className="max-h-72 w-full bg-white object-contain"
                    />
                  ) : (
                    <div className="flex min-h-36 items-center justify-center bg-secondary/40 p-5 text-center text-xs text-muted-foreground">
                      {selectedFigure.label}
                    </div>
                  )}
                  <div className="border-t border-border p-3">
                    <p className="font-semibold text-foreground">{selectedFigure.label}</p>
                    {selectedFigure.caption && (
                      <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {selectedFigure.caption}
                      </p>
                    )}
                    <a
                      href={`#${selectedFigure.id}`}
                      onClick={() => setMobileExpanded(false)}
                      className="mt-2 inline-flex items-center gap-1 font-semibold text-accent hover:underline"
                    >
                      View in article <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No figures available.</p>
              )}

              {visualFigures.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {visualFigures.map((figure) => (
                    <button
                      key={figure.id}
                      type="button"
                      onClick={() => setSelectedFigureId(figure.id)}
                      className={cn(
                        "rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                        selectedFigure?.id === figure.id
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-muted-foreground hover:border-accent hover:text-accent",
                      )}
                    >
                      {figure.label}
                    </button>
                  ))}
                </div>
              )}

              {tables.length > 0 && (
                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Tables {tables.length}
                  </p>
                  <div className="space-y-2">
                    {tables.map((table) => (
                      <a
                        key={table.id}
                        href={`#${table.id}`}
                        onClick={() => setMobileExpanded(false)}
                        className="block rounded-md border border-border p-3 transition-colors hover:border-accent hover:bg-accent/5"
                      >
                        <span className="font-semibold text-accent">{table.label}</span>
                        {table.caption && (
                          <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                            {table.caption}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {panel === "references" && (
            <ol className="space-y-2 text-xs">
              {references.length ? (
                references.map((reference, index) => (
                  <li key={reference.id}>
                    <a
                      href={`#${reference.id}`}
                      onClick={() => setMobileExpanded(false)}
                      className="flex gap-2 rounded-md p-2 leading-relaxed text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <span className="font-mono text-accent">[{index + 1}]</span>
                      <span className="line-clamp-3">{reference.text}</span>
                    </a>
                  </li>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No references available.</p>
              )}
            </ol>
          )}
        </div>
      </div>
    </aside>
  );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[9rem_1fr]">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={cn("text-sm font-medium", mono && "break-all font-mono text-xs")}>{value}</dd>
    </div>
  );
}

export function ArticleReaderLayout({
  journal,
  article,
  headings,
  isXml,
  parsedJats,
  xmlEntry,
  pdfUrl,
}: ArticleReaderLayoutProps) {
  const basePath = xmlEntry?.xmlPath
    ? xmlEntry.xmlPath.substring(0, xmlEntry.xmlPath.lastIndexOf("/") + 1)
    : "";

  const figureLinks = useMemo<FigureLink[]>(() => {
    if (isXml && parsedJats) {
      return Array.from(parsedJats.bodyElement.querySelectorAll("fig, table-wrap")).map(
        (element, index) => {
          const tag = element.tagName.toLowerCase();
          const kind = tag === "fig" ? "figure" : "table";
          const id = element.getAttribute("id") || `reader-${tag}-${index + 1}`;
          const label =
            element.querySelector("label")?.textContent?.trim() ||
            `${tag === "fig" ? "Figure" : "Table"} ${index + 1}`;
          const caption =
            element.querySelector("caption")?.textContent?.replace(/\s+/g, " ").trim() || "";
          const graphic = element.querySelector("graphic");
          const graphicHref =
            graphic?.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
            graphic?.getAttribute("xlink:href") ||
            graphic?.getAttribute("href") ||
            "";
          const imageSrc =
            kind === "figure" && graphicHref
              ? graphicHref.startsWith("http") || graphicHref.startsWith("/")
                ? graphicHref
                : `${basePath}${graphicHref}`
              : undefined;
          return { id, label, caption, kind, imageSrc };
        },
      );
    }

    return article.figures.map((figure) => ({
      id: figure.id,
      label: figure.label,
      caption: figure.caption,
      kind: /^(table|tablo)\b/i.test(figure.label) ? "table" : "figure",
    }));
  }, [article.figures, basePath, isXml, parsedJats]);

  const publicationLine = [
    article.volume ? `Volume ${article.volume}` : "",
    article.issue ? `Issue ${article.issue}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader journal={journal} />

      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: `linear-gradient(125deg, ${journal.theme.heroFrom}, ${journal.theme.heroTo})`,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 82% 18%, rgba(255,255,255,.36), transparent 28%), radial-gradient(circle at 8% 92%, rgba(255,255,255,.18), transparent 25%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-8 lg:py-9">
          <Link
            to="/journal/$slug"
            params={{ slug: journal.slug }}
            className="inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> {journal.name}
          </Link>

          <div className="mt-4 grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_10.5rem] lg:grid-cols-[minmax(0,1fr)_12rem] lg:gap-14">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                <span>{article.subject}</span>
                <span aria-hidden>•</span>
                <span>Open access</span>
                {article.doi && (
                  <>
                    <span aria-hidden>•</span>
                    <a
                      href={`https://crossmark.crossref.org/dialog/?doi=${article.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Check for updates"
                      aria-label="Check for article updates with Crossmark"
                      className="inline-flex shrink-0 items-center gap-1.5 normal-case tracking-normal text-white/80 transition-colors hover:text-white"
                    >
                      <img
                        src="/crossmark-symbol.svg"
                        alt="Crossmark"
                        className="h-4 w-4"
                      />
                      <span className="text-[11px] font-semibold underline decoration-white/55 underline-offset-4">
                        Check for updates
                      </span>
                    </a>
                  </>
                )}
              </div>

              <h1 className="mt-5 max-w-4xl font-sans text-[2rem] font-bold leading-[1.1] tracking-[-0.025em] sm:text-[2.35rem] lg:text-[2.65rem]">
                {article.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/78">
                <span>Published {formatDate(article.publishedAt)}</span>
                {publicationLine && <span>{publicationLine}</span>}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <ArticleActions article={article} pdfUrl={pdfUrl} />
                {article.doi && (
                  <a
                    href={`https://doi.org/${article.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white hover:underline"
                  >
                    doi.org/{article.doi} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <a
                href="#metrics"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition-colors hover:text-white hover:underline"
              >
                Explore metrics <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="-mt-2 hidden md:block">
              <img
                src={journal.coverImage}
                alt={`${journal.name} cover`}
                className="w-full rounded-md border border-white/60 object-cover shadow-2xl shadow-black/30"
              />
              <p className="mt-2 text-center text-xs font-semibold text-white/75">{journal.name}</p>
              <div className="mt-2 space-y-1.5">
                <Link
                  to="/journal/$slug/$section"
                  params={{ slug: journal.slug, section: "about" }}
                  hash={navItemSlug("Aims and scope")}
                  className="flex items-center justify-between border-b border-white/45 py-1.5 text-sm font-semibold text-white/90 transition-colors hover:border-white hover:text-white"
                >
                  Aims and scope <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={OJS_SUBMIT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
                  style={{ color: journal.theme.heroFrom }}
                >
                  Submit your article <Pointer className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 pb-3 pt-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[0.98rem]">
            {article.authors.map((author, index) => (
              <span key={`${author.orcid}-${index}`} className="inline-flex items-center gap-1.5">
                <AuthorDialog author={author} />
                {author.isCorresponding && (
                  <Mail className="h-4 w-4 text-accent" aria-label="Corresponding author" />
                )}
                {index < article.authors.length - 1 && (
                  <span className="text-muted-foreground">,</span>
                )}
              </span>
            ))}
          </div>

        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-8 pt-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10 lg:pb-12 lg:pt-5">
        <main className="min-w-0">
          <section id="abstract" className="scroll-mt-24 border-b border-border pb-9">
            <h2 className="font-serif-display text-3xl font-bold">Abstract</h2>
            <p className="mt-5 text-[1.0625rem] leading-8 text-foreground/85">{article.abstract}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {article.keywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-secondary px-3 py-1 text-xs">
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          <div className="article-prose mt-10">
            {isXml && parsedJats ? (
              <JatsBody bodyElement={parsedJats.bodyElement} basePath={basePath} />
            ) : (
              <ArticleBody content={article.content} figures={article.figures} />
            )}
          </div>

          {article.references.length > 0 && (
            <section id="references" className="mt-16 scroll-mt-24 border-t border-border pt-9">
              <h2 className="font-serif-display text-3xl font-bold">References</h2>
              <ol className="mt-6 space-y-4 text-sm">
                {article.references.map((reference, index) => (
                  <li
                    key={reference.id}
                    id={reference.id}
                    className="flex scroll-mt-24 gap-4 leading-relaxed"
                  >
                    <span className="pt-0.5 font-mono text-xs text-accent">[{index + 1}]</span>
                    <span>{reference.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section id="author-information" className="mt-16 scroll-mt-24 border-t border-border pt-9">
            <h2 className="font-serif-display text-3xl font-bold">Author information</h2>
            <div className="mt-6">
              <AuthorContributions authors={article.authors} />
            </div>
          </section>

          <section id="article-information" className="mt-16 scroll-mt-24 border-t border-border pt-9">
            <h2 className="font-serif-display text-3xl font-bold">About this article</h2>

            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <dl className="rounded-xl border border-border bg-card px-5 py-2">
                <DetailRow label="Received" value={article.info.received} />
                <DetailRow label="Accepted" value={article.info.accepted} />
                <DetailRow label="Published" value={article.info.published} />
                <DetailRow label="Handling editor" value={article.info.editor} />
                <DetailRow label="License" value={article.info.license} />
                <DetailRow label="DOI" value={article.doi} mono />
              </dl>

              <div className="space-y-5">
                {article.funding && (
                  <div className="rounded-xl border border-border p-5">
                    <h3 className="font-semibold">Funding</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.funding}</p>
                  </div>
                )}
                {article.dataAvailability && (
                  <div className="rounded-xl border border-border p-5">
                    <h3 className="font-semibold">Data availability</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {article.dataAvailability}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section id="metrics" className="mt-16 scroll-mt-24 border-t border-border pt-9">
            <h2 className="font-serif-display text-3xl font-bold">Article metrics</h2>
            <div className="mt-6">
              <MetricsCards metrics={article.metrics} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Metrics are updated regularly.</p>
          </section>
        </main>

        <ReaderSidebar headings={headings} figures={figureLinks} references={article.references} />
      </div>

      <SiteFooter />
    </div>
  );
}
