import type { MouseEvent } from 'react';
import { clientProjects, projectDomain, type Project } from '../../data/projects';
import { site } from '../../data/site';
import { stackLine } from '../../lib/format';
import { mediaOf, srcSet } from '../../lib/media';
import { isPlainClick } from '../../lib/mode';
import ExternalLink from '../shell/ExternalLink';
import './clients.css';

/** How many technologies a client row shows (the rest are on the case study and the CV). */
const STACK_SHOWN = 4;

/**
 * A click on the screenshots follows the row's primary link: the case study where there is one,
 * otherwise the live site. Mouse convenience only; both are real links in the row's text.
 */
function followPrimary(e: MouseEvent<HTMLElement>): void {
  if (!isPlainClick(e)) return;
  e.currentTarget.closest('.client')?.querySelector<HTMLAnchorElement>('a[data-primary]')?.click();
}

/**
 * One client (DECISIONS E): the text on columns 1–4, and its own desktop and phone screenshots,
 * at one height, on columns 5–12, visible at rest. ≤900 the screenshots come first; on phones
 * only the desktop one, at the full width.
 */
function Client({ p }: { p: Project }): JSX.Element {
  const desk = mediaOf(p, 'desktop');
  const phone = mediaOf(p, 'phone');
  const domain = projectDomain(p);
  const study = Boolean(p.caseStudy);
  return (
    <article className="client grid" id={`client-${p.id}`} aria-labelledby={`client-${p.id}-h`}>
      <div className="cl-text">
        <div className="cl-head">
          <h4 className="cl-name" id={`client-${p.id}-h`}>
            {p.title}
          </h4>
          <p className="cl-year tnum">{p.year}</p>
        </div>
        <p className="cl-what">{p.subtitle}</p>
        <p className="cl-stack">{stackLine(p.tech.slice(0, STACK_SHOWN))}</p>
        {p.notes?.length ? (
          <ul className="notes">
            {p.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}
        <p className="cl-acts">
          {p.liveUrl && domain && (
            <ExternalLink className="u" href={p.liveUrl} mark data-primary={study ? undefined : ''}>
              {domain}
            </ExternalLink>
          )}
          {study && (
            <a className="case-link" href={`#project/${p.id}`} data-primary="">
              {site.work.caseStudy}
              <span aria-hidden="true">{' →'}</span>
            </a>
          )}
        </p>
      </div>
      {desk && (
        <div className="cl-shots" onClick={followPrimary}>
          <img
            className="cl-desk"
            src={desk.src}
            srcSet={srcSet(desk)}
            sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 900px) calc(74vw - 41px), (max-width: 1100px) 41vw, min(46vw, 702px)"
            alt={desk.alt}
            width={desk.width}
            height={desk.height}
            loading="lazy"
            decoding="async"
          />
          {phone && (
            <img
              className="cl-phone"
              src={phone.src}
              srcSet={srcSet(phone)}
              sizes="(max-width: 900px) 21vw, (max-width: 1100px) 12vw, min(14vw, 205px)"
              alt={phone.alt}
              width={phone.width}
              height={phone.height}
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
      )}
    </article>
  );
}

/** Client sites, live: one row each, Mesara first. */
export default function Clients(): JSX.Element {
  return (
    <div className="clients">
      <div className="sub-head">
        <h3>{site.work.clients}</h3>
      </div>
      {clientProjects.map((p) => (
        <Client key={p.id} p={p} />
      ))}
    </div>
  );
}
