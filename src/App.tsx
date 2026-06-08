import { useCallback, useEffect, useState } from 'react';
import About from './components/About';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Nav from './components/Nav';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Skills from './components/Skills';

export default function App() {
  // Résumé is a lightweight "route" driven by the URL hash so it's linkable & printable.
  const [showResume, setShowResume] = useState(() => window.location.hash === '#resume');

  useEffect(() => {
    const onHash = () => setShowResume(window.location.hash === '#resume');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const openResume = useCallback(() => {
    window.location.hash = 'resume';
    window.scrollTo(0, 0);
  }, []);

  const closeResume = useCallback(() => {
    history.pushState('', document.title, window.location.pathname + window.location.search);
    setShowResume(false);
  }, []);

  if (showResume) return <Resume onBack={closeResume} />;

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
