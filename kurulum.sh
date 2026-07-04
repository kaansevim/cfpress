#!/usr/bin/env bash
# ============================================================================
# Akademik Yayın Platformu — sunucu kurulum scripti
#
# Kullanım (repo kök dizininde):  sudo bash kurulum.sh
#
# Yaptıkları:
#   1. .env dosyası yoksa rastgele veritabanı parolalarıyla oluşturur
#   2. OJS config dosyasını şablondan üretir (salt/api anahtarı/DB parolası)
#   3. Dosya izinlerini ayarlar
#   4. docker compose ile her şeyi build edip başlatır
#
# Script birden çok kez güvenle çalıştırılabilir (mevcut ayarları ezmez).
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Akademik Yayın Platformu kurulumu başlıyor..."

# ---- 1. .env ---------------------------------------------------------------
if [ ! -f .env ]; then
  DB_PASS="$(openssl rand -hex 16)"
  DB_ROOT_PASS="$(openssl rand -hex 16)"
  cat > .env <<EOF
# Otomatik oluşturuldu ($(date +%F)) — bu dosyayı git'e commit ETMEYİN
OJS_DB_PASSWORD=${DB_PASS}
OJS_DB_ROOT_PASSWORD=${DB_ROOT_PASS}

# Alan adları / adresler
OJS_DOMAIN=dergi.cf.org.tr
OJS_PUBLIC_URL=https://dergi.cf.org.tr

# Frontend butonlarının gideceği OJS dergisi (dergi oluşturulunca doldurun,
# sonra: docker compose up -d --build frontend)
OJS_JOURNAL_PATH=

# Portların bağlanacağı IP. Reverse proxy aynı sunucuda ise 127.0.0.1 kalsın.
# Proxy bir konteyner/başka makinedeyse 0.0.0.0 yapın (firewall'a dikkat).
BIND_IP=127.0.0.1
EOF
  echo "==> .env oluşturuldu (rastgele DB parolalarıyla)."
else
  echo "==> .env zaten var, dokunulmadı."
fi

# .env'i oku
set -a; source .env; set +a

# ---- 2. OJS config ----------------------------------------------------------
CONFIG=ojs/config/ojs.config.inc.php
if [ ! -f "$CONFIG" ]; then
  SALT="$(openssl rand -hex 32)"
  API_SECRET="$(openssl rand -hex 32)"
  sed -e "s|__OJS_DB_PASSWORD__|${OJS_DB_PASSWORD}|" \
      -e "s|__OJS_SALT__|${SALT}|" \
      -e "s|__OJS_API_KEY_SECRET__|${API_SECRET}|" \
      ojs/config/ojs.config.TEMPLATE.inc.php > "$CONFIG"
  echo "==> ${CONFIG} şablondan üretildi."
else
  echo "==> ${CONFIG} zaten var, dokunulmadı."
fi

# ---- 3. İzinler --------------------------------------------------------------
# OJS web kurulumu config dosyasına yazabilmeli (konteynerde apache uid=100)
chown 100:101 "$CONFIG" 2>/dev/null || true
chmod 664 "$CONFIG"

# ---- 4. Başlat ---------------------------------------------------------------
echo "==> Docker imajları build edilip başlatılıyor (ilk sefer birkaç dakika sürer)..."
docker compose up -d --build

echo
echo "============================================================"
echo " Kurulum tamamlandı. Servisler:"
echo "   Frontend : http://127.0.0.1:3000   (cf.org.tr buraya yönlenmeli)"
echo "   OJS      : http://127.0.0.1:8080   (dergi.cf.org.tr buraya yönlenmeli)"
echo
echo " OJS web kurulumu için gerekli veritabanı bilgileri:"
echo "   Sürücü         : mysqli"
echo "   Sunucu (host)  : db"
echo "   Kullanıcı      : ojs"
echo "   Parola         : ${OJS_DB_PASSWORD}"
echo "   Veritabanı adı : ojs"
echo "   Dosya dizini   : /var/www/files"
echo "   'Create new database' işaretini KALDIRIN."
echo
echo " Bu bilgileri dergi ekibine iletin — https://dergi.cf.org.tr"
echo " adresini açıp OJS kurulum sihirbazını tamamlayacaklar."
echo "============================================================"
