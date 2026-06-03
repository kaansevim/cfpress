import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as submissions } from "./router-C1YiNSMi.mjs";
import { S as SiteHeader } from "./site-chrome-C4Xr1_fh.mjs";
import { U as Upload, X, F as FileText, a as FileCode } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
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
const statusStyles = {
  "Hakem Sürecinde": "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
  "Yayına Hazırlanıyor": "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
  "Yayımlandı": "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200"
};
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function DashboardPage() {
  const [modalFor, setModalFor] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-6xl px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-accent", children: "Editör Paneli" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-serif-display text-3xl font-bold", children: "Yayın İş Akışı" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Gönderilen makalelerin sürecini takip edin ve mizanpaj dosyalarını yükleyin." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-lg border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Gönderi No" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Başlık" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Sorumlu Yazar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Tarih" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Durum" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border bg-card", children: submissions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "transition-colors hover:bg-secondary/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4 font-mono text-xs text-muted-foreground", children: s.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4 font-medium", children: s.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4 text-muted-foreground", children: s.correspondingAuthor }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4 text-muted-foreground", children: formatDate(s.submittedAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[s.status]}`, children: s.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-4 text-right", children: s.status === "Yayına Hazırlanıyor" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setModalFor(s), className: "inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3 w-3" }),
            "Son Mizanpajı Yükle"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) })
        ] }, s.id)) })
      ] }) })
    ] }),
    modalFor && /* @__PURE__ */ jsxRuntimeExports.jsx(UploadGalleyModal, { submission: modalFor, onClose: () => setModalFor(null) })
  ] });
}
function UploadGalleyModal({
  submission,
  onClose
}) {
  const [doi, setDoi] = reactExports.useState("");
  const [pdf, setPdf] = reactExports.useState(null);
  const [xml, setXml] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-lg border border-border bg-card shadow-xl", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between border-b border-border px-6 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif-display text-lg font-bold", children: "Son Mizanpajı Yükle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: submission.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-md p-1 hover:bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      alert(`Yüklendi: ${submission.id}
DOI: ${doi}`);
      onClose();
    }, className: "space-y-5 px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileField, { label: "Final PDF (LaTeX ile üretilen)", accept: "application/pdf", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }), file: pdf, onChange: setPdf }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileField, { label: "JATS XML Dosyası (Etkileşimli okuyucu için)", accept: ".xml,application/xml,text/xml", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode, { className: "h-5 w-5" }), file: xml, onChange: setXml }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "doi", className: "mb-1 block text-sm font-medium", children: "DOI Numarası Ata" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "doi", type: "text", value: doi, onChange: (e) => setDoi(e.target.value), placeholder: "10.62847/akademik.2025.0099", className: "w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 border-t border-border pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary", children: "İptal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: "Yayımla" })
      ] })
    ] })
  ] }) });
}
function FileField({
  label,
  accept,
  icon,
  file,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border bg-secondary/30 px-4 py-3 transition-colors hover:border-ring", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm", children: file ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: file.name }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Dosya seçmek için tıklayın" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept, onChange: (e) => onChange(e.target.files?.[0] ?? null), className: "hidden", required: true })
    ] })
  ] });
}
export {
  DashboardPage as component
};
