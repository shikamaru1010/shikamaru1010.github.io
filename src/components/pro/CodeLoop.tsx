import { useEffect, useRef } from 'react';
import { site } from '../../data/site';

const L = site.hero.loop;

/**
 * The Professional circle's content: the muted code loop. Nothing is fetched until the
 * circle is on screen (preload="none", played by an IntersectionObserver); it pauses when
 * it leaves the screen, when the tab is hidden and when the Personal tree replaces it (its
 * box goes away, so the observer reports it). Under reduced motion (or Save-Data) it never
 * plays, and the poster is all that shows. Decorative, so aria-hidden.
 */
export default function CodeLoop(): JSX.Element {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // React sets `muted` as a property only; the attribute is what some autoplay policies read
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');

    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    // a visitor who asked the browser to save data gets the poster too
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    let onScreen = false;
    const sync = () => {
      if (onScreen && !still?.matches && !saveData && document.visibilityState === 'visible') {
        if (v.paused) v.play().catch(() => {}); // refused (a power-saving mode): the poster stays
      } else if (!v.paused) {
        v.pause();
      }
    };
    // Reduced motion switched on mid-loop: stop, and go back to the poster.
    const onMotion = () => {
      if (still?.matches) {
        v.pause();
        v.load();
      } else sync();
    };

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver((entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        sync();
      });
      io.observe(v);
    } else {
      onScreen = true;
      sync();
    }
    document.addEventListener('visibilitychange', sync);
    still?.addEventListener?.('change', onMotion);
    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', sync);
      still?.removeEventListener?.('change', onMotion);
      v.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      className="mono-media"
      width={L.size}
      height={L.size}
      poster={L.poster}
      preload="none"
      muted
      loop
      playsInline
      aria-hidden="true"
    >
      <source src={L.webm} type="video/webm" />
      <source src={L.mp4} type="video/mp4" />
    </video>
  );
}
