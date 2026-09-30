// Writes the CV's text formats into public/ from src/lib/cv.ts, the structure the CV page (and so
// the PDF) renders: cv.md, resume.json (JSON Resume v1.0.0), Ratko_Sisovic_CV.docx and llms.txt.
// Usage: npm run cv:export   (npm run pdf runs it first, so every format moves together).
// Vite loads the TypeScript data the way the app does; nothing is copied by hand.
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { buildDocx } from './lib/docx.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (name) => join(root, 'public', name);

const server = await createServer({
  root,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});
try {
  const { buildCv, cvToMarkdown, cvToJsonResume, cvToLlmsTxt } = await server.ssrLoadModule('/src/lib/cv.ts');
  const d = buildCv();
  const files = [
    ['cv.md', cvToMarkdown(d)],
    ['resume.json', JSON.stringify(cvToJsonResume(d), null, 2) + '\n'],
    ['llms.txt', cvToLlmsTxt(d)],
    ['Ratko_Sisovic_CV.docx', buildDocx(d)],
  ];
  for (const [name, content] of files) {
    await writeFile(out(name), content);
    console.log('Wrote public/' + name, `(${(Buffer.byteLength(content) / 1024).toFixed(1)} KB)`);
  }
} finally {
  await server.close();
}
