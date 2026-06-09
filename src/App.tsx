import { useCallback, useEffect, useState } from 'react';
import About from './components/About';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Nav from './components/Nav';
import ProjectCaseStudy from './components/ProjectCaseStudy';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Skills from './components/Skills';
import { projects } from './data/projects';

// Lightweight hash "router": the site stays a single page, but the résumé and
// per-project case studies live at linkable, shareable hashes.
type Route = { kind: 'home' } | { kind: 'resume' } | { kind: 'project'; id: string };

function parseRoute(): Route {
  const hash = window.location.hash;
  if (hash === '#resume') return { kind: 'resume' };
  if (hash.startsWith('#project/')) return { kind: 'project', id: hash.slice('#project/'.length) };
  return { kind: 'home' };
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const openResume = useCallback(() => {
    window.location.hash = 'resume';
    window.scrollTo(0, 0);
  }, []);

  const goHome = useCallback(() => {
    history.pushState('', document.title, window.location.pathname + window.location.search);
    setRoute({ kind: 'home' });
  }, []);

  if (route.kind === 'resume') return <Resume onBack={goHome} />;

  if (route.kind === 'project') {
    const project = projects.find((p) => p.id === route.id);
    // Only projects that actually have a case study get the dedicated page;
    // anything else (bad/stale link) falls through to the home page.
    if (project?.caseStudy) return <ProjectCaseStudy project={project} onBack={goHome} />;
  }

  return (
    <>
      <Nav onOpenResume={openResume} />
      <main>
        <Hero onOpenResume={openResume} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
