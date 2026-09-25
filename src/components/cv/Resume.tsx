import { profile } from '../../data/profile';
import { site } from '../../data/site';
import SkipLink from '../shell/SkipLink';

// STUB (foundation). Owned by cv-study (D): replace the body, keep the signature.
// `.resume-sheet` is the selector scripts/generate-pdf.mjs waits for.
export default function Resume(): JSX.Element {
  return (
    <div className="resume-page">
      <SkipLink />
      <header className="resume-bar">
        <div className="wrap">
          <a className="u" href="#top">
            ← {site.cv.back}
          </a>
          <p className="label">{site.cv.label}</p>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <article className="resume-sheet">
          <h1>{profile.name}</h1>
          <p>{profile.cvSummary}</p>
        </article>
      </main>
    </div>
  );
}
