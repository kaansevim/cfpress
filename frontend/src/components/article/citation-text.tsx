// Tek bir kaynakçanın gösterimi.
//
// Dizgi XML'den hazır gelir (<mixed-citation>); burada yalnızca <source>/<volume>
// italiğe, adresler bağlantıya çevrilir. Metne hiçbir şey eklenmez/çıkarılmaz.

import type { Reference } from "@/lib/mock-articles";

export function CitationText({ reference }: { reference: Reference }) {
  const segments = reference.segments;
  if (!segments?.length) return <>{reference.text}</>;

  return (
    <>
      {segments.map((seg, i) => {
        const body = seg.italic ? <em>{seg.text}</em> : seg.text;
        if (!seg.href) return <span key={i}>{body}</span>;
        return (
          <a
            key={i}
            href={seg.href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words underline decoration-dotted underline-offset-2 hover:text-foreground"
          >
            {body}
          </a>
        );
      })}
    </>
  );
}
