import thought from '../../data/daily-message.json';
import { personal } from '../../data/personal';

/**
 * Today’s thought, rotated each morning by the daily GitHub Action. Like every Personal
 * section, the label holds columns 1–5 and the quote starts on column 6.
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
          <figcaption>{thought.author}</figcaption>
        </figure>
      </div>
    </section>
  );
}
