import type { ReactNode } from "react";
import type { Figure } from "@/lib/mock-articles";
import { slugify } from "@/lib/article-utils";
import { MockFigure } from "@/components/mock-figure";

// Satır içi **kalın** ve [metin](url) link işaretlemesini React düğümlerine çevirir.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  // Önce linkleri, sonra kalınları işleyebilmek için birleşik bir regex.
  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return tokens.map((tok, i) => {
    const key = `${keyPrefix}-${i}`;
    const link = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={key} href={link[2]} target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      );
    }
    if (tok.startsWith("**") && tok.endsWith("**")) {
      return <strong key={key}>{tok.slice(2, -2)}</strong>;
    }
    return <span key={key}>{tok}</span>;
  });
}

/**
 * Genişletilmiş blok-düzey markdown:
 *  - "## " → <h2 id={slug}>  (TOC scroll-spy hedefi)
 *  - "### " → <h3>
 *  - "> " → <blockquote>
 *  - "- " satırları → <ul><li>
 *  - "[[fig:ID]]" → ilgili figürü inline gömer
 *  - diğer → <p>  (satır içi kalın/link desteğiyle)
 */
export function ArticleBody({
  content,
  figures,
}: {
  content: string;
  figures: Figure[];
}) {
  const blocks = content.split(/\n\n+/);
  const figById = new Map(figures.map((f) => [f.id, f]));

  const out: ReactNode[] = [];

  blocks.forEach((block, i) => {
    const key = `b-${i}`;
    const trimmed = block.trim();

    // Inline figür: [[fig:ID]]
    const figMatch = trimmed.match(/^\[\[fig:([^\]]+)\]\]$/);
    if (figMatch) {
      const fig = figById.get(figMatch[1]);
      if (fig) {
        out.push(
          <figure key={key} className="my-8">
            <MockFigure figure={fig} />
            <figcaption className="mt-2 text-sm">
              <span className="font-semibold">{fig.label}.</span>{" "}
              <span className="text-muted-foreground">{fig.caption}</span>
            </figcaption>
          </figure>,
        );
      }
      return;
    }

    if (trimmed.startsWith("## ")) {
      const text = trimmed.replace(/^##\s+/, "");
      out.push(
        <h2 key={key} id={slugify(text)} className="scroll-mt-24">
          {text}
        </h2>,
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      out.push(<h3 key={key}>{trimmed.replace(/^###\s+/, "")}</h3>);
      return;
    }

    if (trimmed.startsWith("> ")) {
      out.push(
        <blockquote key={key}>{renderInline(trimmed.replace(/^>\s+/, ""), key)}</blockquote>,
      );
      return;
    }

    // Liste: tüm satırları "- " ile başlıyorsa
    const lines = trimmed.split("\n");
    if (lines.length > 0 && lines.every((l) => l.startsWith("- "))) {
      out.push(
        <ul key={key}>
          {lines.map((l, j) => (
            <li key={`${key}-${j}`}>{renderInline(l.replace(/^-\s+/, ""), `${key}-${j}`)}</li>
          ))}
        </ul>,
      );
      return;
    }

    out.push(<p key={key}>{renderInline(trimmed, key)}</p>);
  });

  return <>{out}</>;
}
