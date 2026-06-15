import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/hakem-sureci")({
  head: () => ({
    meta: [
      { title: "Hakem Süreci — Akademik Dergi" },
      {
        name: "description",
        content:
          "Akademik Dergi'de uygulanan çift-kör hakem değerlendirme sürecinin aşamaları ve ilkeleri.",
      },
    ],
  }),
  component: PeerReviewPage,
});

function PeerReviewPage() {
  return (
    <InfoPage
      eyebrow="Değerlendirme"
      title="Hakem Süreci"
      intro="Akademik Dergi, bilimsel kalitenin güvencesi olarak çift-kör hakem değerlendirmesi uygular. Sürecin her aşaması şeffaflık ve tarafsızlık ilkesiyle yürütülür."
    >
      <h2>Çift-Kör Değerlendirme</h2>
      <p>
        Değerlendirme boyunca yazarların ve hakemlerin kimlikleri karşılıklı olarak gizli
        tutulur. Bu yaklaşım, değerlendirmenin yalnızca çalışmanın bilimsel niteliğine
        odaklanmasını sağlar ve olası önyargıları en aza indirir.
      </p>

      <h2>Sürecin Aşamaları</h2>
      <ol>
        <li>
          <strong>Ön İnceleme:</strong> Editör, çalışmanın derginin kapsamına uygunluğunu
          ve biçimsel gereklilikleri kontrol eder (yaklaşık 1 hafta).
        </li>
        <li>
          <strong>Hakem Ataması:</strong> Konu alanında uzman en az iki bağımsız hakem
          görevlendirilir.
        </li>
        <li>
          <strong>Değerlendirme:</strong> Hakemler çalışmayı özgünlük, yöntem, bulguların
          tutarlılığı ve katkı açısından inceler (yaklaşık 4–6 hafta).
        </li>
        <li>
          <strong>Karar:</strong> Editör, hakem raporları doğrultusunda kabul, düzeltme
          veya ret kararı verir.
        </li>
        <li>
          <strong>Düzeltme ve Yayın:</strong> İstenen düzeltmelerin ardından kabul edilen
          çalışma mizanpaja alınır ve DOI atanarak yayımlanır.
        </li>
      </ol>

      <h2>Karar Türleri</h2>
      <ul>
        <li><strong>Kabul:</strong> Çalışma mevcut haliyle yayıma uygundur.</li>
        <li><strong>Küçük Düzeltme:</strong> Sınırlı değişikliklerle kabul edilebilir.</li>
        <li><strong>Büyük Düzeltme:</strong> Kapsamlı revizyon sonrası yeniden değerlendirilir.</li>
        <li><strong>Ret:</strong> Çalışma derginin ölçütlerini karşılamamaktadır.</li>
      </ul>

      <h2>Hakemlerin Sorumlulukları</h2>
      <p>
        Hakemler, değerlendirmelerini nesnel, yapıcı ve zamanında sunmakla yükümlüdür.
        Değerlendirilen çalışmaya ilişkin tüm bilgiler gizli tutulur ve hiçbir biçimde
        kişisel çıkar için kullanılamaz. Olası bir çıkar çatışması durumunda hakem,
        görevi reddetmekle yükümlüdür.
      </p>

      <blockquote>
        Ortalama ilk karar süresi başvurudan itibaren yaklaşık <strong>6–8 hafta</strong>dır.
        Sürecin güncel durumunu <a href="/dashboard">editör paneli</a> üzerinden takip
        edebilirsiniz.
      </blockquote>
    </InfoPage>
  );
}
