import { smallerProjects } from '../../data/projects';
import { site } from '../../data/site';
import { yearRange } from '../../lib/format';

/** How many technologies each smaller project shows. */
const STACK_SHOWN = 3;

/** The stack as comma-separated text; a version number never wraps away from its name ('Tailwind 4'). */
function stackLine(tech: readonly string[]): string {
  return tech.map((t) => t.replace(/ (?=\d)/g, '\u00a0')).join(', ');
}

/** Smaller projects (SPEC §6.1.2): one line each on the grid. Styles live in work.css. */
export default function SmallerProjects(): JSX.Element {
  return (
    <div className="also">
      <div className="sub-head">
        <h3>{site.work.smaller}</h3>
        <span className="label tnum">{yearRange(smallerProjects)}</span>
      </div>
      <ul className="also-list">
        {smallerProjects.map((p) => (
          <li key={p.id} className="grid" id={`also-${p.id}`}>
            <span className="a-name">{p.title}</span>
            <span className="a-what">{p.subtitle}</span>
            <span className="a-stack">{stackLine(p.tech.slice(0, STACK_SHOWN))}</span>
            <span className="a-year tnum">{p.year}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
