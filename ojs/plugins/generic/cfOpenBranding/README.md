# CF Open Backend Branding

OJS 3.5'in yönetim, makale gönderimi ve editoryal iş akışı ekranlarını CF
Open görsel diline bağlayan site-geneli generic eklentidir. OJS çekirdek
dosyalarını veya frontend tema dosyalarını değiştirmez.

## Dergi eşlemesi

| OJS path | Dergi | Kimlik |
|---|---|---|
| `jss` | Journal of Social Solutions | mavi |
| `jcf` | Journal of Cognitive Formation | mor |
| `jecf` | Journal of Economic Change and Future | kahve / altın |
| `jcfo` | Journal of Community & Foundations | bordo |

Ana renkler `CfOpenBrandingPlugin.php` içinde tutulur ve
`frontend/src/lib/journals.ts` değerleriyle aynıdır. Yeni bir dergi eklenirse
iki dosyadaki eşleme birlikte güncellenmelidir. Tanınmayan veya site-seviyesi
bir bağlamda CF Open'ın nötr lacivert kimliği kullanılır.

## Nasıl çalışır?

- Eklenti OJS 3.5'in `TemplateManager::setupBackendPage` kancasını kullanır.
- `styles/backend.css` yalnızca `backend` bağlamında ve OJS stillerinden sonra
  yüklenir.
- Aktif journal path'e göre CSS değişkenleri eklenir.
- Hiçbir menü, alan veya düğme gizlenmez; JavaScript ve Vue bileşenlerine
  müdahale edilmez.
- Eklenti site-genelidir; bir kez etkinleştirilmesi dört dergi için yeterlidir.

## İlk etkinleştirme

1. OJS konteynerini yeni Docker mount'u ile yeniden oluşturun:

   ```bash
   docker compose up -d --force-recreate ojs
   ```

2. OJS'te yönetici hesabıyla **Administration → Site Settings → Plugins →
   Generic Plugins** bölümünü açın.
3. **CF Open Backend Branding** eklentisini bulun ve etkinleştirin.
4. OJS veri/şablon önbelleğini temizleyin ve tarayıcıda sert yenileme yapın.

Eklenti dosyaları Docker tarafından salt okunur yönetildiği için OJS Plugins
ekranındaki **Delete** işlemini kullanmayın; sürüm güncellemeleri bu repo
üzerinden yapılır.

## Güvenli geri alma

Eklentiyi Plugins ekranından devre dışı bırakmak yeterlidir. Bind mount'u
kaldırmak istenirse önce eklenti devre dışı bırakılır, sonra
`docker-compose.yml` içindeki ilgili volume satırı kaldırılıp yalnızca OJS
konteyneri yeniden oluşturulur. Veritabanı veya makale dosyaları silinmez.
