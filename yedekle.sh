#!/usr/bin/env bash
# CF Open haftalık yedek: veritabanı + yüklenen dosyalar + ayar dosyası
#
# Sunucuda /development/akademi-dostu-yayim/yedekle.sh olarak durur ve
# cron ile her pazar 03:00'te çalışır:
#   0 3 * * 0 /development/akademi-dostu-yayim/yedekle.sh >> /root/yedek/yedek.log 2>&1
#
# Bu kopya, sunucu sıfırlanırsa yeniden kurulabilsin diye repoda tutulur.

set -uo pipefail
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

REPO=/development/akademi-dostu-yayim
DEST=/root/yedek
KEEP=8
STAMP=$(date +%F)

mkdir -p "$DEST"
cd "$REPO" || exit 1

# 1. Veritabanı — makaleler, kullanıcılar, hakem süreçleri
docker compose exec -T db \
  sh -c 'mariadb-dump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --routines ojs' \
  | gzip > "$DEST/ojs-db-$STAMP.sql.gz"

# Dökümün gerçekten dolu olduğunu doğrula; boş dosya yedek sayılmaz.
if [ "$(stat -c%s "$DEST/ojs-db-$STAMP.sql.gz")" -lt 100000 ]; then
  echo "$(date '+%F %T') HATA: veritabani yedegi cok kucuk, iptal"
  rm -f "$DEST/ojs-db-$STAMP.sql.gz"
  exit 1
fi

# 2. Yüklenen dosyalar — PDF, XML, şekiller
VOL=$(docker volume ls -q | grep -m1 ojs_files)
docker run --rm -v "$VOL":/data:ro -v "$DEST":/backup alpine \
  tar czf "/backup/ojs-files-$STAMP.tar.gz" -C /data . || exit 1

# 3. Ayar dosyası — veritabanı parolası ve API anahtarı burada
cp "$REPO/ojs/config/ojs.config.inc.php" "$DEST/ojs-config-$STAMP.php"

# 4. Son $KEEP yedek kalsın, eskiler silinsin
for p in ojs-db ojs-files ojs-config; do
  ls -1t "$DEST"/$p-* 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f
done

echo "$(date '+%F %T') yedek tamam — toplam $(du -sh "$DEST" | cut -f1)"
