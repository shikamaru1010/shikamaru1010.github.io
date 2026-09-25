import type { SystemFigure } from '../../../data/projects';
import { keepCompounds } from '../../../lib/compounds';
import './figures.css';

type SignalFigure = Extract<SystemFigure, { kind: 'signal' }>;

/**
 * BelgradeBuddy's offline-first design as one line across the grid: solid ink while there is a
 * signal (columns 1–6), dashed accent when there is none (7–12).
 */
export default function SignalLine({ figure }: { figure: SignalFigure }): JSX.Element {
  return (
    <figure className="fig">
      <figcaption className="fig-cap label">
        <span>{figure.caption}</span>
      </figcaption>
      <dl className="signal grid">
        <div className="sg sg-on">
          <dt>{figure.online.label}</dt>
          <dd>{keepCompounds(figure.online.note)}</dd>
        </div>
        <div className="sg sg-off">
          <dt>{figure.offline.label}</dt>
          <dd>{keepCompounds(figure.offline.note)}</dd>
        </div>
      </dl>
    </figure>
  );
}
