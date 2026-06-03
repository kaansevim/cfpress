import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { Q as notFound } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
const appCss = "/assets/styles-gN0191zc.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$4 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Akademik Dergi" },
      { name: "description", content: "Açık erişimli Türkçe akademik yayın platformu" },
      { name: "author", content: "Akademik Dergi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Akademik Dergi" },
      { name: "twitter:title", content: "Akademik Dergi" },
      { property: "og:description", content: "Açık erişimli Türkçe akademik yayın platformu" },
      { name: "twitter:description", content: "Açık erişimli Türkçe akademik yayın platformu" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7193704d-8f91-416f-8638-eb8f4b14cf4d/id-preview-781b3c0e--77410258-0d53-4bb1-8048-02c9636b9929.lovable.app-1780485888132.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7193704d-8f91-416f-8638-eb8f4b14cf4d/id-preview-781b3c0e--77410258-0d53-4bb1-8048-02c9636b9929.lovable.app-1780485888132.png" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Noto+Sans:ital,wght@0,400..700;1,400..700&family=Noto+Serif:ital,wght@0,400..700;1,400..700&display=swap"
      },
      {
        rel: "icon",
        href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📖</text></svg>'
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "tr", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$4.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$3 = () => import("./dashboard-SzNa2fth.mjs");
const Route$3 = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Editör Paneli — Akademik Dergi"
    }, {
      name: "description",
      content: "Editörler için yayın iş akışı paneli."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./auth-BeFwVF84.mjs");
const Route$2 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Giriş Yap — Akademik Dergi"
    }, {
      name: "description",
      content: "ORCID veya e-posta ile Akademik Dergi'ye giriş yapın."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-CNJIODKZ.mjs");
const Route$1 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Akademik Dergi — Açık Erişimli Türkçe Akademik Yayın Platformu"
    }, {
      name: "description",
      content: "Hakemli, açık erişimli Türkçe akademik makaleler. Tüm bilim dallarından son araştırmaları keşfedin."
    }, {
      property: "og:title",
      content: "Akademik Dergi"
    }, {
      property: "og:description",
      content: "Hakemli, açık erişimli Türkçe akademik yayın platformu."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const articles = [
  {
    id: "1",
    title: "Türkiye'de Tarımsal Mikrobiyom Çeşitliliğinin Toprak Verimliliği Üzerindeki Etkisi",
    authors: [
      { name: "Dr. Ayşe Yılmaz", orcid: "0000-0002-1825-0097", affiliation: "İstanbul Üniversitesi, Ziraat Fakültesi" },
      { name: "Prof. Dr. Mehmet Demir", orcid: "0000-0001-5109-3700", affiliation: "Ankara Üniversitesi, Biyoloji Bölümü" }
    ],
    abstract: "Bu çalışma, Anadolu'nun farklı iklim kuşaklarında bulunan tarım topraklarındaki mikrobiyom çeşitliliğini metagenomik yaklaşımlarla incelemiş ve bu çeşitliliğin toprak verimliliği parametreleri ile güçlü bir korelasyon gösterdiğini ortaya koymuştur. Yedi farklı bölgeden alınan 240 toprak örneği analiz edilmiş, Proteobacteria ve Actinobacteria filumlarının baskınlığı tespit edilmiştir.",
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

Shannon çeşitlilik indeksi ile toprak organik madde içeriği arasında güçlü bir pozitif korelasyon (r = 0.78) gözlenmiştir. Bu bulgu, mikrobiyal çeşitliliğin toprak verimliliğinin doğrudan bir göstergesi olarak kullanılabileceğini önermektedir.

## Tartışma

Bulgularımız, sürdürülebilir tarım uygulamalarının planlanmasında mikrobiyal çeşitliliğin korunmasının kritik önem taşıdığını göstermektedir. Yoğun kimyasal gübre kullanımının uzun vadede mikrobiyom çeşitliliğini azalttığı; organik tarım uygulamalarının ise çeşitliliği koruduğu tespit edilmiştir.

## Sonuç

Türkiye genelinde tarımsal toprakların mikrobiyom haritasının çıkarılması, hem akademik hem de uygulamalı tarım politikaları için temel bir referans oluşturacaktır.`,
    figures: [
      { id: "f1", label: "Şekil 1", caption: "Yedi coğrafi bölgeden alınan toprak örneklerinin mikrobiyal filum dağılımı.", placeholder: "Yığılmış sütun grafiği" },
      { id: "f2", label: "Şekil 2", caption: "Shannon çeşitlilik indeksi ile organik madde içeriği arasındaki korelasyon.", placeholder: "Saçılım grafiği (r=0.78)" },
      { id: "t1", label: "Tablo 1", caption: "Bölgelere göre baskın bakteri filumlarının yüzdesel dağılımı.", placeholder: "Veri tablosu" }
    ],
    references: [
      { id: "r1", text: "Fierer, N. (2017). Embracing the unknown: disentangling the complexities of the soil microbiome. Nature Reviews Microbiology, 15(10), 579-590." },
      { id: "r2", text: "Bolyen, E. et al. (2019). Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. Nature Biotechnology, 37, 852-857." },
      { id: "r3", text: "Yılmaz, A. & Demir, M. (2022). Anadolu topraklarında mikrobiyal çeşitlilik. Türk Tarım Dergisi, 45(2), 112-128." }
    ],
    info: {
      received: "12 Kasım 2024",
      accepted: "28 Şubat 2025",
      published: "14 Mart 2025",
      editor: "Prof. Dr. Selma Kaya",
      license: "CC BY 4.0"
    }
  },
  {
    id: "2",
    title: "Büyük Dil Modellerinin Türkçe Akademik Metin Üretiminde Performans Karşılaştırması",
    authors: [
      { name: "Dr. Can Öztürk", orcid: "0000-0003-1415-9265", affiliation: "Boğaziçi Üniversitesi, Bilgisayar Mühendisliği" },
      { name: "Zeynep Aydın", orcid: "0000-0002-7182-8459", affiliation: "ODTÜ, Yapay Zekâ Enstitüsü" }
    ],
    abstract: "Bu makalede, açık ve kapalı kaynaklı altı farklı büyük dil modelinin Türkçe akademik metin üretimindeki performansı karşılaştırılmıştır. Değerlendirme; dilbilgisi doğruluğu, terminoloji tutarlılığı ve bilimsel argümantasyon kalitesi olmak üzere üç eksende yapılmıştır.",
    publishedAt: "2025-02-02",
    doi: "10.62847/akademik.2025.0002",
    keywords: ["büyük dil modelleri", "Türkçe NLP", "akademik yazım", "değerlendirme"],
    content: `## Giriş

Büyük dil modellerinin (BDM) akademik üretkenliğe etkisi son iki yılın en tartışmalı konularından biridir. Türkçe gibi morfolojik olarak zengin diller için bu modellerin performansı, İngilizce odaklı değerlendirmelerden anlamlı biçimde farklılaşmaktadır.

## Yöntemler

Karşılaştırmaya altı model dahil edilmiştir: GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, Llama 3.1 70B, Mistral Large ve yerli bir model olan TurkishBERT-XL. Her modelden 50 farklı akademik konuda 500 kelimelik metinler üretmesi istenmiştir.

## Bulgular

Kapalı kaynaklı modeller dilbilgisi doğruluğunda %95'in üzerinde başarı gösterirken; açık kaynaklı modeller %78-87 bandında kalmıştır. Terminoloji tutarlılığında ise yerli model TurkishBERT-XL, alan-özel terminolojide diğer modelleri geride bırakmıştır.

## Tartışma

Bulgular, Türkçe akademik metin üretiminde "tek bir en iyi model" bulunmadığını, kullanım amacına göre model seçiminin kritik olduğunu göstermektedir.

## Sonuç

Yerli dil modeli geliştirme çalışmalarının, alan-özel akademik kullanım senaryolarında stratejik bir avantaj sağlayabileceği değerlendirilmektedir.`,
    figures: [
      { id: "f1", label: "Şekil 1", caption: "Altı modelin üç değerlendirme ekseninde performans skorları.", placeholder: "Radar grafiği" },
      { id: "t1", label: "Tablo 1", caption: "Model özellikleri ve parametre sayıları.", placeholder: "Karşılaştırma tablosu" }
    ],
    references: [
      { id: "r1", text: "Brown, T. et al. (2020). Language Models are Few-Shot Learners. NeurIPS." },
      { id: "r2", text: "Öztürk, C. (2024). Türkçe doğal dil işleme: güncel durum. TBV Bilgisayar Bilimleri Dergisi, 17(1)." }
    ],
    info: {
      received: "5 Aralık 2024",
      accepted: "20 Ocak 2025",
      published: "2 Şubat 2025",
      editor: "Doç. Dr. Murat Şahin",
      license: "CC BY 4.0"
    }
  },
  {
    id: "3",
    title: "İstanbul'un Tarihi Yarımadasında Mikroklimatik Değişimlerin Mekânsal Analizi",
    authors: [
      { name: "Doç. Dr. Ekin Arslan", orcid: "0000-0004-3829-1182", affiliation: "Mimar Sinan Güzel Sanatlar Üniversitesi, Şehircilik" }
    ],
    abstract: "Sur içi İstanbul'da 2015-2024 dönemini kapsayan uydu verileri ve yer ölçümleri birleştirilerek mikroklimatik değişim haritası üretilmiştir. Yeşil alan kaybı ile yüzey sıcaklığı artışı arasında anlamlı bir ilişki tespit edilmiştir.",
    publishedAt: "2024-12-19",
    doi: "10.62847/akademik.2024.0017",
    keywords: ["mikroklima", "kentsel ısı adası", "İstanbul", "uzaktan algılama"],
    content: `## Giriş

Tarihi kentlerin mikroklimatik dengesi, hem kültürel mirasın korunması hem de yaşam kalitesi açısından kritik öneme sahiptir.

## Yöntemler

Landsat-8 ve Sentinel-2 uydu verileri ile sahada konuşlandırılan 42 sensörden elde edilen veriler birlikte değerlendirilmiştir.

## Bulgular

Sur içi bölgede ortalama yüzey sıcaklığı son on yılda 2.1°C artmıştır. En yüksek artış, yeşil alanların azaldığı Eminönü ve Sirkeci aksında gözlenmiştir.

## Sonuç

Tarihi yarımadanın mikroklimatik dengesini korumak için hedefli yeşil altyapı müdahaleleri acil ihtiyaçtır.`,
    figures: [
      { id: "f1", label: "Şekil 1", caption: "2015 ve 2024 yıllarına ait yüzey sıcaklığı haritaları.", placeholder: "Eş zamanlı harita karşılaştırması" }
    ],
    references: [
      { id: "r1", text: "Oke, T. R. (1982). The energetic basis of the urban heat island. QJRMS, 108, 1-24." }
    ],
    info: {
      received: "1 Eylül 2024",
      accepted: "10 Aralık 2024",
      published: "19 Aralık 2024",
      editor: "Prof. Dr. Selma Kaya",
      license: "CC BY 4.0"
    }
  }
];
const getArticle = (id) => articles.find((a) => a.id === id);
const submissions = [
  { id: "S-2025-014", title: "Anadolu Endemik Bitkilerinde Sekonder Metabolit Çeşitliliği", correspondingAuthor: "Dr. Berk Çelik", submittedAt: "2025-04-02", status: "Hakem Sürecinde" },
  { id: "S-2025-013", title: "Pandemi Sonrası Üniversite Öğrencilerinde Dijital Bağımlılık", correspondingAuthor: "Prof. Dr. Nilgün Akar", submittedAt: "2025-03-21", status: "Hakem Sürecinde" },
  { id: "S-2025-011", title: "Marmara Denizi Plankton Topluluklarının Mevsimsel Değişimi", correspondingAuthor: "Dr. Hakan Yıldız", submittedAt: "2025-02-28", status: "Yayına Hazırlanıyor" },
  { id: "S-2025-009", title: "Kuantum Anahtar Dağıtımı için Yeni Bir Protokol Önerisi", correspondingAuthor: "Doç. Dr. Elif Polat", submittedAt: "2025-02-10", status: "Yayına Hazırlanıyor" },
  { id: "S-2024-074", title: "Türkiye'de Tarımsal Mikrobiyom Çeşitliliği", correspondingAuthor: "Dr. Ayşe Yılmaz", submittedAt: "2024-11-12", status: "Yayımlandı" },
  { id: "S-2024-061", title: "Büyük Dil Modellerinin Türkçe Akademik Metin Üretimi", correspondingAuthor: "Dr. Can Öztürk", submittedAt: "2024-12-05", status: "Yayımlandı" }
];
const $$splitComponentImporter = () => import("./article._id-Biwk6IjM.mjs");
const $$splitErrorComponentImporter = () => import("./article._id-DkFFiRmK.mjs");
const $$splitNotFoundComponentImporter = () => import("./article._id-_j_d3Aye.mjs");
const Route = createFileRoute("/article/$id")({
  loader: ({
    params
  }) => {
    const article = getArticle(params.id);
    if (!article) throw notFound();
    return {
      article
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: loaderData ? [{
      title: `${loaderData.article.title} — Akademik Dergi`
    }, {
      name: "description",
      content: loaderData.article.abstract.slice(0, 160)
    }, {
      property: "og:title",
      content: loaderData.article.title
    }, {
      property: "og:description",
      content: loaderData.article.abstract.slice(0, 160)
    }] : [{
      title: "Makale — Akademik Dergi"
    }]
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const DashboardRoute = Route$3.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$4
});
const AuthRoute = Route$2.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$4
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$4
});
const ArticleIdRoute = Route.update({
  id: "/article/$id",
  path: "/article/$id",
  getParentRoute: () => Route$4
});
const rootRouteChildren = {
  IndexRoute,
  AuthRoute,
  DashboardRoute,
  ArticleIdRoute
};
const routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route as R,
  articles as a,
  router as r,
  submissions as s
};
