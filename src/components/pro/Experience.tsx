import { education, experience, type Experience as Role } from '../../data/experience';
import { site } from '../../data/site';
import { keepCompounds } from '../../lib/compounds';
import { fill, formatPeriod, ordinal } from '../../lib/format';
import './experience.css';

const X = site.experience;

/** A period as two <time> elements: "Jul 2026–now", "2023–2027". */
function Period({ start, end }: { start: string | number; end?: string | number }): JSX.Element {
  const [from, to] = formatPeriod(start, end).split('–');
  return (
    <p className="when">
      <time dateTime={String(start)}>{from}</time>–{end === undefined ? to : <time dateTime={String(end)}>{to}</time>}
    </p>
  );
}

function RoleRow({ x }: { x: Role }): JSX.Element {
  return (
    <li className="xp-row grid">
      <Period start={x.start} end={x.end} />
      <div className="who">
        <h3>{x.role}</h3>
        <p>{x.location ? `${x.org} · ${x.location}` : x.org}</p>
      </div>
      <div className="what">
        {x.points.map((point) => (
          <p key={point}>{point}</p>
        ))}
      </div>
    </li>
  );
}

export default function Experience(): JSX.Element {
  const courses = education.courses.filter((c) => c.featured);
  return (
    <section className="sec" id="experience" aria-labelledby="exp-h">
      <div className="wrap">
        <header className="sec-head grid">
          <h2 className="h2" id="exp-h">
            {X.heading}
          </h2>
        </header>

        <ol>
          {experience.map((x) => (
            <RoleRow key={`${x.org}-${x.start}`} x={x} />
          ))}
        </ol>

        <div className="xp-row edu grid">
          <Period start={education.start} end={education.expectedEnd} />
          <div className="who">
            <h3>{education.degree}</h3>
            <p>
              {fill(X.eduMeta, { short: education.short, university: education.university, ordinal: ordinal(education.year) })}
            </p>
          </div>
          <div className="what">
            <p>{education.detail}</p>
            <h4 className="label">{X.coursework}</h4>
            <ul className="xp-courses">
              {courses.map((c) => (
                <li key={c.name}>
                  <span className="xp-course">{c.name}</span>
                  {/* a no-break space before the dot: it stays with the course name */}
                  {c.detail ? <span className="xp-detail">{'\u00a0· '}{keepCompounds(c.detail)}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
