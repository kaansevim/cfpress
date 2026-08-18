// OJS (dergi yönetim sistemi) bağlantı adresleri — tek yerden yönetilir.
//
// VITE_OJS_URL          : OJS'in dışarıdan erişilen adresi (varsayılan: https://dergi.cf.org.tr)
// VITE_OJS_JOURNAL_PATH : Opsiyonel. Site geneli butonlar için varsayılan dergi path'i.
//                         Boş bırakılırsa site geneli sayfalara bağlanır.
//
// Dergi sayfalarındaki butonlar bu değere DEĞİL, ilgili derginin kendi
// `ojsPath` alanına bakar (bkz. lib/journals.ts). Yani her dergi kendi
// gönderim sayfasına gider; yeni dergi eklendiğinde ek kod gerekmez.
//
// Bu değerler build sırasında gömülür; değiştirmek için .env dosyasına yazıp
// frontend'i yeniden build edin (docker compose up -d --build frontend).

const base = (import.meta.env.VITE_OJS_URL ?? "https://dergi.cf.org.tr").replace(/\/+$/, "");
const defaultJournal = (import.meta.env.VITE_OJS_JOURNAL_PATH ?? "").trim();

/** OJS kök adresi (dergi listesi) */
export const OJS_URL = `${base}/index.php/index`;

/** Belirli bir derginin OJS anasayfası (path verilmezse dergi listesi) */
export const ojsJournalUrl = (path?: string) =>
  path ? `${base}/index.php/${path}` : OJS_URL;

/** Editör / hakem / yazar giriş sayfası */
export const ojsLoginUrl = (path?: string) =>
  `${base}/index.php/${path || defaultJournal || "index"}/login`;

/** Makale gönderim sayfası (dergi belirtilmemişse dergi listesine gider) */
export const ojsSubmitUrl = (path?: string) => {
  const p = path || defaultJournal;
  return p ? `${base}/index.php/${p}/about/submissions` : OJS_URL;
};

/* --- Site geneli (belirli bir dergiye ait olmayan) bağlantılar --- */

/** Site geneli giriş bağlantısı — üst menüdeki "Sign in" için */
export const OJS_LOGIN_URL = ojsLoginUrl();

/** Site geneli gönderim bağlantısı — dergi seçilmemiş bağlamlar için */
export const OJS_SUBMIT_URL = ojsSubmitUrl();
