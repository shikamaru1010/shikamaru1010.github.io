import { createHash } from 'node:crypto';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Resume from './components/cv/Resume';
import PersonalFooter from './components/personal/PersonalFooter';
import PersonalHome from './components/personal/PersonalHome';
import ProFooter from './components/pro/ProFooter';
import ProfessionalHome from './components/ProfessionalHome';
import CaseStudy from './components/study/CaseStudy';
import { education, experience } from './data/experience';
import { clientProjects, studyProjects } from './data/projects';
import updated from './data/updated.json';
import { BUILD_DATE, careerAxis } from './lib/timeline';

// Server-renders every page tree in node: render must be pure (no window /
// document during render), the words must be right, and the two mode trees,
// which share one document, must not repeat an id.

const e = String.fromCharCode(0xe9);
const BANNED = [new RegExp(`r${e}sum${e}|r${e}sume|resum${e}`, 'i'), /\b3rd\b/i, /\bthird[\s-]+year\b/i];

const pages: Array<[string, string]> = [
  ['ProfessionalHome', renderToStaticMarkup(<ProfessionalHome />)],
  ['PersonalHome', renderToStaticMarkup(<PersonalHome />)],
  ['PersonalFooter', renderToStaticMarkup(<PersonalFooter />)],
  ['ProFooter', renderToStaticMarkup(<ProFooter />)],
  ['Resume', renderToStaticMarkup(<Resume />)],
  ...studyProjects.map((p): [string, string] => [`CaseStudy ${p.id}`, renderToStaticMarkup(<CaseStudy project={p} />)]),
];
const html = Object.fromEntries(pages);
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;

/**
 * The CV sheet's text as scripts/generate-pdf.mjs reads it in the browser (the sheet's
 * textContent): the tags stripped, React's five escapes decoded, whitespace collapsed.
 */
function sheetText(markup: string): string {
  const sheet = markup.slice(markup.indexOf('<article class="resume-sheet"'), markup.lastIndexOf('</article>'));
  return sheet
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('render', () => {
  it.each(pages)('%s has no banned words', (_, markup) => {
    for (const re of BANNED) expect(markup).not.toMatch(re);
  });

  // Golos Text has no U+2011: the data's no-break hyphens must reach the page through keepCompounds()
  it.each(pages)('%s prints no U+2011 (it would fall back to another font)', (_, markup) => {
    expect(markup).not.toContain('‑');
  });

  it('Professional says who: 4th year, Podyx, and a CV link', () => {
    expect(html.ProfessionalHome).toContain('4th');
    expect(html.ProfessionalHome).toContain('Podyx');
    expect(html.ProfessionalHome).toContain('href="#resume"');
  });

  it('the client index: a row per client with its phone capture, one plate, one thumbnail each in the strip', () => {
    const P = html.ProfessionalHome;
    for (const p of clientProjects) {
      expect(P).toContain(`id="client-${p.id}"`);
      expect(P).toContain(`/screenshots/${p.id}/mobile.webp 780w`);
      expect(P).toContain(`src="/screenshots/${p.id}/thumb.webp"`);
    }
    expect(count(P, /<figure class="plate"/g)).toBe(1);
    // the plate opens on the first client, with the full-size capture as a srcset candidate
    expect(P).toContain(`/screenshots/${clientProjects[0].id}/desktop.webp 1440w`);
    expect(html['CaseStudy mesara']).toContain('/screenshots/mesara/desktop.webp 1440w');
  });

  it('the hero axis is the only timeline: Work draws no figures', () => {
    const P = html.ProfessionalHome;
    const work = P.slice(P.indexOf('id="work"'), P.indexOf('id="experience"'));
    expect(work).not.toMatch(/<figure(?! class="plate")/);
    expect(work).not.toMatch(/abandoned|180 days/i);
  });

  it('no site page carries a build line or an Updated date (the CV sheet keeps its date)', () => {
    for (const [name, markup] of pages) {
      if (name === 'Resume') continue;
      expect(markup, name).not.toMatch(/Built with|Golos Text|Updated/);
    }
  });

  it('Personal shows the quote and its author, not where it was picked from', () => {
    expect(html.PersonalHome).not.toMatch(/GitHub Action|\d+ quotes/);
  });

  it('the Professional hero puts who and since when on its time axis', () => {
    const hero = html.ProfessionalHome.slice(0, html.ProfessionalHome.indexOf('id="work"'));
    // React writes the attribute as dateTime; HTML attribute names are case-insensitive
    expect(hero).toMatch(/Podyx, intern<\/span> <span class="hx-yrs">since <time datetime="2026-07">Jul 2026<\/time>/i);
    expect(hero).toContain('FON, 4th year');
    expect(hero).toMatch(/B\.Sc\. expected <time datetime="2027">2027<\/time>/i);
    // one bar per role and the degree, each read out with its label
    expect(count(hero, /<li class="hx-step/g)).toBe(experience.length + 1);
    expect(hero).toMatch(/<figure class="hx-steps" aria-labelledby="hx-steps-cap"><figcaption class="sr-only" id="hx-steps-cap">Work and study since 2023</);
    // years by the year only where the data has no month
    expect(hero).toMatch(/since <time datetime="2023">2023<\/time>/i);
    expect(hero).toMatch(/since <time datetime="2025">2025<\/time>/i);
  });

  it('the hero today line comes from the build date, not from the markup', () => {
    const axis = careerAxis([...experience.map((x) => x.start), education.start], education.expectedEnd, BUILD_DATE);
    expect(html.ProfessionalHome).toContain(`style="--today:${axis.today};--years:${axis.years.length}"`);
    for (const y of axis.years) expect(html.ProfessionalHome).toContain(`<b>${y}</b>`);
  });

  // The PDF recruiters download is committed; this ties it to the data (generate-pdf.mjs writes cvHash).
  it('the committed CV PDF was printed from the current data', () => {
    const hash = createHash('sha256').update(sheetText(html.Resume)).digest('hex');
    expect(hash, 'CV content changed: run npm run pdf').toBe(updated.cvHash);
  });

  it('the Personal footer signs in Cyrillic', () => {
    expect(html.PersonalFooter).toContain('Ратко');
    expect(html.PersonalFooter).toContain('lang="sr-Cyrl"');
  });

  it.each(pages.filter(([name]) => !['PersonalFooter', 'ProFooter'].includes(name)))('%s has exactly one h1', (_, markup) => {
    expect(count(markup, /<h1[\s>]/g)).toBe(1);
  });

  it('ids are unique across the home document (both modes and both footers)', () => {
    const home = html.ProfessionalHome + html.PersonalHome + html.ProFooter + html.PersonalFooter;
    const ids = [...home.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
    for (const id of ['main', 'top', 'mode-status']) expect(ids).not.toContain(id); // App and the header own these
  });

  it('the home trees carry the anchor contract', () => {
    for (const id of ['name', 'work', 'experience', 'skills', 'contact']) expect(html.ProfessionalHome).toContain(`id="${id}"`);
    for (const id of ['p-name', 'now', 'thought', 'brain', 'elsewhere']) expect(html.PersonalHome).toContain(`id="${id}"`);
    expect(html.PersonalHome).not.toContain('id="log"');
  });
});
