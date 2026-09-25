import { personal } from '../../data/personal';
import ExternalLink from '../shell/ExternalLink';

/** Where else to find me: each link with its handle; external ones open in a new tab (R7). */
export default function Elsewhere(): JSX.Element {
  return (
    <section className="wrap p-sec" id="elsewhere" aria-labelledby="else-h">
      <div className="grid p-row">
        <div className="p-label">
          <h2 id="else-h">{personal.elsewhereHeading}</h2>
        </div>
        <ul className="p-else">
          {personal.elsewhere.map((l) => {
            const text = (
              <>
                <span className="p-link">{l.label}</span> <span className="p-handle">{l.text}</span>
              </>
            );
            return (
              <li key={l.label}>
                {/^https?:/.test(l.href) ? <ExternalLink href={l.href}>{text}</ExternalLink> : <a href={l.href}>{text}</a>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
