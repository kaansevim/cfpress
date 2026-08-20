# Hangi metin nereden yönetiliyor?

_Güncelleme: 20 Ağustos 2026_

Kural tek cümle: **OJS'te doluysa OJS'teki içerik görünür, boşsa sitedeki hazır
metin görünür.** Hiçbir sayfa boş kalmaz. Bir şeyi değiştirmek için OJS'e
yazman yeterli — kod değişmez, sunucuya dokunulmaz.

Liste OJS ekranlarına göre gruplandı: bir ekrana girdiğinde orada
değiştirebileceğin her şeyi bir arada görüyorsun.

Adres kalıbı: `dergi.cf.org.tr/index.php/{dergi}/management/settings/...`

---

## Settings → Journal → Masthead

| OJS alanı | cf.org.tr'de nereye gider |
|---|---|
| Journal Summary | Aims and scope |
| About the Journal | About the journal |
| Publisher | Publishing credentials |

## Settings → Distribution

| OJS alanı | cf.org.tr'de nereye gider |
|---|---|
| Open Access Policy | Open access |
| Copyright Notice | Copyright and licensing |
| ISSN (Online / Print) | Publishing credentials |
| Search Indexing → Custom Tags | _(siteye gitmez — OJS'i Google'dan gizlemek için)_ |

## Settings → Workflow → Submission

| OJS alanı | cf.org.tr'de nereye gider |
|---|---|
| Author Guidelines | Instructions for authors |
| Submission Checklist | Checklist |
| Competing Interests | Conflict of interest |

## Settings → Workflow → Review

| OJS alanı | cf.org.tr'de nereye gider |
|---|---|
| Reviewer Guidelines | For reviewers |

## Settings → Contact

| OJS alanı | cf.org.tr'de nereye gider |
|---|---|
| Contact name, e-mail, phone | Contact us |
| Mailing address | Contact us |

## Settings → Users & Roles

| OJS'te ne yaparsın | cf.org.tr'de nereye gider |
|---|---|
| Kullanıcıya editör rolü verirsin | Editorial board |
| Kullanıcıya mizanpaj/redaksiyon rolü verirsin | Journal management team |
| ORCID Settings | Yazar ORCID'lerinin doğrulanması |

Ayrıntısı aşağıda.

## Issues

Sayılar, makaleler, cilt/numara/yıl — hepsi buradan. Site otomatik okur.
Sayının **Title** alanını boş bırak; Volume / Number / Year kutularını işaretle.
Başlık sadece özel sayılarda kullanılır.

**Pages** alanına tam aralığı yaz (`45-58`). XML'de sadece ilk sayfa olsa bile
OJS'teki değer geçerli olur; atıf biçimleri buradan okur.

---

## Yayın kurulu nasıl yönetilir

Kodda liste tutulmuyor. OJS künyeyi kullanıcı rollerinden kendisi üretiyor,
site de o künyeyi okuyor.

**1. Rolün künyede görünmesini aç.**
Settings → Users & Roles → **Roles** sekmesi → rolü düzenle →
**"Consider role in masthead list"** işaretli olsun.

Açık olması gerekenler: Journal editor, Section editor, Editorial Board Member,
Layout Editor, Copyeditor gibi görünmesini istediğin roller.
Kapalı olması gereken: **Reviewer** — hakemlerin adı sitede görünmemeli.

**2. Kişiyi ekle.**
Settings → Users & Roles → **Users** → Add User → adı, kurumu, ORCID'i gir,
rolünü seç.

Site 10 dakika içinde kendiliğinden günceller. Kod değişmez, `git push`
gerekmez.

### Hangi rol hangi sayfaya düşer

| OJS rolü | cf.org.tr sayfası |
|---|---|
| Journal editor, Journal manager, Editorial Board Member | Editorial board |
| Section editor | Editorial board |
| Layout Editor, Copyeditor, Proofreader, Assistant | Journal management team |

Sıralama rol düzeyine göre: baş editör üstte, bölüm editörleri altında.

### Sitede ne görünür

Ad, rol adı, kurum ve ORCID numarası. E-posta adresi ve diğer kişisel
bilgiler siteye **hiç çıkmaz** — sunucu tarafında ayıklanır.

Görevi biten kişiler için rolün **dateEnd** tarihini girmen yeterli;
o tarihten sonra künyeden düşer.

---

## Kodda kalanlar

Dosya: `frontend/src/lib/journals.ts` — tek dosya, dört dergi aynı dizide.

- Dergi adı, kısaltma, OJS yolu, kapak görseli, renkler, konu etiketleri
- `editorialBoard` / `managementTeam` — **yedek liste**. Normalde boş kalır;
  yalnızca OJS'e ulaşılamazsa devreye girer. Elle doldurman gerekmiyor.

---

## Henüz OJS'e bağlanmayanlar

Bu başlıkların OJS'te karşılığı yok, metin kodda duruyor:

Abstracting and indexing · Best practice · Readership · Subscription information ·
Mass media · Disclaimer · Research and publication ethics ·
Publication updates and corrections · Editorial policy · E-submission ·
Article processing charge
