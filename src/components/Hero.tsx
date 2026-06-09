import { motion, useReducedMotion } from 'framer-motion';
import { profile } from '../data/profile';
import { ArrowDown, Download, Mail } from './icons';

export default function Hero({ onOpenResume }: { onOpenResume: () => void }) {
  const reduce = useReducedMotion();
  const item = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="top" className="ambient relative overflow-hidden">
      {/* faint grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--border)) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(70% 60% at 50% 30%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 30%, #000 40%, transparent 100%)',
        }}
      />

      <div className="container-page relative pb-20 pt-16 sm:pt-24">
        <motion.div
          {...item(0)}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            {!reduce && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {profile.status}
        </motion.div>

        <motion.h1
          {...item(0.06)}
          className="mt-6 max-w-4xl text-5xl font-bold leading-[0.98] tracking-tight sm:text-7xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p {...item(0.12)} className="mt-4 text-xl text-muted sm:text-2xl">
          {profile.role} <span className="text-subtle">·</span>{' '}
          <span className="text-fg/80">{profile.tagline}</span>
        </motion.p>

        <motion.p {...item(0.18)} className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">
          {profile.about[0]}
        </motion.p>

        <motion.div {...item(0.24)} className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#projects" className="btn-primary">
            See projects
            <ArrowDown width={16} height={16} />
          </a>
          <button onClick={onOpenResume} className="btn-ghost">
            <Download width={16} height={16} />
            Résumé / CV
          </button>
          <a
            href={`mailto:${profile.email}?subject=${encodeURIComponent('Hello Ratko')}`}
            className="btn-ghost"
          >
            <Mail width={16} height={16} />
            Email me
          </a>
        </motion.div>

        <motion.div
          {...item(0.3)}
          className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-subtle"
        >
          <span>{profile.location}</span>
          <span className="text-border">|</span>
          <span>{profile.education}</span>
        </motion.div>
      </div>
    </section>
  );
}
