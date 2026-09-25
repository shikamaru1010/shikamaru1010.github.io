// The Professional hero's time axis: whole years from the first start in the data,
// measured in months, with today taken from the build date.

/** The ISO date of the build (Vite `define`). Falls back to today under plain Node. */
export const BUILD_DATE: string =
  typeof __BUILD_DATE__ === 'string' ? __BUILD_DATE__ : new Date().toISOString().slice(0, 10);

function yearOf(point: string | number): number {
  return Number(String(point).slice(0, 4));
}

/** Months from 1 January of `origin` to the start of a 'YYYY' or 'YYYY-MM' point: ('2026-07', 2023) → 42. */
export function monthsFrom(point: string | number, origin: number): number {
  const [y, m] = String(point).split('-').map(Number);
  return (y - origin) * 12 + (m ? m - 1 : 0);
}

/** Months from 1 January of `origin` to an ISO date, the day as a fraction of its month: ('2026-09-25', 2023) → 44.8. */
export function monthsTo(iso: string, origin: number): number {
  const [y, m, d] = iso.split('-').map(Number);
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return (y - origin) * 12 + (m - 1) + (d - 1) / days;
}

export type Axis = {
  /** The first year on the axis: the earliest start. */
  first: number;
  /** One tick per year, first to last. */
  years: number[];
  /** The axis length in months (whole years). */
  span: number;
  /** Today in months from 1 January of `first`, clamped to [0, span]. */
  today: number;
};

/**
 * Whole years from the earliest start to the later of `end` and the year after today,
 * so today always has room to its right.
 */
export function careerAxis(starts: ReadonlyArray<string | number>, end: number, today: string): Axis {
  const first = Math.min(...starts.map(yearOf));
  const last = Math.max(end, yearOf(today) + 1);
  const years = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  const span = years.length * 12;
  const t = Math.min(Math.max(monthsTo(today, first), 0), span);
  return { first, years, span, today: Math.round(t * 100) / 100 };
}
