// JATS XML <body> elementini React düğümlerine çevirir.
// Yalnızca tarayıcıda çalışır (DOMParser ile parse edilmiş Element alır).

import { type ReactNode } from "react";

const XLINK = "http://www.w3.org/1999/xlink";

interface JatsBodyProps {
  bodyElement: Element;
  basePath?: string;
}

export function JatsBody({ bodyElement, basePath }: JatsBodyProps) {
  const topSections = Array.from(bodyElement.children).filter(
    (c) => c.tagName.toLowerCase() === "sec"
  );

  return (
    <>
      {topSections.map((sec, i) => (
        <RenderSec key={i} el={sec} depth={2} basePath={basePath} />
      ))}
    </>
  );
}

// ── Bölüm ─────────────────────────────────────────────────────────────────────

function RenderSec({ el, depth, basePath }: { el: Element; depth: number; basePath?: string }) {
  const id = el.getAttribute("id") ?? undefined;
  const titleEl = Array.from(el.children).find(
    (c) => c.tagName.toLowerCase() === "title"
  );
  const title = titleEl?.textContent?.trim();
  const secType = el.getAttribute("sec-type");

  const isSupplementary = secType && [
    "COI-statement",
    "funding",
    "ethics-statement",
    "supplementary-material",
    "author-contributions",
    "data-availability",
    "acknowledgments",
    "competing-interests"
  ].includes(secType);

  const effectiveDepth = isSupplementary ? Math.max(depth + 1, 3) : depth;

  const Heading =
    effectiveDepth === 2 ? "h2" : effectiveDepth === 3 ? "h3" : ("h4" as "h2" | "h3" | "h4");

  return (
    <section id={id} className={`scroll-mt-24 ${isSupplementary ? "mt-12" : ""}`}>
      {title && <Heading>{title}</Heading>}
      {Array.from(el.childNodes).map((child, i) =>
        child === titleEl ? null : (
          <RenderNode key={i} node={child} depth={effectiveDepth} basePath={basePath} />
        )
      )}
    </section>
  );
}

// ── Genel düğüm ───────────────────────────────────────────────────────────────

function RenderNode({
  node,
  depth,
  basePath,
}: {
  node: Node;
  depth: number;
  basePath?: string;
}): ReactNode {
  // Metin düğümü
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  const kids = () =>
    Array.from(el.childNodes).map((c, i) => (
      <RenderNode key={i} node={c} depth={depth} basePath={basePath} />
    ));

  switch (tag) {
    // Yapısal
    case "sec":
      return <RenderSec el={el} depth={depth + 1} basePath={basePath} />;

    // Paragraf
    case "p":
      return <p>{kids()}</p>;

    // Satır içi biçimleme
    case "bold":
    case "b":
      return <strong>{kids()}</strong>;
    case "italic":
    case "i":
      return <em>{kids()}</em>;
    case "sup":
      return <sup>{kids()}</sup>;
    case "sub":
      return <sub>{kids()}</sub>;
    case "monospace":
    case "code":
      return <code className="rounded bg-muted px-1 text-sm">{kids()}</code>;
    case "underline":
      return <u>{kids()}</u>;

    // Çapraz referanslar
    case "xref": {
      const refType = el.getAttribute("ref-type");
      const rid = el.getAttribute("rid") ?? "";
      if (refType === "bibr" || refType === "fig" || refType === "table") {
        return (
          <a
            href={`#${rid}`}
            className="text-accent hover:underline"
          >
            {kids()}
          </a>
        );
      }
      return <>{kids()}</>;
    }

    // Dış bağlantı
    case "ext-link": {
      const href =
        el.getAttributeNS(XLINK, "href") ?? el.getAttribute("href") ?? "#";
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="break-all text-accent underline"
        >
          {kids()}
        </a>
      );
    }

    // Alıntı / kutu
    case "disp-quote":
    case "boxed-text":
      return (
        <blockquote className="my-4 border-l-4 border-accent pl-4 italic text-muted-foreground">
          {kids()}
        </blockquote>
      );

    // Liste
    case "list":
      return el.getAttribute("list-type") === "order" ? (
        <ol className="my-3 list-decimal space-y-1 pl-6">{kids()}</ol>
      ) : (
        <ul className="my-3 list-disc space-y-1 pl-6">{kids()}</ul>
      );
    case "list-item":
      return <li>{kids()}</li>;

    // Şekil
    case "fig":
      return <RenderFig el={el} basePath={basePath} />;

    // Tablo
    case "table-wrap":
      return <RenderTableWrap el={el} />;
    case "table":
      return <RenderTable table={el} />;

    // Başlık — üst bileşen tarafından işleniyor, burada atlanıyor
    case "title":
      return null;

    // Bilinmeyen → sadece çocukları render et
    default:
      return <>{kids()}</>;
  }
}

