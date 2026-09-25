import { personal } from '../../data/personal';
import { site } from '../../data/site';

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
            const external = /^https?:/.test(l.href);
            return (
              <li key={l.label}>
                <a href={l.href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  <span className="p-link">{l.label}</span>{' '}
                  <span className="p-handle">{l.text}</span>
                  {external && <span className="sr-only"> {site.newTab}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
