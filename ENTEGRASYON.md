# cf.org.tr ↔ OJS Entegrasyon Yol Haritası

## Amaç

Bugün tanıtım sitesi (cf.org.tr) makaleleri koda gömülü bir listeden
(`frontend/src/lib/article-manifest.ts`) ve repoya elle konan XML/PDF
dosyalarından (`frontend/public/articles/...`) gösteriyor. Hedef:

> Editör OJS'te "Yayınla" dediği anda makale, **hiçbir ek işlem yapmadan**
> cf.org.tr'de de görünsün. Tek veri kaynağı OJS olsun; GitHub'a makale
> yüklemek tamamen ortadan kalksın.

## Ne kadar zor?

Orta zorlukta, tek seferlik bir geliştirme işi. Büyük avantajımız: frontend
zaten JATS XML okuyup makale sayfası çizebiliyor (`jats-parser.ts`) ve OJS de
yayınlanan makalelerin XML/PDF dosyalarını herkese açık adreslerden sunuyor.
Yani "makaleyi güzel gösterme" kısmı hazır; eksik olan sadece "makale
listesini OJS'ten çekme" kısmı. Dergi veya sayı başına yeni kod GEREKMEZ —
bir kez yazılır, tüm dergiler ve tüm sayılar için otomatik çalışır.

## Hostingcinin yapması gereken bir şey var mı?

Neredeyse hiç. İki konteyner zaten aynı Docker ağında; frontend, OJS'e
içeriden (`http://ojs`) veya dışarıdan (`https://dergi.cf.org.tr`) erişebilir.
Hostingciden istenecekler yalnızca şunlar (entegrasyon koda eklendiğinde):

1. Sunucudaki `ojs/config/ojs.config.inc.php` içinde `allowed_hosts`
   satırına `"ojs"` eklemek (içeriden erişim için):

   ```
   allowed_hosts = '["dergi.cf.org.tr", "ojs"]'
   ```

2. Şu iki komutu çalıştırmak:

   ```bash
   docker compose restart ojs
   docker compose up -d --build frontend
   ```

Hepsi bu. Reverse proxy, DNS, Cloudflare tarafında hiçbir değişiklik gerekmez.

## Teknik plan (geliştirmeyi yapacak kişi/AI için)

### Aşama 1 — OJS tarafında hazırlık (kod yok, panel işi)

- Dergiler oluşturulmuş ve en az bir makale bir sayıda yayınlanmış olmalı.
- Makalelerin **JATS XML galley** + PDF galley olarak yüklenmesi kural haline
  getirilmeli (mizanpajdan gelen dosyalar; şekiller XML galley'e "dependent
  files" olarak eklenir).
- OJS'te REST API zaten açıktır; salt-okur erişim için bir kullanıcının
  profilinden **API Key** üretilebilir (Profil → API Key). Yayınlanmış
  içeriğin bir kısmı anahtar gerektirmeden de erişilebilir.

### Aşama 2 — Frontend'de veri katmanını değiştirme (asıl iş)

`article-manifest.ts` ve `journals.ts`'teki sabit veriler yerine, sunucu
tarafında (TanStack Start server function / route loader) OJS'ten veri çekilir:

- **Sayılar:** `GET {OJS}/index.php/{dergiPath}/api/v1/issues` (yayınlanmış
  sayılar herkese açıktır)
- **Sayıdaki makaleler:** `GET .../api/v1/issues/{issueId}`
- **Makale ayrıntısı/galley'ler:** yanıt içindeki publication ve galley
  bilgileri; XML/PDF dosya adresleri şu kalıptadır:
  `{OJS}/index.php/{dergiPath}/article/download/{makaleId}/{galleyId}`
- Çekilen XML, mevcut `jats-parser.ts` ile aynen bugünkü gibi işlenir;
  makale sayfası tasarımı hiç değişmez.

Ortam değişkenleri (docker-compose'a eklenecek):

```
OJS_INTERNAL_URL=http://ojs          # sunucu tarafı istekler için
VITE_OJS_URL=https://dergi.cf.org.tr # tarayıcıya verilecek linkler için
OJS_API_TOKEN=...                    # yalnızca korumalı uçlar gerekirse
```

- 5–15 dakikalık bir önbellek (cache) eklenmeli ki her ziyaretçi için OJS'e
  istek gitmesin.
- OJS'e ulaşılamazsa sayfa hata vermek yerine "makaleler geçici olarak
  yüklenemiyor" gösterme (graceful fallback) eklenmeli.

### Aşama 3 — Temizlik ve geçiş

- Entegrasyon doğrulanınca `frontend/public/articles/` örnek dosyaları ve
  `article-manifest.ts` / `mock-articles.ts` kaldırılır.
- `journals.ts`'teki dergi kartları ya OJS'ten çekilir ya da (dergi listesi
  nadiren değiştiği için) elle güncellenmeye devam eder — ikisi de geçerli.

## Entegrasyon sonrası yayın akışı (hayal edilen son durum)

1. Mizanpajdan XML + PDF + şekiller gelir.
2. OJS'te makalenin üretim sayfasına galley olarak yüklenir, sayıya atanır,
   **Yayınla**'ya basılır.
3. Birkaç dakika içinde (önbellek tazelenince) makale cf.org.tr'de
   kendiliğinden görünür. GitHub'a, hostingciye, başka hiçbir yere dokunulmaz.

## Sıralama önerisi

Önce OJS kurulumu bitsin, dergiler açılsın ve 1-2 gerçek makale OJS üzerinden
yayınlansın. Entegrasyona ondan sonra başlamak en sağlıklısı; çünkü API
yanıtlarını gerçek veriyle test edebiliriz. O aşamaya gelince bu dosyayı
açıp "Aşama 2'yi birlikte yapalım" demeniz yeterli.
