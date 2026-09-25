import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// If deploying to GitHub Pages under a subpath, set `base: '/<repo-name>/'`.
export default defineConfig({
  plugins: [react()],
  // The hero's "today" line (src/lib/timeline.ts) moves with the daily rebuild.
  define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) },
});
