import { profile } from '../../data/profile';
import { site } from '../../data/site';
import { BUILD_DATE, buildYear } from '../../lib/format';
import TurnThePage from '../shell/TurnThePage';

// STUB (foundation). Owned by pro-profile (A): replace the body, keep the signature.
// App renders it inside <footer className="only-pro">.
export default function Colophon(): JSX.Element {
  return (
    <div className="foot ink-plate">
      <div className="wrap">
        <div className="colophon">
          <p>
            © {buildYear} {profile.name}
            <br />
            {site.colophon.updated} <time dateTime={BUILD_DATE}>{BUILD_DATE}</time>
          </p>
          <p>
            <TurnThePage to="personal" />
          </p>
        </div>
      </div>
    </div>
  );
}
