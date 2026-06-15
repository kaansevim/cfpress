import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export function InfoPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-serif-display text-4xl font-bold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro}</p>
        </div>
      </header>

      <main className="article-prose mx-auto max-w-3xl px-6 py-12">{children}</main>

      <SiteFooter />
    </div>
  );
}
