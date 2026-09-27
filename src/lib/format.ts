// Small, pure text helpers shared by every section. Month names are constants
// (no Intl), so Node (tests, scripts) and browsers print the same thing.
import updated from '../data/updated.json';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/**
 * The ISO date the content was last stamped: "Updated <date>" on the CV page and the PDF, and
 * the sitemap's <lastmod>. `npm run pdf` writes it (src/data/updated.json) when it regenerates
 * the CV, so it moves with the content, not with the daily rebuild.
 */
export const UPDATED: string = updated.date;

/** The year of that date: the © at the foot of every site page. */
export const updatedYear = Number(UPDATED.slice(0, 4));

/** Replaces `{key}` in a template with `vars[key]`. Unknown keys are left as they are. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : whole,
  );
}

export function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** 1 → '1st', 2 → '2nd', 4 → '4th', 11 → '11th', 22 → '22nd'. */
export function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  const suffix = ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th';
  return `${n}${suffix}`;
}

function parseYearMonth(value: string | number): { year: number; month?: number } {
  const [y, m] = String(value).split('-');
  const year = Number(y);
  const month = m === undefined ? undefined : Number(m);
  return { year, month };
}

/** One point in time, by month where the data has one: '2026-07' → 'Jul 2026', '2023' → '2023'. */
export function shortPoint(value: string | number): string {
  const { year, month } = parseYearMonth(value);
  return month ? `${MONTHS[month - 1].slice(0, 3)} ${year}` : String(year);
}

/**
 * A period with an en dash: ('2026-07') → 'Jul 2026–now', ('2023') → '2023–now',
 * (2023, 2027) → '2023–2027'.
 */
export function formatPeriod(start: string | number, end?: string | number): string {
  return `${shortPoint(start)}–${end === undefined || end === '' ? 'now' : shortPoint(end)}`;
}

/** ['a', 'b', 'c'] → 'a, b and c'. */
export function listJoin(items: readonly string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** A stack as comma-separated text; a version number never wraps away from its name ('Tailwind 4'). */
export function stackLine(tech: readonly string[]): string {
  return tech.map((t) => t.replace(/ (?=\d)/g, '\u00a0')).join(', ');
}

/** 'https://www.rostiljsisko.rs/sr' → 'rostiljsisko.rs'. */
export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
