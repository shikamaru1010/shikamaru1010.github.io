import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Resume from './components/cv/Resume';
import PersonalFooter from './components/personal/PersonalFooter';
import PersonalHome from './components/personal/PersonalHome';
import Colophon from './components/pro/Colophon';
import ProfessionalHome from './components/ProfessionalHome';
import CaseStudy from './components/study/CaseStudy';
import { studyProjects } from './data/projects';

// Server-renders every page tree in node: render must be pure (no window /
// document during render), the words must be right, and the two mode trees,
// which share one document, must not repeat an id.

const e = String.fromCharCode(0xe9);
const BANNED = [new RegExp(`r${e}sum${e}|r${e}sume|resum${e}`, 'i'), /\b3rd\b/i, /\bthird[\s-]+year\b/i];

const pages: Array<[string, string]> = [
  ['ProfessionalHome', renderToStaticMarkup(<ProfessionalHome />)],
  ['PersonalHome', renderToStaticMarkup(<PersonalHome />)],
  ['PersonalFooter', renderToStaticMarkup(<PersonalFooter />)],
  ['Colophon', renderToStaticMarkup(<Colophon />)],
  ['Resume', renderToStaticMarkup(<Resume />)],
  ...studyProjects.map((p): [string, string] => [`CaseStudy ${p.id}`, renderToStaticMarkup(<CaseStudy project={p} />)]),
];
const html = Object.fromEntries(pages);
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;

describe('render', () => {
  it.each(pages)('%s has no banned words', (_, markup) => {
    for (const re of BANNED) expect(markup).not.toMatch(re);
  });

  it('Professional says who: 4th year, Podyx, and a CV link', () => {
    expect(html.ProfessionalHome).toContain('4th');
    expect(html.ProfessionalHome).toContain('Podyx');
    expect(html.ProfessionalHome).toContain('CV');
  });

  it('the Personal footer signs in Cyrillic', () => {
    expect(html.PersonalFooter).toContain('Ратко');
    expect(html.PersonalFooter).toContain('lang="sr-Cyrl"');
  });

  it.each(pages.filter(([name]) => !['PersonalFooter', 'Colophon'].includes(name)))('%s has exactly one h1', (_, markup) => {
    expect(count(markup, /<h1[\s>]/g)).toBe(1);
  });

  it('ids are unique across the home document (both modes and both footers)', () => {
    const home = html.ProfessionalHome + html.PersonalHome + html.Colophon + html.PersonalFooter;
    const ids = [...home.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
    for (const id of ['main', 'top', 'mode-status']) expect(ids).not.toContain(id); // App and the header own these
  });

  it('the home trees carry the anchor contract', () => {
    for (const id of ['name', 'work', 'experience', 'skills', 'contact']) expect(html.ProfessionalHome).toContain(`id="${id}"`);
    for (const id of ['p-name', 'log', 'now', 'thought', 'brain', 'elsewhere']) expect(html.PersonalHome).toContain(`id="${id}"`);
  });
});
