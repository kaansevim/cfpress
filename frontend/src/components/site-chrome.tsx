import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { journalNav, navItemSlug, type Journal } from "@/lib/journals";

/* ----------------------------- Platform Header ---------------------------- */

const platformLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/journals", label: "Journals", exact: false },
  { to: "/about", label: "About", exact: false },
] as const;

function PlatformNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {platformLinks.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          onClick={onNavigate}
          className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary sm:inline-block"
          activeOptions={l.exact ? { exact: true } : undefined}
          activeProps={{ className: "font-semibold" }}
        >
          {l.label}
        </Link>
      ))}
    </>
  );
}

/* ------------------------------ Journal Header ---------------------------- */

function JournalDesktopNav({ slug }: { slug: string }) {
  return (
    <nav className="hidden items-center gap-1 text-sm lg:flex">
      {journalNav.map((group) => (
        <DropdownMenu key={group.section}>
          <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-foreground outline-none transition-colors hover:bg-secondary data-[state=open]:bg-secondary">
            {group.label}
            <ChevronDown className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-[70vh] overflow-y-auto">
            {group.items.map((item) => (
              <DropdownMenuItem key={item} asChild>
                <Link
                  to="/journal/$slug/$section"
                  params={{ slug, section: group.section }}
                  hash={navItemSlug(item)}
                  className="cursor-pointer"
                >
                  {item}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
      <Link
        to="/"
        className="ml-1 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        Platform
      </Link>
    </nav>
  );
}

function JournalMobileNav({ slug, onNavigate }: { slug: string; onNavigate: () => void }) {
  return (
    <div className="space-y-3">
      {journalNav.map((group) => (
        <div key={group.section}>
          <Link
            to="/journal/$slug/$section"
            params={{ slug, section: group.section }}
            onClick={onNavigate}
            className="block rounded-md px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            {group.label}
          </Link>
          <ul className="ml-3 border-l border-border pl-3">
            {group.items.map((item) => (
              <li key={item}>
                <Link
                  to="/journal/$slug/$section"
                  params={{ slug, section: group.section }}
                  hash={navItemSlug(item)}
                  onClick={onNavigate}
                  className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link
        to="/"
        onClick={onNavigate}
        className="block rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        Platform
      </Link>
    </div>
  );
}

/* -------------------------------- SiteHeader ------------------------------ */

export function SiteHeader({ journal }: { journal?: Journal }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        {journal ? (
          <Link
            to="/journal/$slug"
            params={{ slug: journal.slug }}
            className="flex items-baseline gap-2"
            onClick={close}
          >
            <span className="font-serif-display text-lg font-bold leading-tight tracking-tight sm:text-xl">
              {journal.name}
            </span>
            {journal.shortName && (
              <span className="hidden text-xs uppercase tracking-widest text-muted-foreground sm:inline">
                {journal.shortName}
              </span>
            )}
          </Link>
        ) : (
          <Link to="/" className="flex items-baseline gap-2" onClick={close}>
            <span className="font-serif-display text-xl font-bold tracking-tight sm:text-2xl">
              Akademik Yayın Platformu
            </span>
          </Link>
        )}

        {/* Desktop nav & actions */}
        <div className={journal ? "hidden items-center gap-6 lg:flex" : "hidden items-center gap-6 sm:flex"}>
          {journal ? (
            <JournalDesktopNav slug={journal.slug} />
          ) : (
            <nav className="flex items-center gap-1">
              <PlatformNav />
            </nav>
          )}

          <div className="flex items-center gap-4 border-l border-border pl-6">
            <a
              href="http://localhost:8080/index.php/test/login"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Editör Girişi
            </a>
            <a
              href="http://localhost:8080/index.php/test/about/submissions"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Makale Gönder
            </a>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menüyü aç/kapat"
          aria-expanded={open}
          className={journal ? "rounded-md p-2 hover:bg-secondary lg:hidden" : "rounded-md p-2 hover:bg-secondary sm:hidden"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav className={journal ? "border-t border-border px-4 py-3 lg:hidden" : "border-t border-border px-4 py-3 sm:hidden"}>
          {journal ? (
            <JournalMobileNav slug={journal.slug} onNavigate={close} />
          ) : (
            <PlatformNav onNavigate={close} />
          )}

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <a
              href="http://localhost:8080/index.php/test/about/submissions"
              target="_blank"
              rel="noreferrer"
              className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Makale Gönder
            </a>
            <a
              href="http://localhost:8080/index.php/test/login"
              target="_blank"
              rel="noreferrer"
              className="block rounded-md px-3 py-2 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Editör Girişi
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

/* -------------------------------- SiteFooter ------------------------------ */
// NOT: Footer içeriği (Yayın Ofisi adresi, ISSN, iletişim) GEÇİCİ placeholder'dır.
// Kullanıcı gerçek bilgileri verince güncellenecektir.

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-serif-display text-lg font-bold">Akademik Yayın Platformu</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Birden çok hakemli, açık erişimli akademik derginin yönetildiği yayın platformu.
            </p>
          </div>

          <div className="text-sm">
            <div className="mb-2 font-semibold">Platform</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <Link to="/journals" className="transition-colors hover:text-foreground">
                  Dergiler
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-foreground">
                  Hakkında
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <div className="mb-2 font-semibold">Yayın Ofisi</div>
            {/* GEÇİCİ — kullanıcının vereceği gerçek adresle değiştirilecek */}
            <p className="text-muted-foreground">
              Yayın Ofisi Adresi (placeholder)
              <br />
              Şehir, Ülke
              <br />
              info@ornek-platform.org
            </p>
          </div>

          <div className="text-sm">
            <div className="mb-2 font-semibold">Lisans & Erişim</div>
            <p className="text-muted-foreground">
              Tüm içerikler CC BY 4.0 lisansı ile açık erişimle yayımlanır.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          {/* GEÇİCİ ISSN/telif bilgisi */}
          ISSN 0000-0000 (Basılı) · e-ISSN 0000-0001 (Çevrimiçi) · © {new Date().getFullYear()} Akademik Yayın Platformu
        </div>
      </div>
    </footer>
  );
}
