import { skillGroups } from '../data/skills';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function Skills() {
  return (
    <section id="skills" className="border-y border-border bg-surface/40">
      <div className="container-page scroll-mt-20 py-20">
        <SectionHeading eyebrow="Toolkit" title="Skills & technologies" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.05}>
              <div className="card h-full p-5">
                <div className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-5 text-xs text-subtle">
          I pick up new tools quickly when the work needs it — the fundamentals (networks, data,
          debugging, clear communication) transfer everywhere.
        </p>
      </div>
    </section>
  );
}
