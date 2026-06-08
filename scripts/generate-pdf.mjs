// Renders the résumé view (#resume) from the production build to a one-page PDF.
// Usage: npm run build && npm run pdf
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

if (!(await exists(join(dist, 'index.html')))) {
  console.error('✗ dist/ not found. Run "npm run build" first.');
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

const browser = await puppeteer.launch({ headless: 'new' });
try {
  const page = await browser.newPage();
  // Force the light theme so the printed sheet never picks up dark backgrounds.
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('theme', 'light');
    } catch {}
  });
  await page.goto(`http://localhost:${port}/#resume`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.resume-sheet', { timeout: 10000 });
  // Let webfonts settle.
  await new Promise((r) => setTimeout(r, 600));

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', bottom: '12mm', left: '14mm', right: '14mm' },
  });

  await writeFile(outPublic, pdf);
  await copyFile(outPublic, outDist);
  console.log('✓ Wrote', outPublic);
  console.log('✓ Wrote', outDist);
} finally {
  await browser.close();
  server.close();
}
