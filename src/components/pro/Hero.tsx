import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { education, experience, languages } from '../../data/experience';
import { profile } from '../../data/profile';
import { site } from '../../data/site';
import { around } from '../../lib/around';
import { fill, ordinal, shortPoint } from '../../lib/format';
import { BUILD_DATE, careerAxis, monthsFrom } from '../../lib/timeline';
import ExternalLink from '../shell/ExternalLink';
import './hero.css';

const H = site.hero;
const A = H.axis;

/** Custom properties for the hero's time scale (hero.css). */
type Vars = CSSProperties & Record<`--${string}`, number>;

/** One ink rule is the ground the name stands on and the time axis: 2023 to 2027, or to the year after today. */
const axis = careerAxis([...experience.map((x) => x.start), education.start], education.expectedEnd, BUILD_DATE);

type Step = {
  key: string;
  label: string;
  when: ReactNode;
  detail: string;
  /** Months from 1 January of the first year to the start. */
  start: number;
  /** Study only: months to the expected end (the end of that year). The bar is dashed from today to there. */
  end?: number;
};

/** The roles, newest on top, rising to the right in steps; the degree last, under them. */
const steps: Step[] = [
  ...[...experience]
    .sort((a, b) => monthsFrom(b.start, axis.first) - monthsFrom(a.start, axis.first))
    .map((x) => ({
      key: x.org,
      label: x.short ?? x.org,
      when: around(A.since, 'point', <time dateTime={x.start}>{shortPoint(x.start)}</time>),
      detail: x.summary ?? x.role,
      start: monthsFrom(x.start, axis.first),
    })),
  {
    key: education.short,
    label: fill(A.study, { school: education.short, ordinal: ordinal(education.year) }),
    when: around(
      A.expected,
      'year',
      <time dateTime={String(education.expectedEnd)}>{education.expectedEnd}</time>,
    ),
    detail: fill(A.studyDetail, { field: education.field, school: education.school, start: education.start }),
    start: monthsFrom(education.start, axis.first),
    end: monthsFrom(education.expectedEnd + 1, axis.first),
  },
];

/**
 * The Professional hero (the owner's choice): the name stands on the career
 * time axis, the work rises above it in steps towards the lede and the CV, one vermilion
 * line marks today, and one strip under the axis carries the languages and the links.
 */
export default function Hero(): JSX.Element {
  return (
    <section className="hero wrap" aria-labelledby="name" style={{ '--today': axis.today, '--years': axis.years.length } as Vars}>
      <div className="hx grid">
        <div className="hx-title">
          <h1 className="hx-name" id="name">
            {profile.name}
          </h1>
          <p className="hx-role">{fill(H.role, { role: profile.role, city: profile.city })}</p>
        </div>

        <div className="hx-intro">
          <p className="hx-lede">{profile.lede}</p>
          <p className="hx-cv">
            <a className="hx-cv-view" href="#resume">
              {H.viewCv}
              <span aria-hidden="true">&nbsp;→</span>
            </a>
            <a className="u" href={site.cv.pdf} download>
              {site.cv.download}
            </a>
          </p>
        </div>

        <figure className="hx-steps" aria-labelledby="hx-steps-cap">
          <figcaption className="sr-only" id="hx-steps-cap">
            {fill(A.caption, { year: axis.first })}
          </figcaption>
          <ol>
            {steps.map((s) => (
              <li
                key={s.key}
                className={s.end === undefined ? 'hx-step' : 'hx-step hx-study'}
                style={{ '--s': s.start, ...(s.end !== undefined && { '--e': s.end }) } as Vars}
              >
                <p className="hx-lab">
                  <span>
                    <span className="hx-org">{s.label}</span> <span className="hx-yrs">{s.when}</span>
                  </span>
                  <span className="sr-only">{fill(A.detail, { detail: s.detail })}</span>
                </p>
                <i className="hx-bar" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </figure>

        <div className="hx-axis" aria-hidden="true">
          {axis.years.map((y) => (
            <span key={y} className="hx-tk" style={{ '--y': (y - axis.first) * 12 } as Vars}>
              <b>{y}</b>
            </span>
          ))}
        </div>

        <i className="hx-today" aria-hidden="true" />

        <dl className="hx-strip">
          <div className="hx-lang">
            <dt className="sr-only">{H.strip.languages}</dt>
            <dd>
              {languages.map((l, i) => (
                <Fragment key={l.name}>
                  {i > 0 && ' '}
                  <span className="nw">
                    {fill(H.strip.language, { name: l.name, level: l.levelShort ?? l.level }) +
                      (i < languages.length - 1 ? ',' : '')}
                  </span>
                </Fragment>
              ))}
            </dd>
          </div>
          <div className="hx-mail">
            <dt className="sr-only">{H.strip.contact}</dt>
            <dd>
              <a className="u" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <span className="hx-pair">
                <ExternalLink className="u" href={profile.github} mark>
                  {site.contact.github}
                </ExternalLink>
                <ExternalLink className="u" href={profile.linkedin} mark>
                  {site.contact.linkedin}
                </ExternalLink>
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
