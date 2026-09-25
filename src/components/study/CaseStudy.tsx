import { projectAnchor, type StudyProject } from '../../data/projects';
import { site } from '../../data/site';
import SkipLink from '../shell/SkipLink';

// STUB (foundation). Owned by cv-study (D): replace the body, keep the signature.
export default function CaseStudy({ project }: { project: StudyProject }): JSX.Element {
  return (
    <>
      <SkipLink />
      <header className="site-head study-head">
        <div className="wrap grid">
          <a className="brand" href={`#${projectAnchor(project)}`}>
            ← {site.study.back}
          </a>
          <nav className="nav" aria-label={site.nav.label}>
            <a className="nav-cv" href="#resume">
              {site.nav.cv}
            </a>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="study">
        <div className="study-top wrap">
          <p className="label tnum">{site.study.label}</p>
          <h1 className="study-title">{project.title}</h1>
          <p className="study-intro">{project.caseStudy.intro}</p>
        </div>
      </main>
    </>
  );
}
