import { createHash } from 'node:crypto';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Resume from './components/cv/Resume';
import PersonalFooter from './components/personal/PersonalFooter';
import PersonalHome from './components/personal/PersonalHome';
import ProFooter from './components/pro/ProFooter';
import ProfessionalHome from './components/ProfessionalHome';
import CaseStudy from './components/study/CaseStudy';
import { personal } from './data/personal';
import { profile } from './data/profile';
import { clientProjects, studyProjects } from './data/projects';
import { site } from './data/site';
import updated from './data/updated.json';

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

  it('no timelines: the hero has no figure or list, and Work draws no figures', () => {
    const P = html.ProfessionalHome;
    const hero = P.slice(0, P.indexOf('id="work"'));
    expect(hero).not.toMatch(/<(figure|ol|ul|time)[\s>]/);
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

  // The hero (Monolith): the markup up to the next section, and what its circle holds.
  const heroOf = (markup: string, next: string) => markup.slice(0, markup.indexOf(next));
  const discOf = (hero: string) => {
    const at = hero.indexOf('<div class="mono-disc"');
    expect(at, 'the circle').toBeGreaterThan(-1);
    return hero.slice(at, hero.indexOf('<div class="mono-body"', at));
  };

  it('the Professional hero: name, role and now, the one sentence and one CV link', () => {
    const hero = heroOf(html.ProfessionalHome, 'id="work"');
    expect(hero).toContain(`<h1 class="mono-name" id="name">${profile.name}</h1>`);
    expect(hero).toContain('Software developer, Belgrade');
    expect(hero).toMatch(/<span class="nw">Intern at Podyx<\/span>.*<span class="nw">FON, 4th year<\/span>/);
    expect(profile.lede).toBe('From first brief to production: websites, internal tools and automation systems.');
    expect(hero).toContain(`<p class="mono-lede">${profile.lede}</p>`);
    expect(count(hero, /href="#resume"/g)).toBe(1);
    expect(hero).toContain(`${site.hero.viewCv}<span aria-hidden="true"> →</span></a>`);
  });

  it('the Professional circle holds the code loop: a muted inline loop, webm first, loaded only when played', () => {
    const disc = discOf(heroOf(html.ProfessionalHome, 'id="work"'));
    const L = site.hero.loop;
    expect(disc).toMatch(/^<div class="mono-disc" aria-hidden="true"><video /);
    expect(disc).not.toContain('<img');
    expect(disc).not.toMatch(/autoplay/i); // an IntersectionObserver plays it on screen (CodeLoop)
    for (const attr of ['muted=""', 'loop=""', 'playsinline=""', 'preload="none"', `poster="${L.poster}"`]) {
      expect(disc).toContain(attr);
    }
    expect(disc.indexOf(`<source src="${L.webm}" type="video/webm"/>`)).toBeLessThan(
      disc.indexOf(`<source src="${L.mp4}" type="video/mp4"/>`),
    );
  });

  it('the Personal hero: the same composition, the first name, the Personal sentence and the photo in the circle', () => {
    const hero = heroOf(html.PersonalHome, 'id="now"');
    expect(hero).toContain(`<h1 class="mono-name" id="p-name">${personal.firstName}</h1>`);
    expect(hero).toContain(`<p class="mono-sub">${personal.intro}</p>`);
    expect(hero).toContain(`<p class="mono-lede">${personal.line}</p>`);
    expect(hero).not.toContain('href="#resume"');
    const disc = discOf(hero);
    expect(disc).toMatch(/^<div class="mono-disc"><img /); // not aria-hidden: the photo has its alt text
    expect(disc).toContain(`alt="${personal.photo.alt}"`);
    expect(disc).toContain('data-warm=""');
    expect(disc).not.toContain('<video');
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
