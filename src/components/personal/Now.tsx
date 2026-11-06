import { personal } from '../../data/personal';

/** What I am doing now: run-in lead words, then the tools I work with every day, by group. */
export default function Now(): JSX.Element {
  return (
    <section className="wrap p-sec" id="now" aria-labelledby="now-h">
      <div className="grid p-row">
        <div className="p-label">
          <h2 id="now-h">{personal.nowHeading}</h2>
        </div>
        <ul className="p-now">
          {personal.now.map((item) => (
            <li key={item.lead}>
              <b>{item.lead}</b> {item.text}
            </li>
          ))}
        </ul>
        <div className="p-tools">
          <h3 className="p-tools-h">{personal.toolsLead}</h3>
          <dl className="p-tools-grid">
            {personal.tools.map((group) => (
              <div key={group.label}>
                <dt>{group.label}</dt>
                {group.items.map((item) => (
                  <dd key={item}>{item}</dd>
                ))}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
