import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CF Open" },
      { name: "description", content: "About CF Open: our mission, publishing model, and open access policy." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-serif-display text-4xl font-bold tracking-tight">
            About CF Open
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            An open access publishing platform bringing peer-reviewed academic journals together under one roof.
          </p>
        </div>
      </header>

      <main className="article-prose mx-auto max-w-3xl px-6 py-12">
        <h2>Our Mission</h2>
        <p>
          CF Open brings journals from different disciplines together on a shared editorial and technical infrastructure, offering researchers a publishing experience that is reliable, fast, and free to access.
        </p>

        <h2>Publishing Model</h2>
        <p>
          We follow a continuous publishing model: accepted articles are published as soon as they are ready, without waiting for an issue to close. Every article is assigned a permanent DOI and made available open access.
        </p>
        <p>
          Peer review is conducted rigorously and in confidence; reviewer reports are not made public. This approach protects the independence of the review process while safeguarding the quality of published work.
        </p>

        <h2>Open Access</h2>
        <p>
          All articles are published open access under the CC BY 4.0 license. Authors retain copyright of their work, and readers are free to reuse the content with proper attribution.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
