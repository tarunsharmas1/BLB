// Assembles mobile/www from the storefront web app one directory up.
// Run via `npm run copy:web` (also part of `npm run sync`).
//
// The web app already boots from index.html at the site root (see ../index.html),
// so the mobile shell reuses it verbatim and only layers on mobile-native touches:
//   - a native-app viewport (no user zoom, viewport-fit=cover for notches)
//   - safe-area insets so content clears the status bar / home indicator
//   - the Capacitor runtime bridge + status-bar/splash wiring
import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..');       // BLB/
const www = resolve(here, '..', 'www');       // BLB/mobile/www

// Files/dirs the storefront needs to boot. Keep in sync with ../index.html's <script>/<link> refs.
const ASSETS = [
  'support.js',
  'image-slot.js',
  'bliss-bin-data.js',
  'ProductCard.dc.html',
  'vendor',
  '_ds',
  'assets',
];

rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

for (const rel of ASSETS) {
  const src = join(repo, rel);
  if (!existsSync(src)) {
    console.warn(`[copy-web] skip missing ${rel}`);
    continue;
  }
  cpSync(src, join(www, rel), { recursive: true });
}

// Transform index.html → www/index.html with mobile-native head additions.
let html = readFileSync(join(repo, 'index.html'), 'utf8');

// 1. Native-app viewport (replace the responsive-web one).
html = html.replace(
  /<meta name="viewport"[^>]*>/,
  '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">'
);

// 2. Mobile meta + safe-area CSS + Capacitor bridge, injected right after <head>'s charset.
const MOBILE_HEAD = `
<meta name="theme-color" content="#243c26">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="format-detection" content="telephone=no">
<style>
  :root { --safe-top: env(safe-area-inset-top); --safe-bottom: env(safe-area-inset-bottom); }
  html, body { overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; }
  /* Push the sticky storefront header below the status bar / notch. */
  #dc-root header[style*="sticky"] { padding-top: max(env(safe-area-inset-top), 0px); }
  /* Keep bottom-anchored surfaces (cart drawer footer, toasts) clear of the home indicator. */
  body { padding-bottom: env(safe-area-inset-bottom); }

  /* ---- Mobile reflow: collapse the storefront's desktop grids so nothing
         forces horizontal scroll on a phone. Selectors match React's inline-
         style serialization exactly (spaces after ':' and ','); !important
         overrides the shipped inline grid definitions. ---- */
  @media (max-width: 760px) {
    #dc-root img, #dc-root image-slot { max-width: 100%; }
    /* Tighten page gutters on the max-width content wrappers. */
    #dc-root [style*="max-width: 1280px"],
    #dc-root [style*="max-width: 1240px"],
    #dc-root [style*="max-width: 1200px"],
    #dc-root [style*="max-width: 1120px"] { padding-left: 16px !important; padding-right: 16px !important; }
    /* Two-column feature layouts (hero, PDP, PLP filters, order row) → stacked. */
    #dc-root [style*="grid-template-columns: 1.05fr 0.95fr"],
    #dc-root [style*="grid-template-columns: 1.3fr 1fr"],
    #dc-root [style*="grid-template-columns: 220px 1fr"],
    #dc-root [style*="grid-template-columns: 140px 1fr"] { grid-template-columns: 1fr !important; gap: 24px !important; }
    /* Hero search row (Select + pincode + button) → wrap and let children shrink. */
    #dc-root [style*="max-width: 520px"][style*="display: flex"] { flex-wrap: wrap !important; }
    #dc-root [style*="max-width: 520px"][style*="display: flex"] > * { min-width: 0 !important; flex-basis: 45% !important; }
    /* Dense card grids → 2 up. */
    #dc-root [style*="grid-template-columns: repeat(4"],
    #dc-root [style*="grid-template-columns: repeat(3"],
    #dc-root [style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: repeat(2, 1fr) !important; }
    /* Occasion / chip grids + footer columns → 3 up. */
    #dc-root [style*="grid-template-columns: repeat(5"],
    #dc-root [style*="grid-template-columns: repeat(6"],
    #dc-root [style*="grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr"] { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (max-width: 480px) {
    #dc-root [style*="grid-template-columns: repeat(5"],
    #dc-root [style*="grid-template-columns: repeat(6"] { grid-template-columns: repeat(2, 1fr) !important; }
    #dc-root [style*="grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
  }
  /* Safety net: clip (not hidden) so a stray wide child can't create a
     horizontal scrollbar — clip avoids turning #dc-root into a scroll
     container, so vertical page scrolling stays on the body as normal. */
  #dc-root { overflow-x: clip; }
</style>
<script>
  // Native chrome via the Capacitor global bridge (auto-injected on device by
  // the native runtime — no bundler needed). Every call is guarded so this is a
  // pure no-op in a plain browser or if a plugin is absent.
  window.addEventListener('DOMContentLoaded', function () {
    var C = window.Capacitor;
    if (!(C && C.isNativePlatform && C.isNativePlatform())) return;
    var P = C.Plugins || {};
    try {
      if (P.StatusBar) {
        P.StatusBar.setStyle({ style: 'LIGHT' });
        if (C.getPlatform && C.getPlatform() === 'android') P.StatusBar.setBackgroundColor({ color: '#243c26' });
      }
    } catch (e) {}
    try { if (P.SplashScreen) P.SplashScreen.hide(); } catch (e) {}
    try {
      // Android hardware back: dismiss the storefront's top-most overlay if one
      // is open (cart drawer, dialog, sidebar all expose an aria-label Close),
      // otherwise fall back to history / exit.
      if (P.App) P.App.addListener('backButton', function () {
        var closer = document.querySelector('[aria-label="Close"]');
        if (closer) { closer.click(); return; }
        if (window.history.length > 1) window.history.back();
        else P.App.exitApp();
      });
    } catch (e) {}
  });
</script>
`;
html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">' + MOBILE_HEAD);

writeFileSync(join(www, 'index.html'), html);
console.log('[copy-web] assembled', www);
