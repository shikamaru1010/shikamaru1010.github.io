import thought from '../../data/daily-message.json';
import { personal } from '../../data/personal';
import { fill } from '../../lib/format';

/**
 * Today’s thought, rotated each morning by the daily GitHub Action. Like every Personal
 * section, the label holds columns 1–5 and the quote starts on column 6. The provenance
 * line reads the real pool size from daily-message.json.
 */
export default function Thought(): JSX.Element {
  return (
    <section className="wrap p-sec" id="thought" aria-labelledby="thought-h">
      <div className="grid p-row">
        <div className="p-label">
          <h2 id="thought-h">{personal.thought.heading}</h2>
        </div>
        <figure className="p-thought">
          <blockquote>
            <p>
              <span className="p-q">“</span>
              {thought.text}
              <span className="p-q">”</span>
            </p>
          </blockquote>
          <figcaption>
            <span className="p-author">{thought.author}</span>
            <span className="label">{fill(personal.thought.provenance, { poolSize: thought.poolSize })}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
