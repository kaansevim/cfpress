import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Search } from "../_libs/lucide-react.mjs";
function SiteHeader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-baseline gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif-display text-2xl font-bold tracking-tight", children: "Akademik Dergi" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-xs uppercase tracking-widest text-muted-foreground sm:inline", children: "açık erişim" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-1 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/",
          className: "rounded-md px-3 py-2 text-foreground transition-colors hover:bg-secondary",
          activeOptions: { exact: true },
          activeProps: { className: "font-semibold" },
          children: "Makaleler"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/dashboard",
          className: "rounded-md px-3 py-2 text-foreground transition-colors hover:bg-secondary",
          activeProps: { className: "font-semibold" },
          children: "Editör Paneli"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/auth",
          className: "ml-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Giriş Yap"
        }
      )
    ] })
  ] }) });
}
function SiteFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mt-24 border-t border-border bg-secondary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif-display text-lg font-bold", children: "Akademik Dergi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Açık erişimli, hakemli, Türkçe akademik yayın platformu." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 font-semibold", children: "Bağlantılar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Yazar Rehberi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Hakem Süreci" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Etik İlkeler" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 font-semibold", children: "Lisans" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Tüm içerikler CC BY 4.0 lisansı ile yayımlanır." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3" }),
      " ISSN 0000-0000 · DOI 10.62847/akademik"
    ] })
  ] }) });
}
export {
  SiteHeader as S,
  SiteFooter as a
};
