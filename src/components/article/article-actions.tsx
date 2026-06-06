import { useState } from "react";
import { Download, Quote, Share2, Copy, Check } from "lucide-react";
import type { Article } from "@/lib/mock-articles";
import { toAPA, toChicago, toBibTeX, toRIS } from "@/lib/article-utils";
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

const btn =
  "inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary outline-none";

export function ArticleActions({ article, pdfUrl }: { article: Article; pdfUrl?: string }) {
  const doiUrl = `https://doi.org/${article.doi}`;
  const shareText = encodeURIComponent(article.title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Download */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 rounded-full">
            <Download className="h-4 w-4" /> Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {pdfUrl ? (
            <DropdownMenuItem asChild>
              <a href={pdfUrl} target="_blank" rel="noreferrer" download>
                Download PDF
              </a>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() =>
                alert("This is a prototype; the actual PDF file is not available yet.")
              }
            >
              PDF (prototype)
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Cite */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 rounded-full">
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
          <Button variant="outline" size="sm" className="gap-2 rounded-full">
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
