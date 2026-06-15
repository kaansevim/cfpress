import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteHeader } from "./site-chrome-C4Xr1_fh.mjs";
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
import "../_libs/lucide-react.mjs";
function OrcidIcon({
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 256 256", className, "aria-hidden": true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "128", cy: "128", r: "128", fill: "#A6CE39" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { fill: "#fff", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "86", y: "98", width: "14", height: "100", rx: "2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "93", cy: "78", r: "9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M115 98h47c30 0 50 22 50 50s-20 50-50 50h-47V98zm14 14v72h32c22 0 36-16 36-36s-14-36-36-36h-32z" })
    ] })
  ] });
}
function AuthPage() {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto flex max-w-md flex-col px-6 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif-display text-3xl font-bold", children: "Hesabınıza giriş yapın" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Araştırmacılar için ORCID ile tek tıkla giriş öneriyoruz." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "mt-8 inline-flex items-center justify-center gap-3 rounded-md border border-border px-4 py-3 text-sm font-semibold transition-all hover:shadow-md", style: {
        background: "var(--color-orcid)",
        color: "var(--color-orcid-foreground)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(OrcidIcon, { className: "h-6 w-6" }),
        "ORCID ile Giriş Yap"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "ORCID; araştırmacılara özel, kalıcı bir dijital tanımlayıcıdır." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-8 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" }),
        "veya",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
      }, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", className: "mb-1 block text-sm font-medium", children: "E-posta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "ad.soyad@universite.edu.tr", className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "password", className: "mb-1 block text-sm font-medium", children: "Şifre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90", children: "Giriş Yap" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
        "Hesabınız yok mu?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "font-medium text-accent hover:underline", children: "Kayıt olun" })
      ] })
    ] })
  ] });
}
export {
  AuthPage as component
};
