import thought from '../../data/daily-message.json';
import { personal } from '../../data/personal';
import { fill } from '../../lib/format';

/**
 * Today’s thought, rotated each morning by the daily GitHub Action. The
 * provenance line reads the real pool size from daily-message.json (DECISIONS 12).
 */
export default function Thought(): JSX.Element {
  return (
    <section className="wrap p-sec" id="thought" aria-labelledby="thought-h">
      <h2 id="thought-h" className="sr-only">
        {personal.thought.heading}
      </h2>
      <div className="grid">
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
