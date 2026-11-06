import { systemProjects } from '../../data/projects';
import { site } from '../../data/site';
import { stackLine } from '../../lib/format';
import './systems.css';

/** How many technologies a system shows, as in the client index (the rest are on the CV). */
const STACK_SHOWN = 4;

/**
 * Systems of my own, one compact entry each on the columns of the list below them:
 * name and status | one sentence | stack and the case study, where there is one | years.
 */
export default function Systems(): JSX.Element {
  return (
    <div className="systems">
      <div className="sub-head">
        <h3>{site.work.systems}</h3>
      </div>
      <ul className="sys-list">
        {systemProjects.map((p) => (
          <li key={p.id} className="sys grid" id={`system-${p.id}`}>
            <div className="sys-name">
              <h4>{p.title}</h4>
              <p className="label">{p.statusNote ?? p.status}</p>
            </div>
            <p className="sys-what">{p.summary}</p>
            <div className="sys-stack">
              <p>{stackLine(p.tech.slice(0, STACK_SHOWN))}</p>
              {p.caseStudy && (
                <a className="case-link" href={`#project/${p.id}`}>
                  {site.work.caseStudy}
                  <span className="sr-only">: {p.title}</span>
                  <span aria-hidden="true">{'\u00a0→'}</span>
                </a>
              )}
            </div>
            <p className="sys-year tnum">{p.year}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
