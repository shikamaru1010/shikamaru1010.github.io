import { systemProjects, type Project, type SystemFigure } from '../../data/projects';
import { site } from '../../data/site';
import { stackLine } from '../../lib/format';
import Pipeline from './figures/Pipeline';
import SignalLine from './figures/SignalLine';
import StatusAxis from './figures/StatusAxis';
import './systems.css';

/** Each system gets a figure drawn on the page grid, chosen by `figure.kind`. */
function SystemFigureView({ figure }: { figure: SystemFigure }): JSX.Element {
  switch (figure.kind) {
    case 'pipeline':
      return <Pipeline figure={figure} />;
    case 'status-axis':
      return <StatusAxis figure={figure} />;
    case 'signal':
      return <SignalLine figure={figure} />;
  }
}

function System({ p }: { p: Project }): JSX.Element {
  return (
    <article className="sys" id={`system-${p.id}`}>
      <div className="sys-row grid">
        <div className="sys-title">
          <h4>{p.title}</h4>
          <p className="label tnum">{`${p.year} · ${p.statusNote ?? p.status}`}</p>
        </div>
        <p className="sys-body">{p.blurb}</p>
        {/* the link comes last, as in a client row: after what the project is */}
        <div className="sys-stack">
          <p className="label">{stackLine(p.tech)}</p>
          {p.notes && p.notes.length > 0 && (
            <ul className="notes">
              {p.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
          {p.caseStudy && (
            <p className="sys-acts">
              <a className="case-link" href={`#project/${p.id}`}>
                {site.work.caseStudy}
                <span className="sr-only">: {p.title}</span>
                <span aria-hidden="true">{' →'}</span>
              </a>
            </p>
          )}
        </div>
      </div>
      {p.figure && <SystemFigureView figure={p.figure} />}
    </article>
  );
}

/** Systems of my own: title, blurb, stack with engineering notes, then the figure. */
export default function Systems(): JSX.Element {
  return (
    <div className="systems">
      <div className="sub-head">
        <h3>{site.work.systems}</h3>
      </div>
      {systemProjects.map((p) => (
        <System key={p.id} p={p} />
      ))}
    </div>
  );
}
