import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { personal } from '../data/personal';
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

  // [url, route the pre-paint script sets, same as parseRoute?]
  const cases: Array<[string, 'home' | 'cv' | 'study', boolean]> = [
    ['/', 'home', true],
    ['/?mode=professional', 'home', true],
    ['/?mode=personal', 'home', true],
    ['/?mode=Personal', 'home', true],
    ['/?x=1&mode=personal#work', 'home', true],
    ['/?mode=personal#now', 'home', true],
    ['/#resume', 'cv', true],
    ['/?mode=personal#resume', 'cv', true],
    ['/#project/mesara', 'study', true],
    ['/?mode=personal#project/mesara', 'study', true],
    ['/?mode=personal#project/dev-dashboard', 'study', true],
    // Documented, accepted difference: a #project/<id> without a case study pre-paints as `study`,
    // and App corrects it to `home` in its first layout effect.
    ['/#project/pilatiq', 'study', false],
    ['/?mode=personal#project/nope', 'study', false],
  ];

  it.each(cases)('%s', (url, route, parity) => {
    const u = new URL(url, 'https://shikamaru1010.github.io');
    const rec = runPrepaint(src, url);
    const mode = parseMode(u.search);
    expect(rec.attrs['data-mode']).toBe(mode);
    expect(rec.attrs['data-route']).toBe(route);
    if (parity) expect(rec.attrs['data-route']).toBe(parseRoute(u.hash).kind);
    else expect(parseRoute(u.hash).kind).toBe('home');

    if (mode === 'personal' && route === 'home') {
      expect(rec.title).toBe(site.titles.personal);
      expect(rec.themeColor).toBe(site.themeColor.personal);
      expect(rec.links).toHaveLength(1);
      expect(rec.links[0]).toMatchObject({ rel: 'preload', as: 'image', href: personal.photo.src, fetchpriority: 'high' });
    } else {
      expect(rec.title).toBe(site.titles.professional);
      expect(rec.themeColor).toBe(site.themeColor.professional);
      expect(rec.links).toHaveLength(0);
    }
  });
});
