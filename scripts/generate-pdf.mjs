// Regenerates the CV: stamps today's date into src/data/updated.json, writes the text formats
// (cv.md, resume.json, the DOCX, llms.txt: scripts/export-cv.mjs), builds, and renders the CV page
// (#resume) from the production build to a one-page, tagged A4 PDF with its document information set.
// Usage: npm run pdf              (stamp, build, render)
//        npm run pdf -- --keep-date (build and render with the date already in updated.json)
// Writes public/Ratko_Sisovic_CV.pdf (committed) and dist/Ratko_Sisovic_CV.pdf,
// and fails if the sheet does not fit on exactly one page.
//
// updated.json is the site's one "Updated" date (the CV page and this PDF print it, the © at the
// foot of the site pages takes its year, and public/sitemap.xml carries it as <lastmod>). It moves when the
// CV is regenerated, not with the daily rebuild that refreshes the quote. It also keeps `cvHash`,
// a fingerprint of the text the PDF was printed from: render.test.tsx computes the same from the
// data and fails when they differ, so a data edit cannot ship without a new PDF.
// Commit the PDF, src/data/updated.json and public/sitemap.xml together.
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile, writeFile, copyFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, resolve, sep } from 'node:path';
import puppeteer from 'puppeteer';
import { setPdfInfo } from './lib/pdf-info.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = resolve(root, 'dist');
const updatedPath = join(root, 'src', 'data', 'updated.json');
const outPublic = join(root, 'public', 'Ratko_Sisovic_CV.pdf');
const outDist = join(dist, 'Ratko_Sisovic_CV.pdf');

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/** Today in local time (Belgrade on the machine this runs on), as YYYY-MM-DD. */
function localIsoDate(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** The same fingerprint render.test.tsx takes: the sheet's text, whitespace collapsed, as sha256. */
function cvHash(text) {
  return createHash('sha256').update(text.replace(/\s+/g, ' ').trim()).digest('hex');
}

const readUpdated = async () => JSON.parse(await readFile(updatedPath, 'utf8'));
const writeUpdated = (data) => writeFile(updatedPath, JSON.stringify(data, null, 2) + '\n');

if (!process.argv.includes('--keep-date')) {
  const date = localIsoDate();
  await writeUpdated({ ...(await readUpdated()), date });
  console.log('Stamped src/data/updated.json:', date);
}
// The sitemap's <lastmod> is the same date (seo.test.ts checks).
{
  const { date } = await readUpdated();
  const sitemapPath = join(root, 'public', 'sitemap.xml');
  const sitemap = await readFile(sitemapPath, 'utf8');
  const next = sitemap.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${date}</lastmod>`);
  if (next !== sitemap) {
    await writeFile(sitemapPath, next);
    console.log('Stamped public/sitemap.xml lastmod:', date);
  }
}
// Every other format first, so the build copies the fresh files from public/ into dist/.
execSync('node scripts/export-cv.mjs', { cwd: root, stdio: 'inherit' });
execSync('npm run build', { cwd: root, stdio: 'inherit' });

if (!(await exists(join(dist, 'index.html')))) {
  console.error('dist/ not found after the build.');
  process.exit(1);
}

// Minimal static server for the built SPA: on the loopback interface only, and only files in dist/.
const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0]);
    let filePath = resolve(dist, '.' + (urlPath === '/' ? '/index.html' : urlPath));
    if (filePath !== dist && !filePath.startsWith(dist + sep)) {
      res.writeHead(404);
      res.end();
      return;
    }
    if (!(await exists(filePath))) filePath = join(dist, 'index.html'); // SPA fallback
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end('error');
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

let failed = false;
const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/#resume`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.resume-sheet', { timeout: 10000 });
  // Golos Text (the page's stylesheets) must be in before the PDF is drawn.
  await page.evaluate(() => document.fonts.ready);
  const sheetText = await page.$eval('.resume-sheet', (el) => el.textContent ?? '');

  const raw = Buffer.from(
    await page.pdf({
      format: 'A4',
      printBackground: true,
      // a structure tree (headings, lists, links in reading order) for screen readers and parsers
      tagged: true,
      margin: { top: '10mm', bottom: '10mm', left: '12mm', right: '12mm' },
    }),
  );
  // Title, Author, Subject and Keywords: what a viewer's title bar, a search index and a CV
  // parser read before the text. From the JSON Resume the export just wrote (same data).
  const resume = JSON.parse(await readFile(join(root, 'public', 'resume.json'), 'utf8'));
  const { date } = await readUpdated();
  const pdf = setPdfInfo(raw, {
    title: `${resume.basics.name} – CV`,
    author: resume.basics.name,
    subject: `${resume.basics.label}, ${resume.basics.location.city}`,
    keywords: resume.skills.flatMap((g) => g.keywords).slice(0, 24).join(', '),
    creator: 'shikamaru1010.github.io (scripts/generate-pdf.mjs)',
    date,
  });

  // Chrome writes one "/Type /Page" object per page (and "/Type /Pages" once for the tree).
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pages !== 1) {
    console.error(`The CV must fit on one A4 page, but it has ${pages}. Nothing was written.`);
    failed = true;
  } else {
    await writeFile(outPublic, pdf);
    await copyFile(outPublic, outDist);
    await writeUpdated({ ...(await readUpdated()), cvHash: cvHash(sheetText) });
    console.log('Wrote', outPublic);
    console.log('Wrote', outDist);
    console.log('Stamped src/data/updated.json cvHash');
  }
} finally {
  await browser.close();
  server.close();
}
if (failed) process.exit(1);
