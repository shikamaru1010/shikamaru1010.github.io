// Browser checks for the parts of the app that unit tests cannot reach: history, focus and the
// hash router (src/App.tsx, src/lib/useMode.ts, src/lib/history.ts). Drives a running server in
// headless Chrome and exits 1 if any check fails. Local only, like `npm run pdf`.
// Usage: npm run dev, then   npm run check [-- <base url>]   (default http://localhost:5173)
import puppeteer from 'puppeteer';

const BASE = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, info) => results.push({ name, ok, info });

const browser = await puppeteer.launch({ headless: true });

async function open(url, width = 1440) {
  const page = await browser.newPage();
  const phone = width < 768;
  await page.setViewport({ width, height: phone ? 844 : 900, isMobile: phone, hasTouch: phone });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(String(e)));
  await page.goto(url, { waitUntil: 'networkidle0' });
  return page;
}

/** Where focus is and where the page is scrolled. */
const where = (page) =>
  page.evaluate(() => {
    const a = document.activeElement;
    const r = a?.getBoundingClientRect();
    return {
      hash: location.hash,
      y: Math.round(scrollY),
      tag: a?.tagName ?? '',
      text: (a?.textContent || '').trim().slice(0, 40),
      href: a?.getAttribute?.('href') ?? null,
      top: r ? Math.round(r.top) : null,
    };
  });

/** Focus is on screen (a keyboard user sees where the next Tab starts). */
const onScreen = (w) => w.top !== null && w.top > -40 && w.top < 900;

async function tabTo(page, test, max = 120) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    const w = await where(page);
    if (test(w)) return w;
  }
  return null;
}

try {
  // 1. CV → "Back to the site" → switch to Personal → browser Back shows the CV again.
  {
    const page = await open(`${BASE}/#resume`);
    await page.click('.resume-bar-link');
    await sleep(300);
    await page.click('[data-mode-radio="personal"]');
    await sleep(300);
    await page.goBack();
    await sleep(500);
    const s = await page.evaluate(() => ({ hash: location.hash, sheet: Boolean(document.querySelector('.resume-sheet')) }));
    check('CV, back to the site, switch, Back: the CV again', s.hash === '#resume' && s.sheet, s);
    await page.close();
  }

  // 2. Personal → case study → Back → switch → Forward shows the case study, and its CV link works.
  {
    const page = await open(`${BASE}/?mode=personal`);
    await page.click('.p-study');
    await sleep(300);
    await page.goBack();
    await sleep(400);
    await page.click('[data-mode-radio="professional"]');
    await sleep(300);
    await page.goForward();
    await sleep(500);
    const s = await page.evaluate(() => ({ url: location.search + location.hash, study: Boolean(document.querySelector('.study-title')) }));
    check('Personal, case study, Back, switch, Forward: the case study', s.study, s);
    await page.click('.nav-cv');
    await sleep(400);
    const cv = await page.evaluate(() => Boolean(document.querySelector('.resume-sheet')));
    check('and its CV link still works', cv);
    await page.close();
  }

  // 3. Malformed hashes render the page instead of a blank screen.
  for (const hash of ['#client-%', '#client-%E0%A4%A', '#project/%']) {
    const page = await open(`${BASE}/?mode=professional${hash}`);
    const n = await page.evaluate(() => document.getElementById('root')?.children.length ?? 0);
    check(`${hash} renders`, n > 0 && page.errors.length === 0, { n, errors: page.errors });
    await page.close();
  }

  for (const width of [1440, 390]) {
    // 4. Keyboard: "Case study →", Enter, then "Back to the site": focus returns to the link, on screen,
    //    and a Forward then a Back keep focus at the restored place, not at the top of the page.
    {
      const page = await open(`${BASE}/?mode=professional`, width);
      const at = await tabTo(page, (w) => w.href === '#project/dev-dashboard');
      await page.keyboard.press('Enter');
      await sleep(400);
      await tabTo(page, (w) => /Back to the site/.test(w.text));
      await page.keyboard.press('Enter');
      await sleep(500);
      const back = await where(page);
      check(
        `[${width}] keyboard: back from the case study focuses the link it left by`,
        at && back.href === '#project/dev-dashboard' && Math.abs(back.y - at.y) < 3 && onScreen(back),
        { at, back },
      );
      await page.goForward();
      await sleep(500);
      await page.goBack();
      await sleep(600);
      const again = await where(page);
      check(`[${width}] Forward then Back: focus is on screen at the restored place`, again.y > 0 && onScreen(again) && again.tag !== 'MAIN', again);
      await page.keyboard.press('Tab');
      await sleep(100);
      const next = await where(page);
      check(`[${width}] and the next Tab continues from there`, next.y > 0 && onScreen(next), next);
      await page.close();
    }

    // 5. A case study left scrolled, then "Next case study" and Back: the study opens at the top,
    //    next to its h1, which has focus (the scroll and the focus agree).
    {
      const page = await open(`${BASE}/?mode=professional#project/mesara`, width);
      await page.evaluate(() => {
        const a = document.querySelector('.study-next-link');
        a.scrollIntoView({ block: 'center' });
        a.click();
      });
      await sleep(600);
      await page.goBack();
      await sleep(800);
      const s = await where(page);
      check(`[${width}] Next case study, then Back: the study at the top, focus on its h1`, s.hash === '#project/mesara' && s.y === 0 && s.tag === 'H1', s);
      await page.close();
    }
  }
} finally {
  await browser.close();
}

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : '  ' + JSON.stringify(r.info)}`);
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} of ${results.length} checks failed.` : `\nAll ${results.length} checks passed.`);
process.exit(failed ? 1 : 0);
