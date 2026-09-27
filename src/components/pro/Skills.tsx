import { alsoUsed, siteSkillGroups } from '../../data/skills';
import { site } from '../../data/site';
import { capitalize, fill, listJoin } from '../../lib/format';
import './skills.css';

const S = site.skills;

/** Skills by area: each group a label over a short list, the groups on the page grid. */
export default function Skills(): JSX.Element {
  return (
    <section className="sec" id="skills" aria-labelledby="skills-h">
      <div className="wrap">
        <header className="sec-head grid">
          <h2 className="h2" id="skills-h">
            {S.heading}
          </h2>
        </header>

        <div className="sk-groups grid">
          {siteSkillGroups.map((g) => (
            <div key={g.label} className="sk-group">
              <h3 className="sk-label">{g.label}</h3>
              <ul className="sk-items">
                {g.skills.map((s) => (
                  <li key={s.name}>{capitalize(s.name)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="sk-also">{fill(S.also, { list: listJoin(alsoUsed) })}</p>
      </div>
    </section>
  );
}
