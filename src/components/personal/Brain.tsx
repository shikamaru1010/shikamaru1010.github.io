import { personal, type BrainDomain } from '../../data/personal';
import { projectById } from '../../data/projects';
import { site } from '../../data/site';

/** A domain's project, linked to its case study when it has one (dev-dashboard). */
function ProjectName({ project }: { project: NonNullable<BrainDomain['project']> }): JSX.Element {
  const study = projectById(project.id)?.caseStudy;
  if (!study) return <strong>{project.label}</strong>;
  return (
    <a className="p-study u" href={`#project/${project.id}`}>
      <strong>{project.label}</strong>
      <span className="sr-only">, {site.work.caseStudy}</span>
    </a>
  );
}

/** Side projects: one Obsidian vault, three domains, and the agents that write into it. */
export default function Brain(): JSX.Element {
  const { brain } = personal;
  return (
    <section className="wrap p-sec" id="brain" aria-labelledby="brain-h">
      <div className="grid p-row">
        <div className="p-label">
          <h2 id="brain-h">{brain.heading}</h2>
          <p className="label">{brain.sub}</p>
        </div>
        <p className="p-lede">{brain.lede}</p>
      </div>
      <ul className="p-domains grid">
        {brain.domains.map((d) => (
          <li key={d.name}>
            <h3 className="p-dom">{d.name}</h3>
            {d.project ? (
              <p>
                <ProjectName project={d.project} /> {d.text}
              </p>
            ) : (
              <p className="p-none">{brain.emptyText}</p>
            )}
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
