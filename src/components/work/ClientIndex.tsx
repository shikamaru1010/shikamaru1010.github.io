import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { clientProjects, projectDomain, type Project } from '../../data/projects';
import { site } from '../../data/site';
import { stackLine } from '../../lib/format';
import { mediaOf, srcSet } from '../../lib/media';
import { isPlainClick } from '../../lib/mode';
import { parseRoute } from '../../lib/route';
import ExternalLink from '../shell/ExternalLink';
import './client-index.css';

/** How many technologies the index shows per client (the rest are on the case study and the CV). */
const STACK_SHOWN = 4;
const ROW_PREFIX = 'client-';

/**
 * The client a hash points at: its row's anchor (`#client-<id>`), also where App's router
 * rewrites `#project/<id>` of a client without a case study. Parsed by the router itself,
 * so a malformed escape never throws.
 */
function clientFromHash(hash: string): string | undefined {
  const route = parseRoute(hash);
  const anchor = route.kind === 'home' ? route.anchor : undefined;
  const id = anchor?.startsWith(ROW_PREFIX) ? anchor.slice(ROW_PREFIX.length) : undefined;
  return clientProjects.some((p) => p.id === id) ? id : undefined;
}

/**
 * A row click outside a link follows the row's primary link: the case study where there is one,
 * otherwise the live site. Mouse convenience only; every target is also a real link in the row.
 */
function followPrimary(e: MouseEvent<HTMLTableRowElement>): void {
  if (!isPlainClick(e)) return;
  if ((e.target as Element).closest('a')) return;
  const sel = window.getSelection();
  if (sel && !sel.isCollapsed && sel.toString().trim()) return; // selecting text, not clicking
  e.currentTarget.querySelector<HTMLAnchorElement>('a[data-primary]')?.click();
}

/**
 * One client: the row header is the name alone (a screen reader repeats it for every cell),
 * then what it is and its links, the stack with its notes, the year and, where there is no
 * plate (≤1100px), the phone capture. The cells are laid out on a grid (client-index.css),
 * so the explicit roles keep the table semantics in every browser.
 */
function Row({ p, active }: { p: Project; active: boolean }): JSX.Element {
  const study = Boolean(p.caseStudy);
  const href = `#project/${p.id}`;
  const domain = projectDomain(p);
  const phone = mediaOf(p, 'phone');
  return (
    <tr className={active ? 'row is-active' : 'row'} role="row" onClick={followPrimary}>
      <th scope="row" className="c-name" role="rowheader">
        <span className="mark" aria-hidden="true" />
        {study ? (
          <a className="nm" href={href} data-primary="">
            {p.title}
          </a>
        ) : (
          <span className="nm">{p.title}</span>
        )}
      </th>
      <td className="c-meta" role="cell">
        <span className="what">{p.subtitle}</span>
        <span className="acts">
          {p.liveUrl && domain && (
            <ExternalLink className="u" href={p.liveUrl} mark data-primary={study ? undefined : ''}>
              {domain}
            </ExternalLink>
          )}
          {study && (
            <a className="case-link" href={href}>
              {site.work.caseStudy}
              <span className="sr-only">: {p.title}</span>
              <span aria-hidden="true">{'\u00a0→'}</span>
            </a>
          )}
        </span>
      </td>
      <td className="c-stack" role="cell">
        <p className="stk">{stackLine(p.tech.slice(0, STACK_SHOWN))}</p>
        {p.notes?.length ? (
          <ul className="notes">
            {p.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}
      </td>
      <td className="c-year tnum" role="cell">
        {p.year}
      </td>
      <td className="shot-m" role="cell">
        {phone && (
          <img
            src={phone.src}
            srcSet={srcSet(phone)}
            sizes="(max-width: 720px) 40vw, 200px"
            alt={phone.alt}
            width={phone.width}
            height={phone.height}
            loading="lazy"
            decoding="async"
          />
        )}
      </td>
    </tr>
  );
}

/**
 * Client sites, live: a semantic table (one <tbody> per client, so each row is an anchor) and, on
 * desktop, a sticky plate that shows the selected site on a desktop and a phone at equal heights,
 * with all four sites as a contact strip under them. Hover, focus or a click on a thumbnail selects.
 */
export default function ClientIndex(): JSX.Element {
  const [active, setActive] = useState<string>(clientProjects[0]?.id ?? '');
  const warmed = useRef(false);

  // Landing on (or jumping to) a client's row selects it, so the plate shows what the link pointed at.
  useEffect(() => {
    const sync = () => {
      const id = clientFromHash(location.hash);
      if (id) setActive(id);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  // The desktop captures are already on screen in the strip; fetch the phones before the first swap.
  const warmPhones = useCallback(() => {
    if (warmed.current) return;
    warmed.current = true;
    for (const p of clientProjects) {
      const m = mediaOf(p, 'phone');
      if (m) new Image().src = m.src;
    }
  }, []);

  const current = clientProjects.find((p) => p.id === active) ?? clientProjects[0];
  const desk = current && mediaOf(current, 'desktop');
  const phone = current && mediaOf(current, 'phone');
  const C = site.work.columns;

  return (
    <>
      <div className="sub-head">
        <h3>{site.work.clients}</h3>
      </div>
      <div className="index-wrap grid" onPointerEnter={warmPhones}>
        <table className="index" role="table">
          <caption className="sr-only">{site.work.tableCaption}</caption>
          <thead className="index-head" role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader" className="h-name">
                {C.client}
              </th>
              <th scope="col" role="columnheader" className="h-meta">
                {C.about}
              </th>
              <th scope="col" role="columnheader" className="h-stack">
                {C.stack}
              </th>
              <th scope="col" role="columnheader" className="h-year">
                {C.year}
              </th>
              <th scope="col" role="columnheader" className="h-shot">
                {C.shot}
              </th>
            </tr>
          </thead>
          {clientProjects.map((p) => (
            <tbody
              key={p.id}
              className="client"
              id={`${ROW_PREFIX}${p.id}`}
              role="rowgroup"
              onPointerEnter={() => setActive(p.id)}
              onFocus={() => {
                warmPhones();
                setActive(p.id);
              }}
            >
              <Row p={p} active={p.id === active} />
            </tbody>
          ))}
        </table>

        {current && (
          <figure className="plate" aria-label={site.work.plateLabel}>
            <figcaption className="plate-head">
              <b>{projectDomain(current)}</b>
            </figcaption>
            <div className="plate-grid">
              <div className="shot desk">
                {desk && (
                  <img
                    src={desk.src}
                    srcSet={srcSet(desk)}
                    sizes="(max-width: 1279px) 30vw, min(28vw, 420px)"
                    alt={desk.alt}
                    width={desk.width}
                    height={desk.height}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <div className="shot phone">
                {phone && (
                  <img
                    src={phone.src}
                    srcSet={srcSet(phone)}
                    sizes="(max-width: 1279px) 9vw, min(8vw, 130px)"
                    alt={phone.alt}
                    width={phone.width}
                    height={phone.height}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <div className="sheet" aria-hidden="true">
                {clientProjects.map((p) => {
                  const d = mediaOf(p, 'desktop');
                  return (
                    <span
                      key={p.id}
                      className={p.id === active ? 'thumb is-active' : 'thumb'}
                      onPointerEnter={() => setActive(p.id)}
                      onClick={() => setActive(p.id)}
                    >
                      {d && <img src={d.thumb ?? d.src} alt="" width={320} height={200} loading="lazy" decoding="async" />}
                    </span>
                  );
                })}
              </div>
            </div>
          </figure>
        )}
      </div>
    </>
  );
}
