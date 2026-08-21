# CF Open — Kurulum ve Yönetim Rehberi

_Son güncelleme: 21 Ağustos 2026_

## Mimari

```
                    Cloudflare (SSL, Always Use HTTPS)
                              │
                   Sunucudaki reverse proxy
                    │                        │
   cf.org.tr → 127.0.0.1:3000    dergi.cf.org.tr → 127.0.0.1:8080
                    │                        │
             ┌──────────────┐        ┌──────────────┐     ┌─────────┐
             │   frontend   │ ──API─▶│     OJS      │ ──▶ │ MariaDB │
             │  (okuyucu)   │        │  (yönetim)   │     │   db    │
             └──────────────┘        └──────────────┘     └─────────┘
                        tek docker compose içinde
```

**Rol dağılımı:**

- **OJS** motordur: makale gönderimi, hakem süreci, dosyalar, kullanıcılar.
  Tek doğru veri kaynağı burasıdır.
- **frontend (cf.org.tr)** okuyucu yüzüdür: makaleleri OJS'in API'sinden
  çeker, JATS XML'i kendi tasarımıyla gösterir. OJS'e hiçbir şey yazmaz.

Bu ayrım bilinçlidir: OJS'in kendi arayüzünü giydirmek yerine (DergiPark'ın
yaptığı gibi) önüne kendi sitemizi koyduk. Bedeli aradaki köprü, kazancı
tasarım özgürlüğü.

## Klasörler

| Yol | Ne işe yarar |
|---|---|
| `frontend/` | Okuyucu sitesi (TanStack Start) |
| `frontend/src/lib/ojs.server.ts` | OJS API istemcisi (sunucu tarafı) |
| `frontend/src/lib/metrics.server.ts` | Görüntülenme/indirme sayacı |
| `ojs/config/` | OJS ayar şablonu, Apache ve veritabanı ayarları |
| `ojs/plugins/generic/cfOpenBranding/` | OJS yönetim ve gönderim ekranlarının CF Open kimliği |
| `kurulum.sh` | Sıfırdan sunucu kurulumu |

## Belgeler

| Dosya | İçerik |
|---|---|
| `YAYIN-AKISI.md` | Makale dosyaları nereye yüklenir, yol haritası |
| `SUNUCU-GUNCELLEME.md` | Sunucuya güncelleme çıkma adımları + yedekleme |
| `DERGI-AYAR-SABLONU.md` | Yeni dergi açarken kullanılacak hazır metinler |

## Yayın akışı (günlük kullanım)

1. Yazar OJS'ten makale gönderir
2. Editör hakem sürecini OJS'te yürütür
3. Kabul edilen makaleye **Production** aşamasında galley eklenir:
   - `PDF` etiketli galley → `makale.pdf`
   - `XML` etiketli galley → `makale.xml` (JATS)
   - Şekiller XML galley'in altına **dependent file** olarak, **PNG/JPG** biçiminde
4. Makale sayıya atanır, sayı yayınlanır
5. cf.org.tr en geç 10 dakika içinde makaleyi kendiliğinden gösterir

> Etiketler tam olarak `PDF` ve `XML` olmalıdır; frontend galley'leri bu
> isimlerle tanır.

**Yeni makale için sunucuya dokunmak gerekmez.** Kod değişmediği sürece
yeniden derleme yapılmaz.

## Sunucudaki gerekli ayarlar

`.env` içinde:

```
OJS_DB_PASSWORD=...
OJS_DB_ROOT_PASSWORD=...
OJS_DOMAIN=dergi.cf.org.tr
OJS_PUBLIC_URL=https://dergi.cf.org.tr
OJS_INTERNAL_URL=http://ojs
OJS_API_TOKEN=...        # OJS → Profil Düzenle → API Anahtarı
BIND_IP=127.0.0.1
```

`ojs/config/ojs.config.inc.php` içinde:

```
allowed_hosts = '["dergi.cf.org.tr", "ojs"]'
```

SMTP ayarları da aynı dosyanın `[email]` bölümündedir.

## OJS backend kimliğini etkinleştirme

`cfOpenBranding` eklentisi Docker ile OJS'in generic plugin klasörüne salt
okunur bağlanır; OJS core dosyalarını değiştirmez. İlk kurulumdan veya bu
mount'u ekleyen güncellemeden sonra:

1. `docker compose up -d --force-recreate ojs` çalıştırın.
2. OJS'te **Administration → Site Settings → Plugins → Generic Plugins**
   bölümüne gidin.
3. **CF Open Backend Branding** eklentisini bir kez etkinleştirin.
4. OJS önbelleğini temizleyip tarayıcıda sert yenileme yapın.

Eklenti aktif journal path'ini otomatik algılar: `jss` mavi, `jcf` mor,
`jecf` kahve/altın, `jcfo` bordo. Ayrıntılar ve güvenli geri alma adımları
`ojs/plugins/generic/cfOpenBranding/README.md` dosyasındadır.

## Sık kullanılan komutlar

```bash
docker compose ps                      # servis durumları
docker compose logs -f --tail=100 frontend
docker compose logs -f --tail=100 ojs
docker compose restart ojs
docker compose up -d --build frontend  # kod güncellemesinden sonra
```

> ⚠️ **`docker compose down -v` ASLA çalıştırılmaz.** Veritabanını ve yüklenen
> tüm makale dosyalarını siler.

## Veriler nerede?

| Veri | Yer | Kalıcı mı? |
|---|---|---|
| Veritabanı | `ojs_db_data` volume | ✔ |
| Yüklenen makale dosyaları | `ojs_files` volume | ✔ |
| Dergi görselleri | `ojs_public` volume | ✔ |
| Görüntülenme/indirme sayacı | `frontend_data` volume | ✔ |
| OJS ayarları | `ojs/config/ojs.config.inc.php` | ✔ |

Yedekleme adımları `SUNUCU-GUNCELLEME.md` dosyasındadır.

## Sorun giderme

- **cf.org.tr'de makale görünmüyor** → `.env` içinde `OJS_API_TOKEN` var mı,
  `allowed_hosts` listesinde `"ojs"` var mı? Sonra `docker compose logs frontend`.
- **Makale açılıyor ama şekiller yok** → şekil PDF olarak yüklenmiş olabilir;
  PNG/JPG olmalı. Ayrıca dosya adı XML içindeki adla birebir aynı olmalı.
- **dergi.cf.org.tr tanıtım sitesini açıyor** → reverse proxy 8080 yerine
  3000'e yönlendiriyor.
- **Yönlendirme döngüsü** → Cloudflare SSL modu "Full" olmalı.
- **Büyük PDF yüklenemiyor** → proxy'de `client_max_body_size` düşük.
