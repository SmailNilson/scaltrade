/* Generates the binary brand assets referenced by index.html into public/:
 *   - og-image.png        (1200×630)  social share card
 *   - apple-touch-icon.png (180×180)  iOS home-screen icon
 *   - favicon.ico         (16/32/48)  classic favicon fallback
 *
 * Run:  npm run gen:assets
 * Uses @resvg/resvg-js to rasterize SVG (no system deps) + png-to-ico.
 */
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = resolve(__dirname, '..', 'public');
mkdirSync(PUB, { recursive: true });

const C = {
  bg: '#0A0C0F', surface: '#0E1116', border: '#1E2330',
  text: '#FFFFFF', muted: '#A0AABD', cyan: '#00D4FF', purple: '#7B61FF', green: '#00FF85', red: '#FF3B5C',
};
const MONO = "Menlo, 'JetBrains Mono', ui-monospace, monospace";
const SANS = "Helvetica, 'Inter', Arial, sans-serif";

function renderPng(svg, width) {
  return new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true, defaultFontFamily: 'Helvetica' },
    background: 'rgba(0,0,0,0)',
  }).render().asPng();
}

/* ── Logo mark (rounded square + "ST") ───────────────────────────── */
const logoMark = (s = 180) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 180 180" fill="none">
  <rect x="6" y="6" width="168" height="168" rx="40" fill="${C.surface}" stroke="${C.border}" stroke-width="3"/>
  <text x="40" y="124" font-family="${MONO}" font-size="92" font-weight="700" fill="${C.cyan}">S</text>
  <text x="98" y="124" font-family="${MONO}" font-size="92" font-weight="700" fill="${C.text}">T</text>
</svg>`;

/* ── Candlestick accent for the OG card ──────────────────────────── */
function candles(x0, y0) {
  const data = [
    [0, 60, 18, 44, C.green], [28, 80, 30, 64, C.red], [56, 70, 12, 40, C.green],
    [84, 96, 26, 70, C.green], [112, 110, 34, 84, C.red], [140, 74, 16, 50, C.green],
    [168, 90, 28, 66, C.green], [196, 120, 40, 96, C.red],
  ];
  return data.map(([dx, h, body, bodyH, col]) => {
    const x = x0 + dx, cx = x + 9;
    return `<line x1="${cx}" y1="${y0 - h}" x2="${cx}" y2="${y0}" stroke="${col}" stroke-width="2" opacity="0.9"/>
      <rect x="${x}" y="${y0 - (h - (h - bodyH) / 2)}" width="18" height="${bodyH}" rx="2" fill="${col}" opacity="0.95"/>`;
  }).join('');
}

/* ── OG card 1200×630 ────────────────────────────────────────────── */
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <defs>
    <linearGradient id="title" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#A8B2C6"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="${C.border}" stroke-width="1" opacity="0.5"/>
    </pattern>
    <radialGradient id="glowC" cx="78%" cy="22%" r="55%">
      <stop offset="0" stop-color="${C.cyan}" stop-opacity="0.22"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowP" cx="20%" cy="95%" r="55%">
      <stop offset="0" stop-color="${C.purple}" stop-opacity="0.18"/><stop offset="1" stop-color="${C.purple}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glowC)"/>
  <rect width="1200" height="630" fill="url(#glowP)"/>
  <rect x="0.5" y="0.5" width="1199" height="629" rx="0" fill="none" stroke="${C.border}"/>

  <!-- brand row -->
  <g transform="translate(80,72)">
    <rect x="0" y="0" width="52" height="52" rx="13" fill="${C.surface}" stroke="${C.border}" stroke-width="2"/>
    <text x="11" y="37" font-family="${MONO}" font-size="28" font-weight="700" fill="${C.cyan}">S</text>
    <text x="29" y="37" font-family="${MONO}" font-size="28" font-weight="700" fill="${C.text}">T</text>
    <text x="68" y="26" font-family="${SANS}" font-size="26" font-weight="700" fill="${C.text}">ScalTrade</text>
    <text x="68" y="48" font-family="${MONO}" font-size="13" letter-spacing="3" fill="${C.cyan}">AI MENTOR · FUTURES</text>
  </g>

  <!-- headline -->
  <text x="80" y="300" font-family="${SANS}" font-size="86" font-weight="800" letter-spacing="-3" fill="${C.text}">Your AI Mentor.</text>
  <text x="80" y="392" font-family="${SANS}" font-size="86" font-weight="800" letter-spacing="-3" fill="url(#title)">Your Edge. Real Futures.</text>

  <!-- subhead -->
  <text x="82" y="452" font-family="${SANS}" font-size="27" fill="${C.muted}">Validate every futures trade against your strategy — in real time.</text>

  <!-- accent + candles -->
  <rect x="82" y="486" width="64" height="4" rx="2" fill="${C.cyan}"/>
  <g opacity="0.95">${candles(900, 250)}</g>

  <!-- bottom mono row -->
  <text x="80" y="560" font-family="${MONO}" font-size="20" fill="${C.muted}">Native IBKR bridge<tspan fill="${C.cyan}">  ·  </tspan>Event-sourced backtests<tspan fill="${C.cyan}">  ·  </tspan>scaltrade.com</text>
</svg>`;

/* ── write outputs ───────────────────────────────────────────────── */
writeFileSync(resolve(PUB, 'og-image.png'), renderPng(og, 1200));
writeFileSync(resolve(PUB, 'apple-touch-icon.png'), renderPng(logoMark(180), 180));

const icoBufs = [16, 32, 48].map((s) => renderPng(logoMark(s), s));
writeFileSync(resolve(PUB, 'favicon.ico'), await pngToIco(icoBufs));

console.log('✔ Generated public/og-image.png, apple-touch-icon.png, favicon.ico');
