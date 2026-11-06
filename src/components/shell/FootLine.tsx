import { profile } from '../../data/profile';
import { updatedYear } from '../../lib/format';
import type { Mode } from '../../lib/mode';
import TurnThePage from './TurnThePage';

/**
 * The quiet line every site page ends on: © and my name, and on the home pages the way to
 * the other side (`turn`).
 */
export default function FootLine({ turn }: { turn?: Mode }): JSX.Element {
  return (
    <div className="foot-line">
      <p>
        © <span className="tnum">{updatedYear}</span> {profile.name}
      </p>
      {turn && (
        <p className="foot-turn">
          <TurnThePage to={turn} />
        </p>
      )}
    </div>
  );
}
