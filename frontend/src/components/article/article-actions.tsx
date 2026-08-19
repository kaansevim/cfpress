import { useState } from "react";
import { FileText, Quote, Share2, Copy, Check } from "lucide-react";
import type { Article } from "@/lib/mock-articles";
import { toAPA, toChicago, toBibTeX, toRIS } from "@/lib/article-utils";
import { PdfViewer } from "@/components/article/pdf-viewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function CopyButton({ getText, label }: { getText: () => string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(getText());
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* pano erişimi yoksa sessizce geç */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

interface ArticleActionsProps {
  article: Article;
  /** OJS'teki doğrudan PDF adresi. Görüntüleyici açılamazsa yedek yol. */
  pdfUrl?: string;
  /** Görüntüleyicinin PDF'i sunucudan isteyebilmesi için. */
  journalSlug?: string;
  articleId?: string;
}

export function ArticleActions({
  article,
  pdfUrl,
  journalSlug,
  articleId,
}: ArticleActionsProps) {
  const doiUrl = `https://doi.org/${article.doi}`;
  const shareText = encodeURIComponent(article.title);

  // PDF, indirmek yerine sayfanın yanında açılır. Okuyucu isterse panelin
  // içindeki Download düğmesiyle dosyayı yine de alabilir.
  const slug = journalSlug ?? article.journalSlug;
  const id = articleId ?? article.id;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pdfUrl && slug && id ? (
        <PdfViewer journalSlug={slug} articleId={id} title={article.title} />
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full text-foreground"
          disabled
          title="PDF is not available for this article"
        >
          <FileText className="h-4 w-4" /> View PDF
        </Button>
      )}

      {/* Cite */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 rounded-full text-foreground">
            <Quote className="h-4 w-4" /> Cite
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cite this article</DialogTitle>
            <DialogDescription>APA style and export formats.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">APA</h4>
              <p className="rounded-md bg-secondary/50 p-3 text-sm leading-relaxed">
                {toAPA(article)}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Chicago</h4>
              <p className="rounded-md bg-secondary/50 p-3 text-sm leading-relaxed">
                {toChicago(article)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <CopyButton getText={() => toAPA(article)} label="Copy APA" />
              <CopyButton getText={() => toChicago(article)} label="Copy Chicago" />
              <CopyButton getText={() => toBibTeX(article)} label="Copy BibTeX" />
              <CopyButton getText={() => toRIS(article)} label="Copy RIS" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 rounded-full text-foreground">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(doiUrl);
              } catch {
                /* ignore */
              }
            }}
          >
            Copy DOI link
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(doiUrl)}`}
              target="_blank"
              rel="noreferrer"
            >
              X / Twitter
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(doiUrl)}`}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`mailto:?subject=${shareText}&body=${encodeURIComponent(doiUrl)}`}>
              Email
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
