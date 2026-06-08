import { education, experience, languages } from '../data/experience';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function Experience() {
  return (
    <section id="experience" className="border-y border-border bg-surface/40">
      <div className="container-page scroll-mt-20 py-20">
        <SectionHeading eyebrow="Background" title="Experience & education" />

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Experience timeline */}
          <div className="lg:col-span-3">
            <ol className="relative space-y-8 border-l border-border pl-6">
              {experience.map((job, i) => (
                <Reveal key={job.role} delay={i * 0.06}>
                  <li className="relative">
                    <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg" />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="font-semibold">{job.role}</h3>
                      <span className="font-mono text-xs text-subtle">{job.period}</span>
                    </div>
                    <div className="text-sm text-muted">
                      {job.org} · {job.location}
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {job.points.map((pt, j) => (
                        <li key={j} className="flex gap-2 text-sm leading-relaxed text-muted">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    {job.tech && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {job.tech.map((t) => (
                          <span key={t} className="chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Education + languages */}
          <div className="space-y-4 lg:col-span-2">
            <Reveal>
              <div className="card p-5">
                <div className="mb-1 font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  Education
                </div>
                <h3 className="font-semibold leading-snug">{education.school}</h3>
                <div className="mt-1 text-sm text-muted">{education.degree}</div>
                <div className="mt-1 font-mono text-xs text-subtle">{education.period}</div>
                <ul className="mt-3 space-y-1.5">
                  {education.courses.map((c) => (
                    <li key={c} className="flex gap-2 text-sm leading-relaxed text-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-subtle">{education.detail}</p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="card p-5">
                <div className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  Languages
                </div>
                <div className="space-y-2">
                  {languages.map((l) => (
                    <div key={l.name} className="flex items-baseline justify-between text-sm">
                      <span className="font-medium">{l.name}</span>
                      <span className="text-muted">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
