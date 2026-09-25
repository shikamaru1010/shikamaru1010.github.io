import { personal } from '../../data/personal';
import { useMode } from '../../lib/useMode';

/**
 * The first name, fitted so the k's stem lands on column 6, and under it the
 * line, the intro and the duotone photo, which starts on that same column.
 * The photo is the Personal LCP: eager with high priority on a Personal load,
 * lazy otherwise (the toggle and the wipe warm it before it is revealed).
 */
export default function PersonalHero(): JSX.Element {
  const mode = useMode();
  const shown = mode === 'personal';
  const { photo } = personal;

  return (
    <section className="p-hero wrap" aria-labelledby="p-name">
      <h1 className="p-name" id="p-name" data-fit>
        {personal.firstName}
      </h1>
      <div className="p-under grid">
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
        <div className="p-intro">
          <p className="p-line">{personal.line}</p>
          <p className="p-body">{personal.intro}</p>
        </div>
      </div>
    </section>
  );
}
