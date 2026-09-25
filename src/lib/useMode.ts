// The live mode: a tiny external store over <html data-mode>, plus setMode(),
// which owns every side effect of a switch (URL, title, theme-color, scroll,
// announcement, focus and the one wipe transition).
//
// No DOM access at module level or during render (node tests import this).
import { useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { site } from '../data/site';
import { applyDocumentMeta } from './documentMeta';
import { fitDisplayLines } from './fit';
import { DEFAULT_MODE, parseMode, withMode, type Mode } from './mode';

type SetModeOptions = { focusToggle?: boolean };

const listeners = new Set<() => void>();
/** The running wipe, if any. */
let active: ViewTransition | null = null;
/** The last mode asked for; the transition callback applies this, so no press is lost. */
let latest: Mode | null = null;

export function getMode(): Mode {
  if (typeof document === 'undefined') return DEFAULT_MODE;
  const m = document.documentElement.dataset.mode;
  if (m === 'personal' || m === 'professional') return m;
  return parseMode(location.search);
}

export function subscribeMode(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useMode(): Mode {
  return useSyncExternalStore(subscribeMode, getMode, () => DEFAULT_MODE);
}

function replaceUrl(next: Mode): void {
  try {
    history.replaceState(history.state, '', withMode(location.href, next));
  } catch {
    /* some file:// contexts refuse replaceState */
  }
}

function radioFor(mode: Mode): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-mode-radio="${mode}"]`);
}

function focusRadio(mode: Mode): void {
  radioFor(mode)?.focus({ preventScroll: true });
}

function needsFocusRescue(): boolean {
  const el = document.activeElement;
  if (!el || el === document.body) return true;
  return !el.getClientRects().length; // focus sits in the tree that just disappeared
}

function announce(next: Mode): void {
  const status = document.getElementById('mode-status');
  if (!status) return;
  status.textContent = '';
  requestAnimationFrame(() => {
    status.textContent = site.mode.announce[next];
  });
}

/** Idempotent: applying the current mode only runs the focus step. */
function applyMode(next: Mode, opts?: SetModeOptions): void {
  const root = document.documentElement;
  if (root.dataset.mode === next) {
    if (opts?.focusToggle) focusRadio(next);
    return;
  }
  root.dataset.mode = next;
  listeners.forEach((cb) => cb());
  root.classList.remove('show-grid'); // the grid button only exists in Professional
  applyDocumentMeta({ kind: 'home' }, next);
  fitDisplayLines();
  window.scrollTo(0, 0);
  announce(next);
  if (opts?.focusToggle || needsFocusRescue()) focusRadio(next);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function portrait(): HTMLImageElement | null {
  return document.querySelector<HTMLImageElement>('img[data-warm]');
}

/** Start loading the Personal photo early (the toggle calls this on hover and focus). */
export function warmPortrait(): void {
  if (typeof document === 'undefined') return;
  const img = portrait();
  if (img && img.loading !== 'eager') img.loading = 'eager';
}

/** Warm the photo and wait for it to decode, capped at `ms`, so the wipe never reveals an empty frame. */
export async function warmAndDecode(ms: number): Promise<void> {
  const img = portrait();
  if (!img) return;
  if (img.loading !== 'eager') img.loading = 'eager';
  await Promise.race([img.decode().catch(() => {}), sleep(ms)]);
}

export function setMode(next: Mode, opts?: SetModeOptions): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  latest = next;

  // 1. A second press during the wipe settles at once, on the mode pressed last.
  if (active) {
    active.skipTransition();
    replaceUrl(next);
    if (next !== getMode()) applyMode(next, opts);
    else if (opts?.focusToggle) focusRadio(next);
    return;
  }

  // 2. Already there.
  if (next === getMode()) {
    if (opts?.focusToggle) focusRadio(next);
    return;
  }

  // 3.
  replaceUrl(next);

  // 4. No wipe: reduced motion, no View Transitions, or a hidden tab.
  if (
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    typeof document.startViewTransition !== 'function' ||
    document.visibilityState !== 'visible'
  ) {
    applyMode(next, opts);
    return;
  }

  // 5. The wipe: down to Personal, up to Professional.
  root.dataset.dir = next === 'personal' ? 'down' : 'up';
  const transition = document.startViewTransition(async () => {
    root.classList.add('is-wiping');
    const m = latest ?? next;
    flushSync(() => applyMode(m, opts));
    if (m === 'personal') await warmAndDecode(900);
  });
  active = transition;
  const done = () => {
    root.classList.remove('is-wiping');
    delete root.dataset.dir;
    if (active === transition) active = null;
  };
  transition.finished.then(done, done);
  transition.ready.catch(() => {});
  transition.updateCallbackDone.catch(() => {});
}
