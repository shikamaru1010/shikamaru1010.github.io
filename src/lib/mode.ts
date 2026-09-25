// The two personas of the site, as pure functions (no DOM). The live state and
// its side effects are in useMode.ts. Unit-tested in mode.test.ts.
import { site } from '../data/site';
import { fill } from './format';
import type { Route } from './route';

export type Mode = 'professional' | 'personal';
export const MODES: readonly Mode[] = ['professional', 'personal'];
export const DEFAULT_MODE: Mode = 'professional';

/** `search` is a location.search string ('?a=1&mode=personal' or ''). Only an exact 'personal' selects personal. */
export function parseMode(search: string): Mode {
  try {
    return new URLSearchParams(search).get('mode') === 'personal' ? 'personal' : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

/**
 * pathname + search + hash of `href` with `mode` set (professional is written
 * explicitly), keeping every other param, their order, and the hash.
 */
export function withMode(href: string, mode: Mode): string {
  const u = new URL(href, 'http://localhost');
  u.searchParams.set('mode', mode);
  return u.pathname + u.search + u.hash;
}

/** Which palette a page wears. Only home follows the mode; the CV and case studies are always Professional. */
export type Palette = 'home' | 'cv' | 'study';

/** Title and theme-color for a route. Study titles fill site.titles.study with the project's title. */
export function metaFor(
  route: Route,
  mode: Mode,
  projectTitle?: string,
): { title: string; themeColor: string; palette: Palette } {
  if (route.kind === 'cv') {
    return { title: site.titles.cv, themeColor: site.themeColor.professional, palette: 'cv' };
  }
  if (route.kind === 'study') {
    return {
      title: fill(site.titles.study, { project: projectTitle ?? route.id }),
      themeColor: site.themeColor.professional,
      palette: 'study',
    };
  }
  return { title: site.titles[mode], themeColor: site.themeColor[mode], palette: 'home' };
}

/** A plain left click (no modifier) switches in place; anything else is left to the browser (new tab, copy link). */
export function isPlainClick(e: {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
