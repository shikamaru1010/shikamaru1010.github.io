// Grades the committed CV the way applicant-tracking systems and CV graders do, on the files a
// recruiter or an AI tool actually receives: the PDF's text layer (via poppler's pdftotext when it
// is installed), the DOCX, cv.md, resume.json and llms.txt. Prints each check and a score.
// Usage: npm run cv:audit          (after npm run pdf; exits 1 if any hard check fails)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';
import { readPdfInfo } from './lib/pdf-info.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => join(root, 'public', f);

// What graders look for. HEADINGS in this order; KEYWORDS: terms junior full-stack and automation
// job ads ask for (all true of this CV; the audit only reports which ones a reader can find).
const HEADINGS = ['Summary', 'Technical Skills', 'Experience', 'Projects', 'Education', 'Languages'];
const KEYWORDS = ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'FastAPI', 'Django', 'REST API', 'SQL', 'PostgreSQL', 'Supabase', 'Docker', 'Git', 'GitHub Actions', 'CI/CD', 'Vitest', 'Linux', 'Agile', 'React Native', 'Tailwind CSS', 'LLM'];
const VERBS = /^(Built|Building|Delivered|Ship|Shipped|Work|Worked|Automated|Added|Designed|Developed|Implemented|Created|Led|Wrote|Migrated|Reduced|Improved|Launched|Maintained|Integrated|Deployed|Refactored|Tested)\b/;
const PRONOUNS = /\b(I|me|my|mine|we|our|us)\b/;
const WEAK = /\b(responsible for|worked on|helped with|duties included|various|etc\.|hard-working|team player|passionate|detail-oriented|results-driven|go-getter|synergy|dynamic)\b/i;
const DATE = /\b(?:[A-Z][a-z]{2} )?\d{4} – (?:Present|(?:[A-Z][a-z]{2} )?\d{4}(?: \(expected\))?)/g;

const results = [];
const check = (group, name, ok, detail = '', { hard = true, weight = 1 } = {}) =>
  results.push({ group, name, ok: Boolean(ok), detail, hard, weight });

