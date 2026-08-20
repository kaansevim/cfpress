// robots.txt ve sitemap.xml — sunucu tarafında üretilir.
//
// NEDEN ÖNEMLİ: OJS arayüzünü arama motorlarına kapattık. Artık makalelerin
// Google ve Google Scholar'da bulunması tamamen cf.org.tr'ye bağlı. Yeni bir
// alan adına dışarıdan bağlantı gelmediği için tarayıcılar sayfaları kendi
// başlarına zor keşfeder; site haritası bu yüzden var.
//
// Harita her istekte OJS'ten üretilir (makale listesi zaten 10 dakika
// önbellekli), böylece yeni makale yayınlandığında elle güncelleme gerekmez.
//
// Bu dosya sunucu girişinden (src/server.ts) çağrılır.

import { journalNav, journals } from "./journals";
import { SITE_ORIGIN } from "./seo";

const origin = SITE_ORIGIN.replace(/\/+$/, "");

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const parts = [`    <loc>${xmlEscape(origin + entry.path)}</loc>`];
      if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
      if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      if (entry.priority) parts.push(`    <priority>${entry.priority}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function buildSitemap(): Promise<string> {
  const entries: SitemapEntry[] = [
    { path: "/", changefreq: "daily", priority: "1.0" },
    { path: "/journals", changefreq: "weekly", priority: "0.8" },
    { path: "/about", changefreq: "monthly", priority: "0.5" },
  ];

  for (const journal of journals) {
    entries.push({
      path: `/journal/${journal.slug}`,
      changefreq: "weekly",
      priority: "0.9",
    });
    for (const group of journalNav) {
      entries.push({
        path: `/journal/${journal.slug}/${group.section}`,
        changefreq: "monthly",
        priority: "0.6",
      });
    }
  }

  // Makaleler. OJS'e ulaşılamazsa harita statik sayfalarla yayınlanır;
  // boş bir yanıt döndürmek tarayıcıya "burada içerik yok" demek olurdu.
  try {
    const { listArticles } = await import("./ojs.server");
    const lists = await Promise.all(
      journals.map((journal) =>
        listArticles(journal.ojsPath, journal.slug).catch(() => []),
      ),
    );
    for (const list of lists) {
      for (const article of list) {
        entries.push({
          path: `/journal/${article.journalSlug}/article/${article.id}`,
          lastmod: article.publishedAt || undefined,
          changefreq: "yearly",
          priority: "0.8",
        });
      }
    }
  } catch (error) {
    console.error("[sitemap] makaleler alınamadı:", error);
  }

  return renderSitemap(entries);
}

const ROBOTS = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

/**
 * İstek robots.txt veya sitemap.xml ise yanıtı döner, değilse null döner.
 */
export async function handleSeoRequest(request: Request): Promise<Response | null> {
  if (request.method !== "GET" && request.method !== "HEAD") return null;

  let pathname: string;
  try {
    pathname = new URL(request.url).pathname;
  } catch {
    return null;
  }

  if (pathname === "/robots.txt") {
    return new Response(ROBOTS, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=86400",
      },
    });
  }

  if (pathname === "/sitemap.xml") {
    try {
      return new Response(await buildSitemap(), {
        headers: {
          "content-type": "application/xml; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      });
    } catch (error) {
      console.error("[sitemap] üretilemedi:", error);
      return new Response("Sitemap unavailable", { status: 500 });
    }
  }

  return null;
}
