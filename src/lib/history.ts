// The little state this app keeps in history entries, so Back returns the visitor
// to exactly where they left home, in either mode. DOM access only inside functions
// (node tests import the modules that import this).
import { isPlainClick } from './mode';

/** What the app writes into `history.state` (other keys are kept as they are). */
export type NavState = {
  /** On a home entry: the scroll position when the visitor left it. */
  homeY?: number;
  /** On a CV or case-study entry: it was opened by a link on home, so Back returns to home. */
  fromHome?: boolean;
};

export function navState(): NavState {
  try {
    const s: unknown = history.state;
    return s && typeof s === 'object' ? (s as NavState) : {};
  } catch {
    return {};
  }
}

/** Merges `patch` into the current entry's state; the URL is left as it is. */
export function patchNavState(patch: NavState): void {
  try {
    history.replaceState({ ...navState(), ...patch }, '');
  } catch {
    /* some file:// contexts refuse replaceState */
  }
}

/**
 * onClick for a "back to the site" link: when this page was opened from home in this tab,
 * a plain click goes back through history, which restores the visitor's place (and mode).
 * Otherwise (a direct load, a new tab, a modifier click) the link's own href is followed.
 */
export function returnHome(e: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; preventDefault(): void }): void {
  if (!isPlainClick(e) || !navState().fromHome) return;
  e.preventDefault();
  history.back();
}
