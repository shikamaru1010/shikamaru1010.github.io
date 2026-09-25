import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CaseStudy from './components/study/CaseStudy';
import Resume from './components/cv/Resume';
import PersonalFooter from './components/personal/PersonalFooter';
import PersonalHome from './components/personal/PersonalHome';
import Colophon from './components/pro/Colophon';
import ProfessionalHome from './components/ProfessionalHome';
import GridOverlay from './components/shell/GridOverlay';
import SiteHeader from './components/shell/SiteHeader';
import SkipLink from './components/shell/SkipLink';
import { studyProjects } from './data/projects';
import { applyDocumentMeta } from './lib/documentMeta';
import { useFitDisplay } from './lib/fit';
import { parseRoute, type Route } from './lib/route';
import { useMode } from './lib/useMode';

/** Where the visitor was on home when they left for the CV or a case study (browser Back returns there). */
let homeScrollY: number | null = null;

function visibleElement(id: string | undefined): HTMLElement | null {
  if (!id) return null;
  const el = document.getElementById(id);
  return el && el.getClientRects().length ? el : null;
}

export default function App(): JSX.Element {
  const [route, setRoute] = useState<Route>(() => parseRoute(location.hash));
  const mode = useMode();
  const study = route.kind === 'study' ? studyProjects.find((p) => p.id === route.id) : undefined;
  const prevKind = useRef<Route['kind'] | null>(null);

  useEffect(() => {
    const onHash = () => {
      const next = parseRoute(location.hash);
      // Leaving home: remember the position now, while the home page is still laid out.
      if (prevKind.current === 'home' && next.kind !== 'home') homeScrollY = window.scrollY;
      setRoute(next);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Document state for the page: <html data-route>, title, theme-color; and the hash rewrite.
  useLayoutEffect(() => {
    const shown: Route = route.kind === 'study' && !study ? { kind: 'home' } : route;
    applyDocumentMeta(shown, mode, study?.title);
  }, [route, mode, study]);

  // Scrolling, without fighting the browser's own restoration.
  useLayoutEffect(() => {
    if (route.kind === 'home' && route.rewriteHash !== undefined) {
      try {
        history.replaceState(history.state, '', location.pathname + location.search + route.rewriteHash);
      } catch {
        /* ignore */
      }
    }
    const before = prevKind.current;
    prevKind.current = route.kind;
    const anchor = route.kind === 'home' ? route.anchor : undefined;

    if (before === null) {
      // First mount: the anchor did not exist when the browser tried its native jump.
      visibleElement(anchor)?.scrollIntoView();
      return;
    }
    if (before === route.kind) return; // home → home hash changes: the browser's native anchor scroll
    if (route.kind !== 'home') {
      window.scrollTo(0, 0);
      return;
    }
    const target = visibleElement(anchor);
    if (target) target.scrollIntoView();
    else if (anchor) window.scrollTo(0, 0); // the anchor is hidden in this mode
    else window.scrollTo(0, homeScrollY ?? 0); // browser Back from the CV or a case study
  }, [route]);

  useFitDisplay([route.kind, mode]);

  if (route.kind === 'cv') return <Resume />;
  if (study) return <CaseStudy project={study} />;

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
      <GridOverlay />
      <div className="wipe-edge" aria-hidden="true" />
    </>
  );
}
