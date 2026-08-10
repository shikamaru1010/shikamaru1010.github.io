import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/** Screen-space point the theme-swap animation should expand from. */
type Origin = { x: number; y: number };

function getInitialTheme(): Theme {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  return 'light';
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Theme state synced with the <html class="dark"> set in index.html before paint. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore storage errors (private mode) */
    }
  }, [theme]);

  const toggle = useCallback(
    (origin?: Origin) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';

      // Progressive enhancement: browsers without the View Transitions API (or
      // with reduced-motion requested) just flip instantly — same as before.
      if (!document.startViewTransition || prefersReducedMotion()) {
        setTheme(next);
        return;
      }

      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const transition = document.startViewTransition(() => setTheme(next));

      transition.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
            {
              duration: 500,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            },
          );
        })
        .catch(() => {
          /* transition was skipped (e.g. page hidden) — theme already applied */
        });
    },
    [theme],
  );

  return { theme, toggle };
}
