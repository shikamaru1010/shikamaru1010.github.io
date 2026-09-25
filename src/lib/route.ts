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
