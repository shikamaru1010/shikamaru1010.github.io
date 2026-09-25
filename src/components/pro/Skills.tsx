import { Fragment } from 'react';
import { projectAnchor, projectById } from '../../data/projects';
import { alsoUsed, skillGroups, type Evidence } from '../../data/skills';
import { site } from '../../data/site';
import { fill, listJoin } from '../../lib/format';
import './skills.css';

const S = site.skills;

/** One piece of evidence: a link to the project's row (plus the part of it), a FON course, or plain text. */
function EvidenceItem({ e }: { e: Evidence }): JSX.Element | null {
  if ('project' in e) {
    const p = projectById(e.project);
    if (!p) return null; // data.test.ts guarantees every id resolves
    return (
      <span className="skills-ev">
        <a className="u" href={`#${projectAnchor(p)}`}>
          {p.title}
        </a>
        {e.part ? ` (${e.part})` : null}
      </span>
    );
  }
  if ('course' in e) return <>{fill(S.course, { course: e.course })}</>;
  return <>{e.text}</>;
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
          <p className="sec-note">{S.note}</p>
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
          {skillGroups.map((g) => (
            <tbody key={g.label} className="skills-group" role="rowgroup">
              {g.skills.map((s, i) => (
                <tr key={s.name} role="row">
                  {i === 0 ? (
                    <th scope="rowgroup" rowSpan={g.skills.length} className="skills-area" role="rowheader">
                      {g.label}
                    </th>
                  ) : null}
                  <th scope="row" className="skills-name" role="rowheader">
                    {s.name}
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
