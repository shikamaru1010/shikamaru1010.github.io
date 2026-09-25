import type { ReactNode } from 'react';
import { personal } from '../../data/personal';
import worklog from '../../data/worklog.json';
import { fill, formatDate } from '../../lib/format';
import Brain from './Brain';
import DuotoneFilter from './DuotoneFilter';
import Elsewhere from './Elsewhere';
import Now from './Now';
import OffScreen from './OffScreen';
import PersonalHero from './PersonalHero';
import Thought from './Thought';
import WorkLogFigure, { keepTogether, plural, summarizeWorklog, type WorklogData } from './WorkLogFigure';
import './personal.css';

// Pure data, computed once (no DOM).
const log = summarizeWorklog(worklog as WorklogData);

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

/** The work log: the habit in one sentence, then drawn on the grid (replaces the giant 99). */
function WorkLog(): JSX.Element {
  const copy = personal.log;
  return (
    <section className="wrap p-sec" id="log" aria-labelledby="log-h">
      <div className="grid p-row">
        <div className="p-label">
          <h2 id="log-h">{copy.heading}</h2>
          <p className="label">
            {around(copy.asOf, 'date', <time dateTime={log.asOf}>{keepTogether(formatDate(log.asOf))}</time>)}
          </p>
        </div>
        <div className="p-log-text">
          {log.first && (
            <p className="p-log-t">
              {plural(
                fill(copy.headline, {
                  total: log.total,
                  days: log.dayCount,
                  first: keepTogether(formatDate(log.first)),
                }),
              )}
            </p>
          )}
          <p className="p-log-note">{copy.note}</p>
        </div>
      </div>
      <WorkLogFigure summary={log} />
    </section>
  );
}

/** Personal mode: first name, photo, the log, now, a thought, side projects and where else to find me. */
export default function PersonalHome(): JSX.Element {
  return (
    <>
      <DuotoneFilter />
      <PersonalHero />
      <WorkLog />
      <Now />
      <Thought />
      <Brain />
      <OffScreen />
      <Elsewhere />
    </>
  );
}
