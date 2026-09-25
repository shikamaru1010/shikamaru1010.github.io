import { useEffect, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { site } from '../../data/site';
import { MODES, isPlainClick, type Mode } from '../../lib/mode';
import { setMode, useMode, useModeHref, warmPortrait } from '../../lib/useMode';

/**
 * The Professional | Personal switch. Two real links (`?mode=…`), so modifier-clicks open
 * a mode in a new tab; after mount the same wrapper becomes a radiogroup with roving
 * tabindex and Arrow / Home / End (DECISIONS 9). The wrapper keeps its element type, so
 * the upgrade only changes attributes and nothing remounts.
 */
export default function ModeToggle(): JSX.Element {
  const mode = useMode();
  const [enhanced, setEnhanced] = useState(false);
  const hrefs: Record<Mode, string> = { professional: useModeHref('professional'), personal: useModeHref('personal') };

  useEffect(() => {
    setEnhanced(true);
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
    return () => document.removeEventListener('click', onWipeClick);
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

  return (
    <div className="switch" role={enhanced ? 'radiogroup' : 'navigation'} aria-label={site.mode.groupLabel}>
      {MODES.map((m, i) => {
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
      })}
    </div>
  );
}
