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
import { OJS_LOGIN_URL, OJS_SUBMIT_URL } from "@/lib/ojs";

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
          <DropdownMenuContent
            align="start"
            className="max-h-[70vh] overflow-y-auto"
            // Menü kapanırken odağın tetik butonuna dönmesi sayfayı yukarı
            // kaydırıp anchor'a gidişi iptal ediyordu — engelliyoruz.
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            {group.items.map((item) => (
              <DropdownMenuItem key={item} asChild>
                <Link
                  to="/journal/$slug/$section"
                  params={{ slug, section: group.section }}
                  hash={navItemSlug(item)}
                  hashScrollIntoView={{ behavior: "smooth", block: "start" }}
                  className="cursor-pointer"
                >
                  {item}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
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
                  hashScrollIntoView={{ behavior: "smooth", block: "start" }}
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
    </div>
  );
}

/* -------------------------------- SiteHeader ------------------------------ */

export function SiteHeader({ journal, flush }: { journal?: Journal; flush?: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={flush ? "bg-transparent" : "border-b border-border bg-background"}>
      {journal ? (
        <div className="border-b border-border bg-accent/5">
          <div className="mx-auto max-w-6xl px-4 py-1.5 sm:px-6">
            <Link
              to="/"
              onClick={close}
              className="text-xs font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              CF Open
            </Link>
          </div>
        </div>
      ) : (
        // Dergi sayfalarındaki üst şeritle aynı yükseklikte görünmez boşluk —
        // ana sayfa header'ı dergi sayfalarındaki hizada dursun diye.
        <div className="border-b border-transparent" aria-hidden>
          <div className="mx-auto max-w-6xl px-4 py-1.5 sm:px-6">
            <span className="invisible text-xs font-medium tracking-wide">CF Open</span>
          </div>
        </div>
      )}
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
              CF Open
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
              href={OJS_LOGIN_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </a>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
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
            {journal && (
              <a
                href={OJS_SUBMIT_URL}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Submit article
              </a>
            )}
            <a
              href={OJS_LOGIN_URL}
              target="_blank"
              rel="noreferrer"
              className="block rounded-md px-3 py-2 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Sign in
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
            <div className="font-serif-display text-lg font-bold">CF Open</div>
            <p className="mt-2 text-sm text-muted-foreground">
              A publishing platform hosting peer-reviewed, open access academic journals.
            </p>
          </div>

          <div className="text-sm">
            <div className="mb-2 font-semibold">Explore</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <Link to="/journals" className="transition-colors hover:text-foreground">
                  Journals
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <div className="mb-2 font-semibold">Editorial Office</div>
            <p className="text-muted-foreground">
              CF Education and Consulting
              <br />
              ASBU Sosyokent No: 209
              <br />
              Altındağ - Ankara - Türkiye
              <br />
              <a
                href="https://cfdanismanlik.com.tr/"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                cfdanismanlik.com.tr
              </a>
              <br />
              <a href="tel:+908503033719" className="transition-colors hover:text-foreground">
                +90 850 303 37 19
              </a>
            </p>
          </div>

          <div className="text-sm">
            <div className="mb-2 font-semibold">License & Access</div>
            <p className="text-muted-foreground">
              All content is published open access under the CC BY 4.0 license.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} CF Open
        </div>
      </div>
    </footer>
  );
}
