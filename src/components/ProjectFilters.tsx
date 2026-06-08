import { CATEGORIES, type Category } from '../data/projects';
import { Close, Search } from './icons';

export default function ProjectFilters({
  search,
  setSearch,
  active,
  toggleCategory,
  clear,
  isFiltering,
  resultCount,
  totalCount,
}: {
  search: string;
  setSearch: (v: string) => void;
  active: Category[];
  toggleCategory: (c: Category) => void;
  clear: () => void;
  isFiltering: boolean;
  resultCount: number;
  totalCount: number;
}) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            width={16}
            height={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, tech, keywords…"
            aria-label="Search projects"
            className="h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none"
          />
        </div>
        <div aria-live="polite" className="font-mono text-xs text-subtle sm:w-40 sm:text-right">
          Showing {resultCount} of {totalCount}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const on = active.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              aria-pressed={on}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                on
                  ? 'border-accent bg-accent text-accent-fg'
                  : 'border-border bg-surface text-muted hover:text-fg hover:border-subtle'
              }`}
            >
              {cat}
            </button>
          );
        })}

        {isFiltering && (
          <button
            onClick={clear}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
          >
            <Close width={13} height={13} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
