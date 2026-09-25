import type { CSSProperties } from 'react';
import { personal } from '../../data/personal';
import { fill, formatDate, monthYear } from '../../lib/format';
import './worklog.css';

export type WorklogData = { asOf: string; total: number; days: Record<string, number> };

export type WorklogMonth = {
  /** 'YYYY-MM' */
  key: string;
  /** Days drawn: the whole month, or up to `asOf` in its last month. */
  slots: number;
  /** Entries per day slot, index 0 = the 1st. */
  counts: number[];
  entries: number;
  days: number;
};

export type WorklogSummary = {
  asOf: string;
  total: number;
  dayCount: number;
  first?: string;
  busiest?: { day: string; count: number };
  months: WorklogMonth[];
};

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (iso: string) => iso.split('-').map(Number) as [number, number, number];
const daysIn = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

/** A date never breaks across lines ('9 June 2026'). */
export function keepTogether(s: string): string {
  return s.replace(/ /g, '\u00a0');
}

/** The templates say "entries" and "days"; a count of 1 takes the singular from personal.log.singular. */
export function plural(s: string): string {
  return Object.entries(personal.log.singular).reduce(
    (out, [many, one]) => out.replace(new RegExp(`\\b1 ${many}\\b`, 'g'), `1 ${one}`),
    s,
  );
}

/** Everything the log section shows, derived from worklog.json alone (pure; no Intl, no time zone). */
export function summarizeWorklog(log: WorklogData): WorklogSummary {
  const keys = Object.keys(log.days)
    .filter((k) => log.days[k] > 0 && k <= log.asOf)
    .sort();
  const summary: WorklogSummary = { asOf: log.asOf, total: log.total, dayCount: keys.length, months: [] };
  if (!keys.length) return summary;

  summary.first = keys[0];
  for (const k of keys) {
    // strict ">" keeps the earliest day on a tie
    if (!summary.busiest || log.days[k] > summary.busiest.count) summary.busiest = { day: k, count: log.days[k] };
  }

  const [endY, endM, endD] = ymd(log.asOf);
  let [y, m] = ymd(keys[0]);
  while (y < endY || (y === endY && m <= endM)) {
    const key = `${y}-${pad(m)}`;
    const slots = y === endY && m === endM ? endD : daysIn(y, m);
    const counts = Array.from({ length: slots }, (_, i) => log.days[`${key}-${pad(i + 1)}`] ?? 0);
    summary.months.push({
      key,
      slots,
      counts,
      entries: counts.reduce((a, b) => a + b, 0),
      days: counts.filter(Boolean).length,
    });
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return summary;
}

/** The month name on the axis; the year is added on the first month and wherever it changes. */
function axisName(key: string, index: number): string {
  const full = monthYear(key);
  return index === 0 || key.endsWith('-01') ? full : full.replace(/\s\d{4}$/, '');
}

/**
 * The work log drawn on the grid: one continuous day axis from
 * the 1st of the first month to the "as of" date, one square per entry, stacked
 * bottom-up on its day; the busiest day in the accent. The marks are hidden
 * from assistive tech, which gets the month-by-month numbers in the caption
 * (the headline above the figure already says the totals).
 */
export default function WorkLogFigure({ summary }: { summary: WorklogSummary }): JSX.Element | null {
  const { months, busiest, first } = summary;
  if (!summary.total || !busiest || !first) return null;

  const busiestText = plural(fill(personal.log.busiest, { count: busiest.count, date: keepTogether(formatDate(busiest.day)) }));

  return (
    <figure className="wl">
      <figcaption className="sr-only">
        <ul>
          {months.map((mo) => (
            <li key={mo.key}>
              {plural(fill(personal.log.monthSummary, { month: monthYear(mo.key), entries: mo.entries, days: mo.days }))}
            </li>
          ))}
        </ul>
      </figcaption>

      <ol
        className="wl-months"
        aria-hidden="true"
        style={{ '--wl-cols': months.map((mo) => `${mo.slots}fr`).join(' ') } as CSSProperties}
      >
        {months.map((mo, i) => (
          <li key={mo.key} className="wl-month" style={{ '--slots': String(mo.slots) } as CSSProperties}>
            <ol className="wl-days">
              {mo.counts.map((count, d) => (
                <li key={d} className={`${mo.key}-${pad(d + 1)}` === busiest.day ? 'wl-top' : undefined}>
                  {Array.from({ length: count }, (_, k) => (
                    <i key={k} />
                  ))}
                </li>
              ))}
            </ol>
            <p className="wl-axis">
              <span className="wl-mname">{axisName(mo.key, i)}</span>
            </p>
          </li>
        ))}
      </ol>

      <p className="wl-legend label">
        <span className="wl-key" aria-hidden="true">
          <i className="wl-swatch" />
          {personal.log.oneEntry}
        </span>
        <span className="wl-key">
          <i className="wl-swatch wl-swatch-top" aria-hidden="true" />
          <span className="tnum">{busiestText}</span>
        </span>
      </p>
    </figure>
  );
}
