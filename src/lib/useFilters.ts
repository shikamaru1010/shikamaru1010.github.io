import { useEffect, useMemo, useState } from 'react';
import type { Category, Project } from '../data/projects';

/** Debounce any fast-changing value (used for the search input). */
function useDebounced<T>(value: T, delay = 180): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function matchesSearch(project: Project, q: string): boolean {
  if (!q) return true;
  const haystack = [
    project.title,
    project.subtitle,
    project.blurb,
    project.note ?? '',
    project.tech.join(' '),
    project.highlights.join(' '),
    project.categories.join(' '),
  ]
    .join(' ')
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function useProjectFilters(projects: Project[]) {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<Category[]>([]);
  const debouncedSearch = useDebounced(search);

  const toggleCategory = (cat: Category) =>
    setActive((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));

  const clear = () => {
    setSearch('');
    setActive([]);
  };

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          matchesSearch(p, debouncedSearch) &&
          (active.length === 0 || active.some((c) => p.categories.includes(c))),
      ),
    [projects, debouncedSearch, active],
  );

  const isFiltering = active.length > 0 || debouncedSearch.trim().length > 0;

  return { search, setSearch, active, toggleCategory, clear, filtered, isFiltering };
}
