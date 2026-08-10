import type { Config } from 'tailwindcss';

/**
 * Semantic colors are driven by CSS variables (see src/index.css) so light/dark
 * themes share one set of class names. Values are space-separated RGB channels so
 * Tailwind's <alpha-value> opacity modifiers keep working (e.g. text-fg/70).
 */
const withVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: withVar('--bg'),
        surface: withVar('--surface'),
        'surface-2': withVar('--surface-2'),
        fg: withVar('--fg'),
        muted: withVar('--muted'),
        subtle: withVar('--subtle'),
        border: withVar('--border'),
        accent: withVar('--accent'),
        'accent-fg': withVar('--accent-fg'),
        'accent-soft': withVar('--accent-soft'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        content: '72rem',
      },
      boxShadow: {
        // Theme-aware — plain elevation in light mode, layered glass-highlight +
        // accent glow in dark mode. Values live in src/index.css (:root / .dark).
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
} satisfies Config;
