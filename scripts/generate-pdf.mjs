// Regenerates the CV: stamps today's date into src/data/updated.json, builds, and renders the
// CV page (#resume) from the production build to a one-page A4 PDF.
// Usage: npm run pdf              (stamp, build, render)
//        npm run pdf -- --keep-date (build and render with the date already in updated.json)
// Writes public/Ratko_Sisovic_CV.pdf (committed) and dist/Ratko_Sisovic_CV.pdf,
// and fails if the sheet does not fit on exactly one page.
//
// updated.json is the site's one "Updated" date (the CV page and this PDF, the colophon and the
// case studies all print it). It moves when the CV is regenerated, not with the daily rebuild
// that refreshes the quote, so commit it with the PDF.
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, writeFile, copyFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
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

if (!process.argv.includes('--keep-date')) {
  const date = localIsoDate();
  await writeFile(join(root, 'src', 'data', 'updated.json'), JSON.stringify({ date }, null, 2) + '\n');
  console.log('Stamped src/data/updated.json:', date);
}
execSync('npm run build', { cwd: root, stdio: 'inherit' });

if (!(await exists(join(dist, 'index.html')))) {
  console.error('dist/ not found after the build.');
  process.exit(1);
}

// Minimal static server for the built SPA.
const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0]);
    let filePath = join(dist, urlPath === '/' ? 'index.html' : urlPath);
    if (!(await exists(filePath))) filePath = join(dist, 'index.html'); // SPA fallback
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end('error');
  }
});

await new Promise((r) => server.listen(0, r));
const port = server.address().port;

let failed = false;
const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/#resume`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.resume-sheet', { timeout: 10000 });
  // Golos Text (the page's stylesheets) must be in before the PDF is drawn.
  await page.evaluate(() => document.fonts.ready);

  const pdf = Buffer.from(
    await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', bottom: '12mm', left: '14mm', right: '14mm' },
    }),
  );

  // Chrome writes one "/Type /Page" object per page (and "/Type /Pages" once for the tree).
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pages !== 1) {
    console.error(`The CV must fit on one A4 page, but it has ${pages}. Nothing was written.`);
    failed = true;
  } else {
    await writeFile(outPublic, pdf);
    await copyFile(outPublic, outDist);
    console.log('Wrote', outPublic);
    console.log('Wrote', outDist);
  }
} finally {
  await browser.close();
  server.close();
}
if (failed) process.exit(1);
