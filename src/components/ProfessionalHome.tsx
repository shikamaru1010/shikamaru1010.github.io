import Contact from './pro/Contact';
import Experience from './pro/Experience';
import Hero from './pro/Hero';
import Skills from './pro/Skills';
import Work from './work/Work';

/** The Professional tree: Hero, Work, Experience, Skills, Contact. The colophon is App's footer. */
export default function ProfessionalHome(): JSX.Element {
  return (
    <>
      <Hero />
      <Work />
      <Experience />
      <Skills />
      <Contact />
    </>
  );
}