// ---------------- the PDF ----------------
const pdfPath = pub('Ratko_Sisovic_CV.pdf');
const pdf = readFileSync(pdfPath);
const raw = pdf.toString('latin1');
const pages = (raw.match(/\/Type\s*\/Page[^s]/g) || []).length;
const kb = statSync(pdfPath).size / 1024;
check('PDF', 'exactly one A4 page', pages === 1, `${pages} page(s)`, { weight: 3 });
check('PDF', 'file size under 500 KB (upload limits start at 1–2 MB)', kb < 500, `${kb.toFixed(0)} KB`);
check('PDF', 'file name is ASCII, no spaces', /^[A-Za-z0-9_.-]+$/.test('Ratko_Sisovic_CV.pdf'), 'Ratko_Sisovic_CV.pdf');
check('PDF', 'tagged PDF (structure tree for parsers and screen readers)', /\/StructTreeRoot/.test(raw) && /\/MarkInfo/.test(raw));
check('PDF', 'fonts embedded (subset tags)', /\/FontName\s*\/[A-Z]{6}\+/.test(raw));
const links = (raw.match(/\/URI\s*\(/g) || []).length;
check('PDF', 'clickable links (email, LinkedIn, GitHub, portfolio)', links >= 4, `${links} links`);
const info = readPdfInfo(pdf);
check('PDF', 'document info: Title, Author, Subject, Keywords', info.Title && info.Author && info.Subject && info.Keywords, info.Title ?? 'missing');

let text = '';
let layout = '';
try {
  text = execFileSync('pdftotext', ['-enc', 'UTF-8', '-raw', pdfPath, '-'], { encoding: 'utf8' });
  layout = execFileSync('pdftotext', ['-enc', 'UTF-8', '-layout', pdfPath, '-'], { encoding: 'utf8' });
} catch {
  console.log('(pdftotext not found: the text checks read cv.md instead. Install poppler for the PDF text layer.)');
  text = layout = readFileSync(pub('cv.md'), 'utf8');
}
const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
check('Text layer', 'text is extractable (not an image)', text.length > 1500, `${text.length} characters`, { weight: 3 });
check('Text layer', 'name with diacritics comes out intact', /Ratko Šišović/.test(lines[0] ?? ''), lines[0]);

const headingOrder = (t) => HEADINGS.map((h) => t.search(new RegExp(`^\\s*${h}\\s*$`, 'im')));
const rawOrder = headingOrder(text);
const layoutOrder = headingOrder(layout);
const inOrder = (o) => o.every((v, i) => v >= 0 && (i === 0 || v > o[i - 1]));
check('Text layer', 'standard section headings, in order (raw reading order)', inOrder(rawOrder), HEADINGS.join(' → '), { weight: 2 });
check('Text layer', 'same order in layout mode (no interleaved columns)', inOrder(layoutOrder), '', { weight: 2 });
const top = text.slice(0, Math.max(0, rawOrder[0]));
check('Contact', 'email in the body, above the first section', /[\w.+-]+@[\w-]+\.[\w.]+/.test(top));
check('Contact', 'phone number', /\+?\d[\d ()-]{7,}\d/.test(top), 'not set: add profile.phone', { hard: false, weight: 2 });
check('Contact', 'LinkedIn and GitHub', /linkedin\.com\/in\//.test(top) && /github\.com\//.test(top));
check('Contact', 'location (city, country)', /Belgrade, Serbia/.test(top));
check('Contact', 'portfolio URL', /shikamaru1010\.github\.io/.test(top));

// ---------------- content ----------------
const body = text.slice(rawOrder[0]);
const words = text.split(/\s+/).filter(Boolean).length;
check('Content', 'length fits a one-page junior CV (350–700 words)', words >= 350 && words <= 700, `${words} words`, { weight: 2 });
// bullets: a line starting with "•", joined with its wrapped continuation lines
const bullets = [];
for (const l of lines) {
  if (l.startsWith('•')) bullets.push(l.replace(/^•\s*/, ''));
  else if (bullets.length && !HEADINGS.some((h) => h.toLowerCase() === l.toLowerCase()) && /^[a-z(]/.test(l)) bullets[bullets.length - 1] += ' ' + l;
}
check('Content', 'bullet points present (parsers count "•")', bullets.length >= 6, `${bullets.length} bullets`, { weight: 2 });
const verbFirst = bullets.filter((b) => VERBS.test(b)).length;
check('Content', 'bullets open with an action verb', verbFirst === bullets.length, `${verbFirst}/${bullets.length}`, { weight: 2 });
const quantified = bullets.filter((b) => /\d|\b(four|dozens|every|each)\b/i.test(b)).length;
check('Content', 'quantified bullets (a number or a count) ≥ 40%', quantified / Math.max(1, bullets.length) >= 0.4, `${quantified}/${bullets.length}`, { weight: 2 });
const long = bullets.filter((b) => b.split(/\s+/).length > 40);
check('Content', 'no bullet longer than 40 words', long.length === 0, long.map((b) => b.slice(0, 40) + '…').join(' | '));
check('Content', 'no first-person pronouns', !PRONOUNS.test(body), (body.match(PRONOUNS) || [''])[0]);
check('Content', 'no weak phrases or buzzwords', !WEAK.test(body), (body.match(WEAK) || [''])[0]);
const dates = text.match(DATE) || [];
check('Content', 'dates in one ATS format ("Mon YYYY – Present")', dates.length >= 5 && !/\b(now|current)\b/i.test(dates.join(' ')), `${dates.length} ranges`);
const found = KEYWORDS.filter((k) => text.toLowerCase().includes(k.toLowerCase()));
check('Keywords', `target keywords present (${KEYWORDS.length} common in job ads)`, found.length === KEYWORDS.length, `missing: ${KEYWORDS.filter((k) => !found.includes(k)).join(', ') || 'none'}`, { weight: 2 });

// ---------------- the other formats ----------------
function unzip(buf) {
  const files = {};
  let at = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const count = buf.readUInt16LE(at + 10);
  let p = buf.readUInt32LE(at + 16);
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nlen = buf.readUInt16LE(p + 28), elen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42);
    const name = buf.subarray(p + 46, p + 46 + nlen).toString('utf8');
    const lnlen = buf.readUInt16LE(off + 26), lelen = buf.readUInt16LE(off + 28);
    const data = buf.subarray(off + 30 + lnlen + lelen, off + 30 + lnlen + lelen + csize);
    files[name] = (method === 8 ? inflateRawSync(data) : data).toString('utf8');
    p += 46 + nlen + elen + clen;
  }
  return files;
}
const docxPath = pub('Ratko_Sisovic_CV.docx');
if (existsSync(docxPath)) {
  const docx = unzip(readFileSync(docxPath));
  const doc = docx['word/document.xml'] ?? '';
  const plain = doc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  check('DOCX', 'opens as a Word package (content types, document, styles)', docx['[Content_Types].xml'] && doc && docx['word/styles.xml']);
  check('DOCX', 'real headings and bullets (Heading1, list numbering)', /w:val="Heading1"/.test(doc) && /<w:numPr>/.test(doc));
  check('DOCX', 'no tables, text boxes or header/footer parts', !/<w:tbl>|<w:txbxContent>/.test(doc) && !Object.keys(docx).some((n) => /header|footer/.test(n)));
  check('DOCX', 'same name, email and sections as the PDF', HEADINGS.every((h) => plain.includes(h)) && plain.includes('Ratko Šišović') && plain.includes('ralesisko@gmail.com'));
  check('DOCX', 'document properties: title and author', /<dc:title>[^<]+<\/dc:title>/.test(docx['docProps/core.xml'] ?? '') && /<dc:creator>/.test(docx['docProps/core.xml'] ?? ''));
} else check('DOCX', 'Ratko_Sisovic_CV.docx exists', false, 'run npm run cv:export');

const json = JSON.parse(readFileSync(pub('resume.json'), 'utf8'));
check('JSON Resume', 'basics, work, education, skills (jsonresume.org v1.0.0)', json.basics?.name && json.basics?.email && json.work?.length && json.education?.length && json.skills?.length);
check('JSON Resume', 'ISO dates (YYYY or YYYY-MM)', [...json.work, ...json.education].every((x) => /^\d{4}(-\d{2})?$/.test(x.startDate)));
const md = readFileSync(pub('cv.md'), 'utf8');
check('Markdown', 'cv.md has every section', HEADINGS.every((h) => md.includes(`## ${h}`)));
const llms = readFileSync(pub('llms.txt'), 'utf8');
check('AI discovery', 'llms.txt links the CV as Markdown, JSON, PDF and DOCX', ['cv.md', 'resume.json', 'Ratko_Sisovic_CV.pdf', 'Ratko_Sisovic_CV.docx'].every((f) => llms.includes(f)));
const index = readFileSync(join(root, 'index.html'), 'utf8');
check('AI discovery', 'index.html links resume.json and cv.md (rel="alternate")', /rel="alternate"[^>]+resume\.json/.test(index) && /rel="alternate"[^>]+cv\.md/.test(index), '', { hard: false });

// ---------------- report ----------------
let group = '';
for (const r of results) {
  if (r.group !== group) console.log(`\n${(group = r.group)}`);
  console.log(`  ${r.ok ? 'PASS' : r.hard ? 'FAIL' : 'WARN'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
}
const total = results.reduce((s, r) => s + r.weight, 0);
const got = results.reduce((s, r) => s + (r.ok ? r.weight : 0), 0);
console.log(`\nScore: ${Math.round((100 * got) / total)}/100  ·  ${results.filter((r) => r.ok).length}/${results.length} checks pass`);
if (results.some((r) => !r.ok && r.hard)) process.exit(1);
