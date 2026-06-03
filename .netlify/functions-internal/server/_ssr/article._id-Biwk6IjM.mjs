import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteHeader } from "./site-chrome-D6ilkQVL.mjs";
import { R as Route } from "./router-CvIdKJ3f.mjs";
import { A as ArrowLeft, E as ExternalLink } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
const palette = ["#c2410c", "#0e7490", "#15803d", "#a16207", "#7e22ce", "#be185d"];
function BarChart() {
  const data = [62, 48, 78, 35, 90, 55, 70];
  const max = Math.max(...data);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 320 200", className: "h-full w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "30", y1: "170", x2: "310", y2: "170", stroke: "currentColor", strokeOpacity: "0.2" }),
    [0, 0.25, 0.5, 0.75, 1].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "line",
      {
        x1: "30",
        x2: "310",
        y1: 170 - t * 140,
        y2: 170 - t * 140,
        stroke: "currentColor",
        strokeOpacity: "0.06"
      },
      i
    )),
    data.map((v, i) => {
      const h = v / max * 140;
      const x = 35 + i * (280 / data.length) + 4;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("g", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "rect",
        {
          x,
          y: 170 - h,
          width: 280 / data.length - 8,
          height: h,
          fill: palette[i % palette.length],
          opacity: "0.85",
          rx: "2"
        }
      ) }, i);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "170", y: "195", textAnchor: "middle", fontSize: "9", fill: "currentColor", opacity: "0.5", children: "Coğrafi bölgeler" })
  ] });
}
function ScatterChart() {
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = i / 40;
    const noise = (Math.sin(i * 7.3) + Math.cos(i * 2.1)) * 0.08;
    const y = 0.15 + x * 0.7 + noise;
    return { x: 30 + x * 270, y: 170 - y * 140 };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 320 200", className: "h-full w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "30", y1: "170", x2: "310", y2: "170", stroke: "currentColor", strokeOpacity: "0.2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "30", y1: "30", x2: "30", y2: "170", stroke: "currentColor", strokeOpacity: "0.2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "35", y1: "160", x2: "305", y2: "50", stroke: "#c2410c", strokeWidth: "1.5", strokeDasharray: "4 3" }),
    pts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: p.x, cy: p.y, r: "3", fill: "#0e7490", opacity: "0.7" }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "170", y: "195", textAnchor: "middle", fontSize: "9", fill: "currentColor", opacity: "0.5", children: "Organik madde (%)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "text",
      {
        x: "12",
        y: "100",
        fontSize: "9",
        fill: "currentColor",
        opacity: "0.5",
        transform: "rotate(-90 12 100)",
        textAnchor: "middle",
        children: "Shannon indeksi"
      }
    )
  ] });
}
function RadarChart() {
  const cx = 160;
  const cy = 110;
  const r = 75;
  const axes = 6;
  const angles = Array.from({ length: axes }, (_, i) => Math.PI * 2 * i / axes - Math.PI / 2);
  const grid = [0.25, 0.5, 0.75, 1];
  const series = [
    { color: "#c2410c", vals: [0.9, 0.7, 0.85, 0.6, 0.8, 0.75] },
    { color: "#0e7490", vals: [0.6, 0.85, 0.55, 0.9, 0.65, 0.8] },
    { color: "#15803d", vals: [0.7, 0.6, 0.9, 0.55, 0.85, 0.7] }
  ];
  const point = (a, v) => `${cx + Math.cos(a) * r * v},${cy + Math.sin(a) * r * v}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 320 220", className: "h-full w-full", children: [
    grid.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "polygon",
      {
        points: angles.map((a) => point(a, g)).join(" "),
        fill: "none",
        stroke: "currentColor",
        strokeOpacity: "0.1"
      },
      i
    )),
    angles.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "line",
      {
        x1: cx,
        y1: cy,
        x2: cx + Math.cos(a) * r,
        y2: cy + Math.sin(a) * r,
        stroke: "currentColor",
        strokeOpacity: "0.1"
      },
      i
    )),
    series.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "polygon",
      {
        points: angles.map((a, j) => point(a, s.vals[j])).join(" "),
        fill: s.color,
        fillOpacity: "0.15",
        stroke: s.color,
        strokeWidth: "1.5"
      },
      i
    )),
    ["Doğruluk", "Tutarlılık", "Akıcılık", "Terim", "Argüman", "Hız"].map((lbl, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "text",
      {
        x: cx + Math.cos(angles[i]) * (r + 14),
        y: cy + Math.sin(angles[i]) * (r + 14) + 3,
        textAnchor: "middle",
        fontSize: "9",
        fill: "currentColor",
        opacity: "0.7",
        children: lbl
      },
      i
    ))
  ] });
}
function DataTable() {
  const rows = [
    ["Marmara", "38.2%", "24.7%", "12.1%"],
    ["Ege", "35.8%", "26.4%", "13.5%"],
    ["İç Anadolu", "41.5%", "22.9%", "10.8%"],
    ["Karadeniz", "33.1%", "21.5%", "18.7%"]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full overflow-hidden p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[10px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-current/20 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1 pr-2 font-semibold", children: "Bölge" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1 pr-2 font-semibold", children: "Proteo." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1 pr-2 font-semibold", children: "Actino." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1 font-semibold", children: "Acido." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-current/10", children: r.map((c, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `py-1 pr-2 ${j === 0 ? "font-medium" : "font-mono"}`, children: c }, j)) }, i)) })
  ] }) });
}
function MapView() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 320 200", className: "h-full w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "0", width: "320", height: "200", fill: "#f0f9ff" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M20,80 Q60,40 110,60 T200,50 Q260,70 300,100 L300,180 L20,180 Z",
        fill: "#bae6fd",
        opacity: "0.4"
      }
    ),
    [
      { x: 90, y: 110, r: 32, c: "#ef4444" },
      { x: 140, y: 95, r: 26, c: "#f97316" },
      { x: 190, y: 120, r: 38, c: "#dc2626" },
      { x: 235, y: 100, r: 22, c: "#f59e0b" }
    ].map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: b.x, cy: b.y, r: b.r, fill: b.c, opacity: "0.45" }, i)),
    [
      { x: 80, y: 70, l: "Eminönü" },
      { x: 200, y: 75, l: "Sirkeci" },
      { x: 245, y: 130, l: "Sultanahmet" }
    ].map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: p.x, cy: p.y, r: "2", fill: "#1e293b" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: p.x + 5, y: p.y + 3, fontSize: "8", fill: "#1e293b", children: p.l })
    ] }, i))
  ] });
}
function pickRenderer(placeholder) {
  const p = placeholder.toLowerCase();
  if (p.includes("sütun") || p.includes("yığ")) return /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart, {});
  if (p.includes("saçılım") || p.includes("scatter")) return /* @__PURE__ */ jsxRuntimeExports.jsx(ScatterChart, {});
  if (p.includes("radar")) return /* @__PURE__ */ jsxRuntimeExports.jsx(RadarChart, {});
  if (p.includes("tablo")) return /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, {});
  if (p.includes("harita") || p.includes("map")) return /* @__PURE__ */ jsxRuntimeExports.jsx(MapView, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart, {});
}
function MockFigure({ figure }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex aspect-[16/10] items-center justify-center rounded-md border border-border bg-secondary/30 p-2 text-foreground/80", children: pickRenderer(figure.placeholder) });
}
function renderMarkdown(md) {
  const blocks = md.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: block.replace(/^## /, "") }, i);
    }
    if (block.startsWith("### ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: block.replace(/^### /, "") }, i);
    }
    if (block.startsWith("> ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("blockquote", { children: block.replace(/^> /, "") }, i);
    }
    const parts = block.split(/(\*\*[^*]+\*\*)/g);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: parts.map((p, j) => p.startsWith("**") && p.endsWith("**") ? /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: p.slice(2, -2) }, j) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p }, j)) }, i);
  });
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function ArticlePage() {
  const {
    article
  } = Route.useLoaderData();
  const [tab, setTab] = reactExports.useState("figures");
  const tabs = [{
    id: "figures",
    label: "Şekiller & Tablolar"
  }, {
    id: "references",
    label: "Kaynakça"
  }, {
    id: "info",
    label: "Makale Bilgisi"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-6 pt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Tüm makaleler"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-8 lg:grid lg:grid-cols-5 lg:gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "lg:col-span-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Araştırma Makalesi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(article.publishedAt) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "article-prose", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: article.title }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-2 border-y border-border py-5", children: [
          article.authors.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-baseline gap-x-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: a.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: a.affiliation }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://orcid.org/${a.orcid}`, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-accent", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, className: "inline-block h-2.5 w-2.5 rounded-full", style: {
                background: "var(--color-orcid)"
              } }),
              a.orcid
            ] })
          ] }, a.orcid)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://doi.org/${article.doi}`, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 font-mono text-accent hover:underline", children: [
            "doi.org/",
            article.doi,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-serif-display text-xl font-bold", children: "Özet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "article-prose text-[1.0625rem] leading-relaxed", children: article.abstract }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: article.keywords.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-secondary px-3 py-1 text-xs", children: k }, k)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "article-prose mt-12", children: renderMarkdown(article.content) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "mt-12 lg:col-span-2 lg:mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:sticky lg:top-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-border", children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t.id), className: `flex-1 px-3 py-3 text-xs font-medium transition-colors ${tab === t.id ? "border-b-2 border-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`, children: t.label }, t.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[calc(100vh-12rem)] overflow-y-auto p-5", children: [
          tab === "figures" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: article.figures.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MockFigure, { figure: f }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { className: "mt-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                f.label,
                "."
              ] }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: f.caption })
            ] })
          ] }, f.id)) }),
          tab === "references" && /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-3 text-sm", children: article.references.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
              "[",
              i + 1,
              "]"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: r.text })
          ] }, r.id)) }),
          tab === "info" && /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Geliş Tarihi", value: article.info.received }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Kabul Tarihi", value: article.info.accepted }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Yayın Tarihi", value: article.info.published }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Sorumlu Editör", value: article.info.editor }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Lisans", value: article.info.license }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "DOI", value: article.doi, mono: true })
          ] })
        ] })
      ] }) }) })
    ] })
  ] });
}
function InfoRow({
  label,
  value,
  mono
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4 border-b border-border pb-2 last:border-b-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: mono ? "font-mono text-xs" : "text-right font-medium", children: value })
  ] });
}
export {
  ArticlePage as component
};
