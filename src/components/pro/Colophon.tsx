import ColophonLine from '../shell/ColophonLine';
import './contact.css';

/** The Professional footer: the colophon line on the ink plate that Contact starts. */
export default function Colophon(): JSX.Element {
  return (
    <div className="foot ink-plate">
      <div className="wrap">
        <ColophonLine turn="personal" />
      </div>
    </div>
  );
}
