// Fitted display lines ("the width of the page") are sized in container units
// calibrated to Golos Text, so they fill the measure with no JS. This is only a
// guard: if a fallback face is wider than Golos, it shrinks that line until it
// fits. It never grows a line. Mark a fitted element with `data-fit`; its
// nearest `.wrap` is the measure. No DOM access at module level (node tests
// import this file).
import { useEffect, useLayoutEffect } from 'react';

/** Latin, latin-ext and Cyrillic faces at 700, the weight every fitted line uses. */
const FIT_SAMPLE = 'Ratko Šišović ralesisko@gmail.com Ратко Шишовић';
const FIT_FONT = '700 16px "Golos Text"';

export function fitDisplayLines(root?: ParentNode): void {
  if (typeof document === 'undefined') return;
  const scope = root ?? document;
  scope.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
    el.style.fontSize = '';
    if (!el.getClientRects().length) return; // hidden in this mode
    const parent = el.closest('.wrap');
    if (!parent) return;
    const cs = getComputedStyle(parent);
    const right = parent.getBoundingClientRect().right - parseFloat(cs.paddingRight);
    const range = document.createRange();
    range.selectNodeContents(el);
    const box = range.getBoundingClientRect();
    if (box.right > right + 1) {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = ((fs * (right - box.left)) / box.width * 0.995).toFixed(2) + 'px';
    }
  });
}

function fontsReady(): boolean {
  try {
    return document.fonts ? document.fonts.check(FIT_FONT, FIT_SAMPLE) : true;
  } catch {
    return true;
  }
}

/**
 * Runs the guard when `deps` change (only once the exact Golos faces are in,
 * so a line is never shrunk against the fallback and then grown back), once
 * the faces load (or fail to), and on resize (debounced 120 ms).
 */
export function useFitDisplay(deps: readonly unknown[]): void {
  useLayoutEffect(() => {
    if (fontsReady()) fitDisplayLines();
  }, deps);

  useEffect(() => {
    let alive = true;
    const run = () => {
      if (alive) fitDisplayLines();
    };
    if (document.fonts) document.fonts.load(FIT_FONT, FIT_SAMPLE).then(run, run);
    else run();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(run, 120);
    };
    window.addEventListener('resize', onResize);
    return () => {
      alive = false;
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);
}
