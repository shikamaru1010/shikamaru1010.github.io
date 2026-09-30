import './resume.css';
import { site } from '../../data/site';
import { buildCv, type CvEntry, type CvLink } from '../../lib/cv';
import { returnHome } from '../../lib/history';
import ExternalLink from '../shell/ExternalLink';
import SkipLink from '../shell/SkipLink';

// The CV (#resume): a no-print toolbar over one white A4 sheet. `.resume-sheet` is the selector
// scripts/generate-pdf.mjs waits for, and the sheet must print on exactly one A4 page.
// One column in reading order, standard section names, contact details in the body: the layout
// ATS parsers read correctly. Every line comes from buildCv() (src/lib/cv.ts), the same structure
// the Markdown, JSON Resume and DOCX exports are written from.

function Link({ link, className = 'resume-link' }: { link: CvLink; className?: string }): JSX.Element {
  if (!link.href) return <>{link.text}</>;
  return /^https?:/.test(link.href) ? (
    <ExternalLink className={className} href={link.href}>
      {link.text}
    </ExternalLink>
  ) : (
    <a className={className} href={link.href}>
      {link.text}
    </a>
  );
}

/** A role or a project: title (and employer) with the dates on the same line, then the details and the points. */
function Entry({ entry }: { entry: CvEntry }): JSX.Element {
  return (
    <div className="resume-entry">
      <div className="resume-entry-head">
        <h3 className="resume-h3">
          {entry.title}
          {entry.org && <span className="resume-org"> · {entry.org}</span>}
        </h3>
        <p className="resume-when tnum">{entry.when}</p>
      </div>
      {(entry.detail || entry.link) && (
        <p className="resume-meta">
          {entry.detail}
          {entry.detail && entry.link && <span aria-hidden="true"> · </span>}
          {entry.link && <Link link={entry.link} />}
        </p>
      )}
      <ul className="resume-points">
        {entry.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Resume(): JSX.Element {
  const cv = buildCv();
  const h = cv.headings;

  return (
    <div className="resume-page">
      <SkipLink />
      <header className="resume-bar">
        <div className="resume-bar-row wrap grid">
          <a className="resume-bar-link" href="#top" onClick={returnHome}>
            <span aria-hidden="true">←&nbsp;</span>
            {site.cv.back}
          </a>
          <p className="resume-bar-label label">{site.cv.label}</p>
          <div className="resume-bar-actions">
            <a className="resume-bar-link" href={site.cv.pdf} download>
              {site.cv.download}
            </a>
            <button type="button" className="resume-print" onClick={() => window.print()}>
              {site.cv.print}
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="resume-main">
        <article className="resume-sheet" aria-labelledby="resume-name">
          <header className="resume-head">
            <h1 className="resume-name" id="resume-name" tabIndex={-1} data-focus-target="">
              {cv.name}
              <span className="resume-mark" aria-hidden="true" />
            </h1>
            <p className="resume-title">{cv.title}</p>
            <address className="resume-contact">
              <ul>
                {cv.contact.map((c) => (
                  <li key={c.text}>
                    <Link link={c} />
                  </li>
                ))}
              </ul>
            </address>
          </header>

          <section className="resume-sec" aria-labelledby="resume-summary">
            <h2 className="resume-h2" id="resume-summary">
              {h.summary}
            </h2>
            <p className="resume-text">{cv.summary}</p>
          </section>

          <section className="resume-sec" aria-labelledby="resume-skills">
            <h2 className="resume-h2" id="resume-skills">
              {h.skills}
            </h2>
            <dl className="resume-skills">
              {cv.skills.map((g) => (
                <div key={g.label}>
                  <dt>{g.label}:</dt> <dd>{g.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="resume-sec" aria-labelledby="resume-experience">
            <h2 className="resume-h2" id="resume-experience">
              {h.experience}
            </h2>
            {cv.experience.map((e) => (
              <Entry key={e.title} entry={e} />
            ))}
          </section>

          <section className="resume-sec" aria-labelledby="resume-projects">
            <h2 className="resume-h2" id="resume-projects">
              {h.projects}
            </h2>
            {cv.projects.map((e) => (
              <Entry key={e.title} entry={e} />
            ))}
          </section>

          <section className="resume-sec" aria-labelledby="resume-education">
            <h2 className="resume-h2" id="resume-education">
              {h.education}
            </h2>
            <div className="resume-entry">
              <div className="resume-entry-head">
                <h3 className="resume-h3">{cv.education.degree}</h3>
                <p className="resume-when tnum">{cv.education.when}</p>
              </div>
              <p className="resume-meta">
                {cv.education.school}
                <span aria-hidden="true"> · </span>
                {cv.education.status}
              </p>
              <p className="resume-text resume-course">
                <b>{site.cv.coursework}:</b> {cv.education.coursework}.
              </p>
            </div>
          </section>

          <section className="resume-sec" aria-labelledby="resume-languages">
            <h2 className="resume-h2" id="resume-languages">
              {h.languages}
            </h2>
            <p className="resume-text">{cv.languages.join(' · ')}</p>
          </section>
        </article>

        <p className="resume-formats">
          {site.cv.formatsLead}{' '}
          {site.cv.formats.map((f, i) => (
            <span key={f.href}>
              {i > 0 && <span aria-hidden="true"> · </span>}
              <a className="resume-link" href={f.href} download={f.download || undefined}>
                {f.label}
              </a>
            </span>
          ))}
        </p>
      </main>
    </div>
  );
}
