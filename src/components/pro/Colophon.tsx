import { profile } from '../../data/profile';
import { site } from '../../data/site';
import { UPDATED, updatedYear } from '../../lib/format';
import TurnThePage from '../shell/TurnThePage';
import './contact.css';

const K = site.colophon;

/** A middle dot between the parts of the line; screen readers get the parts, not the dots. */
function Sep(): JSX.Element {
  return (
    <span className="colophon-sep" aria-hidden="true">
      {' · '}
    </span>
  );
}

/** The Professional footer: one quiet line (©, how it is built, the content date) and the way to the other side. */
export default function Colophon(): JSX.Element {
  return (
    <div className="foot ink-plate">
      <div className="wrap">
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
          <p className="colophon-turn">
            <TurnThePage to="personal" />
          </p>
        </div>
      </div>
    </div>
  );
}
