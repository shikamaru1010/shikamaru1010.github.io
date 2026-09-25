import './study.css';
import { personal } from '../../data/personal';
import { profile } from '../../data/profile';
import { projectAnchor, projectDomain, studyProjects, type StudyProject } from '../../data/projects';
import { site } from '../../data/site';
import { UPDATED, fill, updatedYear } from '../../lib/format';
import { returnHome } from '../../lib/history';
import { useMode } from '../../lib/useMode';
import NewTab from '../shell/NewTab';
import SkipLink from '../shell/SkipLink';
import StudyFlow from './StudyFlow';

// A case study (#project/<id>), in the Swiss language and always in the
// Professional palette (tokens.css gates Personal to data-route="home").
// No in-page hash links here: the hash router would leave the page (SPEC R7).

/** An external domain link. Only the header's shows the visible ↗ (SPEC R7). */
function ExternalDomain({
  href,
  domain,
  className,
  mark,
}: {
  href: string;
  domain: string;
  className?: string;
  mark?: boolean;
}): JSX.Element {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {domain}
      {mark && (
        <span className="ext-mark" aria-hidden="true">
          ↗
        </span>
      )}
      <NewTab />
    </a>
  );
}

function ListSection({
  id,
  title,
  items,
  ordered,
  className,
}: {
  id: string;
  title: string;
  items: string[];
  ordered?: boolean;
  className: string;
}): JSX.Element {
  const List = ordered ? 'ol' : 'ul';
  return (
    <section className={className} aria-labelledby={id}>
      <div className="study-sec-head">
        <h2 className="study-h2" id={id}>
          {title}
        </h2>
      </div>
      <List className="study-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </section>
  );
}

/**
 * Where "Back to the site" goes when there is no history to go back through (a direct
 * load, a new tab): the project's row in Professional; in Personal, Side projects if the
 * project is one of them, else the top (the rows only exist in the Professional tree).
 */
function backHref(project: StudyProject, personalMode: boolean): string {
  if (!personalMode) return `#${projectAnchor(project)}`;
  return personal.brain.domains.some((d) => d.project?.id === project.id) ? '#brain' : '#top';
}

