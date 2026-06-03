import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as articles } from "./router-CvIdKJ3f.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteHeader, a as SiteFooter } from "./site-chrome-D6ilkQVL.mjs";
import { S as Search } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function ArticleCard({ article }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group border-b border-border py-8 last:border-b-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(article.publishedAt) }),
      article.keywords.slice(0, 2).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-secondary px-2 py-0.5 normal-case tracking-normal", children: k }, k))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/article/$id", params: { id: article.id }, className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif-display text-2xl font-bold leading-tight transition-colors group-hover:text-accent sm:text-3xl", children: article.title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-muted-foreground", children: article.authors.map((a) => a.name).join(", ") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "article-prose mt-4 line-clamp-3 text-base", children: article.abstract }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/article/$id",
          params: { id: article.id },
          className: "font-medium text-accent hover:underline",
          children: "Makaleyi oku →"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: `https://doi.org/${article.doi}`,
          target: "_blank",
          rel: "noreferrer",
          className: "font-mono text-xs text-muted-foreground hover:text-foreground",
          children: [
            "doi.org/",
            article.doi
          ]
        }
      )
    ] })
  ] });
}
function HomePage() {
  const [query, setQuery] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) => a.title.toLowerCase().includes(q) || a.abstract.toLowerCase().includes(q) || a.authors.some((au) => au.name.toLowerCase().includes(q)) || a.keywords.some((k) => k.toLowerCase().includes(q)));
  }, [query]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-6 py-20 text-center sm:py-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent", children: "Açık Erişim · Hakemli · Türkçe" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl", children: "Bilim, herkesin erişimine açık olmalı." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground", children: "Akademik Dergi; tüm disiplinlerden Türkçe araştırmaları, ücretsiz ve etkileşimli bir okuma deneyimiyle bilim topluluğuna sunar." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif-display text-xl font-bold", children: "Son Makaleler" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Makale, yazar, anahtar kelime...", className: "w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20" })
        ] })
      ] }),
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-12 text-center text-muted-foreground", children: "Aramanızla eşleşen makale bulunamadı." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleCard, { article: a }, a.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
export {
  HomePage as component
};
