import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildDocx } from '../../scripts/lib/docx.mjs';
import { profile } from '../data/profile';
import { buildCv, cvText, cvToJsonResume, cvToLlmsTxt, cvToMarkdown } from './cv';

// The CV is what recruiters and their parsers read first. These guard the rules the copy in
// data/cv.ts was written to (scripts/cv-audit.mjs grades the committed PDF on the same ones),
// and that every exported format still says what the data says.
const cv = buildCv();
const text = cvText(cv);
const points = [...cv.experience, ...cv.projects].flatMap((e) => e.points);
const pub = (f: string) => new URL(`../../public/${f}`, import.meta.url);

describe('the CV', () => {
  it('is written in CV register: no first person, no filler, each point opens with a verb and stays under 40 words', () => {
    expect(`${cv.summary} ${points.join(' ')}`).not.toMatch(/\b(I|me|my|mine|we|our|us)\b/);
    expect(text).not.toMatch(/\b(responsible for|worked on|helped with|various|passionate|team player|hard-working|results-driven)\b/i);
    for (const p of points) {
      expect(p, p).toMatch(/^(Built|Building|Delivered|Ship|Work|Automated|Added|Designed|Developed|Implemented|Wrote)\b/);
      expect(p.split(/\s+/).length, p).toBeLessThanOrEqual(40);
    }
  });

  it('fits one page for a junior role: 350–650 words, 2–3 points per role, ATS dates', () => {
    const words = text.split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(350);
    expect(words).toBeLessThanOrEqual(650);
    for (const e of cv.experience) expect(e.points.length).toBeGreaterThanOrEqual(2);
    for (const e of [...cv.experience, ...cv.projects]) expect(e.points.length).toBeLessThanOrEqual(3);
    for (const when of [...cv.experience, ...cv.projects].map((e) => e.when).concat(cv.education.when)) {
      expect(when).toMatch(/^(?:[A-Z][a-z]{2} )?\d{4}(?: – (?:Present|\d{4}(?: \(expected\))?))?$/);
    }
    expect(Object.values(cv.headings)).toEqual(['Summary', 'Technical Skills', 'Experience', 'Projects', 'Education', 'Languages']);
  });

  it('has complete contact details in the body: location, email, LinkedIn, GitHub, site (and a phone once set)', () => {
    const contact = cv.contact.map((c) => c.text).join(' ');
    expect(contact).toContain(profile.location);
    expect(contact).toContain(profile.email);
    expect(contact).toMatch(/linkedin\.com\/in\//);
    expect(contact).toMatch(/github\.com\//);
    expect(contact).toContain('shikamaru1010.github.io');
    if (profile.phone) expect(contact).toContain(profile.phone);
  });

  it('every exported format matches the data (cv.md, resume.json, llms.txt, DOCX): run npm run cv:export after an edit', () => {
    expect(readFileSync(pub('cv.md'), 'utf8')).toBe(cvToMarkdown(cv));
    expect(JSON.parse(readFileSync(pub('resume.json'), 'utf8'))).toEqual(cvToJsonResume(cv));
    expect(readFileSync(pub('llms.txt'), 'utf8')).toBe(cvToLlmsTxt(cv));
    expect(Buffer.compare(readFileSync(pub('Ratko_Sisovic_CV.docx')), buildDocx(cv))).toBe(0);
  });

  it('resume.json is JSON Resume v1.0.0: the required basics and ISO dates', () => {
    const r = cvToJsonResume(cv);
    expect(r.basics).toMatchObject({ name: profile.name, email: profile.email, url: profile.siteUrl });
    expect(r.basics.profiles.map((p) => p.network)).toEqual(['LinkedIn', 'GitHub']);
    for (const x of [...r.work, ...r.education]) expect(x.startDate).toMatch(/^\d{4}(-\d{2})?$/);
    expect(r.skills.flatMap((s) => s.keywords)).toEqual(expect.arrayContaining(['TypeScript', 'React', 'Python', 'Docker']));
  });
});
