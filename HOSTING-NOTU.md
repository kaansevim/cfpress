# Hosting Notu — cf.org.tr / dergi.cf.org.tr

Merhaba! Repo'yu production'a uygun hale getirdik. Artık her şey tek
`docker compose` ile ayağa kalkıyor. Senden istediklerimiz şunlar:

## 1. Repo'yu klonla ve kurulum scriptini çalıştır

Kod artık şurada: **https://github.com/ofsevim/akademi-dostu-yayim**

```bash
git clone https://github.com/ofsevim/akademi-dostu-yayim.git
cd akademi-dostu-yayim
sudo bash kurulum.sh
```

(Sunucuda eski cfpress kurulumu varsa önce onu durdur: eski klasörde
`docker compose down` — veriler volume'larda olduğu için silinmez, ama bu
sıfırdan kurulum olduğu için istersen `docker compose down -v` ile temiz
başlayabilirsin.)

Script; rastgele veritabanı parolası üretir, OJS ayar dosyasını hazırlar ve
iki servisi başlatır:

- **Frontend** → `127.0.0.1:3000`
- **OJS** → `127.0.0.1:8080`

Script sonunda ekrana yazılan **veritabanı bilgilerini bize ilet** (OJS web
kurulumunda gerekecek).

## 2. Reverse proxy yönlendirmesini düzelt (asıl sorun buydu)

Şu an `dergi.cf.org.tr` de frontend'e (3000) gidiyor. Doğrusu:

| Alan adı | Hedef |
|---|---|
| `cf.org.tr` (ve `www`) | `http://127.0.0.1:3000` |
| `dergi.cf.org.tr` | `http://127.0.0.1:8080` |

Nginx kullanıyorsan `dergi.cf.org.tr` vhost'u şöyle olmalı:

```nginx
server {
    server_name dergi.cf.org.tr;
    listen 80;
    # (SSL'i Cloudflare veya kendi sertifikanla nasıl sonlandırıyorsan öyle kalsın)

    client_max_body_size 100M;   # makale PDF yüklemeleri için önemli

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
    }
}
```

Önemli olanlar: `Host` ve `X-Forwarded-Proto` header'larının iletilmesi ve
`client_max_body_size` artırılması. `cf.org.tr` vhost'unda da aynı header'lar
`127.0.0.1:3000`'e gitsin.

> Proxy'n Docker konteyneri içindeyse veya başka makinedeyse söyle:
> `.env` içinde `BIND_IP=0.0.0.0` yapmak yeterli.

## 3. Cloudflare ayarları

- SSL/TLS modu: **Full** (Flexible olmasın, yönlendirme döngüsü yapar)
- **Always Use HTTPS**: Açık
- `dergi` DNS kaydı sunucuya baksın (proxy/turuncu bulut açık kalabilir)

## 4. Kontrol

- `https://cf.org.tr` → dergi tanıtım sitesi açılmalı
- `https://dergi.cf.org.tr` → **OJS kurulum sayfası** açılmalı (tanıtım sitesi DEĞİL)

İkisi de tamamsa haber ver, biz OJS kurulumunu web'den tamamlayacağız. Teşekkürler!
