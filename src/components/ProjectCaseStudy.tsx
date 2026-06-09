import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import type { Project } from '../data/projects';
import { ArrowUpRight, Check } from './icons';
import Reveal from './Reveal';

/**
 * Per-project case study — a distinct "ops console / engineering dossier" world,
 * deliberately unlike the editorial CV. Driven by the URL hash (`#project/<id>`),
 * so it's linkable. Every section is optional and renders only when present.
 * Respects light/dark tokens and prefers-reduced-motion.
 */
export default function ProjectCaseStudy({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  const cs = project.caseStudy;
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.id]);

  // Guarded by App routing, but keep the component safe on its own.
  if (!cs) return null;

  const rise = reduce
    ? {}
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="cs-canvas min-h-screen">
      <div className="cs-grain" aria-hidden />

      {/* Console top bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="container-page flex h-12 items-center justify-between">
          <button
            onClick={onBack}
            className="cs-label flex items-center gap-2 text-muted transition-colors hover:text-fg"
          >
            ← BACK
          </button>
          <div className="cs-label hidden text-subtle sm:block">
            ~ / projects / {project.id}
          </div>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="cs-label flex items-center gap-1.5 text-accent transition-opacity hover:opacity-80"
            >
              LIVE
              <ArrowUpRight width={12} height={12} />
            </a>
          ) : (
            <span className="cs-label text-subtle">CASE FILE</span>
          )}
        </div>
      </div>

      <div className="container-page relative z-10 pb-28">
        {/* Dossier header */}
        <motion.header
          {...rise}
          transition={{ duration: 0.55, ease }}
          className="pt-12 sm:pt-16"
        >
          <div className="cs-label flex items-center gap-2.5 text-accent">
            <span className="relative flex h-2 w-2">
              {!reduce && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            CASE FILE — 01
          </div>

          <h1 className="mt-4 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="mt-3 max-w-2xl font-mono text-sm text-muted sm:text-base">
            {project.subtitle}
          </p>

          {/* Metadata readout */}
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            <Meta k="Status" v={project.status} live />
            <Meta k="Timeline" v={project.year} />
            <Meta k="Domain" v={project.categories[0]} />
            <Meta k="Stack" v={`${project.tech.length} technologies`} />
          </dl>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-fg/90">{cs.intro}</p>
        </motion.header>

        {/* Metric strip */}
        {cs.metrics && cs.metrics.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cs.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                {...rise}
                transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.15 + i * 0.08 }}
                className="cs-panel p-5"
              >
                <div className="font-display text-3xl font-bold tracking-tight text-accent sm:text-4xl">
                  {m.value}
                </div>
                <div className="cs-label mt-1.5 text-muted">{m.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Architecture & structure — system modules */}
        {cs.architecture && cs.architecture.length > 0 && (
          <Section index="02" title="Architecture & structure" caption="System modules">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cs.architecture.map((node, i) => (
                <Reveal key={node.title} delay={Math.min(i * 0.06, 0.3)} className="h-full">
                  <div className="cs-panel flex h-full flex-col">
                    <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
                      <span className="font-mono text-[13px] font-medium text-fg">
                        {node.title}
                      </span>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-sm leading-relaxed text-muted">{node.detail}</p>
                      {node.tech && node.tech.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {node.tech.map((t) => (
                            <span key={t} className="cs-port">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        {/* How it works — execution pipeline */}
        {cs.workflow && cs.workflow.length > 0 && (
          <Section index="03" title="How it works" caption="Execution pipeline">
            <div className="cs-panel p-5 sm:p-7">
              <ol>
                {cs.workflow.map((step, i) => {
                  const isLast = i === cs.workflow!.length - 1;
                  return (
                    <Reveal key={i} delay={Math.min(i * 0.05, 0.25)}>
                      <li className="relative flex gap-4 pb-7 last:pb-0">
                        {!isLast && (
                          <span
                            className="absolute left-[15px] top-9 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-accent/50 to-border"
                            aria-hidden
                          />
                        )}
                        <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent/40 bg-bg font-mono text-xs text-accent">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="pt-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="cs-actor">{step.actor}</span>
                            <h3 className="font-medium text-fg">{step.title}</h3>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.detail}</p>
                        </div>
                      </li>
                    </Reveal>
                  );
                })}
              </ol>
            </div>
          </Section>
        )}

        {/* Decisions & guardrails */}
        {((cs.decisions && cs.decisions.length > 0) ||
          (cs.guardrails && cs.guardrails.length > 0)) && (
          <Section index="04" title="Decisions & guardrails" caption="Engineering choices">
            <div className="grid gap-3 md:grid-cols-2">
              {cs.decisions && cs.decisions.length > 0 && (
                <ListPanel label="Decisions" items={cs.decisions} marker="▸" />
              )}
              {cs.guardrails && cs.guardrails.length > 0 && (
                <ListPanel label="Guardrails" items={cs.guardrails} marker="◆" accent />
              )}
            </div>
          </Section>
        )}

        {/* Challenges */}
        {cs.challenges && cs.challenges.length > 0 && (
          <Section index="05" title="Challenges" caption="What was hard">
            <ListPanel items={cs.challenges} marker="↳" />
          </Section>
        )}

        {/* Outcomes */}
        {cs.outcomes && cs.outcomes.length > 0 && (
          <Section index="06" title="Outcomes" caption="Results">
            <div className="cs-panel p-5 sm:p-7">
              <ul className="space-y-3">
                {cs.outcomes.map((o, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-fg/90">
                    <Check width={18} height={18} className="mt-0.5 shrink-0 text-accent" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        )}

        {/* Privacy / restricted note */}
        {cs.privacyNote && (
          <div className="mt-12 flex flex-col gap-2 rounded-xl border border-dashed border-border bg-surface-2/60 p-4 sm:flex-row sm:items-center sm:gap-4">
            <span className="cs-label shrink-0 text-subtle">[ Private ]</span>
            <p className="text-xs leading-relaxed text-muted">{cs.privacyNote}</p>
          </div>
        )}

        <div className="mt-12 border-t border-border pt-8">
          <button onClick={onBack} className="btn-ghost h-10 px-5 text-sm">
            ← Back to portfolio
          </button>
        </div>
      </div>
    </div>
  );
}

function Meta({ k, v, live }: { k: string; v: string; live?: boolean }) {
  return (
    <div className="bg-surface px-4 py-3">
      <dt className="cs-label text-subtle">{k}</dt>
      <dd className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-fg">
        {live && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />}
        {v}
      </dd>
    </div>
  );
}

function Section({
  index,
  title,
  caption,
  children,
}: {
  index: string;
  title: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mb-6 flex items-baseline gap-4 border-b border-border pb-3">
        <span className="font-mono text-sm font-medium text-accent">{index}</span>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {caption && <span className="cs-label ml-auto hidden text-subtle sm:block">{caption}</span>}
      </div>
      {children}
    </section>
  );
}

function ListPanel({
  label,
  items,
  marker = '▸',
  accent,
}: {
  label?: string;
  items: string[];
  marker?: string;
  accent?: boolean;
}) {
  return (
    <div className="cs-panel h-full p-5 sm:p-6">
      {label && <div className="cs-label mb-4 text-subtle">{label}</div>}
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
            <span
              className={`mt-px shrink-0 font-mono ${accent ? 'text-accent' : 'text-subtle'}`}
              aria-hidden
            >
              {marker}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
