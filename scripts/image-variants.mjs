// Writes the smaller copies of the site's images that `srcset` (src/lib/media.ts) and the client
// index's thumbnail strip use:
//   public/screenshots/<id>/desktop-720.webp   720 × 450, the desktop capture at half size
//   public/screenshots/<id>/desktop-1200.webp  1200 × 750, for the 2x and 3x screens whose slot needs
//                                              about 1000 device pixels (phones, tablets, 1280@2x)
//   public/screenshots/<id>/thumb.webp         320 × 200, the client index's contact strip (not a srcset)
//   public/screenshots/<id>/mobile-480.webp    480 wide, the phone capture
//   public/ratko/ratko-square-l.webp           800 × 800, the Personal photo in luminance only
//   public/ratko/ratko-square-l-480.webp       480 × 480, the same, smaller
// The photo is printed in the page's two inks by an SVG filter that keeps only luminance
// (DuotoneFilter.tsx: Rec. 709 weights on the sRGB values), so its colour is never shown:
// the luminance copies look the same after the filter at about a fifth of the bytes.
// Usage: npm run images   (re-run after replacing a screenshot or the photo; commit the output)
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (p) => join(root, 'public', p);
const CLIENTS = ['mesara', 'pilatiq', 'stan-pro-tim', 'kutlesic-vikendice'];

/** [source, output, width, height (null = keep the aspect), quality, luminance only] */
const jobs = [];
for (const id of CLIENTS) {
  jobs.push([`screenshots/${id}/desktop.webp`, `screenshots/${id}/desktop-720.webp`, 720, 450, 0.8, false]);
  jobs.push([`screenshots/${id}/desktop.webp`, `screenshots/${id}/desktop-1200.webp`, 1200, 750, 0.8, false]);
  jobs.push([`screenshots/${id}/desktop.webp`, `screenshots/${id}/thumb.webp`, 320, 200, 0.8, false]);
  jobs.push([`screenshots/${id}/mobile.webp`, `screenshots/${id}/mobile-480.webp`, 480, null, 0.8, false]);
}
jobs.push(['ratko/ratko-square.webp', 'ratko/ratko-square-l.webp', 800, 800, 0.7, true]);
jobs.push(['ratko/ratko-square.webp', 'ratko/ratko-square-l-480.webp', 480, 480, 0.7, true]);

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setContent('<!doctype html><title>variants</title>');
  for (const [src, out, width, height, quality, luminance] of jobs) {
    const data = (await readFile(pub(src))).toString('base64');
    const result = await page.evaluate(
      async ({ data, width, height, quality, luminance }) => {
        const blob = await (await fetch(`data:image/webp;base64,${data}`)).blob();
        const full = await createImageBitmap(blob);
        const h = height ?? Math.round((full.height * width) / full.width);
        const bitmap = await createImageBitmap(full, { resizeWidth: width, resizeHeight: h, resizeQuality: 'high' });
        const canvas = new OffscreenCanvas(width, h);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);
        if (luminance) {
          const img = ctx.getImageData(0, 0, width, h);
          const px = img.data;
          for (let i = 0; i < px.length; i += 4) {
            const y = Math.round(0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]);
            px[i] = px[i + 1] = px[i + 2] = y;
          }
          ctx.putImageData(img, 0, 0);
        }
        const outBlob = await canvas.convertToBlob({ type: 'image/webp', quality });
        const bytes = new Uint8Array(await outBlob.arrayBuffer());
        let bin = '';
        for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        return { b64: btoa(bin), width, height: h };
      },
      { data, width, height, quality, luminance },
    );
    const buf = Buffer.from(result.b64, 'base64');
    await writeFile(pub(out), buf);
    console.log(`${out}  ${result.width} × ${result.height}  ${buf.length} B`);
  }
} finally {
  await browser.close();
}
