import { profile } from '../../data/profile';
import { site } from '../../data/site';
import ModeToggle from './ModeToggle';

/** Home header: brand · mode switch · section nav · CV, one sticky row (56px on phones). */
export default function SiteHeader(): JSX.Element {
  return (
    <header className="site-head">
      <div className="wrap grid">
        <a className="brand" href="#top">
          <span className="only-pro">
            {profile.firstName}
            <span> {profile.lastName}</span>
          </span>
          <span className="only-personal">{profile.firstName}</span>
        </a>
        <ModeToggle />
        <nav className="nav" aria-label={site.nav.label}>
          {site.nav.professional.map((l) => (
            <a key={l.href} className="only-pro" href={l.href}>
              {l.label}
            </a>
          ))}
          {site.nav.personal.map((l) => (
            <a key={l.href} className="only-personal" href={l.href}>
              {l.label}
            </a>
          ))}
          <a className="nav-cv" href="#resume">
            {site.nav.cv}
          </a>
        </nav>
        <p id="mode-status" className="sr-only" role="status" aria-live="polite" />
      </div>
    </header>
  );
}
