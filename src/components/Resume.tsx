import { education, experience, languages } from '../data/experience';
import { profile } from '../data/profile';
import { featuredProjects } from '../data/projects';
import { skillGroups } from '../data/skills';
import { ArrowUpRight, Download } from './icons';

/**
 * Print-optimized one-page résumé. Rendered on a white sheet regardless of theme;
 * `window.print()` (or the bundled PDF) produces a clean A4 page.
 */
export default function Resume({ onBack }: { onBack: () => void }) {
  return (
    <div className="resume-page min-h-screen bg-surface-2 py-0 sm:py-8">
      {/* Toolbar (never printed) */}
      <div className="no-print container-page mb-6 flex items-center justify-between">
        <button onClick={onBack} className="btn-ghost h-9 px-4 text-xs">
          ← Back to site
        </button>
        <div className="flex gap-2">
          <a href="/Ratko_Sisovic_CV.pdf" download className="btn-ghost h-9 px-4 text-xs">
            <Download width={14} height={14} />
            Download PDF
          </a>
          <button onClick={() => window.print()} className="btn-primary h-9 px-4 text-xs">
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* The sheet */}
      <div className="resume-sheet mx-auto max-w-[820px] bg-white px-10 py-9 text-[12.5px] leading-snug text-zinc-800 shadow-soft sm:rounded-xl">
        {/* Header */}
        <header className="flex items-end justify-between border-b border-zinc-200 pb-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
              {profile.name}
            </h1>
            <p className="mt-0.5 text-sm text-zinc-600">
              {profile.role} — {profile.tagline}
            </p>
          </div>
          <div className="text-right text-[11px] leading-relaxed text-zinc-600">
            <div>{profile.email}</div>
            <div>{profile.github.replace('https://', '')}</div>
            <div>{profile.linkedin.replace('https://www.', '')}</div>
            <div>{profile.location}</div>
          </div>
        </header>

        {/* Summary */}
        <section className="py-3">
          <p className="text-zinc-700">{profile.about[0]}</p>
        </section>

        <div className="grid grid-cols-3 gap-6">
          {/* Left column */}
          <div className="col-span-2 space-y-4">
            {/* Experience */}
            <section>
              <h2 className="mb-2 border-b border-zinc-200 pb-1 font-display text-xs font-bold uppercase tracking-[0.12em] text-zinc-900">
                Experience
              </h2>
              <div className="space-y-3">
                {experience.map((job) => (
                  <div key={job.role}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-zinc-900">{job.role}</h3>
                      <span className="text-[11px] text-zinc-500">{job.period}</span>
                    </div>
                    <div className="text-[11px] italic text-zinc-600">
                      {job.org} · {job.location}
                    </div>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11.5px] text-zinc-700 marker:text-zinc-400">
                      {job.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="mb-2 border-b border-zinc-200 pb-1 font-display text-xs font-bold uppercase tracking-[0.12em] text-zinc-900">
                Selected projects
              </h2>
              <div className="space-y-2">
                {featuredProjects.slice(0, 4).map((p) => (
                  <div key={p.id}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-zinc-900">
                        {p.title} <span className="font-normal text-zinc-500">— {p.subtitle}</span>
                      </h3>
                    </div>
                    <p className="text-[11.5px] text-zinc-700">{p.blurb}</p>
                    <div className="text-[10.5px] text-zinc-500">{p.tech.join(' · ')}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="col-span-1 space-y-4">
            {/* Skills */}
            <section>
              <h2 className="mb-2 border-b border-zinc-200 pb-1 font-display text-xs font-bold uppercase tracking-[0.12em] text-zinc-900">
                Skills
              </h2>
              <div className="space-y-2">
                {skillGroups.map((g) => (
                  <div key={g.label}>
                    <div className="text-[10.5px] font-semibold uppercase tracking-wide text-zinc-500">
                      {g.label}
                    </div>
                    <div className="text-[11.5px] text-zinc-700">{g.items.join(', ')}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="mb-2 border-b border-zinc-200 pb-1 font-display text-xs font-bold uppercase tracking-[0.12em] text-zinc-900">
                Education
              </h2>
              <h3 className="font-semibold text-zinc-900">{education.degree}</h3>
              <div className="text-[11px] text-zinc-600">{education.school}</div>
              <div className="text-[10.5px] text-zinc-500">{education.period}</div>
            </section>

            {/* Languages */}
            <section>
              <h2 className="mb-2 border-b border-zinc-200 pb-1 font-display text-xs font-bold uppercase tracking-[0.12em] text-zinc-900">
                Languages
              </h2>
              {languages.map((l) => (
                <div key={l.name} className="text-[11.5px] text-zinc-700">
                  <span className="font-medium">{l.name}</span> — {l.level}
                </div>
              ))}
            </section>
          </div>
        </div>

        <footer className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-2 text-[10px] text-zinc-400">
          <span>{profile.education}</span>
          <span className="inline-flex items-center gap-1">
            {profile.siteUrl.replace('https://', '')} <ArrowUpRight width={10} height={10} />
          </span>
        </footer>
      </div>
    </div>
  );
}
