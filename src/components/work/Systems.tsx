import { systemProjects, type Project, type SystemFigure } from '../../data/projects';
import { site } from '../../data/site';
import { yearRange } from '../../lib/format';
import Pipeline from './figures/Pipeline';
import SignalLine from './figures/SignalLine';
import StatusAxis from './figures/StatusAxis';
import './systems.css';

/** The stack as comma-separated text; a version number never wraps away from its name ('Tailwind 4'). */
function stackLine(tech: readonly string[]): string {
  return tech.map((t) => t.replace(/ (?=\d)/g, '\u00a0')).join(', ');
}

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
          {p.caseStudy && (
            <a className="case-link" href={`#project/${p.id}`}>
              {site.work.readCaseStudy}
              <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
        <p className="sys-body">{p.blurb}</p>
        <div className="sys-stack">
          <p>{stackLine(p.tech)}</p>
          {p.notes && p.notes.length > 0 && (
            <ul className="notes">
              {p.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {p.figure && <SystemFigureView figure={p.figure} />}
    </article>
  );
}

/** Systems of my own (SPEC §6.1.2): title, blurb, stack with engineering notes, then the figure. */
export default function Systems(): JSX.Element {
  return (
    <div className="systems">
      <div className="sub-head">
        <h3>{site.work.systems}</h3>
        <span className="label tnum">{yearRange(systemProjects)}</span>
      </div>
      {systemProjects.map((p) => (
        <System key={p.id} p={p} />
      ))}
    </div>
  );
}
