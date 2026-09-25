import type { WorkflowStep } from '../../data/projects';
import { site } from '../../data/site';
import { fill } from '../../lib/format';

// "How it works": the steps on a vertical stop line (the home pipeline's phone
// form, at every width). Shape code (DECISIONS 10): a square is the system, a
// filled circle is a person stepping in (site.study.personActors). The actor is
// also written out next to every step, so the shape is never the only signal.

function isPersonActor(actor: string): boolean {
  return (site.study.personActors as readonly string[]).includes(actor);
}

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
          <p className="label tnum">{fill(site.study.counts.flow, { n: steps.length })}</p>
        </div>
      </div>
      <ol className="study-flow">
        {steps.map((step) => (
          <li key={step.title} className={`study-step grid${isPersonActor(step.actor) ? ' is-person' : ''}`}>
            <p className="study-actor label">{step.actor}</p>
            <div className="study-step-body">
              <h3 className="study-step-title">{step.title}</h3>
              <p className="study-step-detail">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
