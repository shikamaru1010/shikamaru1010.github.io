import FootLine from '../shell/FootLine';
import './contact.css';

/** The Professional footer: the last line on the ink plate that Contact starts. */
export default function ProFooter(): JSX.Element {
  return (
    <div className="foot ink-plate">
      <div className="wrap">
        <FootLine turn="personal" />
      </div>
    </div>
  );
}
