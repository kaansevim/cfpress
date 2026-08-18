# CF Open — Yayın Akışı ve Yol Haritası

_Güncelleme: 17 Ağustos 2026_

## Hedef

Editör OJS'te "Yayınla" dediği anda makale cf.org.tr'de kendiliğinden görünsün.
Ne sunucuya bağlanmak, ne kod göndermek, ne hostingciye yazmak gereksin.

**Bunun için sunucuya tek bir güncelleme yapacağız.** O günden sonra makale
yayınlamak tamamen OJS panelinden yürüyecek.

---

## Neden şu an bir güncelleme gerekiyor?

Bugün makaleler kodun içinde bir listede duruyor. Yeni makale = kod değişikliği
= yeniden derleme. Sürdürülebilir değil, zaten bu yüzden değiştiriyoruz.

Entegrasyondan sonra makaleler koddan değil OJS'ten gelecek. Kod bir daha
değişmeyeceği için sunucuya da bir daha dokunmayacağız. Yani:

| Değişen şey | Sunucu güncellemesi gerekir mi? |
|---|---|
| Yeni makale yayınlamak | **Hayır** |
| Yeni sayı çıkarmak | **Hayır** |
| Dergi metinlerini OJS'ten düzenlemek | **Hayır** |
| Yeni dergi açmak | Sadece dergi kartı için tek satır (istenirse otomatiğe alınır) |
| Sitenin tasarımını değiştirmek | Evet |

---

## Tek seferlik güncellemenin içeriği

Hepsi tek pakette gidecek, sunucu bir kez yeniden derlenecek.

### 1. Örnek içeriklerin temizliği
- Uydurma makaleler, sahte DOI'ler ve sahte metrik sayıları kaldırılır
- Yerine "Bu dergide henüz makale yayınlanmadı" gibi sakin bir ekran gelir

### 2. OJS entegrasyonu (asıl iş)
- Sayı ve makale listesi OJS'ten sunucu tarafında çekilir
- JATS XML mevcut görüntüleyiciyle çizilir; makale sayfası tasarımı değişmez
- 10 dakikalık önbellek — her ziyaretçi için OJS'e gidilmez
- OJS'e ulaşılamazsa sayfa çökmez, nazik bir mesaj gösterir

> **Not:** OJS 3.5'in API'si dışarıya kapalı (test ettik, 401 dönüyor).
> Erişim sunucu tarafında bir API anahtarıyla olacak; anahtar tarayıcıya
> hiç gitmez.

### 3. Metrikler
- **Görüntülenme:** cf.org.tr kendi sayar (okuyucu orada)
- **İndirme:** indirme düğmesi OJS'in indirme adresine gider, tıklama sayılır
- **Atıf:** DOI alınana kadar gösterilmez (veri Crossref'ten gelir)
- Sayılar sıfırdan başlar ve gerçek trafikle birikir

### 4. Dergi bazlı gönderim butonları
Yapıldı. Her dergi kendi OJS gönderim sayfasına gidiyor.

### 5. Metin düzeltmeleri
Yapıldı: resmi unvan, şablon kuralı, çıkar çatışması beyanı, sahte ISSN'lerin
kaldırılması.

---

## Sunucuda yapılacaklar (tek sefer)

Kaan SSH ile kendisi yapacak, hostingciye iş düşmüyor.

1. `.env` dosyasına eklenecek:
   ```
   OJS_INTERNAL_URL=http://ojs
   OJS_API_TOKEN=(OJS profilinden üretilecek)
   ```
2. `ojs/config/ojs.config.inc.php` içinde:
   ```
   allowed_hosts = '["dergi.cf.org.tr", "ojs"]'
   ```
3. Kod güncellenip yeniden derlenecek:
   ```
   git pull
   docker compose restart ojs
   docker compose up -d --build frontend
   ```

> ⚠️ `docker compose down -v` ASLA çalıştırılmayacak — veritabanını siler.

---

## Sıralama

| # | Adım | Kimde |
|---|---|---|
| 1 | JCF, JECF, JCFO ayarları (şablon dosyası hazır) | Kaan |
| 2 | Yedekleme kurulumu | Birlikte |
| 3 | Entegrasyon + temizlik + metrikler kodlanır | Claude |
| 4 | OJS'te API anahtarı üretilir | Kaan |
| 5 | **Tek seferlik sunucu güncellemesi** | Birlikte |
| 6 | Test makalesi silinir, dergiler aktifleştirilir | Kaan |
| 7 | Gerçek makaleler yüklenir, ilk sayı yayınlanır | Kaan |
| 8 | ORCID başvurusu ve entegrasyonu | Birlikte |
| 9 | ISSN başvurusu (ilk sayıdan sonra) | Kaan |
| 10 | DOI / Crossref üyeliği, atıf metriği açılır | Birlikte |
| 11 | OJS sayfaları arama motorlarına kapatılır | Birlikte |

5. adımdan sonra sistem DOI ve ISSN dışında tam çalışır durumda olacak.

---

## Yedekleme (5. adımdan önce mutlaka)

Gerçek makaleler girmeden önce şunların yedeği alınmalı:
- Veritabanı (`ojs_db_data`) — makaleler, kullanıcılar, hakem süreçleri
- Yüklenen dosyalar (`ojs_files`) — PDF, XML, şekiller
- Ayar dosyası (`ojs/config/ojs.config.inc.php`)

Haftalık otomatik çalışan bir script kurulacak, ilk yedeğin bir kopyası
sunucu dışında saklanacak.

---

## Açık kararlar

**DOI.** Gerçek DOI için Crossref üyeliği (yıllık ücretli) gerekir. Üye
olunursa OJS'in Crossref eklentisi DOI'leri otomatik üretip kaydeder.

**ISSN.** İlk sayı yayınlandıktan sonra Milli Kütüphane üzerinden.

**Yayın kurulu.** İlk duyurudan önce en azından bir baş editör ismi görünmeli.
