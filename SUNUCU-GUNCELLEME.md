# Tek Seferlik Sunucu Güncellemesi — Adım Adım

_Hazırlandı: 17 Ağustos 2026_

Bu güncellemeden sonra makale yayınlamak için sunucuya bir daha dokunulmayacak.
Hepsi ZeroTier + VS Code (SSH) üzerinden yapılır, hostingciye iş düşmez.

> ⚠️ **`docker compose down -v` ASLA çalıştırılmayacak.** Bu komut veritabanını
> ve yüklenen tüm makale dosyalarını siler.

---

## 0. Önce yedek al (atlanmayacak)

Kod güncellemesinden önce mevcut durumun yedeği alınır. Repo klasöründe:

```bash
mkdir -p ~/yedek && cd ~/yedek

# Veritabanı
docker compose -f ~/akademi-dostu-yayim/docker-compose.yml exec -T db \
  sh -c 'mariadb-dump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction ojs' \
  | gzip > ojs-db-$(date +%F).sql.gz

# Yüklenen dosyalar (PDF, XML, şekiller)
docker run --rm \
  -v "$(docker volume ls -q | grep ojs_files | head -1)":/data:ro \
  -v "$PWD":/backup alpine \
  tar czf /backup/ojs-files-$(date +%F).tar.gz -C /data .

ls -lh
```

İki dosya da oluştuysa devam. **Bir kopyasını sunucu dışına indir**
(VS Code'da dosyaya sağ tık → Download).

---

## 1. OJS API anahtarını üret

OJS'te sağ üst → **Profil Düzenle** → **API Anahtarı** sekmesi → anahtar üret,
kopyala. (Zaten ürettiysen aynısı kullanılabilir.)

---

## 2. `.env` dosyasına üç satır ekle

Repo klasöründeki `.env` dosyasının sonuna:

```
# Frontend'in OJS'e sunucu tarafı erişimi
OJS_INTERNAL_URL=http://ojs
OJS_PUBLIC_URL=https://dergi.cf.org.tr
OJS_API_TOKEN=BURAYA_ANAHTAR
```

---

## 3. OJS'in `allowed_hosts` satırını genişlet

`ojs/config/ojs.config.inc.php` içinde:

```
allowed_hosts = '["dergi.cf.org.tr", "ojs"]'
```

Frontend, OJS'e konteynerler arası `http://ojs` adresiyle bağlanacak; bu satır
olmadan OJS isteği reddeder.

---

## 4. Kodu güncelle ve yayına al

```bash
cd ~/akademi-dostu-yayim
git pull
docker compose up -d --force-recreate ojs
docker compose up -d --build frontend
```

Build birkaç dakika sürer.

Bu güncellemede OJS konteyneri yeniden oluşturulur; böylece
`cfOpenBranding` plugin mount'u devreye girer. Veritabanı, yüklenen dosyalar ve
`config.inc.php` kalıcı volume/bind mount'larda olduğu için korunur.

İlk seferinde OJS'te **Administration → Site Settings → Plugins → Generic
Plugins** bölümünden **CF Open Backend Branding** eklentisini bir kez
etkinleştirin. Ardından OJS önbelleğini temizleyin.

---

## 5. Kontrol listesi

| Kontrol | Beklenen |
|---|---|
| `https://cf.org.tr` | Anasayfa açılıyor, yayınlanmış makaleler listeleniyor |
| `https://cf.org.tr/journal/social-solutions` | JSS sayfası, makale kartı görünüyor |
| Makaleye tıkla | Tam metin (JATS) açılıyor, şekiller görünüyor |
| PDF düğmesi | PDF iniyor |
| "Submit your article" | JSS'in OJS gönderim sayfasına gidiyor |
| OJS dashboard / gönderim | Açık derginin rengiyle CF Open görünümü geliyor |
| Metrikler | Görüntülenme 1+ (sayfayı açtın), atıf kutusu yok |
| `https://dergi.cf.org.tr` | OJS normal çalışıyor |

Sorun olursa:

```bash
docker compose logs --tail=100 frontend
```

---

## 6. Geri alma (gerekirse)

Kod kaynaklı bir sorunda bir önceki sürüme dönmek güvenlidir; veritabanına
dokunmaz:

```bash
git log --oneline -5        # önceki commit'i bul
git checkout <commit>
docker compose up -d --build frontend
```

---

## Güncellemeden sonra

- Lorem ipsum test makalesi OJS'ten silinir
- Dergiler **Aktifleştir** yapılır (şu an bilinçli kapalı)
- Gerçek makaleler yüklenmeye başlanır
- Yedekleme haftalık otomatiğe bağlanır
