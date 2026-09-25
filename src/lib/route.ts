// The hash router: the site is one page, and the CV and case studies live at
// shareable hashes. Pure (no DOM), unit-tested in route.test.ts.
import { projectAnchor, projectById } from '../data/projects';

export type Route =
  | { kind: 'home'; anchor?: string; rewriteHash?: string }
  | { kind: 'cv' }
  | { kind: 'study'; id: string };

function decode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/**
 * | hash                                   | route                                             |
 * | '' / '#'                               | home                                              |
 * | '#resume'                              | cv                                                |
 * | '#project/<id>' with a case study      | study                                             |
 * | '#project/<id>' without a case study   | home, anchor = the project's row, hash rewritten  |
 * | '#project/<unknown>'                   | home, hash stripped                               |
 * | any other '#x'                         | home, anchor = 'x'                                |
 */
export function parseRoute(hash: string): Route {
  if (!hash || hash === '#') return { kind: 'home' };
  if (hash === '#resume') return { kind: 'cv' };
  if (hash.startsWith('#project/')) {
    const id = decode(hash.slice('#project/'.length));
    const p = projectById(id);
    if (!p) return { kind: 'home', rewriteHash: '' };
    if (p.caseStudy) return { kind: 'study', id: p.id };
    const anchor = projectAnchor(p);
    return { kind: 'home', anchor, rewriteHash: `#${anchor}` };
  }
  return { kind: 'home', anchor: decode(hash.slice(1)) };
}

/** The identity of a page. A change of study id is a page change, just like a change of kind. */
export function routeKey(route: Route): string {
  return route.kind === 'study' ? `study:${route.id}` : route.kind;
}

/** What App does with the scroll position after the route changes. */
export type ScrollStep =
  | { kind: 'native' } // leave it to the browser (its own anchor jump or scroll restoration)
  | { kind: 'anchor'; id: string } // scroll this element into view; the top of the page if it is hidden
  | { kind: 'top' }
  | { kind: 'restore'; y: number };

/**
 * The scroll step and whether focus moves, for a route change. `before` is the previous
 * `routeKey` (null on first mount); `savedY` is the home position saved in this history
 * entry, if there is one (browser Back to home).
 *
 * | change                                 | scroll                               | focus |
 * | first mount                            | the anchor, if any, else native      | no    |
 * | home → home (a plain anchor)           | native                               | no    |
 * | home → home with a rewritten hash      | the rewritten anchor, else the top   | no    |
 * | any → cv / study, study → other study  | top                                  | yes   |
 * | cv / study → home                      | saved position, else anchor, else top| yes   |
 */
export function scrollStep(before: string | null, route: Route, savedY?: number): { scroll: ScrollStep; focus: boolean } {
  const anchor = route.kind === 'home' ? route.anchor : undefined;
  if (before === null) return { scroll: anchor ? { kind: 'anchor', id: anchor } : { kind: 'native' }, focus: false };
  if (before === routeKey(route)) {
    if (route.kind === 'home' && route.rewriteHash !== undefined) {
      return { scroll: anchor ? { kind: 'anchor', id: anchor } : { kind: 'top' }, focus: false };
    }
    return { scroll: { kind: 'native' }, focus: false };
  }
  if (route.kind !== 'home') return { scroll: { kind: 'top' }, focus: true };
  if (typeof savedY === 'number' && Number.isFinite(savedY)) return { scroll: { kind: 'restore', y: savedY }, focus: true };
  return { scroll: anchor ? { kind: 'anchor', id: anchor } : { kind: 'top' }, focus: true };
}
