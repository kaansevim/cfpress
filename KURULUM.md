# Kurulum ve Yönetim Rehberi

## Mimari

```
                    Cloudflare (SSL, Always Use HTTPS)
                              │
                 Sunucudaki reverse proxy (hostingci yönetir)
                    │                        │
   cf.org.tr → 127.0.0.1:3000    dergi.cf.org.tr → 127.0.0.1:8080
                    │                        │
             ┌──────────────┐        ┌──────────────┐     ┌─────────┐
             │   frontend   │        │     OJS      │ ──▶ │ MariaDB │
             │ (tanıtım UI) │        │ (dergi yön.) │     │   db    │
             └──────────────┘        └──────────────┘     └─────────┘
                        tek docker compose içinde
```

- **frontend/** — Tanıtım sitesi (TanStack Start). Docker'da production
  build ile çalışır; Netlify deploy'u etkilenmez (preset otomatik seçilir).
- **ojs/config/** — OJS ayar şablonu, Apache HTTPS algılama, DB karakter seti.
- **kurulum.sh** — Sunucuda tek komutla kurulum (hostingci çalıştırır).
- **HOSTING-NOTU.md** — Hostingciye gönderilecek talimatlar.

## OJS'i sıfırdan kurma (web sihirbazı)

Hostingci `kurulum.sh`'i çalıştırıp yönlendirmeyi düzelttikten sonra:

1. `https://dergi.cf.org.tr` adresini açın → OJS kurulum sihirbazı gelir.
2. **Yönetici hesabı**: kullanıcı adı, güçlü parola ve e-posta girin.
   (Bu site yöneticisi hesabıdır — bilgileri güvenle saklayın.)
3. **Diller**: Birincil dil olarak Türkçe'yi seçebilirsiniz; İngilizce'yi de
   ek dil olarak işaretlemenizi öneririz.
4. **Dosya dizini** (Directory for uploads): `/var/www/files`
5. **Veritabanı** (bilgileri hostingciden alın, script ekrana yazar):
   - Sürücü: `mysqli`
   - Sunucu: `db`
   - Kullanıcı: `ojs`
   - Parola: (hostingcinin ilettiği `OJS_DB_PASSWORD`)
   - Veritabanı adı: `ojs`
   - **"Create new database" işaretini kaldırın** (veritabanı zaten var)
   - "Beacon" isteğe bağlıdır.
6. **Install** deyin. Açılan sayfada admin bilgileriyle giriş yapın.

## Kurulumdan sonra: dergileri oluşturma

1. Giriş yapın → sağ üst menü → **Administration → Hosted Journals →
   Create Journal**.
2. Her dergi için ad, kısaltma ve **Path** girin. Önerilen path'ler
   (frontend'deki dergilerle uyumlu):
   - Journal of Social Solutions → `jss`
   - Journal of Cognitive Formation → `jcf`
   - Journal of Economic Change and Future → `jecf`
   - Journal of Community & Foundations → `jcfo`
3. Dergi adresleri şöyle olur:
   `https://dergi.cf.org.tr/index.php/jss` vb.

### Frontend butonlarını bir dergiye bağlama (opsiyonel)

"Makale Gönder" butonu varsayılan olarak OJS dergi listesine gider. Tek bir
dergiye gitmesini isterseniz sunucudaki `.env` dosyasında:

```
OJS_JOURNAL_PATH=jss
```

yazıp `docker compose up -d --build frontend` çalıştırılmalı (hostingciden
istenebilir).

## Sık kullanılan komutlar (sunucuda)

```bash
docker compose ps                # servis durumları
docker compose logs -f ojs      # OJS logları
docker compose up -d --build     # kod güncellemesinden sonra
docker compose restart ojs      # OJS'i yeniden başlat
```

## Veriler nerede?

| Veri | Yer | Kalıcı mı? |
|---|---|---|
| Veritabanı | `ojs_db_data` volume | ✔ |
| Yüklenen makaleler/dosyalar | `ojs_files` volume | ✔ |
| Dergi görselleri (public) | `ojs_public` volume | ✔ |
| OJS ayarları | `ojs/config/ojs.config.inc.php` (sunucuda) | ✔ |

Konteynerler silinip yeniden oluşturulsa bile bunlar korunur. Yedekleme için
bu volume'lar ve config dosyası yeterlidir.

## E-posta (önemli)

OJS'in davet/bildirim e-postaları gönderebilmesi için SMTP ayarlanmalıdır.
Sunucudaki `ojs/config/ojs.config.inc.php` içinde `[email]` bölümünde
`smtp` satırlarını açıp bir SMTP hesabı girin, ardından
`docker compose restart ojs`. (Ayarlanmazsa e-postalar büyük ihtimalle
gönderilmez ya da spam'e düşer.)

## Sorun giderme

- **dergi.cf.org.tr tanıtım sitesini açıyor** → reverse proxy hâlâ 3000'e
  yönlendiriyor; HOSTING-NOTU.md'deki 2. adım yapılmamış.
- **Yönlendirme döngüsü (redirect loop)** → Cloudflare SSL modu "Flexible"
  kalmış; "Full" yapılmalı.
- **OJS http:// linkler üretiyor / karışık içerik uyarısı** → proxy
  `X-Forwarded-Proto` header'ını iletmiyor (HOSTING-NOTU.md'deki nginx
  ayarına bakın).
- **Büyük PDF yüklenemiyor** → proxy'de `client_max_body_size` düşük.
