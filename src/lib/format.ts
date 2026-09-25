// Small, pure text helpers shared by every section. Month names are constants
// (no Intl), so Node (tests, scripts) and browsers print the same thing.

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

const NUMBER_WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
] as const;

/** The ISO date of the build (Vite `define`). Falls back to today under plain Node. */
export const BUILD_DATE: string =
  typeof __BUILD_DATE__ === 'string' ? __BUILD_DATE__ : new Date().toISOString().slice(0, 10);

/** Year of the build: "years of freelance work" and the © line. */
export const buildYear = Number(BUILD_DATE.slice(0, 4));

/** Replaces `{key}` in a template with `vars[key]`. Unknown keys are left as they are. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : whole,
  );
}

/** 0–20 as a word ('four'); anything else as digits. */
export function numberWord(n: number): string {
  return Number.isInteger(n) && n >= 0 && n < NUMBER_WORDS.length ? NUMBER_WORDS[n] : String(n);
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

function shortPoint(value: string | number): string {
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

/** '2026-06-09' → '9 June 2026'. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** '2026-09-25' → 'September 2026'; '2026-07' → 'July 2026'. */
export function monthYear(iso: string): string {
  const { year, month } = parseYearMonth(iso);
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
}

export type Years = { start: number; end: number | 'now' };

/** '2024–now' → { start: 2024, end: 'now' }; '2024' → { start: 2024, end: 2024 }. */
export function parseYears(value: string): Years {
  const [a, b] = value.split(/\s*[–-]\s*/);
  const start = Number(a);
  if (b === undefined) return { start, end: start };
  return { start, end: /^now$/i.test(b) ? 'now' : Number(b) };
}

/** The span of a set of projects' years: '2023–now', '2024–2025', or a single year. */
export function yearRange(items: ReadonlyArray<{ year: string }>): string {
  if (!items.length) return '';
  const spans = items.map((p) => parseYears(p.year));
  const start = Math.min(...spans.map((s) => s.start));
  const open = spans.some((s) => s.end === 'now');
  if (open) return `${start}–now`;
  const end = Math.max(...spans.map((s) => s.end as number));
  return end === start ? String(start) : `${start}–${end}`;
}

/** ['a', 'b', 'c'] → 'a, b and c'. */
export function listJoin(items: readonly string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** 'https://www.rostiljsisko.rs/sr' → 'rostiljsisko.rs'. */
export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
