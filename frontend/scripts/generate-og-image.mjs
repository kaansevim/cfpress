// Generates public/cfopen-share.png (1200x630) for social share previews.
// Run with: node scripts/generate-og-image.mjs
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const W = 1200;
const H = 630;

const logo = readFileSync(join(root, "public", "brand", "cfopen-lockup-primary.png")).toString("base64");

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f7fafc"/>
      <stop offset="0.62" stop-color="#edf5fa"/>
      <stop offset="1" stop-color="#e6f1f8"/>
    </linearGradient>
    <linearGradient id="signal" x1="760" y1="138" x2="1095" y2="510" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0068b7" stop-opacity="0.96"/>
      <stop offset="0.62" stop-color="#0b85c8" stop-opacity="0.76"/>
      <stop offset="1" stop-color="#55bde5" stop-opacity="0.46"/>
    </linearGradient>
    <filter id="soft-shadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#0b5d91" flood-opacity="0.13"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#background)"/>
  <rect x="0" y="0" width="${W}" height="8" fill="#087acc"/>

  <!-- Small platform lockup; page title and URL are supplied by Open Graph metadata. -->
  <image href="data:image/png;base64,${logo}" x="78" y="72" width="300" height="55" preserveAspectRatio="xMinYMid meet"/>

  <text x="80" y="410" font-family="Arial, Helvetica, sans-serif" font-size="25" letter-spacing="5"
        font-weight="700" fill="#0b70b9">OPEN ACCESS · PEER REVIEWED</text>
  <text x="78" y="468" font-family="Georgia, 'Times New Roman', serif" font-size="51"
        font-weight="700" fill="#17324a">Research for a</text>
  <text x="78" y="523" font-family="Georgia, 'Times New Roman', serif" font-size="51"
        font-weight="700" fill="#17324a">changing world.</text>
  <line x1="80" y1="552" x2="565" y2="552" stroke="#0b70b9" stroke-opacity="0.2" stroke-width="2"/>
  <text x="80" y="591" font-family="Arial, Helvetica, sans-serif" font-size="23" fill="#60798c">Peer-reviewed research, freely accessible.</text>

  <!-- Abstract radar signal, echoing the CF Open mark and homepage visual. -->
  <g fill="none" stroke="#164f78">
    <circle cx="912" cy="322" r="230" stroke-width="2" stroke-opacity="0.10" stroke-dasharray="930 520" transform="rotate(-34 912 322)"/>
    <circle cx="912" cy="322" r="206" stroke-width="10" stroke-opacity="0.07" stroke-dasharray="370 930" transform="rotate(22 912 322)"/>
    <polygon points="912,116 1090,219 1090,425 912,528 734,425 734,219" stroke-width="2" stroke-opacity="0.23"/>
    <polygon points="912,169 1044,245 1044,397 912,473 780,397 780,245" stroke-opacity="0.14"/>
    <polygon points="912,220 1000,271 1000,373 912,424 824,373 824,271" stroke-opacity="0.12"/>
    <path d="M912 116v412M734 219l356 206M1090 219L734 425" stroke-opacity="0.10"/>
  </g>

  <polygon points="912,139 1047,244 1068,407 912,490 769,404 799,236"
           fill="url(#signal)" stroke="#075f99" stroke-width="4" stroke-linejoin="round" filter="url(#soft-shadow)"/>
  <polygon points="912,207 1071,266 1014,433 912,467 782,394 826,238"
           fill="none" stroke="#ee9d2d" stroke-width="4" stroke-linejoin="round"/>

  <g fill="#eef8fc" stroke="#086aa7" stroke-width="4">
    <circle cx="912" cy="139" r="9"/><circle cx="1047" cy="244" r="9"/>
    <circle cx="1068" cy="407" r="9"/><circle cx="912" cy="490" r="9"/>
    <circle cx="769" cy="404" r="9"/><circle cx="799" cy="236" r="9"/>
  </g>

  <g fill="none" stroke="#eaf7fc" stroke-linecap="round">
    <circle cx="912" cy="322" r="52" fill="#0b4e7d" stroke="#0b4e7d"/>
    <circle cx="912" cy="322" r="37" stroke-width="4" stroke-opacity="0.65" stroke-dasharray="175 58"/>
    <circle cx="912" cy="322" r="23" stroke-width="4" stroke-opacity="0.84" stroke-dasharray="104 40"/>
  </g>
  <circle cx="912" cy="322" r="8" fill="#ee9d2d"/>

  <g fill="#0b70b9">
    <circle cx="674" cy="126" r="8" opacity="0.16"/>
    <circle cx="1124" cy="162" r="6" opacity="0.22"/>
    <circle cx="681" cy="500" r="11" opacity="0.10"/>
    <circle cx="1144" cy="492" r="7" opacity="0.18"/>
  </g>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: W },
  font: { loadSystemFonts: true },
});
const png = resvg.render().asPng();

mkdirSync(join(root, "public"), { recursive: true });
const out = join(root, "public", "cfopen-share.png");
writeFileSync(out, png);
console.log(`Wrote ${out} (${png.length} bytes)`);
