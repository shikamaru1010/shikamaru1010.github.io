import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
// If deploying to GitHub Pages under a subpath, set `base: '/<repo-name>/'`.
export default defineConfig({
    plugins: [react()],
});
