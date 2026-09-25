import './resume.css';
import { education, experience, languages } from '../../data/experience';
import { profile } from '../../data/profile';
import { cvProjectIds, projectById, projectDomain, type Project } from '../../data/projects';
import { site } from '../../data/site';
import { alsoUsed, skillGroups } from '../../data/skills';
import { UPDATED, capitalize, domainOf, fill, formatPeriod, listJoin, ordinal } from '../../lib/format';
import { returnHome } from '../../lib/history';
import ExternalLink from '../shell/ExternalLink';
import SkipLink from '../shell/SkipLink';

// The CV (#resume): a no-print toolbar over one white A4 sheet. `.resume-sheet`
// is the selector scripts/generate-pdf.mjs waits for, and the sheet must print on
// exactly one A4 page. Every line below is derived from src/data; nothing is typed in.

type ContactItem = { text: string; href?: string; external?: boolean };

function ContactLine({ item }: { item: ContactItem }): JSX.Element {
  if (!item.href) return <li>{item.text}</li>;
  return (
    <li>
      {item.external ? (
        <ExternalLink className="resume-link" href={item.href}>
          {item.text}
        </ExternalLink>
      ) : (
        <a className="resume-link" href={item.href}>
          {item.text}
        </a>
      )}
    </li>
  );
}

/** A project: its title and the blurb (which already says what it is), then the stack and the live site. */
function ProjectEntry({ project }: { project: Project }): JSX.Element {
  const domain = projectDomain(project);
  return (
    <div className="resume-entry">
      <h3 className="resume-h3">{project.title}</h3>
      <p className="resume-text">{project.blurb}</p>
      <p className="resume-meta resume-meta-row">
        <span>{project.tech.join(', ')}</span>
        {domain && project.liveUrl && (
          <ExternalLink className="resume-link" href={project.liveUrl}>
            {domain}
          </ExternalLink>
        )}
      </p>
    </div>
  );
}

export default function Resume(): JSX.Element {
  const now = experience[0];
  const roleLine = fill(site.cv.roleLine, { role: now.role, org: now.org, ordinal: ordinal(education.year), school: education.short });
  const contact: ContactItem[] = [
    { text: profile.email, href: `mailto:${profile.email}` },
    { text: `github.com/${profile.githubHandle}`, href: profile.github, external: true },
    { text: `linkedin.com/in/${profile.linkedinHandle}`, href: profile.linkedin, external: true },
    { text: profile.location },
    { text: domainOf(profile.siteUrl), href: profile.siteUrl },
  ];
  const cvProjects = cvProjectIds.map((id) => projectById(id)).filter((p): p is Project => Boolean(p));
  const coursework = education.courses.filter((c) => c.featured).map((c) => c.name);

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
            <div className="resume-id">
              <h1 className="resume-name" id="resume-name" tabIndex={-1} data-focus-target="">
                {profile.name}
                <span className="resume-mark" aria-hidden="true" />
              </h1>
              <p className="resume-role">{roleLine}</p>
              <p className="resume-summary">{profile.cvSummary}</p>
            </div>
            <address className="resume-contact">
              <ul>
                {contact.map((item) => (
                  <ContactLine key={item.text} item={item} />
                ))}
              </ul>
            </address>
          </header>

          <div className="resume-cols">
            <div className="resume-col-main">
              <section className="resume-sec" aria-labelledby="resume-experience">
                <h2 className="resume-h2" id="resume-experience">
                  {site.cv.experience}
                </h2>
                {experience.map((x) => (
                  <div className="resume-entry" key={`${x.org}-${x.start}`}>
                    <div className="resume-entry-head">
                      <h3 className="resume-h3">{x.role}</h3>
                      <p className="resume-meta">
                        {x.location ? `${x.org} · ${x.location}` : x.org}
                      </p>
                      <p className="resume-meta resume-when tnum">{formatPeriod(x.start, x.end)}</p>
                    </div>
                    <ul className="resume-points">
                      {x.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section className="resume-sec" aria-labelledby="resume-projects">
                <h2 className="resume-h2" id="resume-projects">
                  {site.cv.projects}
                </h2>
                {cvProjects.map((p) => (
                  <ProjectEntry key={p.id} project={p} />
                ))}
              </section>
            </div>

            <div className="resume-col-side">
              <section className="resume-sec" aria-labelledby="resume-education">
                <h2 className="resume-h2" id="resume-education">
                  {site.cv.education}
                </h2>
                <div className="resume-entry">
                  <h3 className="resume-h3">{education.degree}</h3>
                  <p className="resume-meta">{education.school}</p>
                  <p className="resume-meta tnum">
                    {fill(site.cv.eduYears, {
                      period: formatPeriod(education.start, education.expectedEnd),
                      ordinal: ordinal(education.year),
                    })}
                  </p>
                </div>
                <dl className="resume-dl">
                  <div>
                    <dt>{site.cv.coursework}</dt>
                    <dd>{coursework.join(', ')}</dd>
                  </div>
                </dl>
              </section>

              <section className="resume-sec" aria-labelledby="resume-skills">
                <h2 className="resume-h2" id="resume-skills">
                  {site.cv.skills}
                </h2>
                <dl className="resume-dl">
                  {skillGroups.map((g) => (
                    // the CV lists every group, the CV-only ones included
                    <div key={g.label}>
                      <dt>{g.label}</dt>
                      <dd>{capitalize(g.skills.map((s) => s.name).join(', '))}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="resume-sec" aria-labelledby="resume-languages">
                <h2 className="resume-h2" id="resume-languages">
                  {site.cv.languages}
                </h2>
                <ul className="resume-plain">
                  {languages.map((l) => (
                    <li key={l.name}>
                      {l.name}, {l.level}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="resume-sec" aria-labelledby="resume-also">
                <h2 className="resume-h2" id="resume-also">
                  {site.cv.also}
                </h2>
                <p className="resume-text">{listJoin(alsoUsed)}</p>
              </section>
            </div>
          </div>

          {/* the site's address is in the contact block */}
          <footer className="resume-foot">
            <p className="tnum">{fill(site.cv.updated, { date: UPDATED })}</p>
          </footer>
        </article>
      </main>
    </div>
  );
}
