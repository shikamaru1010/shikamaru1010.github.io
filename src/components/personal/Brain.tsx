import { personal, type BrainDomain } from '../../data/personal';
import { projectById } from '../../data/projects';
import { site } from '../../data/site';

/** A domain's project, linked to its case study when it has one (dev-dashboard). */
function ProjectName({ project }: { project: NonNullable<BrainDomain['project']> }): JSX.Element {
  const study = projectById(project.id)?.caseStudy;
  if (!study) return <strong className="nw">{project.label}</strong>;
  return (
    <a className="p-study nw u" href={`#project/${project.id}`}>
      <strong>{project.label}</strong>
      <span className="sr-only">, {site.work.caseStudy}</span>
    </a>
  );
}

/**
 * Side projects: one Obsidian vault, three domains, and the agents that write into it.
 * A domain is drawn only when something writes into it; the lede names all three.
 */
export default function Brain(): JSX.Element {
  const { brain } = personal;
  const shown = brain.domains.filter((d) => d.project || d.text);
  return (
    <section className="wrap p-sec" id="brain" aria-labelledby="brain-h">
      <div className="grid p-row">
        <div className="p-label">
          <h2 id="brain-h">{brain.heading}</h2>
        </div>
        <p className="p-lede">{brain.lede}</p>
      </div>
      <ul className="p-domains">
        {shown.map((d) => (
          <li key={d.name} className="grid">
            <h3 className="p-dom">{d.name}</h3>
            <p>
              {d.project ? (
                <>
                  <ProjectName project={d.project} />{' '}
                </>
              ) : null}
              {d.text}
            </p>
          </li>
        ))}
      </ul>
      <div className="grid">
        <p className="p-orch">
          <b>{brain.plannedLead}</b> {brain.planned}
        </p>
      </div>
    </section>
  );
}
