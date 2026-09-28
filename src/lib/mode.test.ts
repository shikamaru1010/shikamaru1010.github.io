import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { studyProjects } from '../data/projects';
import { site } from '../data/site';
import { DEFAULT_MODE, MODES, isPlainClick, metaFor, parseMode, withMode } from './mode';
import { parseRoute } from './route';

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');

describe('parseMode', () => {
  it.each([
    ['', 'professional'],
    ['?mode=professional', 'professional'],
    ['?mode=personal', 'personal'],
    ['?x=1&mode=personal', 'personal'],
    ['?mode=Personal', 'professional'],
    ['?mode=', 'professional'],
    ['?mode=anything', 'professional'],
    ['?mode=personal&mode=professional', 'personal'], // the first wins, as URLSearchParams.get
  ])('%j → %s', (search, mode) => {
    expect(parseMode(search)).toBe(mode);
  });

  it('defaults to professional and knows both modes', () => {
    expect(DEFAULT_MODE).toBe('professional');
    expect(MODES).toEqual(['professional', 'personal']);
  });
});

describe('withMode', () => {
  it.each([
    ['/', 'personal', '/?mode=personal'],
    ['/', 'professional', '/?mode=professional'],
    ['/?a=1#work', 'personal', '/?a=1&mode=personal#work'],
    ['/?mode=personal#project/mesara', 'professional', '/?mode=professional#project/mesara'],
    ['/?a=1&mode=personal&b=2#resume', 'professional', '/?a=1&mode=professional&b=2#resume'],
    ['https://shikamaru1010.github.io/?mode=professional#client-pilatiq', 'personal', '/?mode=personal#client-pilatiq'],
  ] as const)('%s + %s → %s', (href, mode, out) => {
    expect(withMode(href, mode)).toBe(out);
  });
});

describe('metaFor', () => {
  it('home follows the mode', () => {
    expect(metaFor({ kind: 'home' }, 'professional')).toEqual({
      title: site.titles.professional,
      themeColor: site.themeColor.professional,
      palette: 'home',
    });
    expect(metaFor({ kind: 'home', anchor: 'now' }, 'personal')).toEqual({
      title: site.titles.personal,
      themeColor: site.themeColor.personal,
      palette: 'home',
    });
  });

  it('the CV and case studies are always Professional', () => {
    for (const mode of MODES) {
      expect(metaFor({ kind: 'cv' }, mode)).toEqual({
        title: site.titles.cv,
        themeColor: site.themeColor.professional,
        palette: 'cv',
      });
      expect(metaFor({ kind: 'study', id: 'mesara' }, mode, 'Mesara Šisko')).toEqual({
        title: 'Mesara Šisko · Case study · Ratko Šišović',
        themeColor: site.themeColor.professional,
        palette: 'study',
      });
    }
  });
});

describe('isPlainClick', () => {
  const base = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };
  it('only a plain primary click switches in place', () => {
    expect(isPlainClick(base)).toBe(true);
    expect(isPlainClick({ ...base, button: 1 })).toBe(false);
    expect(isPlainClick({ ...base, ctrlKey: true })).toBe(false);
    expect(isPlainClick({ ...base, metaKey: true })).toBe(false);
    expect(isPlainClick({ ...base, shiftKey: true })).toBe(false);
    expect(isPlainClick({ ...base, altKey: true })).toBe(false);
  });
});

describe('theme colours match the paper tokens', () => {
  const css = read('../styles/tokens.css');
  const block = (selector: RegExp) => {
    const m = css.match(selector);
    expect(m, `block ${selector}`).not.toBeNull();
    return m![1];
  };
  const paperIn = (body: string) => body.match(/--paper:\s*(#[0-9a-fA-F]{6})/)?.[1]?.toUpperCase();

  it('professional = :root --paper', () => {
    expect(paperIn(block(/:root\s*\{([^}]*)\}/))).toBe(site.themeColor.professional.toUpperCase());
  });
  it('personal = the personal --paper', () => {
    expect(paperIn(block(/html\[data-mode="personal"\]\[data-route="home"\]\s*\{([^}]*)\}/))).toBe(
      site.themeColor.personal.toUpperCase(),
    );
  });
});

