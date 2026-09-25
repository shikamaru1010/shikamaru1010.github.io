import { Fragment } from 'react';
import { projectById } from '../../data/projects';
import { alsoUsed, siteSkillGroups, type Evidence } from '../../data/skills';
import { site } from '../../data/site';
import { capitalize, fill, listJoin } from '../../lib/format';
import './skills.css';

const S = site.skills;

/**
 * One piece of evidence, as plain text: a project (plus the part of it) or a FON course.
 * Not links: the projects are all in Work, just above, so a link would only point back up the page.
 */
function EvidenceItem({ e }: { e: Evidence }): JSX.Element | null {
  if ('project' in e) {
    const p = projectById(e.project);
    if (!p) return null; // data.test.ts guarantees every id resolves
    return (
      <span className="skills-ev">
        {p.title}
        {e.part ? <span className="skills-part"> ({e.part})</span> : null}
      </span>
    );
  }
  if ('course' in e) {
    return (
      <span className="skills-ev">
        {e.course} <span className="skills-part">{S.course}</span>
      </span>
    );
  }
  return <span className="skills-ev">{e.text}</span>;
}

/**
 * Skills as a table on the grid (DECISIONS 1): area | skill | where I used it.
 * The ARIA roles repeat the native ones on purpose: on phones the cells are
 * display: block, and some browsers drop table semantics when that happens.
 */
export default function Skills(): JSX.Element {
  return (
    <section className="sec" id="skills" aria-labelledby="skills-h">
      <div className="wrap">
        <header className="sec-head grid">
          <h2 className="h2" id="skills-h">
            {S.heading}
          </h2>
        </header>

        <table className="skills-table" role="table">
          <caption className="sr-only">{S.caption}</caption>
          <colgroup>
            <col className="skills-col-area" />
            <col className="skills-col-skill" />
            <col />
          </colgroup>
          <thead className="skills-head" role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader">
                {S.columns.area}
              </th>
              <th scope="col" role="columnheader">
                {S.columns.skill}
              </th>
              <th scope="col" role="columnheader">
                {S.columns.used}
              </th>
            </tr>
          </thead>
          {siteSkillGroups.map((g) => (
            <tbody key={g.label} className="skills-group" role="rowgroup">
              {g.skills.map((s, i) => (
                <tr key={s.name} role="row">
                  {i === 0 ? (
                    <th scope="rowgroup" rowSpan={g.skills.length} className="skills-area" role="rowheader">
                      {g.label}
                    </th>
                  ) : null}
                  <th scope="row" className="skills-name" role="rowheader">
                    {capitalize(s.name)}
                  </th>
                  <td className="skills-used" role="cell">
                    {s.evidence.map((e, j) => (
                      <Fragment key={j}>
                        {j > 0 ? ', ' : null}
                        <EvidenceItem e={e} />
                      </Fragment>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>

        <p className="skills-also">{fill(S.also, { list: listJoin(alsoUsed) })}</p>
      </div>
    </section>
  );
}
