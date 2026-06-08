import type { Project } from '../data/projects';
import { ArrowUpRight } from './icons';

const statusStyles: Record<Project['status'], string> = {
  'In production': 'text-emerald-600 dark:text-emerald-400',
  'Active development': 'text-accent',
  Maintained: 'text-amber-600 dark:text-amber-400',
  Completed: 'text-muted',
};

export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  const featured = project.featured;
  return (
    <button
      onClick={() => onOpen(project)}
      className={`card group flex w-full flex-col p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:-translate-y-0.5 ${
        featured ? '' : 'sm:flex-row sm:items-center sm:gap-4'
      }`}
      aria-label={`Open details for ${project.title}`}
    >
      <div className={featured ? '' : 'flex-1'}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight">{project.title}</h3>
            <p className="text-sm text-muted">{project.subtitle}</p>
          </div>
          <ArrowUpRight
            width={18}
            height={18}
            className="shrink-0 text-subtle transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          />
        </div>

        <p className={`mt-3 text-sm leading-relaxed text-muted ${featured ? '' : 'line-clamp-2'}`}>
          {project.blurb}
        </p>
      </div>

      <div className={featured ? 'mt-4' : 'mt-3 sm:mt-0 sm:w-44 sm:shrink-0'}>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, featured ? 5 : 3).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-subtle">
          <span className={statusStyles[project.status]}>● {project.status}</span>
          <span className="text-border">·</span>
          <span>{project.year}</span>
        </div>
      </div>
    </button>
  );
}
