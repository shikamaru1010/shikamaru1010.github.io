import { personal } from '../../data/personal';
import { profile } from '../../data/profile';
import { buildYear } from '../../lib/format';
import TurnThePage from '../shell/TurnThePage';
import './personal.css';

/**
 * The Personal close: the same name in Serbian Cyrillic at the width of the
 * page (the only Cyrillic moment, DECISIONS 15), then the foot row and the way
 * back to the professional side. App renders it inside <footer class="only-personal">.
 */
export default function PersonalFooter(): JSX.Element {
  return (
    <div className="wrap p-end">
      <p className="p-cap">{personal.signCaption}</p>
      <p className="p-sign" lang="sr-Cyrl" data-fit>
        {personal.nameCyrillic.map((w, i) => (
          <span key={w}>
            {i > 0 ? ' ' : ''}
            {w}
          </span>
        ))}
      </p>
      <div className="p-foot grid">
        <p className="p-copy">
          © <span className="tnum">{buildYear}</span> {profile.name}
        </p>
        <p className="p-place">{personal.footPlace}</p>
        <p className="p-turn">
          <TurnThePage to="professional" />
        </p>
      </div>
    </div>
  );
}
