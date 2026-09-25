import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CaseStudy from './components/study/CaseStudy';
import Resume from './components/cv/Resume';
import PersonalFooter from './components/personal/PersonalFooter';
import PersonalHome from './components/personal/PersonalHome';
import Colophon from './components/pro/Colophon';
import ProfessionalHome from './components/ProfessionalHome';
import SiteHeader from './components/shell/SiteHeader';
import SkipLink from './components/shell/SkipLink';
import { studyProjects } from './data/projects';
import { applyDocumentMeta } from './lib/documentMeta';
import { focusMain, visibleLinks } from './lib/focus';
import { navState, patchNavState, type NavState } from './lib/history';
import { isPlainClick } from './lib/mode';
import { parseRoute, routeKey, scrollStep, type Route } from './lib/route';
import { syncModeFromUrl, useMode } from './lib/useMode';

function visibleElement(id: string | undefined): HTMLElement | null {
  if (!id) return null;
  const el = document.getElementById(id);
  return el && el.getClientRects().length ? el : null;
}

/**
 * After a page change, focus goes to the new page (a keyboard or screen-reader user
 * would otherwise be left on <body>): the anchor it opened at, else the page's h1
 * (CV, case study), else <main>. The target gets tabindex="-1" and no ring
 * ([data-focus-target] in base.css): it marks a place, it is not a control.
 */
function focusPage(target: HTMLElement | null): void {
  const el = (target && target.id !== 'top' ? target : null) ?? document.querySelector<HTMLElement>('main h1[data-focus-target]');
  if (!el) {
    focusMain({ preventScroll: true });
    return;
  }
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.setAttribute('data-focus-target', '');
  el.focus({ preventScroll: true });
}

/** The bottom of the sticky header: what is above it is covered. */
function headerBottom(): number {
  return document.querySelector('.site-head')?.getBoundingClientRect().bottom ?? 0;
}

/** Some of the element is on screen, below the sticky header. */
function inView(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > headerBottom() && r.top < window.innerHeight;
}

/** The row or section at the top of the screen, just under the header. */
function boxAtTop(): HTMLElement | null {
  const hit = document.elementFromPoint(window.innerWidth / 2, headerBottom() + 8);
  const box = hit?.closest<HTMLElement>('article[id], section[id], li[id]');
  return box && box.id !== 'top' ? box : null;
}

/**
 * Back (or Forward) to home: focus goes where the restored scroll position is, so the next Tab
 * continues from there, not from the top of the page. First the link the visitor left by, or
 * the box around it, if it is on screen; else the row or section at the top of the screen;
 * <main> only when the page is at its top. The saved link is kept for the next return: the
 * capture click in App overwrites it when home is left by a link again.
 */
function focusReturn(saved: NavState['homeFocus']): void {
  if (saved) {
    const links = visibleLinks(saved.href);
    const link = links[saved.i] ?? links[0];
    if (link && inView(link)) {
      link.focus({ preventScroll: true });
      return;
    }
    const box = visibleElement(saved.within);
    if (box && box.id !== 'main' && box.id !== 'root' && inView(box)) {
      focusPage(box);
      return;
    }
  }
  const top = window.scrollY > 0 ? boxAtTop() : null;
  if (top) focusPage(top);
  else focusMain({ preventScroll: true });
}

