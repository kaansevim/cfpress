import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Giriş Yap — Akademik Dergi" },
      { name: "description", content: "ORCID veya e-posta ile Akademik Dergi'ye giriş yapın." },
    ],
  }),
  component: AuthPage,
});

function OrcidIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden>
      <circle cx="128" cy="128" r="128" fill="#A6CE39" />
      <g fill="#fff">
        <rect x="86" y="98" width="14" height="100" rx="2" />
        <circle cx="93" cy="78" r="9" />
        <path d="M115 98h47c30 0 50 22 50 50s-20 50-50 50h-47V98zm14 14v72h32c22 0 36-16 36-36s-14-36-36-36h-32z" />
      </g>
    </svg>
  );
}

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16">
        <h1 className="font-serif-display text-3xl font-bold">Hesabınıza giriş yapın</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Araştırmacılar için ORCID ile tek tıkla giriş öneriyoruz.
        </p>

        <button
          type="button"
          className="mt-8 inline-flex items-center justify-center gap-3 rounded-md border border-border px-4 py-3 text-sm font-semibold transition-all hover:shadow-md"
          style={{ background: "var(--color-orcid)", color: "var(--color-orcid-foreground)" }}
        >
          <OrcidIcon className="h-6 w-6" />
          ORCID ile Giriş Yap
        </button>

        <p className="mt-2 text-xs text-muted-foreground">
          ORCID; araştırmacılara özel, kalıcı bir dijital tanımlayıcıdır.
        </p>

        <div className="my-8 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          veya
          <span className="h-px flex-1 bg-border" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ad.soyad@universite.edu.tr"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Giriş Yap
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link to="/auth" className="font-medium text-accent hover:underline">
            Kayıt olun
          </Link>
        </p>
      </main>
    </div>
  );
}
