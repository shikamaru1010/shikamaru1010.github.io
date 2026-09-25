import { personal } from '../../data/personal';
import { profile } from '../../data/profile';
import { buildYear } from '../../lib/format';
import TurnThePage from '../shell/TurnThePage';

// STUB (foundation). Owned by personal (C): replace the body, keep the signature.
// App renders it inside <footer className="only-personal">.
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
      <div className="p-foot">
        <p>
          © {buildYear} {profile.name}
        </p>
        <p>{personal.footPlace}</p>
        <p>
          <TurnThePage to="professional" />
        </p>
      </div>
    </div>
  );
}
