import { useEffect, useState } from 'react';
import { profile } from '../data/profile';
import ThemeToggle from './ThemeToggle';
import { Close, Download, GitHub, LinkedIn, Menu } from './icons';

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav({ onOpenResume }: { onOpenResume: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on desktop resize (keeps state clean)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header
      className={`no-print sticky top-0 z-40 transition-colors ${
        scrolled ? 'border-b border-border bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Back to top">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-display text-sm font-bold text-accent-fg">
            {profile.initials}
          </span>
          <span className="hidden font-display text-sm font-semibold sm:block">{profile.name}</span>
        </a>

        <div className="hidden items-center gap-7 text-sm text-muted md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hidden h-9 w-9 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-fg sm:grid"
          >
            <GitHub width={17} height={17} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hidden h-9 w-9 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-fg sm:grid"
          >
            <LinkedIn width={17} height={17} />
          </a>
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-fg md:hidden"
          >
            {mobileOpen ? <Close width={17} height={17} /> : <Menu width={17} height={17} />}
          </button>
          <button onClick={onOpenResume} className="btn-primary h-9 px-4 text-xs">
            <Download width={15} height={15} />
            <span className="hidden sm:inline">Résumé</span>
          </button>
        </div>
      </nav>

      {/* Mobile navigation panel (simple, touch-friendly, reuses link data) */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-bg">
          <div className="container-page flex flex-col py-1 text-sm">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-muted transition-colors hover:bg-surface hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
