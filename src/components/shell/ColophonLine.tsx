import { profile } from '../../data/profile';
import { site } from '../../data/site';
import { UPDATED, updatedYear } from '../../lib/format';
import type { Mode } from '../../lib/mode';
import TurnThePage from './TurnThePage';

const K = site.colophon;

/** A middle dot between the parts of the line. The spaces sit outside it, so screen readers still hear them. */
function Sep(): JSX.Element {
  return (
    <>
      {' '}
      <span className="colophon-sep" aria-hidden="true">
        ·
      </span>{' '}
    </>
  );
}

/**
 * The one colophon line every page ends on: ©, how the site is built, the content
 * date. On the home pages it carries the way to the other side (`turn`).
 */
export default function ColophonLine({ turn }: { turn?: Mode }): JSX.Element {
  return (
    <div className="colophon">
      <p className="colophon-line">
        <span>
          © <span className="tnum">{updatedYear}</span> {profile.name}
        </span>
        <Sep />
        <span>{K.set}</span>
        <Sep />
        <span>
          {K.updated} <time dateTime={UPDATED}>{UPDATED}</time>
        </span>
      </p>
      {turn && (
        <p className="colophon-turn">
          <TurnThePage to={turn} />
        </p>
      )}
    </div>
  );
}
