// Moving focus to a place on the page, for keyboard and screen-reader users. DOM access
// only inside functions (node tests import the modules that import this).

/**
 * Focuses <main>. It is focusable only while it has focus: a permanent tabindex would make a
 * click on any plain text focus <main>, and the next Tab would start from the top of the page
 * instead of from the click (WCAG 2.4.3).
 */
export function focusMain(opts?: FocusOptions): HTMLElement | null {
  const main = document.getElementById('main');
  if (!main) return null;
  if (!main.hasAttribute('tabindex')) {
    main.setAttribute('tabindex', '-1');
    main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
  }
  main.focus(opts);
  return main;
}

/** The links on the page with exactly this href that are shown (in the current mode), in document order. */
export function visibleLinks(href: string): HTMLAnchorElement[] {
  return [...document.querySelectorAll<HTMLAnchorElement>('a[href]')].filter(
    (a) => a.getAttribute('href') === href && a.getClientRects().length > 0,
  );
}
