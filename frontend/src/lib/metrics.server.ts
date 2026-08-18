// Makale metrikleri — görüntülenme ve indirme sayacı. Yalnızca sunucuda çalışır.
//
// NEDEN BURADA SAYIYORUZ: Okuyucu cf.org.tr'de olduğu için OJS bu ziyaretleri
// göremez. OJS'in sayacı yalnızca kendi sayfalarına gelen trafiği ölçer.
// İki ayrı ve ikisi de eksik sayı yerine tek doğru kaynak burasıdır.
//
// NEDEN DOSYA, NEDEN VERİTABANI DEĞİL: Ek servis, ek parola ve şema göçü
// gerektirmez. Sayaç, konteyner yeniden derlense bile silinmesin diye kalıcı
// bir dizine yazılır (docker-compose'daki frontend_data volume'u).
//
// Ortam değişkeni: METRICS_DIR (varsayılan /data)
//
// Atıf sayısı BURADA TUTULMAZ: o veri Crossref'ten gelir ve DOI alınmadan
// var olamaz. Uydurma atıf sayısı gösterilmeyecek.

import process from "node:process";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export interface ArticleMetrics {
  views: number;
  downloads: number;
}

type Store = Record<string, ArticleMetrics>;

const EMPTY: ArticleMetrics = { views: 0, downloads: 0 };

function filePath(): string {
  return join(process.env.METRICS_DIR ?? "/data", "metrics.json");
}

function key(journalSlug: string, articleId: string): string {
  return `${journalSlug}:${articleId}`;
}

/* --------------------------- Bellek içi durum ----------------------------- */

let store: Store | null = null;
let loading: Promise<Store> | null = null;
let dirty = false;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
/** Disk yazılamıyorsa (izin yok, volume bağlı değil) sayaç bellekte devam eder. */
let diskAvailable = true;

async function load(): Promise<Store> {
  if (store) return store;
  if (loading) return loading;
  loading = (async () => {
    try {
      const raw = await readFile(filePath(), "utf8");
      const parsed = JSON.parse(raw) as Store;
      store = parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      // Dosya henüz yoksa sıfırdan başlanır — hata değil.
      store = {};
    }
    return store;
  })();
  return loading;
}

async function flush(): Promise<void> {
  if (!dirty || !store || !diskAvailable) return;
  dirty = false;
  const path = filePath();
  const snapshot = JSON.stringify(store);
  try {
    await mkdir(dirname(path), { recursive: true });
    // Önce geçici dosyaya yazıp taşıyoruz: yazma sırasında kesinti olursa
    // mevcut sayaç dosyası bozulmaz.
    const tmp = `${path}.tmp`;
    await writeFile(tmp, snapshot, "utf8");
    await rename(tmp, path);
  } catch (error) {
    diskAvailable = false;
    console.error("[metrics] diske yazılamadı, sayaç bellekte tutuluyor:", error);
  }
}

/** Yazmayı topluyoruz: her tıklamada diske gitmek yerine 5 saniyede bir. */
function scheduleFlush(): void {
  dirty = true;
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, 5_000);
}

/* -------------------------------- Genel API -------------------------------- */

export async function increment(
  journalSlug: string,
  articleId: string,
  field: keyof ArticleMetrics,
): Promise<ArticleMetrics> {
  const s = await load();
  const k = key(journalSlug, articleId);
  const current = s[k] ?? { ...EMPTY };
  const next = { ...current, [field]: (current[field] ?? 0) + 1 };
  s[k] = next;
  scheduleFlush();
  return next;
}

export async function getMany(
  journalSlug: string,
  articleIds: string[],
): Promise<Record<string, ArticleMetrics>> {
  const s = await load();
  const out: Record<string, ArticleMetrics> = {};
  for (const id of articleIds) out[id] = s[key(journalSlug, id)] ?? { ...EMPTY };
  return out;
}

export async function getAll(): Promise<Store> {
  return { ...(await load()) };
}
