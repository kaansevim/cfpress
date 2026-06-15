// Generates public/og-image.png (1200x630) for social share previews.
// Run with: node scripts/generate-og-image.mjs
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const W = 1200;
const H = 630;

// Brand palette (from src/styles.css)
const PRIMARY = "#087acc";
const FOREGROUND = "#212121";
const MUTED = "#757575";
const BORDER = "#e0e0e0";

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#ffffff"/>

  <!-- top accent bar -->
  <rect x="0" y="0" width="${W}" height="10" fill="${PRIMARY}"/>

  <!-- open-book mark -->
  <g transform="translate(96, 150)">
    <path d="M0 18 C 26 4, 70 4, 96 22 L 96 150 C 70 132, 26 132, 0 146 Z"
          fill="none" stroke="${PRIMARY}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M192 18 C 166 4, 122 4, 96 22 L 96 150 C 122 132, 166 132, 192 146 Z"
          fill="none" stroke="${PRIMARY}" stroke-width="7" stroke-linejoin="round"/>
    <line x1="96" y1="22" x2="96" y2="150" stroke="${PRIMARY}" stroke-width="7"/>
  </g>

  <!-- eyebrow -->
  <text x="96" y="372" font-family="Arial, sans-serif" font-size="26" letter-spacing="6"
        font-weight="700" fill="${PRIMARY}">AÇIK ERİŞİM · HAKEMLİ · TÜRKÇE</text>

  <!-- title -->
  <text x="94" y="452" font-family="Georgia, 'Times New Roman', serif" font-size="92"
        font-weight="700" fill="${FOREGROUND}">Akademik Dergi</text>

  <!-- subtitle -->
  <text x="96" y="512" font-family="Arial, sans-serif" font-size="34" fill="${MUTED}">Bilgi, paylaşıldıkça değer kazanır.</text>

  <!-- footer rule + meta -->
  <line x1="96" y1="560" x2="${W - 96}" y2="560" stroke="${BORDER}" stroke-width="2"/>
  <text x="96" y="600" font-family="Arial, sans-serif" font-size="24" fill="${MUTED}">CC BY 4.0</text>
  <text x="${W - 96}" y="600" text-anchor="end" font-family="Arial, sans-serif" font-size="24"
        fill="${MUTED}">DOI 10.62847/akademik</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: W },
  font: { loadSystemFonts: true },
});
const png = resvg.render().asPng();

mkdirSync(join(root, "public"), { recursive: true });
const out = join(root, "public", "og-image.png");
writeFileSync(out, png);
console.log(`Wrote ${out} (${png.length} bytes)`);
