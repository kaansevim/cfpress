import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/yazar-rehberi")({
  head: () => ({
    meta: [
      { title: "Yazar Rehberi — Akademik Dergi" },
      {
        name: "description",
        content:
          "Akademik Dergi'ye makale gönderecek yazarlar için biçim, başvuru ve değerlendirme kuralları.",
      },
    ],
  }),
  component: AuthorGuidePage,
});

function AuthorGuidePage() {
  return (
    <InfoPage
      eyebrow="Yazarlar İçin"
      title="Yazar Rehberi"
      intro="Akademik Dergi, tüm bilim dallarından özgün ve hakemli araştırmaları yayımlar. Makalenizi göndermeden önce aşağıdaki kuralları lütfen dikkatle inceleyin."
    >
      <h2>Genel İlkeler</h2>
      <p>
        Dergiye gönderilen çalışmaların daha önce başka bir yerde yayımlanmamış ve eş
        zamanlı olarak başka bir derginin değerlendirmesinde bulunmuyor olması gerekir.
        Tüm makaleler, çift-kör hakem değerlendirmesinden geçer ve yalnızca bilimsel
        özgünlük, yöntem sağlamlığı ve katkı düzeyi temelinde değerlendirilir.
      </p>

      <h2>Makale Türleri</h2>
      <ul>
        <li>
          <strong>Araştırma Makalesi:</strong> Özgün bulgular içeren tam metin çalışmalar
          (en fazla 8.000 kelime).
        </li>
        <li>
          <strong>Derleme:</strong> Bir alandaki güncel literatürü eleştirel biçimde
          değerlendiren çalışmalar.
        </li>
        <li>
          <strong>Kısa Bildirim:</strong> Hızlı yayımlanması gereken sınırlı kapsamlı
          bulgular (en fazla 3.000 kelime).
        </li>
      </ul>

      <h2>Biçim ve Hazırlık</h2>
      <ul>
        <li>Metin Türkçe veya İngilizce hazırlanabilir; Türkçe makalelerde İngilizce özet zorunludur.</li>
        <li>Özet 250 kelimeyi aşmamalı, 4–6 anahtar kelime içermelidir.</li>
        <li>Başlıklar numaralandırılmalı; şekil ve tablolar metin içinde atıfla anılmalıdır.</li>
        <li>Kaynaklar APA 7 biçiminde verilmeli, mümkün olduğunda DOI bağlantısı eklenmelidir.</li>
        <li>Tüm yazarların ORCID kimliği başvuru sırasında belirtilmelidir.</li>
      </ul>

      <h2>Başvuru Süreci</h2>
      <p>
        Başvurular, sorumlu yazarın ORCID hesabıyla giriş yapması sonrası çevrim içi
        sistem üzerinden alınır. Yüklenen dosyalar arasında ana metin, kör değerlendirmeye
        uygun anonim sürüm ve varsa ek veri dosyaları yer almalıdır. Editör ön incelemesini
        geçen çalışmalar hakem sürecine alınır.
      </p>

      <h2>Açık Erişim ve Telif</h2>
      <p>
        Yayımlanan tüm makaleler{" "}
        <a href="/etik-ilkeler">etik ilkelerimize</a> uygun olarak{" "}
        <strong>CC BY 4.0</strong> lisansıyla açık erişime sunulur. Yazarlar eserlerinin
        telif hakkını korur; dergi yalnızca ilk yayım hakkına sahip olur.
      </p>

      <blockquote>
        Başvurunuzla ilgili sorularınız için editör ekibimize{" "}
        <a href="/auth">hesabınız üzerinden</a> ulaşabilirsiniz.
      </blockquote>
    </InfoPage>
  );
}
