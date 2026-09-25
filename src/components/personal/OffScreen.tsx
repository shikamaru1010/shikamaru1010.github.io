import { personal } from '../../data/personal';

/**
 * Off screen: renders only when `personal.offline` is filled. It is empty on
 * purpose until Ratko writes two or three real things there; nothing is invented.
 */
export default function OffScreen(): JSX.Element | null {
  if (!personal.offline.length) return null;
  return (
    <section className="wrap p-sec" id="offline" aria-labelledby="off-h">
      <div className="grid p-row">
        <div className="p-label">
          <h2 id="off-h">{personal.offlineHeading}</h2>
        </div>
        <ul className="p-off">
          {personal.offline.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
