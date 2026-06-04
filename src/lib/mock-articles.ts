export interface Author {
  name: string;
  orcid: string;
  affiliation: string;
  isCorresponding?: boolean;
  email?: string;
  contributions?: string[];
}

export interface Figure {
  id: string;
  label: string;
  caption: string;
  placeholder: string;
}

export interface Reference {
  id: string;
  text: string;
}

export interface Article {
  id: string;
  journalSlug: string;
  subject: string;
  title: string;
  authors: Author[];
  abstract: string;
  publishedAt: string;
  doi: string;
  keywords: string[];
  content: string;
  figures: Figure[];
  references: Reference[];
  metrics: {
    views: number;
    downloads: number;
    citations: number;
  };
  funding?: string;
  dataAvailability?: string;
  info: {
    received: string;
    accepted: string;
    published: string;
    editor: string;
    license: string;
  };
}

export const articles: Article[] = [
  {
    id: "1",
    journalSlug: "social-solutions",
    subject: "Toplum Sağlığı & Çevre",
    title: "Türkiye'de Tarımsal Mikrobiyom Çeşitliliğinin Toprak Verimliliği Üzerindeki Etkisi",
    authors: [
      { name: "Dr. Ayşe Yılmaz", orcid: "0000-0002-1825-0097", affiliation: "İstanbul Üniversitesi, Ziraat Fakültesi", isCorresponding: true, email: "ayse.yilmaz@istanbul.edu.tr", contributions: ["Kavramsallaştırma", "Metodoloji", "Yazım — özgün taslak"] },
      { name: "Prof. Dr. Mehmet Demir", orcid: "0000-0001-5109-3700", affiliation: "Ankara Üniversitesi, Biyoloji Bölümü", contributions: ["Denetim", "Yazım — gözden geçirme ve düzenleme"] },
    ],
    abstract:
      "Bu çalışma, Anadolu'nun farklı iklim kuşaklarında bulunan tarım topraklarındaki mikrobiyom çeşitliliğini metagenomik yaklaşımlarla incelemiş ve bu çeşitliliğin toprak verimliliği parametreleri ile güçlü bir korelasyon gösterdiğini ortaya koymuştur. Yedi farklı bölgeden alınan 240 toprak örneği analiz edilmiş, Proteobacteria ve Actinobacteria filumlarının baskınlığı tespit edilmiştir.",
    publishedAt: "2025-03-14",
    doi: "10.62847/akademik.2025.0001",
    keywords: ["mikrobiyom", "toprak verimliliği", "metagenomik", "Anadolu"],
    content: `## Giriş

Toprak mikrobiyomu, tarımsal üretkenliğin görünmez ama belirleyici aktörüdür. Son on yılda gelişen yüksek verimli sekanslama teknolojileri, toprak içindeki mikrobiyal toplulukların kompozisyonunu eşi görülmemiş bir çözünürlükte tanımlamamıza imkân tanımıştır.

Türkiye, üç farklı iklim kuşağını barındıran coğrafi konumu sayesinde bu tür çalışmalar için eşsiz bir doğal laboratuvar sunmaktadır. Buna rağmen, ülkemizde tarımsal mikrobiyom çeşitliliğini sistematik olarak ele alan kapsamlı bir araştırma henüz mevcut değildir.

## Yöntemler

2023 yılı bahar ve sonbahar dönemlerinde Trakya, Ege, Akdeniz, İç Anadolu, Karadeniz, Doğu Anadolu ve Güneydoğu Anadolu bölgelerinden toplam **240 toprak örneği** toplanmıştır. Her örnekten DNA izolasyonu standart CTAB protokolü ile gerçekleştirilmiş; 16S rRNA geninin V3-V4 bölgesi Illumina MiSeq platformunda sekanslanmıştır.

> Veriler QIIME2 (sürüm 2024.5) kullanılarak işlenmiş ve istatistiksel analizler R ortamında gerçekleştirilmiştir.

## Bulgular

Genel olarak Proteobacteria (%38.2) ve Actinobacteria (%24.7) filumları baskın bulunmuştur. Karadeniz bölgesi topraklarında Acidobacteria oranı diğer bölgelere kıyasla anlamlı düzeyde yüksek bulunmuştur (p < 0.001).

[[fig:f1]]

Shannon çeşitlilik indeksi ile toprak organik madde içeriği arasında güçlü bir pozitif korelasyon (r = 0.78) gözlenmiştir. Bu bulgu, mikrobiyal çeşitliliğin toprak verimliliğinin doğrudan bir göstergesi olarak kullanılabileceğini önermektedir.

[[fig:f2]]

## Tartışma

Bulgularımız, sürdürülebilir tarım uygulamalarının planlanmasında mikrobiyal çeşitliliğin korunmasının kritik önem taşıdığını göstermektedir. Yoğun kimyasal gübre kullanımının uzun vadede mikrobiyom çeşitliliğini azalttığı; organik tarım uygulamalarının ise çeşitliliği koruduğu tespit edilmiştir.

## Sonuç

Türkiye genelinde tarımsal toprakların mikrobiyom haritasının çıkarılması, hem akademik hem de uygulamalı tarım politikaları için temel bir referans oluşturacaktır.`,
    figures: [
      { id: "f1", label: "Şekil 1", caption: "Yedi coğrafi bölgeden alınan toprak örneklerinin mikrobiyal filum dağılımı.", placeholder: "Yığılmış sütun grafiği" },
      { id: "f2", label: "Şekil 2", caption: "Shannon çeşitlilik indeksi ile organik madde içeriği arasındaki korelasyon.", placeholder: "Saçılım grafiği (r=0.78)" },
      { id: "t1", label: "Tablo 1", caption: "Bölgelere göre baskın bakteri filumlarının yüzdesel dağılımı.", placeholder: "Veri tablosu" },
    ],
    references: [
      { id: "r1", text: "Fierer, N. (2017). Embracing the unknown: disentangling the complexities of the soil microbiome. Nature Reviews Microbiology, 15(10), 579-590." },
      { id: "r2", text: "Bolyen, E. et al. (2019). Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. Nature Biotechnology, 37, 852-857." },
      { id: "r3", text: "Yılmaz, A. & Demir, M. (2022). Anadolu topraklarında mikrobiyal çeşitlilik. Türk Tarım Dergisi, 45(2), 112-128." },
    ],
    metrics: { views: 4218, downloads: 1126, citations: 14 },
    funding: "Bu çalışma TÜBİTAK 1001 programı (proje no. 123A456) tarafından desteklenmiştir.",
    dataAvailability: "Ham sekanslama verileri NCBI SRA veri tabanında PRJNA000001 erişim numarasıyla kamuya açıktır.",
    info: {
      received: "12 Kasım 2024",
      accepted: "28 Şubat 2025",
      published: "14 Mart 2025",
      editor: "Prof. Dr. Selma Kaya",
      license: "CC BY 4.0",
    },
  },
  {
    id: "2",
    journalSlug: "cognitive-formation",
    subject: "Yapay Zekâ & Dilbilim",
    title: "Büyük Dil Modellerinin Türkçe Akademik Metin Üretiminde Performans Karşılaştırması",
    authors: [
      { name: "Dr. Can Öztürk", orcid: "0000-0003-1415-9265", affiliation: "Boğaziçi Üniversitesi, Bilgisayar Mühendisliği", isCorresponding: true, email: "can.ozturk@boun.edu.tr", contributions: ["Kavramsallaştırma", "Yazılım", "Yazım — özgün taslak"] },
      { name: "Zeynep Aydın", orcid: "0000-0002-7182-8459", affiliation: "ODTÜ, Yapay Zekâ Enstitüsü", contributions: ["Veri derleme", "Doğrulama"] },
    ],
    abstract:
      "Bu makalede, açık ve kapalı kaynaklı altı farklı büyük dil modelinin Türkçe akademik metin üretimindeki performansı karşılaştırılmıştır. Değerlendirme; dilbilgisi doğruluğu, terminoloji tutarlılığı ve bilimsel argümantasyon kalitesi olmak üzere üç eksende yapılmıştır.",
    publishedAt: "2025-02-02",
    doi: "10.62847/akademik.2025.0002",
    keywords: ["büyük dil modelleri", "Türkçe NLP", "akademik yazım", "değerlendirme"],
    content: `## Giriş

Büyük dil modellerinin (BDM) akademik üretkenliğe etkisi son iki yılın en tartışmalı konularından biridir. Türkçe gibi morfolojik olarak zengin diller için bu modellerin performansı, İngilizce odaklı değerlendirmelerden anlamlı biçimde farklılaşmaktadır.

## Yöntemler

Karşılaştırmaya altı model dahil edilmiştir: GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, Llama 3.1 70B, Mistral Large ve yerli bir model olan TurkishBERT-XL. Her modelden 50 farklı akademik konuda 500 kelimelik metinler üretmesi istenmiştir.

## Bulgular

Kapalı kaynaklı modeller dilbilgisi doğruluğunda %95'in üzerinde başarı gösterirken; açık kaynaklı modeller %78-87 bandında kalmıştır. Terminoloji tutarlılığında ise yerli model TurkishBERT-XL, alan-özel terminolojide diğer modelleri geride bırakmıştır.

[[fig:f1]]

## Tartışma

Bulgular, Türkçe akademik metin üretiminde "tek bir en iyi model" bulunmadığını, kullanım amacına göre model seçiminin kritik olduğunu göstermektedir.

## Sonuç

Yerli dil modeli geliştirme çalışmalarının, alan-özel akademik kullanım senaryolarında stratejik bir avantaj sağlayabileceği değerlendirilmektedir.`,
    figures: [
      { id: "f1", label: "Şekil 1", caption: "Altı modelin üç değerlendirme ekseninde performans skorları.", placeholder: "Radar grafiği" },
      { id: "t1", label: "Tablo 1", caption: "Model özellikleri ve parametre sayıları.", placeholder: "Karşılaştırma tablosu" },
    ],
    references: [
      { id: "r1", text: "Brown, T. et al. (2020). Language Models are Few-Shot Learners. NeurIPS." },
      { id: "r2", text: "Öztürk, C. (2024). Türkçe doğal dil işleme: güncel durum. TBV Bilgisayar Bilimleri Dergisi, 17(1)." },
    ],
    metrics: { views: 7903, downloads: 2541, citations: 22 },
    funding: "Bu araştırma için herhangi bir dış finansman alınmamıştır.",
    dataAvailability: "Üretilen metinler ve değerlendirme kodları açık bir depoda (github.com/ornek/bdm-degerlendirme) paylaşılmıştır.",
    info: {
      received: "5 Aralık 2024",
      accepted: "20 Ocak 2025",
      published: "2 Şubat 2025",
      editor: "Doç. Dr. Murat Şahin",
      license: "CC BY 4.0",
    },
  },
  {
    id: "3",
    journalSlug: "economic-change-future",
    subject: "Kentleşme & Çevre",
    title: "İstanbul'un Tarihi Yarımadasında Mikroklimatik Değişimlerin Mekânsal Analizi",
    authors: [
      { name: "Doç. Dr. Ekin Arslan", orcid: "0000-0004-3829-1182", affiliation: "Mimar Sinan Güzel Sanatlar Üniversitesi, Şehircilik", isCorresponding: true, email: "ekin.arslan@msgsu.edu.tr", contributions: ["Kavramsallaştırma", "Metodoloji", "Görselleştirme", "Yazım — özgün taslak"] },
    ],
    abstract:
      "Sur içi İstanbul'da 2015-2024 dönemini kapsayan uydu verileri ve yer ölçümleri birleştirilerek mikroklimatik değişim haritası üretilmiştir. Yeşil alan kaybı ile yüzey sıcaklığı artışı arasında anlamlı bir ilişki tespit edilmiştir.",
    publishedAt: "2024-12-19",
    doi: "10.62847/akademik.2024.0017",
    keywords: ["mikroklima", "kentsel ısı adası", "İstanbul", "uzaktan algılama"],
    content: `## Giriş

Tarihi kentlerin mikroklimatik dengesi, hem kültürel mirasın korunması hem de yaşam kalitesi açısından kritik öneme sahiptir.

## Yöntemler

Landsat-8 ve Sentinel-2 uydu verileri ile sahada konuşlandırılan 42 sensörden elde edilen veriler birlikte değerlendirilmiştir.

## Bulgular

Sur içi bölgede ortalama yüzey sıcaklığı son on yılda 2.1°C artmıştır. En yüksek artış, yeşil alanların azaldığı Eminönü ve Sirkeci aksında gözlenmiştir.

[[fig:f1]]

## Sonuç

Tarihi yarımadanın mikroklimatik dengesini korumak için hedefli yeşil altyapı müdahaleleri acil ihtiyaçtır.`,
    figures: [
      { id: "f1", label: "Şekil 1", caption: "2015 ve 2024 yıllarına ait yüzey sıcaklığı haritaları.", placeholder: "Eş zamanlı harita karşılaştırması" },
    ],
    references: [
      { id: "r1", text: "Oke, T. R. (1982). The energetic basis of the urban heat island. QJRMS, 108, 1-24." },
    ],
    metrics: { views: 2987, downloads: 813, citations: 6 },
    funding: "İstanbul Büyükşehir Belediyesi Şehir Politikaları Merkezi tarafından desteklenmiştir.",
    dataAvailability: "İşlenmiş sıcaklık katmanları ve sensör verileri talep üzerine sorumlu yazardan temin edilebilir.",
    info: {
      received: "1 Eylül 2024",
      accepted: "10 Aralık 2024",
      published: "19 Aralık 2024",
      editor: "Prof. Dr. Selma Kaya",
      license: "CC BY 4.0",
    },
  },
  {
    id: "4",
    journalSlug: "community-foundations",
    subject: "Sivil Toplum & Yerel Yönetişim",
    title: "Türkiye'de Mahalle Muhtarlıklarının Dijital Dönüşümü: Katılımcı Yönetişim Üzerine Bir Saha Araştırması",
    authors: [
      {
        name: "Doç. Dr. Fatma Çelik",
        orcid: "0000-0001-2345-6789",
        affiliation: "Marmara Üniversitesi, Siyaset Bilimi ve Kamu Yönetimi",
        isCorresponding: true,
        email: "fatma.celik@marmara.edu.tr",
        contributions: ["Kavramsallaştırma", "Saha araştırması", "Yazım — özgün taslak"],
      },
      {
        name: "Dr. Tarık Soysal",
        orcid: "0000-0002-9876-5432",
        affiliation: "Sakarya Üniversitesi, Yerel Yönetimler Araştırma Merkezi",
        contributions: ["Veri analizi", "Yazım — gözden geçirme"],
      },
    ],
    abstract:
      "Bu çalışma, Türkiye'deki 48 mahalle muhtarlığında yürütülen saha araştırmasıyla dijital dönüşüm süreçlerini ve bu süreçlerin vatandaş katılımına etkisini incelemiştir. E-muhtarlık uygulamalarının benimsenmesinde altyapı, dijital okuryazarlık ve kurumsal destek olmak üzere üç kritik faktör belirlenmiştir.",
    publishedAt: "2025-05-08",
    doi: "10.62847/akademik.2025.0004",
    keywords: ["dijital dönüşüm", "muhtarlık", "katılımcı yönetişim", "yerel yönetim"],
    content: `## Giriş

Yerel yönetim birimlerinin dijitalleşmesi, kamu hizmetlerinin etkinliği ve vatandaş katılımı açısından kritik öneme sahiptir. Türkiye'de yaklaşık 51.000 mahalle muhtarlığı, yerel yönetimin en küçük birimi olarak vatandaşla doğrudan temas noktasını oluşturmaktadır.

## Yöntemler

Araştırma, 2024 yılı Ekim–Aralık döneminde İstanbul, Ankara, İzmir, Bursa ve Gaziantep illerinden seçilen **48 muhtarlıkta** karma yöntem deseniyle yürütülmüştür. Muhtarlarla yapılandırılmış görüşmeler ve vatandaş anketleri birlikte kullanılmıştır.

## Bulgular

Dijital araç kullanan muhtarlıklarda vatandaş başvuru süresi ortalama **%62 kısalmıştır**. Bununla birlikte, 65 yaş üstü nüfusun yoğun olduğu mahallelerde dijital hizmetlere erişim oranı %23 ile sınırlı kalmaktadır.

[[fig:f1]]

## Tartışma

Dijital dönüşümün salt teknoloji yatırımına indirgenmesi yetersiz kalmaktadır. Başarılı uygulamalar incelendiğinde, sürdürülebilir dijitalleşmenin arkasında güçlü bir kapasite geliştirme programı olduğu görülmektedir.

## Sonuç

Muhtarlıklarda dijital dönüşüm, altyapı, eğitim ve kurumsal destek sacayağına oturtulduğunda vatandaş memnuniyetini ve katılımı anlamlı biçimde artırabilecek potansiyele sahiptir.`,
    figures: [
      {
        id: "f1",
        label: "Şekil 1",
        caption: "İllere göre dijital hizmet benimseme oranları ve vatandaş memnuniyeti skorları.",
        placeholder: "Çubuk grafik + çizgi grafik (ikili eksen)",
      },
      {
        id: "t1",
        label: "Tablo 1",
        caption: "Araştırma kapsamındaki muhtarlıkların demografik özellikleri.",
        placeholder: "Veri tablosu",
      },
    ],
    references: [
      {
        id: "r1",
        text: "Özgür, H. & Kösecik, M. (2019). Yerel yönetimler üzerine güncel araştırmalar. Adalet Yayınevi.",
      },
      {
        id: "r2",
        text: "Yıldırım, Ü. (2023). E-devlet ve yerel katılım: Türkiye deneyimi. Amme İdaresi Dergisi, 56(1), 45–72.",
      },
      {
        id: "r3",
        text: "OECD (2022). Digital Government Review of Turkey. OECD Publishing.",
      },
    ],
    metrics: { views: 891, downloads: 234, citations: 0 },
    funding: "Bu araştırma için herhangi bir dış finansman alınmamıştır.",
    dataAvailability: "Anket verileri ve görüşme transkriptleri talep üzerine sorumlu yazardan temin edilebilir.",
    info: {
      received: "3 Mart 2025",
      accepted: "22 Nisan 2025",
      published: "8 Mayıs 2025",
      editor: "Prof. Dr. Selma Kaya",
      license: "CC BY 4.0",
    },
  },
];

