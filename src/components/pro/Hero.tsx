import { education, experience, languages } from '../../data/experience';
import { profile } from '../../data/profile';
import { site } from '../../data/site';
import { fill, monthYear, ordinal } from '../../lib/format';
import './hero.css';

const R = site.hero.record;
const current = experience[0];

/** The record card (DECISIONS 6): who, where, and how to read or reach me, one fact per row. */
const record: Array<{ term: string; value: JSX.Element | string }> = [
  {
    term: R.now,
    value: fill(site.hero.nowValue, { role: current.role, org: current.org, month: monthYear(current.start) }),
  },
  {
    term: R.studying,
    value: fill(site.hero.studyingValue, {
      field: education.field,
      school: education.short,
      ordinal: ordinal(education.year),
      start: education.start,
      end: education.expectedEnd,
    }),
  },
  { term: R.based, value: profile.location },
  { term: R.languages, value: languages.map((l) => `${l.name} (${l.level})`).join(', ') },
  {
    term: R.cv,
    value: (
      <span className="record-acts">
        <a className="u" href="#resume">
          {site.hero.viewCv}
        </a>
        <a className="u" href={site.cv.pdf} download>
          {site.cv.download}
        </a>
      </span>
    ),
  },
  {
    term: R.email,
    value: (
      <a className="u" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
    ),
  },
  {
    term: R.code,
    value: (
      <a className="u" href={profile.github} target="_blank" rel="noreferrer">
        {profile.github.replace(/^https?:\/\//, '')}
        <span className="sr-only"> {site.newTab}</span>
      </a>
    ),
  },
];

/**
 * Keeps hyphenated compounds ("4th-year") on one line: a line that ends in "4th-"
 * reads badly. The text is unchanged; only the break opportunity at the hyphen goes.
 */
function keepCompounds(text: string): Array<string | JSX.Element> {
  return text.split(/(\S*\w-\w\S*)/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="lead-nb">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function Hero(): JSX.Element {
  return (
    <section className="hero wrap" aria-labelledby="name">
      <h1 className="name" id="name">
        {profile.name}
      </h1>

      <div className="hero-body grid">
        <p className="lead">{keepCompounds(profile.lede)}</p>
        <dl className="record">
          {record.map((r) => (
            <div key={r.term}>
              <dt>{r.term}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
