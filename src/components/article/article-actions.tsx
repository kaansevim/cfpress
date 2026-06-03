import { useState } from "react";
import { Download, Quote, Share2, Copy, Check } from "lucide-react";
import type { Article } from "@/lib/mock-articles";
import { toAPA, toBibTeX, toRIS } from "@/lib/article-utils";
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
      {copied ? "Kopyalandı" : label}
    </button>
  );
}

const btn =
  "inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary outline-none";

export function ArticleActions({ article }: { article: Article }) {
  const doiUrl = `https://doi.org/${article.doi}`;
  const shareText = encodeURIComponent(article.title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* İndir */}
      <DropdownMenu>
        <DropdownMenuTrigger className={btn}>
          <Download className="h-4 w-4" /> İndir
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() =>
              alert("Bu bir prototiptir; gerçek PDF dosyası henüz mevcut değil.")
            }
          >
            PDF (prototip)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alıntı */}
      <Dialog>
        <DialogTrigger className={btn}>
          <Quote className="h-4 w-4" /> Alıntı
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bu makaleyi alıntıla</DialogTitle>
            <DialogDescription>APA biçimi ve dışa aktarım formatları.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="rounded-md bg-secondary/50 p-3 text-sm leading-relaxed">
              {toAPA(article)}
            </p>
            <div className="flex flex-wrap gap-2">
              <CopyButton getText={() => toAPA(article)} label="APA kopyala" />
              <CopyButton getText={() => toBibTeX(article)} label="BibTeX kopyala" />
              <CopyButton getText={() => toRIS(article)} label="RIS kopyala" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Paylaş */}
      <DropdownMenu>
        <DropdownMenuTrigger className={btn}>
          <Share2 className="h-4 w-4" /> Paylaş
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(doiUrl);
              } catch {
                /* yoksay */
              }
            }}
          >
            DOI bağlantısını kopyala
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
              E-posta
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
