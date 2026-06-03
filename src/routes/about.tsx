import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Hakkında — Akademik Yayın Platformu" },
      { name: "description", content: "Akademik Yayın Platformu hakkında: misyon, yayın modeli ve açık erişim ilkesi." },
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Platform</p>
          <h1 className="mt-3 font-serif-display text-4xl font-bold tracking-tight">
            Platform Hakkında
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Birden çok hakemli akademik derginin tek çatı altında yönetildiği, açık erişimli bir yayın altyapısı.
          </p>
        </div>
      </header>

      <main className="article-prose mx-auto max-w-3xl px-6 py-12">
        <h2>Misyonumuz</h2>
        <p>
          Akademik Yayın Platformu, farklı disiplinlerden dergileri ortak bir editöryal ve teknik altyapıda buluşturarak; araştırmacılara güvenilir, hızlı ve ücretsiz erişilebilir bir yayın deneyimi sunmayı amaçlar.
        </p>

        <h2>Yayın Modelimiz</h2>
        <p>
          Sürekli yayın (continuous publishing) modelini benimsiyoruz: kabul edilen makaleler, bir sayı beklenmeksizin yayımlanır. Her makaleye kalıcı bir DOI atanır ve içerikler açık erişimle sunulur.
        </p>
        <p>
          Hakem değerlendirmesi titizlikle ve gizlilik içinde yürütülür; hakem raporları kamuya açıklanmaz. Bu yaklaşım, değerlendirmenin bağımsızlığını korurken yayımlanan içeriğin niteliğini güvence altına alır.
        </p>

        <h2>Açık Erişim</h2>
        <p>
          Yayımlanan tüm makaleler CC BY 4.0 lisansıyla açık erişime sunulur. Yazarlar eserlerinin telif hakkını korur; okuyucular içeriği kaynak göstererek özgürce kullanabilir.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
