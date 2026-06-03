import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-serif-display text-2xl font-bold tracking-tight">
            Akademik Dergi
          </span>
          <span className="hidden text-xs uppercase tracking-widest text-muted-foreground sm:inline">
            açık erişim
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-secondary"
            activeOptions={{ exact: true }}
            activeProps={{ className: "font-semibold" }}
          >
            Makaleler
          </Link>
          <Link
            to="/dashboard"
            className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-secondary"
            activeProps={{ className: "font-semibold" }}
          >
            Editör Paneli
          </Link>
          <Link
            to="/auth"
            className="ml-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Giriş Yap
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="font-serif-display text-lg font-bold">Akademik Dergi</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Açık erişimli, hakemli, Türkçe akademik yayın platformu.
            </p>
          </div>
          <div className="text-sm">
            <div className="mb-2 font-semibold">Bağlantılar</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>Yazar Rehberi</li>
              <li>Hakem Süreci</li>
              <li>Etik İlkeler</li>
            </ul>
          </div>
          <div className="text-sm">
            <div className="mb-2 font-semibold">Lisans</div>
            <p className="text-muted-foreground">
              Tüm içerikler CC BY 4.0 lisansı ile yayımlanır.
            </p>
          </div>
        </div>
        <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
          <Search className="h-3 w-3" /> ISSN 0000-0000 · DOI 10.62847/akademik
        </div>
      </div>
    </footer>
  );
}
