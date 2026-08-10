import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRef, type MouseEvent } from 'react';
import { useTheme } from '../lib/useTheme';
import { Moon, Sun } from './icons';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const reduce = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement>(null);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Mouse clicks carry a real point to expand the reveal from; keyboard
    // activation (clientX/Y both 0) falls back to the button's own center.
    if (e.clientX || e.clientY) {
      toggle({ x: e.clientX, y: e.clientY });
      return;
    }
    const rect = btnRef.current?.getBoundingClientRect();
    toggle(rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined);
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-border bg-surface text-muted transition-colors hover:text-fg hover:bg-surface-2"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          className="grid place-items-center"
          initial={reduce ? undefined : { rotate: -70, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={reduce ? undefined : { rotate: 70, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {isDark ? <Sun width={17} height={17} /> : <Moon width={17} height={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
