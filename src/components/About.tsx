import { profile } from '../data/profile';
import { principles } from '../data/skills';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function About() {
  return (
    <section id="about" className="container-page scroll-mt-20 py-20">
      <SectionHeading eyebrow="About" title="How I think about building software" />

      <div className="grid gap-12 lg:grid-cols-5">
        <Reveal className="space-y-4 text-[15px] leading-relaxed text-muted lg:col-span-3">
          {profile.about.map((p, i) => (
            <p key={i} className={i === 0 ? 'text-fg/90' : undefined}>
              {p}
            </p>
          ))}
        </Reveal>

        <div className="space-y-3 lg:col-span-2">
          {principles.map((pr, i) => (
            <Reveal key={pr.title} delay={i * 0.08}>
              <div className="card p-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-sm font-semibold">{pr.title}</h3>
                </div>
                <p className="mt-2 pl-8 text-sm leading-relaxed text-muted">{pr.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
