# Hangi metin nereden yönetiliyor?

_Güncelleme: 19 Ağustos 2026_

Kural basit: **OJS'te doluysa OJS'teki metin görünür, boşsa sitedeki hazır metin
görünür.** Yani hiçbir sayfa boş kalmaz; bir metni değiştirmek istediğinde OJS'e
yazman yeter, kod değişmez, sunucuya dokunulmaz.

## OJS'ten yönetilenler

Adres: `dergi.cf.org.tr/index.php/{dergi}/management/settings/context`

| cf.org.tr sayfası | OJS'te yeri |
|---|---|
| Aims and scope | Masthead → Journal Summary |
| About the journal | Masthead → About the Journal |
| Open access | Distribution → Open Access Policy |
| Contact us | Contact (ad, e-posta, telefon, adres) |
| Publishing credentials | Masthead → Publisher + Distribution → ISSN |
| Instructions for authors | Workflow → Submission → Author Guidelines |
| Checklist | Workflow → Submission → Submission Checklist |
| Conflict of interest | Workflow → Submission → Competing Interests |
| Copyright and licensing | Distribution → Copyright Notice (yoksa License Terms) |
| For reviewers | Workflow → Review → Reviewer Guidelines |

Sayılar ve makaleler zaten OJS'ten geliyor. Yeni sayı çıkarmak, makale
yayınlamak, bu metinleri değiştirmek — hiçbiri sunucu güncellemesi istemez.

## Kodda kalanlar

`frontend/src/lib/journals.ts` içinde:

- **Yayın kurulu** (`editorialBoard`) ve **yönetim ekibi** (`managementTeam`) —
  isim, görev, kurum, ülke, ORCID. Boş bırakılırsa sayfada "duyurulacaktır" yazar.
- Dergi adı, kısaltma, kapak görseli, renkler, konu başlıkları.

Örnek:

```ts
editorialBoard: [
  {
    name: "Prof. Dr. Ad Soyad",
    role: "Editor-in-Chief",
    affiliation: "Ankara Üniversitesi",
    country: "Türkiye",
    orcid: "0000-0002-1825-0097",
  },
],
```

Neden OJS'te değil: OJS'in kullanıcı listesi ile yayın kurulu sayfası aynı şey
değil; OJS'e editör eklemek kişiyi sisteme yetkilendirir, siteye yazmaz.
Listeyi burada tutmak, kimin görüneceğine tek tek karar vermeni sağlıyor.
Bu liste değiştiğinde kod güncellenir (tek satır ekleme, sonra `git push`).

## Henüz bağlanmayanlar

Bu başlıkların OJS'te karşılığı yok, metin kodda duruyor:
Abstracting and indexing, Best practice, Readership, Subscription information,
Mass media, Disclaimer, Research and publication ethics, Editorial policy,
E-submission, Article processing charge.
