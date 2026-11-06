// Writes the per-page document state: <title>, <meta name="theme-color"> and
// <html data-route> (which gates the Personal palette in tokens.css).
import { metaFor, type Mode } from './mode';
import type { Route } from './route';

export function applyDocumentMeta(route: Route, mode: Mode, projectTitle?: string): void {
  if (typeof document === 'undefined') return;
  const meta = metaFor(route, mode, projectTitle);
  if (document.title !== meta.title) document.title = meta.title;
  const tag = document.querySelector('meta[name="theme-color"]');
  if (tag && tag.getAttribute('content') !== meta.themeColor) tag.setAttribute('content', meta.themeColor);
  if (document.documentElement.dataset.route !== meta.palette) document.documentElement.dataset.route = meta.palette;
}
