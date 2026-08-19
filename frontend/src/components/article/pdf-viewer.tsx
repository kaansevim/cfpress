import { useCallback, useEffect, useRef, useState } from "react";
import { Download, FileText, Loader2, X } from "lucide-react";

import { getArticlePdf } from "@/lib/api/journal.functions";
import { recordDownload } from "@/lib/api/metrics.functions";
import { Button } from "@/components/ui/button";

// SAYFA İÇİ PDF GÖRÜNTÜLEYİCİ
//
// OJS galley dosyalarını her zaman "attachment" olarak veriyor; adresi bir
// çerçeveye koyduğunda tarayıcı dosyayı indiriyor, göstermiyor. Bu yüzden PDF
// sunucu tarafından alınıp okuyucuya blob olarak veriliyor (bkz.
// lib/ojs.server.ts → fetchArticlePdf). Okuyucu OJS'e hiç gitmiyor.
//
// Veri yalnızca panel açıldığında çekilir; makale sayfası PDF'i taşımaz.

function base64ToBlobUrl(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
}

interface PdfViewerProps {
  journalSlug: string;
  articleId: string;
  title: string;
  /** OJS'teki doğrudan adres. Gömme başarısız olursa yedek indirme yolu. */
  fallbackUrl?: string;
}

export function PdfViewer({ journalSlug, articleId, title, fallbackUrl }: PdfViewerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState("article.pdf");

  // Blob adresleri elle serbest bırakılmazsa sekme kapanana kadar bellekte kalır.
  const blobRef = useRef<string | null>(null);
  useEffect(() => {
    blobRef.current = blobUrl;
  }, [blobUrl]);
  useEffect(() => {
    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, []);

  const load = useCallback(async () => {
    if (blobUrl || loading) return;
    setLoading(true);
    setError(null);
    try {
      const pdf = await getArticlePdf({ data: { slug: journalSlug, id: articleId } });
      if (!pdf) {
        setError("The PDF could not be loaded.");
        return;
      }
      setBlobUrl(base64ToBlobUrl(pdf.base64));
      setFilename(pdf.filename);
    } catch {
      setError("The PDF could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [articleId, blobUrl, journalSlug, loading]);

  const openViewer = useCallback(() => {
    setOpen(true);
    void recordDownload({ data: { slug: journalSlug, id: articleId } }).catch(() => {});
    void load();
  }, [articleId, journalSlug, load]);

  // Panel açıkken Esc ile kapansın ve arka plan kaymasın.
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
      <Button
        variant="outline"
        size="sm"
        className="gap-2 rounded-full text-foreground"
        onClick={openViewer}
      >
        <FileText className="h-4 w-4" /> View PDF
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="PDF">
          <button
            type="button"
            aria-label="Close PDF"
            className="flex-1 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <aside className="flex h-full w-full flex-col border-l border-border bg-background shadow-2xl sm:w-[46rem] sm:max-w-[92vw]">
            <header className="flex items-center gap-3 border-b border-border px-4 py-3">
              <FileText className="h-4 w-4 shrink-0 text-accent" />
              <p className="min-w-0 flex-1 truncate text-sm font-medium" title={title}>
                {title}
              </p>

              {blobUrl && (
                <a
                  href={blobUrl}
                  download={filename}
                  className="inline-flex items-center gap-1.5 rounded-md border border-input px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              )}

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1.5 transition-colors hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="min-h-0 flex-1 bg-secondary/30">
              {loading && (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  <p className="text-sm">Loading PDF…</p>
                </div>
              )}

              {!loading && error && (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="text-sm text-muted-foreground">{error}</p>
                  {fallbackUrl && (
                    <a
                      href={fallbackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-accent hover:underline"
                    >
                      Download the PDF instead
                    </a>
                  )}
                </div>
              )}

              {!loading && !error && blobUrl && (
                <iframe src={blobUrl} title={title} className="h-full w-full border-0" />
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
