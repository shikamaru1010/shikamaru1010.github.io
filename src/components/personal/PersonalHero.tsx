import { useEffect } from 'react';
import { personal } from '../../data/personal';
import { getMode, useMode, warmPortrait } from '../../lib/useMode';

/**
 * The first name, the line and the intro in columns 1–5, the duotone photo
 * beside them from column 6, the axis every Personal section below starts on.
 * The name sits exactly where the Professional name does, so the switch only
 * changes what follows it. On phones: name, line, photo, intro.
 * The photo is the Personal LCP: eager with high priority on a Personal load,
 * lazy otherwise; on a Professional load it is fetched when the browser is idle,
 * so a switch reveals a finished photo instead of waiting for it.
 */
export default function PersonalHero(): JSX.Element {
  const mode = useMode();
  const shown = mode === 'personal';
  const { photo } = personal;

  useEffect(() => {
    if (getMode() === 'personal') return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(warmPortrait, { timeout: 5000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = setTimeout(warmPortrait, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="p-hero wrap" aria-labelledby="p-name">
      <div className="p-hero-grid grid">
        <h1 className="p-name" id="p-name">
          {personal.firstName}
        </h1>
        <p className="p-line">{personal.line}</p>
        <figure className="p-photo">
          <img
            src={photo.src}
            srcSet={photo.srcset}
            sizes={photo.sizes}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            data-warm=""
            decoding="async"
            loading={shown ? 'eager' : 'lazy'}
            {...({ fetchpriority: shown ? 'high' : 'auto' } as Record<string, string>)}
          />
        </figure>
        <p className="p-body">{personal.intro}</p>
      </div>
    </section>
  );
}
