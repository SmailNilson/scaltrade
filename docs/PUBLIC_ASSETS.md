# Static assets (served at the web root by Vite)

Files here are copied verbatim into `dist/` and served from `/`.

## Present
- `favicon.svg` — the ScalTrade "ST" logo (vector, matches `src/icons.jsx`).

## To provide (referenced by `index.html` — add these to avoid 404s)
- `favicon.ico` — 32×32 (or multi-size) ICO fallback for older browsers.
- `apple-touch-icon.png` — 180×180 PNG for iOS home-screen.
- `og-image.png` — **1200×630** social share image (used by Open Graph + Twitter cards).

Tip for the og-image: dark background `#0A0C0F`, the ST logo, the headline
"Your AI Mentor. Your Edge. Real Futures." and a cyan accent `#00D4FF`.
Until `og-image.png` exists, link previews on X/LinkedIn will show no image.
