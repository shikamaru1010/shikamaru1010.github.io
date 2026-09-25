import { personal } from '../../data/personal';
import { around } from '../../lib/around';
import { listJoin } from '../../lib/format';

/** What I am doing now: run-in lead words, then the tools I live in. */
export default function Now(): JSX.Element {
  const updated = personal.nowUpdatedAt;
  return (
    <section className="wrap p-sec" id="now" aria-labelledby="now-h">
      <div className="grid p-row">
        <div className="p-label">
          <h2 id="now-h">{personal.nowHeading}</h2>
          <p className="label">
            {around(personal.nowUpdated, 'date', <time dateTime={updated}>{updated}</time>)}
          </p>
        </div>
        <ul className="p-now">
          {personal.now.map((item) => (
            <li key={item.lead}>
              <b>{item.lead}</b> {item.text}
            </li>
          ))}
        </ul>
        <p className="p-tools">
          {personal.toolsLead} <b>{listJoin(personal.tools)}</b>.
        </p>
      </div>
    </section>
  );
}
