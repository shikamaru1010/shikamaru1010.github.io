// Screenshots as <img> attributes. One helper for every page that shows them, so the
// full-size file is always a srcset candidate (with `w` descriptors the browser ignores
// `src`, so a srcset of the smaller copies alone would upscale them on large screens).
import type { Project, ProjectMedia } from '../data/projects';

export function mediaOf(p: Project, device: ProjectMedia['device']): ProjectMedia | undefined {
  return p.media?.find((m) => m.device === device);
}

/** `srcset` from a capture's smaller copies plus the capture itself (undefined when it has no copies). */
export function srcSet(m: ProjectMedia): string | undefined {
  if (!m.variants?.length) return undefined;
  return [...m.variants.map((v) => `${v.src} ${v.width}w`), `${m.src} ${m.width}w`].join(', ');
}
