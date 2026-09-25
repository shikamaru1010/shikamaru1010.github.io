import { education, experience, type Experience as Role } from '../../data/experience';
import { site } from '../../data/site';
import { fill, formatPeriod, monthYear, ordinal } from '../../lib/format';
import './experience.css';

const X = site.experience;

/** "Intern at Podyx since July 2026, freelance since 2023, B.Sc. expected in 2027." */
function sectionNote(): string {
  // \b…\b: "Internal Tools Developer" must not count as an internship.
  const intern = experience.find((x) => /\bintern\b/i.test(x.role)) ?? experience[0];
  const freelance = experience.find((x) => /freelance/i.test(x.org)) ?? experience[1];
  return fill(X.note, {
    org: intern.org,
    month: monthYear(intern.start),
    freelance: String(freelance.start).slice(0, 4),
    graduation: education.expectedEnd,
  });
}

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
          <p className="sec-note">{sectionNote()}</p>
        </header>

        <ol className="xp-list">
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
                  {c.detail ? <span className="xp-detail"> · {c.detail}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
