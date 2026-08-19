import { useCallback, useEffect, useState } from "react";
import { Download, FileText, X } from "lucide-react";

import { recordDownload } from "@/lib/api/metrics.functions";

// PDF GÖRÜNTÜLEME
//
// PDF'in kendi adresi var: /journal/{dergi}/article/{id}/pdf
// (bkz. lib/pdf-route.server.ts). OJS dosyayı hep "attachment" olarak
// gönderdiği için doğrudan bağlanmak işe yaramıyordu.
//
// Cihaza göre davranış:
//   Masaüstü — adres sağdaki panele yüklenir, okuyucu sayfadan ayrılmaz.
//   Telefon/tablet — bağlantı yeni sekmede açılır; telefon tarayıcıları PDF'i
//   çerçeve içinde kaydırmıyor, yalnızca ilk sayfayı gösteriyor. Kendi
//   okuyucularında ise sorunsuz açılıyor.

const PANEL_MIN_WIDTH = 1024;

export function articlePdfHref(journalSlug: string, articleId: string, download = false) {
  const base = `/journal/${journalSlug}/article/${articleId}/pdf`;
  return download ? `${base}?download=1` : base;
}

interface PdfViewerProps {
  journalSlug: string;
  articleId: string;
  title: string;
}

export function PdfViewer({ journalSlug, articleId, title }: PdfViewerProps) {
  const [open, setOpen] = useState(false);
  const href = articlePdfHref(journalSlug, articleId);

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      void recordDownload({ data: { slug: journalSlug, id: articleId } }).catch(() => {});

      // Yeni sekmede açma isteklerine (Cmd/Ctrl/orta tık) karışma.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      if (typeof window === "undefined") return;
      if (window.innerWidth < PANEL_MIN_WIDTH) return;

      event.preventDefault();
      setOpen(true);
    },
    [articleId, journalSlug],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        <FileText className="h-4 w-4" /> View PDF
      </a>

      {open && (
        <div
          className="fixed inset-0 z-50 flex text-foreground"
          role="dialog"
          aria-modal="true"
          aria-label="PDF"
        >
          <button
            type="button"
            aria-label="Close PDF"
            className="flex-1 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <aside className="flex h-full w-full flex-col border-l border-border bg-background text-foreground shadow-2xl lg:w-[48rem] lg:max-w-[92vw]">
            <header className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
              <FileText className="h-4 w-4 shrink-0 text-accent" />
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground" title={title}>
                {title}
              </p>

              <a
                href={articlePdfHref(journalSlug, articleId, true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </a>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1.5 text-foreground transition-colors hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="min-h-0 flex-1 bg-secondary/30">
              <iframe src={href} title={title} className="h-full w-full border-0" />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