// ---------------------------------------------------------------------------
// The inline pre-paint script in index.html must agree with parseMode / parseRoute.

type Recorded = {
  attrs: Record<string, string>;
  title: string;
  themeColor: string;
  links: Array<Record<string, string>>;
};

function prepaintSource(): string {
  const html = read('../../index.html');
  const m = html.match(/<script data-prepaint>([\s\S]*?)<\/script>/);
  expect(m, '<script data-prepaint> in index.html').not.toBeNull();
  return m![1];
}

function runPrepaint(src: string, url: string): Recorded {
  const u = new URL(url, 'https://shikamaru1010.github.io');
  const rec: Recorded = { attrs: {}, title: site.titles.professional, themeColor: site.themeColor.professional, links: [] };
  const meta = {
    setAttribute(name: string, value: string) {
      if (name === 'content') rec.themeColor = value;
    },
  };
  const doc = {
    documentElement: {
      setAttribute(name: string, value: string) {
        rec.attrs[name] = value;
      },
    },
    get title() {
      return rec.title;
    },
    set title(v: string) {
      rec.title = v;
    },
    querySelector(sel: string) {
      return sel === 'meta[name="theme-color"]' ? meta : null;
    },
    createElement() {
      const el: Record<string, unknown> = {};
      el.setAttribute = (name: string, value: string) => {
        el[name] = value;
      };
      return el;
    },
    head: {
      appendChild(el: Record<string, unknown>) {
        const plain: Record<string, string> = {};
        for (const [k, v] of Object.entries(el)) if (typeof v === 'string') plain[k] = v;
        rec.links.push(plain);
      },
    },
  };
  new Function('document', 'location', src)(doc, { search: u.search, hash: u.hash });
  return rec;
}

describe('pre-paint script parity', () => {
  const src = prepaintSource();

  it('is ES5 (no arrow functions, let/const or template strings)', () => {
    expect(src).not.toMatch(/=>|\blet\b|\bconst\b|`/);
  });

  it('knows exactly the ids that have a case study', () => {
    const m = src.match(/var S = \[([^\]]*)\]/);
    expect(m, 'var S = [...] in the pre-paint script').not.toBeNull();
    const ids = m![1].split(',').map((s) => s.trim().replace(/^'|'$/g, ''));
    expect(ids).toEqual(studyProjects.map((p) => p.id));
  });

  // [url, route the pre-paint script sets]; it always equals parseRoute's kind
  const cases: Array<[string, 'home' | 'cv' | 'study']> = [
    ['/', 'home'],
    ['/?mode=professional', 'home'],
    ['/?mode=personal', 'home'],
    ['/?mode=Personal', 'home'],
    ['/?x=1&mode=personal#work', 'home'],
    ['/?mode=personal#now', 'home'],
    ['/#resume', 'cv'],
    ['/?mode=personal#resume', 'cv'],
    ['/#project/mesara', 'study'],
    ['/?mode=personal#project/mesara', 'study'],
    ['/?mode=personal#project/dev-dashboard', 'study'],
    // a #project/<id> without a case study, or an unknown id, is home (App rewrites the hash)
    ['/#project/pilatiq', 'home'],
    ['/?mode=personal#project/pilatiq', 'home'],
    ['/?mode=personal#project/nope', 'home'],
  ];

  it.each(cases)('%s', (url, route) => {
    const u = new URL(url, 'https://shikamaru1010.github.io');
    const rec = runPrepaint(src, url);
    const mode = parseMode(u.search);
    expect(rec.attrs['data-mode']).toBe(mode);
    expect(rec.attrs['data-route']).toBe(route);
    expect(rec.attrs['data-route']).toBe(parseRoute(u.hash).kind);

    // nothing to preload in either mode: the Personal circle is an inline drawing (ContourArt)
    expect(rec.links).toHaveLength(0);
    if (mode === 'personal' && route === 'home') {
      expect(rec.title).toBe(site.titles.personal);
      expect(rec.themeColor).toBe(site.themeColor.personal);
    } else {
      expect(rec.title).toBe(site.titles.professional);
      expect(rec.themeColor).toBe(site.themeColor.professional);
    }
  });
});
