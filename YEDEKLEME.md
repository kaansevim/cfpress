# Yedekleme

_Güncelleme: 20 Ağustos 2026_

## Mantık

Script her çalıştığında **sıfırdan tam kopya** üretir. Fark yedeği değildir.
Bir günün dosyaları tek başına eksiksizdir; önceki haftalara ihtiyaç yoktur.

Sunucuda `/root/yedek` klasöründe **son 8 hafta** durur. Eskiler kendiliğinden
silinir. En kötü senaryoda kaybedilen, son yedekten bu yana geçen süredir —
en fazla 7 gün.

Çalışma zamanı: her pazar 03:00 (cron).

## Yedekte ne var

| Dosya | İçeriği |
|---|---|
| `ojs-db-TARİH.sql.gz` | Tüm veritabanı: dört dergi, makaleler, yazarlar, kullanıcılar, hakem süreçleri, sayılar, OJS'e girilen bütün metinler ve ayarlar |
| `ojs-files-TARİH.tar.gz` | Yüklenen tüm dosyalar: PDF, JATS XML, şekiller, kapak görselleri, gönderim ve hakem dosyaları |
| `metrikler-TARİH.tar.gz` | Sitedeki görüntülenme ve indirme sayaçları |
| `ojs-config-TARİH.php` | OJS ayar dosyası (veritabanı parolası, SMTP) |
| `env-TARİH.txt` | Ortam değişkenleri (API anahtarı, parolalar) |

## Yedekte olmayanlar — çünkü gerekmiyor

- **Sitenin kodu.** GitHub'da: `github.com/kaansevim/cfpress`
- **Docker imajları.** İnternetten yeniden iner.

## Güvenlik

Yedek dosyalarında **parolalar ve API anahtarı** vardır. Herkese açık bir
bulut klasörüne, paylaşılan diske veya e-postaya koyma.

## Sunucu dışına kopya

Yedeğin sunucudaki diskte durması yedek sayılmaz — disk giderse ikisi de gider.
Mac'te (sunucuda değil) kendi terminalinden, ZeroTier açıkken:

```bash
scp root@10.29.15.178:/root/yedek/*$(date +%F)* ~/Downloads/
```

Bunu en azından **her sayı yayınlandıktan sonra** yap.

## Geri yükleme

Sunucu tamamen gitmişse sıra şu:

**1. Kodu ve ayarları getir**

```bash
git clone https://github.com/kaansevim/cfpress.git akademi-dostu-yayim
cd akademi-dostu-yayim
cp /yedek/env-TARİH.txt .env
mkdir -p ojs/config && cp /yedek/ojs-config-TARİH.php ojs/config/ojs.config.inc.php
```

**2. Konteynerleri başlat** (veritabanı boş oluşur)

```bash
docker compose up -d db
```

**3. Veritabanını geri yükle**

```bash
gunzip -c /yedek/ojs-db-TARİH.sql.gz | \
  docker compose exec -T db sh -c 'mariadb -uroot -p"$MYSQL_ROOT_PASSWORD" ojs'
```

**4. Yüklenen dosyaları geri yükle**

```bash
VOL=$(docker volume ls -q | grep -m1 ojs_files)
docker run --rm -v "$VOL":/data -v /yedek:/backup alpine \
  tar xzf /backup/ojs-files-TARİH.tar.gz -C /data
```

**5. Sayaçları geri yükle** (isteğe bağlı)

```bash
MVOL=$(docker volume ls -q | grep -m1 frontend_data)
docker run --rm -v "$MVOL":/data -v /yedek:/backup alpine \
  tar xzf /backup/metrikler-TARİH.tar.gz -C /data
```

**6. Her şeyi ayağa kaldır**

```bash
docker compose up -d --build
```

> ⚠️ `docker compose down -v` hiçbir aşamada çalıştırılmaz — veritabanını siler.

## Yedeğin çalıştığını kontrol

```bash
tail -20 /root/yedek/yedek.log
ls -lh /root/yedek
```

Son satırda "yedek tamam" yazmalı ve dosyaların tarihi son pazar olmalı.
Veritabanı dosyası birkaç MB'ın altındaysa bir sorun var demektir.
