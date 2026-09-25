import type { ReactNode } from 'react';
import { personal } from '../../data/personal';
import { listJoin, monthYear } from '../../lib/format';

/** Puts `node` where `{key}` sits in `template` (so a date can be a real <time>). */
function around(template: string, key: string, node: ReactNode): ReactNode {
  const [before, after = ''] = template.split(`{${key}}`);
  return (
    <>
      {before}
      {node}
      {after}
    </>
  );
}

/** What I am doing now: run-in lead words, then the tools I live in. */
export default function Now(): JSX.Element {
  const updated = personal.nowUpdatedAt;
  return (
    <section className="wrap p-sec" id="now" aria-labelledby="now-h">
      <div className="grid p-row">
        <div className="p-label">
          <h2 id="now-h">{personal.nowHeading}</h2>
          <p className="label">
            {around(personal.nowUpdated, 'month', <time dateTime={updated.slice(0, 7)}>{monthYear(updated)}</time>)}
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
