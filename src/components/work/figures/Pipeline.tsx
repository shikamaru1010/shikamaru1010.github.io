import type { SystemFigure } from '../../../data/projects';
import { site } from '../../../data/site';
import { keepCompounds } from '../../../lib/compounds';
import './figures.css';

type PipelineFigure = Extract<SystemFigure, { kind: 'pipeline' }>;

/**
 * tradingAgent's day as stops on the page grid, two columns each (SPEC §6.1.2, DECISIONS 10).
 * Shape code: a square is the system, a circle is a person stepping in, so the gate differs by
 * shape, not by colour alone.
 */
export default function Pipeline({ figure }: { figure: PipelineFigure }): JSX.Element {
  return (
    <figure className="fig">
      <figcaption className="fig-cap label">
        <span>{figure.caption}</span>
        <span className="legend">
          <i className="sq" aria-hidden="true" />
          {site.work.legend.system} <i className="ci" aria-hidden="true" />
          {site.work.legend.person}
        </span>
      </figcaption>
      <ol className="pipe grid">
        {figure.steps.map((s) => (
          <li key={s.label} data-actor={s.actor}>
            <b className="stop">{s.label}</b>
            {/* the circle says it visually; a screen reader hears the legend's word for it */}
            {s.actor === 'person' && <span className="sr-only"> ({site.work.legend.person})</span>}
            <span className="note label">{keepCompounds(s.note)}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
