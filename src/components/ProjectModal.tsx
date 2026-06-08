import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { Project } from '../data/projects';
import { ArrowUpRight, Check, Close } from './icons';

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prevFocus?.focus();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="no-print fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-surface p-6 shadow-lift sm:rounded-3xl sm:p-8"
            initial={reduce ? {} : { y: 24, opacity: 0, scale: 0.98 }}
            animate={reduce ? {} : { y: 0, opacity: 1, scale: 1 }}
            exit={reduce ? {} : { y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          >
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-fg"
            >
              <Close width={17} height={17} />
            </button>

            <div className="pr-10">
              <div className="font-mono text-xs text-accent">{project.year} · {project.status}</div>
              <h3 id="modal-title" className="mt-1 font-display text-2xl font-bold tracking-tight">
                {project.title}
              </h3>
              <p className="text-muted">{project.subtitle}</p>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-fg/90">{project.blurb}</p>

            <div className="mt-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                Highlights
              </div>
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <Check width={16} height={16} className="mt-0.5 shrink-0 text-accent" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {project.note && (
              <p className="mt-5 rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
                {project.note}
              </p>
            )}

            {project.links && project.links.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost h-9 px-4 text-xs"
                  >
                    {l.label}
                    <ArrowUpRight width={14} height={14} />
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
