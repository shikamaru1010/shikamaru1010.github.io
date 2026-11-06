// Renders public/og-image.png (2400 × 1260): the share card, in the site's Professional language.
// Usage: npm run og   (needs network for the Golos Text stylesheet; Node >= 22.18 for the .ts imports)
//
// Every word comes from src/data (profile.ts, experience.ts). src/lib/format.ts is NOT imported: it imports
// a JSON file, which Node's type stripping does not load without an import attribute. The type follows the site's quiet scale: the
// name is ordinary display text at 600, not fitted to the width of the card.
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { education, experience } from '../src/data/experience.ts';
import { profile } from '../src/data/profile.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public', 'og-image.png');

const W = 1200; // CSS px; rendered at deviceScaleFactor 2 → 2400 × 1260
const H = 630;

/** 1 → '1st', 4 → '4th', 11 → '11th', 22 → '22nd' (same rule as src/lib/format.ts). */
function ordinal(n) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const now = experience[0];
const domain = new URL(profile.siteUrl).host;
const left = `${profile.role} in ${profile.city}.`;
const right = `${now.role} at ${now.org}, ${ordinal(education.year)}-year student at ${education.short}.`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400..900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${W}px; height: ${H}px; }
  body {
    background: #F2F1EC; color: #111110;
    font-family: 'Golos Text', sans-serif; -webkit-font-smoothing: antialiased; font-synthesis-weight: none;
  }
  /* 40px margins; a 12-column grid on the 1120px measure (gutter 24) */
  .card { position: absolute; inset: 40px; display: flex; flex-direction: column; border-top: 1px solid #111110; }
  .name { margin-top: 30px; font-size: 104px; line-height: 1.05; letter-spacing: -.03em; font-weight: 600; white-space: nowrap; }
  .row {
    margin-top: 64px;
    display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; align-items: start;
    font-size: 28px; line-height: 1.22; letter-spacing: -.02em; font-weight: 400;
  }
  .row p:first-child { grid-column: 1 / span 5; }
  .row p:last-child { grid-column: 7 / -1; text-wrap: pretty; }
  .foot {
    margin-top: auto; display: flex; justify-content: space-between; align-items: center;
    font-size: 13px; line-height: 1.4; font-weight: 500; color: #53514C;
  }
  .mark { width: 10px; height: 10px; background: #D83218; }
</style>
</head>
<body>
  <main class="card">
    <h1 class="name">${esc(profile.name)}</h1>
    <div class="row"><p>${esc(left)}</p><p>${esc(right)}</p></div>
    <div class="foot"><span>${esc(domain)}</span><span class="mark"></span></div>
  </main>
</body>
</html>`;

const browser = await puppeteer.launch({ headless: true });
let failed = '';
try {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // Never write a card set in a fallback face: every weight and glyph used must be Golos.
  const check = await page.evaluate(async (name) => {
    const faces = ['600 104px "Golos Text"', '400 28px "Golos Text"', '500 13px "Golos Text"'];
    await Promise.all(faces.map((f) => document.fonts.load(f, name)));
    const missing = faces.filter((f) => !document.fonts.check(f, name));
    const overflow = [...document.querySelectorAll('.name, .row p, .foot span')]
      .filter((e) => e.scrollWidth > e.clientWidth + 1 || e.getBoundingClientRect().right > 1160 + 0.5)
      .map((e) => e.textContent);
    return { missing, overflow };
  }, profile.name);
  if (check.missing.length) failed = `Golos Text did not load (${check.missing.join(', ')}).`;
  else if (check.overflow.length) failed = `Text runs past the margin: ${check.overflow.join(' | ')}`;
  else {
    const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
    await writeFile(out, png);
    console.log('Wrote', out, `(${W * 2} × ${H * 2})`);
  }
} finally {
  await browser.close();
}
if (failed) {
  console.error(failed, 'Nothing was written.');
  process.exit(1);
}
