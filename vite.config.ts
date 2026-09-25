import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// If deploying to GitHub Pages under a subpath, set `base: '/<repo-name>/'`.
export default defineConfig({
  plugins: [react()],
  // The colophon's "Updated YYYY-MM-DD" (and the © year) come from the build date.
  define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) },
});
