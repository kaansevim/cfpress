import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/etik-ilkeler")({
  head: () => ({
    meta: [
      { title: "Etik İlkeler — Akademik Dergi" },
      {
        name: "description",
        content:
          "Akademik Dergi'nin yayın etiği, intihal, çıkar çatışması ve araştırma bütünlüğü ilkeleri.",
      },
    ],
  }),
  component: EthicsPage,
});

function EthicsPage() {
  return (
    <InfoPage
      eyebrow="Yayın Etiği"
      title="Etik İlkeler"
      intro="Akademik Dergi, yayın sürecinin her aşamasında uluslararası yayın etiği standartlarını (COPE) benimser. Aşağıdaki ilkeler tüm taraflar için bağlayıcıdır."
    >
      <h2>Araştırma Bütünlüğü</h2>
      <p>
        Yazarlar, sundukları verilerin özgün ve doğru olduğunu garanti eder. Verilerin
        uydurulması, çarpıtılması veya seçici biçimde raporlanması ciddi etik ihlaller
        olarak kabul edilir ve çalışmanın reddedilmesine ya da yayımlanmışsa geri
        çekilmesine yol açar.
      </p>

      <h2>İntihal</h2>
      <p>
        Tüm başvurular, değerlendirmeye alınmadan önce intihal tarama yazılımıyla kontrol
        edilir. Başkalarına ait metin, fikir veya bulguların kaynak gösterilmeden
        kullanılması kabul edilemez. Kendinden alıntı dahil tüm alıntılar açıkça
        belirtilmelidir.
      </p>

      <h2>Yazarlık ve Katkı</h2>
      <p>
        Yazar olarak yalnızca çalışmaya anlamlı bilimsel katkı sunan kişiler
        listelenmelidir. Tüm yazarlar makalenin son halini onaylamış olmalıdır. Yazar
        sıralaması ve katkı oranları konusundaki anlaşmazlıklar başvuru öncesinde
        çözülmelidir.
      </p>

      <h2>Çıkar Çatışması</h2>
      <p>
        Yazarlar, hakemler ve editörler; değerlendirmeyi etkileyebilecek mali veya kişisel
        ilişkileri açıkça beyan etmekle yükümlüdür. Çıkar çatışması bulunan editör ya da
        hakemler ilgili çalışmanın sürecinden çekilir.
      </p>

      <h2>Geri Çekme ve Düzeltme</h2>
      <p>
        Yayım sonrası ciddi bir hata ya da etik ihlal tespit edilirse, dergi düzeltme
        (erratum) yayımlar veya gerektiğinde çalışmayı şeffaf bir gerekçeyle geri çeker.
        Geri çekme bildirimleri kalıcı olarak erişilebilir tutulur.
      </p>

      <h2>Editöryal Bağımsızlık</h2>
      <p>
        Yayım kararları yalnızca bilimsel değer temelinde alınır; yazarların kurumu,
        uyruğu, cinsiyeti veya ticari kaygılar bu kararları etkilemez.
      </p>

      <blockquote>
        Bir etik kaygıyı bildirmek için <a href="/auth">hesabınız üzerinden</a> editör
        ekibiyle iletişime geçebilirsiniz. Tüm bildirimler gizlilik içinde değerlendirilir.
      </blockquote>
    </InfoPage>
  );
}
