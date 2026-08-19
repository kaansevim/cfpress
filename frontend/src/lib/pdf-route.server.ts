// Makale PDF'ini kendi adresimizden yayınlar.
//
// Adres: /journal/{dergi}/article/{id}/pdf        → tarayıcıda açılır
//        /journal/{dergi}/article/{id}/pdf?download=1 → dosya olarak iner
//
// NEDEN GEREKLİ: OJS galley dosyalarını her zaman "attachment" başlığıyla
// gönderiyor. Adresi doğrudan verdiğimizde tarayıcı dosyayı indiriyor,
// göstermiyor. Ayrıca telefon tarayıcıları PDF'i çerçeve içinde
// kaydırmıyor — yalnızca ilk sayfayı gösteriyor. Bu yüzden PDF'in kendi
// adresi olması gerekiyor: telefonda tarayıcının kendi okuyucusu açılıyor,
// masaüstünde aynı adres yandaki panele yükleniyor.
//
// Bu dosya sunucu girişinden (src/server.ts) çağrılır; TanStack yönlendiricisi
// devreye girmeden önce isteği yakalar.

import { Buffer } from "node:buffer";

import { getJournal } from "./journals";

const PDF_PATH = /^\/journal\/([a-z0-9-]+)\/article\/([^/]+)\/pdf\/?$/i;

function notFound(): Response {
  return new Response("Not found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

/**
 * İstek bir PDF adresiyse yanıtı döner, değilse null döner ve istek
 * normal akışına devam eder.
 */
export async function handleArticlePdfRequest(request: Request): Promise<Response | null> {
  if (request.method !== "GET" && request.method !== "HEAD") return null;

  let pathname: string;
  let search: URLSearchParams;
  try {
    const url = new URL(request.url);
    pathname = url.pathname;
    search = url.searchParams;
  } catch {
    return null;
  }

  const match = PDF_PATH.exec(pathname);
  if (!match) return null;

  const [, slug, id] = match;
  const journal = getJournal(slug.toLowerCase());
  if (!journal) return notFound();

  try {
    const { getArticleById, fetchArticlePdf } = await import("./ojs.server");
    const article = await getArticleById(journal.ojsPath, journal.slug, id);
    if (!article?.pdfPath) return notFound();

    const pdf = await fetchArticlePdf(article);
    if (!pdf) return notFound();

    const bytes = Buffer.from(pdf.base64, "base64");
    const disposition = search.get("download") ? "attachment" : "inline";

    return new Response(request.method === "HEAD" ? null : new Uint8Array(bytes), {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `${disposition}; filename="${pdf.filename}"`,
        "content-length": String(bytes.byteLength),
        // Yayınlanmış makale değişmez; okuyucu ve ara sunucular bir saat tutabilir.
        "cache-control": "public, max-age=3600",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[pdf] yayınlanamadı:", error);
    return new Response("The PDF could not be loaded.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
