import type { WorkflowStep } from '../../data/projects';
import { site } from '../../data/site';

// "How it works": the steps on a vertical stop line. Shape code: a square is
// the system, a filled circle is a person stepping in (the step's `kind`). The
// actor is also written out next to every step, so the shape is never the only
// signal. A step is its title only: the architecture above says what each part does.

export default function StudyFlow({ steps }: { steps: WorkflowStep[] }): JSX.Element {
  return (
    <section className="study-sec wrap" aria-labelledby="study-flow-h">
      <div className="study-sec-head">
        <h2 className="study-h2" id="study-flow-h">
          {site.study.sections.flow}
        </h2>
        <div className="study-sec-aside">
          <ul className="study-legend label" aria-hidden="true">
            <li>
              <span className="study-key" />
              {site.study.legend.system}
            </li>
            <li>
              <span className="study-key is-person" />
              {site.study.legend.person}
            </li>
          </ul>
        </div>
      </div>
      <ol className="study-flow">
        {steps.map((step) => (
          <li key={step.title} className={`study-step grid${step.kind === 'person' ? ' is-person' : ''}`}>
            <p className="study-actor label">{step.actor}</p>
            <h3 className="study-step-title">{step.title}</h3>
          </li>
        ))}
      </ol>
    </section>
  );
}
