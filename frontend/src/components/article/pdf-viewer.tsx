import { useCallback } from "react";
import { FileText } from "lucide-react";

import { recordDownload } from "@/lib/api/metrics.functions";

// PDF GÖRÜNTÜLEME
//
// PDF'in kendi adresi var: /journal/{dergi}/article/{id}/pdf
// (bkz. lib/pdf-route.server.ts). OJS dosyayı hep "attachment" olarak
// gönderdiği için doğrudan bağlanmak işe yaramıyordu.
//
// Bağlantı HER ZAMAN yeni sekmede açılır; sayfa içi panel yoktur. Ayrı bir
// "Download" düğmesi de yoktur — tarayıcının PDF görüntüleyicisi zaten indirme
// ve yazdırma düğmelerini kendisi sunuyor.

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
  const href = articlePdfHref(journalSlug, articleId);

  const onClick = useCallback(() => {
    void recordDownload({ data: { slug: journalSlug, id: articleId } }).catch(() => {});
  }, [articleId, journalSlug]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      title={title}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
    >
      <FileText className="h-4 w-4" /> View PDF
    </a>
  );
}
