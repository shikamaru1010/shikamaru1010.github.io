import { useEffect, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { site } from '../../data/site';
import { MODES, isPlainClick, withMode, type Mode } from '../../lib/mode';
import { setMode, useMode, warmPortrait } from '../../lib/useMode';

type Hrefs = Record<Mode, string>;
const INITIAL_HREFS: Hrefs = { professional: '?mode=professional', personal: '?mode=personal' };

function currentHrefs(): Hrefs {
  return {
    professional: withMode(location.href, 'professional'),
    personal: withMode(location.href, 'personal'),
  };
}

/**
 * The Professional | Personal switch. Two real links (`?mode=…`), so it works
 * before React and with modifier-clicks; after mount it upgrades to a
 * radiogroup with roving tabindex and Arrow / Home / End.
 */
export default function ModeToggle(): JSX.Element {
  const mode = useMode();
  const [enhanced, setEnhanced] = useState(false);
  const [hrefs, setHrefs] = useState<Hrefs>(INITIAL_HREFS);

  useEffect(() => {
    setEnhanced(true);
    const update = () => setHrefs(currentHrefs());
    update();
    window.addEventListener('hashchange', update);

    // During the wipe the page is a snapshot and every click lands on <html>. Map a click that
    // falls on a switch cell back to that cell, so a second press settles at once (DECISIONS 9).
    const onWipeClick = (e: globalThis.MouseEvent) => {
      const root = document.documentElement;
      if (e.target !== root || !root.classList.contains('is-wiping') || !isPlainClick(e)) return;
      for (const m of MODES) {
        const r = document.querySelector(`[data-mode-radio="${m}"]`)?.getBoundingClientRect();
        if (r && e.clientX >= r.left && e.clientX < r.right && e.clientY >= r.top && e.clientY < r.bottom) {
          e.preventDefault();
          setMode(m, { focusToggle: true });
          return;
        }
      }
    };
    document.addEventListener('click', onWipeClick);
    return () => {
      window.removeEventListener('hashchange', update);
      document.removeEventListener('click', onWipeClick);
    };
  }, []);

  const onClick = (target: Mode) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    setMode(target, { focusToggle: true });
  };

  const onKeyDown = (index: number) => (e: KeyboardEvent<HTMLAnchorElement>) => {
    let next: Mode | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = MODES[(index + 1) % MODES.length];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = MODES[(index - 1 + MODES.length) % MODES.length];
    else if (e.key === 'Home') next = MODES[0];
    else if (e.key === 'End') next = MODES[MODES.length - 1];
    else if (e.key === ' ') {
      // an <a> does not consume Space, so the page would scroll; the focused radio is already checked
      e.preventDefault();
      return;
    }
    if (next) {
      e.preventDefault();
      setMode(next, { focusToggle: true });
    }
  };

  const cells = MODES.map((m, i) => {
    const checked = m === mode;
    const warm = m === 'personal' ? { onPointerEnter: warmPortrait, onFocus: warmPortrait } : { onFocus: warmPortrait };
    const state = enhanced
      ? { role: 'radio', 'aria-checked': checked, tabIndex: checked ? 0 : -1, onKeyDown: onKeyDown(i) }
      : { 'aria-current': checked ? ('page' as const) : undefined };
    return (
      <a key={m} className="switch-cell" data-mode-radio={m} href={hrefs[m]} onClick={onClick(m)} {...warm} {...state}>
        {site.mode.labels[m]}
      </a>
    );
  });

  return enhanced ? (
    <div className="switch" role="radiogroup" aria-label={site.mode.groupLabel}>
      {cells}
    </div>
  ) : (
    <nav className="switch" aria-label={site.mode.groupLabel}>
      {cells}
    </nav>
  );
}
