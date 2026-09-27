import { useEffect } from 'react';
import { personal } from '../../data/personal';
import { getMode, useMode, warmPortrait } from '../../lib/useMode';
import Monolith from '../hero/Monolith';

/**
 * The Personal hero: the Professional composition in the Personal inks (Monolith), with the
 * first name, where I am and the Personal sentence, and the duotone photo in the same circle,
 * so a switch keeps the circle where it is and the wipe swaps the code loop for the photo.
 * The photo is the Personal LCP: eager with high priority on a Personal load, lazy otherwise;
 * on a Professional load it is fetched when the browser is idle (and at once when the toggle
 * is hovered or focused), so a switch reveals a finished photo instead of waiting for it.
 */
export default function PersonalHero(): JSX.Element {
  const shown = useMode() === 'personal';
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
    <Monolith
      nameId="p-name"
      name={personal.firstName}
      lines={[personal.intro]}
      lede={personal.line}
      disc={
        <img
          className="mono-media p-photo"
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
      }
    />
  );
}
