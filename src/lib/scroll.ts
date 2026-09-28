// Section jumps from the nav. A section's top padding is the space between it and the
// previous section, so aligning the section box itself under the sticky header wastes that
// space on screen. Instead the jump lines up the section's CONTENT: a section that fits the
// viewport is centred below the header, a longer one starts just under it.

export type SectionBox = {
  /** Document y of the section box's top edge. */
  top: number;
  /** The section's padding-top (spacing that belongs to the gap above it). */
  padTop: number;
  /** The section box's full height, padding included. */
  height: number;
  /** window.innerHeight */
  viewport: number;
  /** Height of the sticky header. */
  head: number;
  /** Breathing room kept under the header. */
  gap: number;
};

/** The scroll position that shows as much of the section's content as possible. */
export function sectionScrollTop({ top, padTop, height, viewport, head, gap }: SectionBox): number {
  const contentTop = top + padTop;
  const contentHeight = height - padTop;
  const available = viewport - head;
  const y =
    contentHeight + 2 * gap <= available
      ? contentTop - head - (available - contentHeight) / 2 // fits: centre it
      : contentTop - head - gap; // longer than the screen: start just under the header
  return Math.max(0, Math.round(y));
}

/** Nav targets that get the content-aware jump; any other anchor keeps scrollIntoView(). */
export function isSection(el: Element): boolean {
  return el.tagName === 'SECTION';
}

export function scrollToSection(el: HTMLElement, smooth: boolean): void {
  const rect = el.getBoundingClientRect();
  const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--head-h')) || 64;
  const top = sectionScrollTop({
    top: rect.top + window.scrollY,
    padTop: parseFloat(getComputedStyle(el).paddingTop) || 0,
    height: rect.height,
    viewport: window.innerHeight,
    head,
    gap: 24,
  });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: smooth && !reduce ? 'smooth' : 'auto' });
}
