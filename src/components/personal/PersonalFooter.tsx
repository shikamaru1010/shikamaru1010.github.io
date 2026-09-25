import { personal } from '../../data/personal';
import ColophonLine from '../shell/ColophonLine';
import './personal.css';

/**
 * The Personal close: my name in Serbian Cyrillic (the only Cyrillic moment,
 * DECISIONS 15), then the colophon line every page ends on, with the way back to
 * the professional side. App renders it inside <footer class="only-personal">.
 */
export default function PersonalFooter(): JSX.Element {
  return (
    <div className="wrap p-end">
      <p className="p-cap">{personal.signCaption}</p>
      <p className="p-sign" lang="sr-Cyrl">
        {personal.nameCyrillic.map((w, i) => (
          <span key={w}>
            {i > 0 ? ' ' : ''}
            {w}
          </span>
        ))}
      </p>
      <ColophonLine turn="professional" />
    </div>
  );
}
