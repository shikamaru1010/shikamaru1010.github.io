import type { CSSProperties } from 'react';
import type { SystemFigure } from '../../../data/projects';
import { site } from '../../../data/site';
import { fill } from '../../../lib/format';
import './figures.css';

type AxisFigure = Extract<SystemFigure, { kind: 'status-axis' }>;

type Segment = { key: 'active' | 'paused' | 'aband'; from: number; start: number; span: number; label: string; note: string };

/** The three status bands, measured in page-grid columns (1 column = `daysPerColumn` days). */
function axisSegments(figure: AxisFigure): { columns: number; segments: Segment[] } {
  const { daysPerColumn: per, maxDays, thresholds } = figure;
  const t = site.work.axis;
  const columns = Math.round(maxDays / per);
  const activeSpan = Math.round(thresholds.active / per);
  const pausedSpan = Math.round((thresholds.paused - thresholds.active) / per);
  return {
    columns,
    segments: [
      { key: 'active', from: 0, start: 1, span: activeSpan, label: t.active, note: figure.activeNote },
      {
        key: 'paused',
        from: thresholds.active,
        start: 1 + activeSpan,
        span: pausedSpan,
        label: t.paused,
        note: fill(t.pausedNote, { from: thresholds.active + 1, to: thresholds.paused }),
      },
      {
        key: 'aband',
        from: thresholds.paused,
        start: 1 + activeSpan + pausedSpan,
        span: columns - activeSpan - pausedSpan,
        label: t.abandoned,
        note: fill(t.abandonedNote, { days: thresholds.paused }),
      },
    ],
  };
}

/**
 * dev-dashboard's status rule drawn to scale: the page's twelve columns are the time axis, one
 * column per `daysPerColumn` days, with the real thresholds from the data (SPEC §6.1.2).
 */
export default function StatusAxis({ figure }: { figure: AxisFigure }): JSX.Element {
  const { columns, segments } = axisSegments(figure);
  return (
    <figure className="fig">
      <figcaption className="fig-cap label">
        <span>{figure.caption}</span>
        <span>
          <span className="d-only">{figure.scaleNote}</span>
          <span className="m-only">{figure.scaleNoteNarrow}</span>
        </span>
      </figcaption>
      <div className="axis grid" style={{ '--axis-cols': columns } as CSSProperties}>
        <div className="ticks" aria-hidden="true">
          {Array.from({ length: columns }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        {segments.map((s) => (
          <div key={s.key} className={`seg seg-${s.key}`} style={{ '--seg': `${s.start} / span ${s.span}` } as CSSProperties}>
            <b className="num">{s.from}</b>
            <i className="bar" aria-hidden="true" />
            <span className="st">{s.label}</span>
            <span className="note label">{s.note}</span>
          </div>
        ))}
        <span className="end label tnum" aria-hidden="true">
          {fill(site.work.axis.end, { days: figure.maxDays })}
        </span>
      </div>
    </figure>
  );
}