export const getArticle = (id: string) => articles.find((a) => a.id === id);

export const getArticlesByJournal = (journalSlug: string) =>
  articles.filter((a) => a.journalSlug === journalSlug);

export type SubmissionStatus = "Hakem Sürecinde" | "Yayına Hazırlanıyor" | "Yayımlandı";

export interface Submission {
  id: string;
  title: string;
  correspondingAuthor: string;
  submittedAt: string;
  status: SubmissionStatus;
}

export const submissions: Submission[] = [
  { id: "S-2025-014", title: "Anadolu Endemik Bitkilerinde Sekonder Metabolit Çeşitliliği", correspondingAuthor: "Dr. Berk Çelik", submittedAt: "2025-04-02", status: "Hakem Sürecinde" },
  { id: "S-2025-013", title: "Pandemi Sonrası Üniversite Öğrencilerinde Dijital Bağımlılık", correspondingAuthor: "Prof. Dr. Nilgün Akar", submittedAt: "2025-03-21", status: "Hakem Sürecinde" },
  { id: "S-2025-011", title: "Marmara Denizi Plankton Topluluklarının Mevsimsel Değişimi", correspondingAuthor: "Dr. Hakan Yıldız", submittedAt: "2025-02-28", status: "Yayına Hazırlanıyor" },
  { id: "S-2025-009", title: "Kuantum Anahtar Dağıtımı için Yeni Bir Protokol Önerisi", correspondingAuthor: "Doç. Dr. Elif Polat", submittedAt: "2025-02-10", status: "Yayına Hazırlanıyor" },
  { id: "S-2024-074", title: "Türkiye'de Tarımsal Mikrobiyom Çeşitliliği", correspondingAuthor: "Dr. Ayşe Yılmaz", submittedAt: "2024-11-12", status: "Yayımlandı" },
  { id: "S-2024-061", title: "Büyük Dil Modellerinin Türkçe Akademik Metin Üretimi", correspondingAuthor: "Dr. Can Öztürk", submittedAt: "2024-12-05", status: "Yayımlandı" },
];