// ── Şekil ─────────────────────────────────────────────────────────────────────

export function RenderFig({ el, idSuffix = "", basePath = "" }: { el: Element; idSuffix?: string; basePath?: string }) {
  const baseId = el.getAttribute("id") ?? "";
  const id = baseId ? `${baseId}${idSuffix}` : undefined;
  const label = el.querySelector("label")?.textContent?.trim() ?? "";
  const captionTitle = el.querySelector("caption > title")?.textContent?.trim() ?? "";
  const captionP = el.querySelector("caption > p")?.textContent?.trim() ?? "";
  const caption = [captionTitle, captionP].filter(Boolean).join(" ");
  const graphicEl = el.querySelector("graphic");
  let src = graphicEl
    ? (graphicEl.getAttributeNS(XLINK, "href") ??
      graphicEl.getAttribute("xlink:href") ??
      "")
    : "";

  if (src && !src.startsWith("http") && !src.startsWith("/") && basePath) {
    src = basePath + src;
  }

  return (
    <figure id={id} className="my-8">
      {src ? (
        <img
          src={src}
          alt={caption || label}
          className="mx-auto max-h-[500px] max-w-full rounded border border-border object-contain"
        />
      ) : (
        <div className="flex min-h-[8rem] items-center justify-center rounded border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
          {label || "Şekil"}
        </div>
      )}
      {(label || caption) && (
        <figcaption className="mt-2 text-sm">
          {label && <span className="font-semibold">{label}. </span>}
          {caption && (
            <span className="text-muted-foreground">{caption}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

// ── Tablo sarmalayıcı ─────────────────────────────────────────────────────────

export function RenderTableWrap({ el, idSuffix = "" }: { el: Element; idSuffix?: string }) {
  const baseId = el.getAttribute("id") ?? "";
  const id = baseId ? `${baseId}${idSuffix}` : undefined;
  const label = el.querySelector("label")?.textContent?.trim() ?? "";
  const captionTitle =
    el.querySelector("caption > title")?.textContent?.trim() ?? "";
  const captionP =
    el.querySelector("caption > p")?.textContent?.trim() ?? "";
  const tableEl = el.querySelector("table");

  return (
    <figure id={id} className="my-8 overflow-x-auto">
      {tableEl && <RenderTable table={tableEl} />}
      {(label || captionTitle) && (
        <figcaption className="mt-2 text-sm">
          {label && <span className="font-semibold">{label}. </span>}
          <span className="text-muted-foreground">
            {[captionTitle, captionP].filter(Boolean).join(" ")}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

// ── Tablo ─────────────────────────────────────────────────────────────────────

function RenderTable({ table }: { table: Element }) {
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  return (
    <div className="w-full overflow-x-auto my-6 rounded-lg border border-border shadow-sm">
      <table className="w-full border-collapse text-sm text-left bg-card">
        {thead && (
          <thead className="bg-muted/40 border-b border-border text-muted-foreground">
            {Array.from(thead.querySelectorAll("tr")).map((tr, i) => (
              <tr key={i} className="border-b border-border/40 last:border-0">
                {Array.from(tr.querySelectorAll("th, td")).map((cell, j) => (
                  <th
                    key={j}
                    colSpan={parseInt(cell.getAttribute("colspan") || "1")}
                    rowSpan={parseInt(cell.getAttribute("rowspan") || "1")}
                    className="px-4 py-3 font-medium align-bottom"
                  >
                    {Array.from(cell.childNodes).map((child, k) => (
                      <RenderNode key={k} node={child} depth={5} />
                    ))}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        )}
        {tbody && (
          <tbody className="divide-y divide-border/60">
            {Array.from(tbody.querySelectorAll("tr")).map((tr, i) => (
              <tr key={i} className="transition-colors hover:bg-muted/30">
                {Array.from(tr.querySelectorAll("td, th")).map((cell, j) => (
                  <td
                    key={j}
                    colSpan={parseInt(cell.getAttribute("colspan") || "1")}
                    rowSpan={parseInt(cell.getAttribute("rowspan") || "1")}
                    className="px-4 py-3 align-top"
                  >
                    {Array.from(cell.childNodes).map((child, k) => (
                      <RenderNode key={k} node={child} depth={5} />
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
