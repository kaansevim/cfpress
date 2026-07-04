// OJS (dergi yönetim sistemi) bağlantı adresleri — tek yerden yönetilir.
//
// VITE_OJS_URL          : OJS'in dışarıdan erişilen adresi (varsayılan: https://dergi.cf.org.tr)
// VITE_OJS_JOURNAL_PATH : Opsiyonel. Belirli bir derginin OJS'teki path'i (örn. "jss").
//                         Boş bırakılırsa site geneli sayfalara bağlanır.
//
// Bu değerler build sırasında gömülür; değiştirmek için .env dosyasına yazıp
// frontend'i yeniden build edin (docker compose build frontend).

const base = (import.meta.env.VITE_OJS_URL ?? "https://dergi.cf.org.tr").replace(/\/+$/, "");
const journal = (import.meta.env.VITE_OJS_JOURNAL_PATH ?? "").trim();

/** OJS kök adresi (dergi listesi) */
export const OJS_URL = `${base}/index.php/index`;

/** Editör / hakem / yazar giriş sayfası */
export const OJS_LOGIN_URL = `${base}/index.php/${journal || "index"}/login`;

/** Makale gönderim sayfası (dergi belirtilmemişse dergi listesine gider) */
export const OJS_SUBMIT_URL = journal
  ? `${base}/index.php/${journal}/about/submissions`
  : OJS_URL;
