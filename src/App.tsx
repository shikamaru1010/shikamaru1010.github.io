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
import { navState, patchNavState } from './lib/history';
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
  const el =
    (target && target.id !== 'top' ? target : null) ??
    document.querySelector<HTMLElement>('main h1[data-focus-target]') ??
    document.getElementById('main');
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.setAttribute('data-focus-target', '');
  el.focus({ preventScroll: true });
}

export default function App(): JSX.Element {
  const [route, setRoute] = useState<Route>(() => parseRoute(location.hash));
  const mode = useMode();
  const study = route.kind === 'study' ? studyProjects.find((p) => p.id === route.id) : undefined;
  /** The previous page's routeKey (null until the first layout). */
  const prevKey = useRef<string | null>(null);
  /** A plain click on home just followed a link to the CV or a case study. */
  const leavingHome = useRef(false);

  useEffect(() => {
    const onHash = () => {
      const next = parseRoute(location.hash);
      // The new entry was opened from home by a link: its "back to the site" links can use history.
      if (leavingHome.current && next.kind !== 'home') patchNavState({ fromHome: true });
      leavingHome.current = false;
      syncModeFromUrl(); // Back / Forward can land on an entry of the other mode
      setRoute(next);
    };
    // Leaving home by a link: save the position in the home entry while it is still the current one.
    const onClick = (e: MouseEvent) => {
      if (prevKey.current !== 'home' || !isPlainClick(e)) return;
      const href = (e.target as Element | null)?.closest?.('a')?.getAttribute('href');
      if (!href || !href.startsWith('#') || parseRoute(href).kind === 'home') return;
      patchNavState({ homeY: Math.round(window.scrollY) });
      leavingHome.current = true;
    };
    window.addEventListener('hashchange', onHash);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('hashchange', onHash);
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
    if (route.kind === 'home' && route.rewriteHash !== undefined) {
      try {
        history.replaceState(history.state, '', location.pathname + location.search + route.rewriteHash);
      } catch {
        /* ignore */
      }
    }
    const before = prevKey.current;
    prevKey.current = routeKey(route);
    const { scroll, focus } = scrollStep(before, route, route.kind === 'home' ? navState().homeY : undefined);

    let target: HTMLElement | null = null;
    if (scroll.kind === 'top') window.scrollTo(0, 0);
    else if (scroll.kind === 'restore') window.scrollTo(0, scroll.y);
    else if (scroll.kind === 'anchor') {
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
      <main id="main" tabIndex={-1}>
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
