# Hangi metin nereden yönetiliyor?

_Güncelleme: 19 Ağustos 2026_

Kural tek cümle: **OJS'te doluysa OJS'teki metin görünür, boşsa sitedeki hazır
metin görünür.** Hiçbir sayfa boş kalmaz. Bir metni değiştirmek için OJS'e
yazman yeterli — kod değişmez, sunucuya dokunulmaz.

Aşağıdaki liste OJS ekranlarına göre gruplandı. Yani bir ekrana girdiğinde o
ekranda değiştirebileceğin her şeyi bir arada görüyorsun.

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

## Settings → Users & Roles → ORCID Settings

Siteye metin göndermez. Yazarların ORCID'lerini doğrulamasını sağlar;
doğrulanan numara makale sayfasında yazar adının yanında görünür.

## Issues

Sayılar, makaleler, cilt/numara/yıl — hepsi buradan. Site otomatik okur.
Sayının **Title** alanını boş bırak; Volume / Number / Year kutularını işaretle.
Başlık sadece özel sayılarda kullanılır.

---

## Kodda kalanlar

Dosya: `frontend/src/lib/journals.ts` — **tek dosya, dört dergi aynı dosyada.**

- **Yayın kurulu** (`editorialBoard`) ve **yönetim ekibi** (`managementTeam`)
- Dergi adı, kısaltma, kapak görseli, renkler, konu etiketleri

Yayın kurulu neden OJS'te değil: OJS'e editör eklemek o kişiye sistemde yetki
verir, siteye isim yazmaz. İkisi ayrı şey. Listeyi burada tutmak, sayfada kimin
görüneceğine tek tek karar vermeni sağlıyor.

### Yayın kurulu nasıl eklenir

`journals.ts` içinde dört dergi tek bir dizide duruyor. Hangi dergiye
ekleyeceksen o derginin süslü parantezinin içine yazacaksın — `slug` satırından
tanıyabilirsin:

```ts
export const journals: Journal[] = [
  {
    slug: "social-solutions",          // ← JSS
    name: "Journal of Social Solutions",
    shortName: "JSS",
    ojsPath: "jss",
    coverImage: "/journals/social-solutions/cover.png",
    theme: { ... },
    scope: "...",
    subjects: [...],

    editorialBoard: [                  // ← buraya eklenir
      {
        name: "Prof. Dr. Ad Soyad",
        role: "Editor-in-Chief",
        affiliation: "Ankara Üniversitesi",
        country: "Türkiye",
        orcid: "0000-0002-1825-0097",
      },
      {
        name: "Doç. Dr. Ad Soyad",
        role: "Associate Editor",
        affiliation: "İstanbul Üniversitesi",
        country: "Türkiye",
      },
    ],

    managementTeam: [                  // ← yönetim ekibi de aynı yere
      {
        name: "Ad Soyad",
        role: "Managing Editor",
        affiliation: "CF Open",
        country: "Türkiye",
      },
    ],
  },
  {
    slug: "cognitive-formation",       // ← JCF, kendi listesi buraya
    ...
  },
  ...
]
```

Kurallar:

- `name` ve `role` zorunlu; `affiliation`, `country`, `orcid` isteğe bağlı
- Her üyeden sonra virgül; son üyeden sonra da virgül bırakmak sorun değil
- `orcid` sadece numara — `https://orcid.org/` yazma, siteyi kendisi ekliyor
- Liste boş bırakılırsa sayfada "duyurulacaktır" yazar
- Sıralama ekrandaki sıradır: baş editör en üste

Değişiklikten sonra `git push` + sunucuda yeniden derleme gerekir.

---

## Henüz OJS'e bağlanmayanlar

Bu başlıkların OJS'te karşılığı yok, metin kodda duruyor:

Abstracting and indexing · Best practice · Readership · Subscription information ·
Mass media · Disclaimer · Research and publication ethics ·
Publication updates and corrections · Editorial policy · E-submission ·
Article processing charge
