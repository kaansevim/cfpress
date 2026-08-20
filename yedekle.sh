#!/usr/bin/env bash
# CF Open haftalık yedek.
#
# Her çalıştığında SIFIRDAN TAM KOPYA üretir — fark/artımlı yedek değildir.
# Yani bir günün dosyaları tek başına eksiksiz bir geri dönüş sağlar.
#
# Sunucuda /development/akademi-dostu-yayim/yedekle.sh olarak durur, cron ile
# her pazar 03:00'te çalışır:
#   0 3 * * 0 /development/akademi-dostu-yayim/yedekle.sh >> /root/yedek/yedek.log 2>&1
#
# Bu kopya, sunucu sıfırlanırsa yeniden kurulabilsin diye repoda tutulur.
# Ne yedeklendiği ve nasıl geri yüklendiği: YEDEKLEME.md
#
# ⚠️ Üretilen dosyalarda veritabanı parolası ve API anahtarı vardır.
#    Herkese açık bir yere koyma.

set -uo pipefail
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

REPO=/development/akademi-dostu-yayim
DEST=/root/yedek
KEEP=8
STAMP=$(date +%F)

mkdir -p "$DEST"
cd "$REPO" || exit 1

# 1. Veritabanı — makaleler, kullanıcılar, hakem süreçleri, tüm OJS ayarları
docker compose exec -T db \
  sh -c 'mariadb-dump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --routines ojs' \
  | gzip > "$DEST/ojs-db-$STAMP.sql.gz"

# Dökümün gerçekten dolu olduğunu doğrula; boş dosya yedek sayılmaz.
if [ "$(stat -c%s "$DEST/ojs-db-$STAMP.sql.gz")" -lt 100000 ]; then
  echo "$(date '+%F %T') HATA: veritabani yedegi cok kucuk, iptal"
  rm -f "$DEST/ojs-db-$STAMP.sql.gz"
  exit 1
fi

# 2. Yüklenen dosyalar — PDF, XML, şekiller, kapaklar
VOL=$(docker volume ls -q | grep -m1 ojs_files)
docker run --rm -v "$VOL":/data:ro -v "$DEST":/backup alpine \
  tar czf "/backup/ojs-files-$STAMP.tar.gz" -C /data . || exit 1

# 3. Sitenin sayaçları — görüntülenme ve indirme sayıları
#    OJS'te değil, frontend'in kendi diskinde tutulur.
MVOL=$(docker volume ls -q | grep -m1 frontend_data)
if [ -n "$MVOL" ]; then
  docker run --rm -v "$MVOL":/data:ro -v "$DEST":/backup alpine \
    tar czf "/backup/metrikler-$STAMP.tar.gz" -C /data . || true
fi

# 4. Ayar dosyaları — bunlar olmadan sunucu sıfırdan kurulamaz
cp "$REPO/ojs/config/ojs.config.inc.php" "$DEST/ojs-config-$STAMP.php"
cp "$REPO/.env" "$DEST/env-$STAMP.txt"

# 5. Son $KEEP yedek kalsın, eskiler silinsin
for p in ojs-db ojs-files metrikler ojs-config env; do
  ls -1t "$DEST"/$p-* 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f
done

echo "$(date '+%F %T') yedek tamam — toplam $(du -sh "$DEST" | cut -f1)"
