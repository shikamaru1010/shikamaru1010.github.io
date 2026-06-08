import { useTheme } from '../lib/useTheme';
import { Moon, Sun } from './icons';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-fg hover:bg-surface-2"
    >
      {isDark ? <Sun width={17} height={17} /> : <Moon width={17} height={17} />}
    </button>
  );
}