export default function CaseStudy({ project }: { project: StudyProject }): JSX.Element {
  const cs = project.caseStudy;
  const back = backHref(project, useMode() === 'personal');
  const domain = projectDomain(project);
  const live = domain && project.liveUrl ? { href: project.liveUrl, domain } : undefined;
  const desktop = project.media?.find((m) => m.device === 'desktop');
  const phone = project.media?.find((m) => m.device === 'phone');
  const at = studyProjects.findIndex((p) => p.id === project.id);
  const next = studyProjects.length > 1 ? studyProjects[(at + 1) % studyProjects.length] : undefined;
  const hasPair = Boolean(cs.decisions?.length || cs.guardrails?.length);

  return (
    <>
      <SkipLink />
      <header className="site-head study-head">
        <div className="wrap grid">
          <a className="brand" href={back} onClick={returnHome}>
            <span aria-hidden="true">←&nbsp;</span>
            {site.study.back}
          </a>
          <p className="study-kicker label">{site.study.label}</p>
          <nav className="nav" aria-label={site.study.headNav}>
            {live && <ExternalDomain className="study-head-domain" href={live.href} domain={live.domain} mark />}
            <a className="nav-cv" href="#resume">
              {site.nav.cv}
            </a>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="study">
        <div className="study-top wrap">
          {/* the page's focus target after a route change (App); no ring, it marks a place */}
          <h1 className="study-title" tabIndex={-1} data-focus-target="">
            {project.title}
          </h1>
          <p className="study-sub">{project.subtitle}</p>

          <dl className="study-meta grid">
            <div>
              <dt className="label">{site.study.meta.status}</dt>
              <dd>{project.statusNote ?? project.status}</dd>
            </div>
            <div>
              <dt className="label">{site.study.meta.years}</dt>
              <dd className="tnum">{project.year}</dd>
            </div>
            <div className={`study-meta-stack${live ? '' : ' is-wide'}`}>
              <dt className="label">{site.study.meta.stack}</dt>
              <dd>{project.tech.join(', ')}</dd>
            </div>
            {live && (
              <div>
                <dt className="label">{site.study.meta.live}</dt>
                <dd>
                  <ExternalDomain className="u" href={live.href} domain={live.domain} />
                </dd>
              </div>
            )}
          </dl>

          <p className="study-intro">{cs.intro}</p>
        </div>

        {cs.metrics?.length ? (
          <section className="study-glance wrap" aria-labelledby="study-glance-h">
            <h2 className="sr-only" id="study-glance-h">
              {site.study.sections.metrics}
            </h2>
            <dl className="study-metrics grid">
              {cs.metrics.map((m) => (
                <div key={m.label}>
                  <dt className="label">{m.label}</dt>
                  <dd className="study-metric tnum">{m.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {desktop && phone ? (
          <figure className="study-plate wrap" aria-labelledby="study-plate-cap">
            <figcaption className="study-plate-head" id="study-plate-cap">
              {live && <b>{live.domain}</b>}
              {desktop.caption}
            </figcaption>
            <div className="study-plate-grid">
              <div className="study-shot study-shot-desk">
                <img
                  src={desktop.src}
                  srcSet={desktop.variants?.map((v) => `${v.src} ${v.width}w`).join(', ')}
                  sizes="(max-width: 720px) 70vw, min(74vw, 1070px)"
                  alt={desktop.alt}
                  width={desktop.width}
                  height={desktop.height}
                  loading="lazy"
                  decoding="async"
                />
                <span className="label">{site.work.dims.desktop}</span>
              </div>
              <div className="study-shot study-shot-phone">
                <img
                  src={phone.src}
                  srcSet={phone.variants?.map((v) => `${v.src} ${v.width}w`).join(', ')}
                  sizes="(max-width: 720px) 22vw, min(24vw, 340px)"
                  alt={phone.alt}
                  width={phone.width}
                  height={phone.height}
                  loading="lazy"
                  decoding="async"
                />
                <span className="label">{site.work.dims.phone}</span>
              </div>
            </div>
          </figure>
        ) : null}

        {cs.architecture?.length ? (
          <section className="study-sec wrap" aria-labelledby="study-arch-h">
            <div className="study-sec-head">
              <h2 className="study-h2" id="study-arch-h">
                {site.study.sections.architecture}
              </h2>
              <p className="label tnum">{fill(site.study.counts.architecture, { n: cs.architecture.length })}</p>
            </div>
            <ul className="study-arch grid">
              {cs.architecture.map((node) => (
                <li key={node.title}>
                  <h3 className="study-arch-title">{node.title}</h3>
                  <p className="study-arch-detail">{node.detail}</p>
                  {node.tech?.length ? <p className="study-arch-tech label">{node.tech.join(', ')}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {cs.workflow?.length ? <StudyFlow steps={cs.workflow} /> : null}

        {hasPair ? (
          <div className="study-sec study-pair wrap grid">
            {cs.decisions?.length ? (
              <ListSection
                className="study-half"
                id="study-decisions-h"
                title={site.study.sections.decisions}
                items={cs.decisions}
                ordered
              />
            ) : null}
            {cs.guardrails?.length ? (
              <ListSection
                className="study-half"
                id="study-guardrails-h"
                title={site.study.sections.guardrails}
                items={cs.guardrails}
              />
            ) : null}
          </div>
        ) : null}

        {cs.challenges?.length ? (
          <ListSection
            className="study-sec study-wide wrap"
            id="study-challenges-h"
            title={site.study.sections.challenges}
            items={cs.challenges}
          />
        ) : null}

        {cs.outcomes?.length ? (
          <ListSection
            className="study-sec study-wide wrap"
            id="study-outcomes-h"
            title={site.study.sections.outcomes}
            items={cs.outcomes}
          />
        ) : null}

        {cs.privacyNote ? (
          <div className="study-private-wrap wrap">
            <dl className="study-private">
              <dt className="label">{site.study.sections.privacy}</dt>
              <dd>{cs.privacyNote}</dd>
            </dl>
          </div>
        ) : null}

        {/* DOM order = reading order at every width: back first, then the next case study */}
        <nav className="study-next wrap" aria-label={site.study.nextNav}>
          <div className="study-next-row grid">
            <a className="study-next-back" href={back} onClick={returnHome}>
              <span aria-hidden="true">←&nbsp;</span>
              {site.study.back}
            </a>
            {next ? (
              <a className="study-next-link" href={`#project/${next.id}`}>
                <span className="label">{site.study.next}</span>
                <span className="sr-only">: </span>
                <span className="study-next-title">
                  {next.title}
                  <span aria-hidden="true">&nbsp;→</span>
                </span>
              </a>
            ) : null}
          </div>
        </nav>
      </main>

      <footer className="study-foot wrap">
        <div className="study-foot-row grid">
          <p>
            © <span className="tnum">{updatedYear}</span> {profile.name}
          </p>
          <p>
            {site.colophon.updated} <time dateTime={UPDATED}>{UPDATED}</time>
          </p>
        </div>
      </footer>
    </>
  );
}
