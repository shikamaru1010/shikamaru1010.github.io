import type { MouseEvent } from 'react';
import { profile } from '../../data/profile';
import { site } from '../../data/site';
import { isPlainClick } from '../../lib/mode';
import { isSection, scrollToSection } from '../../lib/scroll';
import ModeToggle from './ModeToggle';

/**
 * Section links: the browser's own anchor jump would put the section's top padding (the gap
 * to the previous section) under the header, so do the jump here instead (lib/scroll.ts) and
 * keep what native hash navigation gives: a history entry, the hash in the URL, and the
 * keyboard's starting point moved to the section.
 */
function onSectionClick(e: MouseEvent<HTMLAnchorElement>): void {
  const href = e.currentTarget.getAttribute('href') ?? '';
  if (!isPlainClick(e.nativeEvent)) return;
  const el = document.getElementById(href.slice(1));
  if (!el || !isSection(el) || !el.getClientRects().length) return;
  e.preventDefault();
  if (href !== location.hash) history.pushState(null, '', location.pathname + location.search + href);
  scrollToSection(el, true);
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.setAttribute('data-focus-target', '');
  el.focus({ preventScroll: true });
}

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
            <a key={l.href} className="only-pro" href={l.href} onClick={onSectionClick}>
              {l.label}
            </a>
          ))}
          {site.nav.personal.map((l) => (
            <a key={l.href} className="only-personal" href={l.href} onClick={onSectionClick}>
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
