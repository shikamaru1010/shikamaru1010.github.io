import { useState } from 'react';
import { projects, type Project } from '../data/projects';
import { useProjectFilters } from '../lib/useFilters';
import ProjectCard from './ProjectCard';
import ProjectFilters from './ProjectFilters';
import ProjectModal from './ProjectModal';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function Projects() {
  const [open, setOpen] = useState<Project | null>(null);
  const { search, setSearch, active, toggleCategory, clear, filtered, isFiltering } =
    useProjectFilters(projects);

  const featured = filtered.filter((p) => p.featured);
  const more = filtered.filter((p) => !p.featured);

  return (
    <section id="projects" className="container-page scroll-mt-20 py-20">
      <SectionHeading eyebrow="Selected work" title="Projects" />

      <ProjectFilters
        search={search}
        setSearch={setSearch}
        active={active}
        toggleCategory={toggleCategory}
        clear={clear}
        isFiltering={isFiltering}
        resultCount={filtered.length}
        totalCount={projects.length}
      />

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-sm text-muted">
          No projects match your filters.{' '}
          <button onClick={clear} className="text-accent underline-offset-2 hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {featured.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i * 0.06, 0.24)}>
                  <ProjectCard project={p} onOpen={setOpen} />
                </Reveal>
              ))}
            </div>
          )}

          {more.length > 0 && (
            <div>
              {featured.length > 0 && !isFiltering && (
                <div className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                  More projects
                </div>
              )}
              <div className="grid gap-3">
                {more.map((p, i) => (
                  <Reveal key={p.id} delay={Math.min(i * 0.04, 0.2)}>
                    <ProjectCard project={p} onOpen={setOpen} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-subtle">
        Several repositories are private (API keys / client work). Full code, architecture and
        walk-throughs available on request.
      </p>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
