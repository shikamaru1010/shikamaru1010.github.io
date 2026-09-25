import { personal } from '../../data/personal';
import { useMode } from '../../lib/useMode';

/**
 * The first name, the line and the intro in columns 1–5, the duotone photo
 * beside them from column 6, the axis every Personal section below starts on.
 * The name sits exactly where the Professional name does, so the switch only
 * changes what follows it. On phones: name, line, photo, intro.
 * The photo is the Personal LCP: eager with high priority on a Personal load,
 * lazy otherwise (the toggle and the wipe warm it before it is revealed).
 */
export default function PersonalHero(): JSX.Element {
  const mode = useMode();
  const shown = mode === 'personal';
  const { photo } = personal;

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