export default function App(): JSX.Element {
  const [route, setRoute] = useState<Route>(() => parseRoute(location.hash));
  const mode = useMode();
  const study = route.kind === 'study' ? studyProjects.find((p) => p.id === route.id) : undefined;
  /** The previous page's routeKey (null until the first layout). */
  const prevKey = useRef<string | null>(null);
  /** A plain click on home just followed a link to the CV or a case study. */
  const leavingHome = useRef(false);
  /** The hash the route was last taken from (or rewritten to), so the second of two events is a no-op. */
  const handledHash = useRef(location.hash);

  useEffect(() => {
    // Both events: a traversal across a ?mode change (the switch rewrites the search with
    // replaceState) fires only popstate, and an ordinary hash change fires both.
    const sync = () => {
      syncModeFromUrl(); // Back / Forward can land on an entry of the other mode
      if (location.hash === handledHash.current) return;
      handledHash.current = location.hash;
      const next = parseRoute(location.hash);
      // The new entry was opened from home by a link: its "back to the site" links can use history.
      if (leavingHome.current && next.kind !== 'home') patchNavState({ fromHome: true });
      leavingHome.current = false;
      setRoute(next);
    };
    // Leaving home by a link (a click, or Enter on it): save the position and the link in the
    // home entry while it is still the current one.
    const onClick = (e: MouseEvent) => {
      if (prevKey.current !== 'home' || !isPlainClick(e)) return;
      const link = (e.target as Element | null)?.closest?.('a');
      const href = link?.getAttribute('href');
      if (!link || !href || !href.startsWith('#') || parseRoute(href).kind === 'home') return;
      const i = Math.max(0, visibleLinks(href).indexOf(link));
      const within = link.parentElement?.closest('[id]')?.id;
      patchNavState({ homeY: Math.round(window.scrollY), homeFocus: { href, i, within } });
      leavingHome.current = true;
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
      document.removeEventListener('click', onClick, true);
    };
  }, []);

  // While home is shown, keep its entry's position current (for Back / Forward that skip the click above).
  useEffect(() => {
    if (route.kind !== 'home') return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => patchNavState({ homeY: Math.round(window.scrollY) }), 250);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [route.kind]);

  // Document state for the page: <html data-route>, title, theme-color; and the hash rewrite.
  useLayoutEffect(() => {
    const shown: Route = route.kind === 'study' && !study ? { kind: 'home' } : route;
    applyDocumentMeta(shown, mode, study?.title);
  }, [route, mode, study]);

  // Scrolling and focus, without fighting the browser's own restoration (route.ts, scrollStep).
  useLayoutEffect(() => {
    // The browser restores the scroll position of an entry it returns to, after this effect has
    // run: right for home, which is restored anyway, but a CV or case study opens at the top,
    // next to the h1 that gets focus. The mode is kept per history entry.
    try {
      history.scrollRestoration = route.kind === 'home' ? 'auto' : 'manual';
    } catch {
      /* ignore */
    }
    if (route.kind === 'home' && route.rewriteHash !== undefined) {
      try {
        history.replaceState(history.state, '', location.pathname + location.search + route.rewriteHash);
      } catch {
        /* ignore */
      }
      handledHash.current = location.hash;
    }
    const before = prevKey.current;
    prevKey.current = routeKey(route);
    const { scroll, focus } = scrollStep(before, route, route.kind === 'home' ? navState().homeY : undefined);

    let target: HTMLElement | null = null;
    if (scroll.kind === 'top') window.scrollTo(0, 0);
    else if (scroll.kind === 'restore') {
      window.scrollTo(0, scroll.y);
      if (focus) focusReturn(navState().homeFocus);
      return;
    } else if (scroll.kind === 'anchor') {
      target = visibleElement(scroll.id);
      if (target) target.scrollIntoView();
      else if (before !== null) window.scrollTo(0, 0); // the anchor is hidden in this mode
    }
    if (focus) focusPage(target);
  }, [route]);

  if (route.kind === 'cv') return <Resume />;
  // key: the next case study is a new page, not an update of this one
  if (study) return <CaseStudy key={study.id} project={study} />;

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <span id="top" />
        <div className="only-pro">
          <ProfessionalHome />
        </div>
        <div className="only-personal">
          <PersonalHome />
        </div>
      </main>
      <footer className="only-pro">
        <Colophon />
      </footer>
      <footer className="only-personal">
        <PersonalFooter />
      </footer>
      <div className="wipe-edge" aria-hidden="true" />
    </>
  );
}
