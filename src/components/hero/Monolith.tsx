import { Fragment, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import './monolith.css';

type Props = {
  /** The h1's id: the anchor each mode's tree exposes ('name', 'p-name'). */
  nameId: string;
  name: string;
  /** The quiet lines under the name, in ink-2. */
  lines: ReactNode[];
  /** The one sentence, at --s4. */
  lede: string;
  /** The line whose baseline is the circle's bottom edge (View CV). */
  action?: ReactNode;
  /** What the circle holds: the code loop (Professional) or the contour drawing (Personal). */
  disc: ReactNode;
  /** The circle is decoration (the code loop): hidden from screen readers. */
  decorative?: boolean;
};

/**
 * Where the entrance is: held before the fonts are in, the sentence split into words to find
 * its lines, playing, then at rest on the same line nodes (see the second effect).
 */
type Enter =
  | { phase: 'hold' }
  | { phase: 'measure' }
  | { phase: 'play'; lines: string[] }
  | { phase: 'rest'; lines: string[] };

const START = 160; // the first line starts while the circle is still low
const WIPE = 480; // one line's wipe
const FADE = 320; // View CV
const END = 900; // everything is in by here, then nothing moves

/** One entrance per page load, for the tree that is on screen; a return from the CV is already at rest. */
let entered = false;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * The hero both modes share (the owner's "Monolith"): a small tombstone top left (name,
 * role, now), one sentence on columns 5–11, and one circle, two columns wide, ending on
 * column 4. The circle's top edge is the sentence's cap line and its bottom edge the
 * action's baseline (monolith.css). Both trees render it with the same geometry, so a mode
 * switch keeps the circle in place and the wipe only swaps what is inside it.
 *
 * The entrance (motion allowed, first load only): the circle opens from a hairline on its
 * baseline, the sentence is wiped in line by line, the action fades in, all within 900 ms;
 * after it the sentence stays on its line nodes until its column changes width. Render stays
 * pure (the server render and reduced motion get the finished hero); the layout effect holds
 * the hero before its first paint, so nothing is seen twice.
 */
export default function Monolith({ nameId, name, lines, lede, action, disc, decorative }: Props): JSX.Element {
  const section = useRef<HTMLElement>(null);
  const sentence = useRef<HTMLParagraphElement>(null);
  const [enter, setEnter] = useState<Enter | null>(null);
  /** The entrance ran to its end (so an unmount after it does not ask for another). */
  const finished = useRef(false);

  // 1. Before the first paint: hold, then wait for Golos (300 ms at most) so the lines are the final ones.
  useLayoutEffect(() => {
    const el = section.current;
    if (entered || !el || !el.getClientRects().length) return; // the other mode's tree is display: none
    entered = true;
    if (
      document.visibilityState !== 'visible' ||
      !window.matchMedia?.('(prefers-reduced-motion: no-preference)').matches
    ) {
      return;
    }
    let live = true;
    finished.current = false;
    setEnter({ phase: 'hold' });
    const fonts = document.fonts?.load
      ? Promise.all([
          document.fonts.load(`400 36px "Golos Text"`, lede),
          document.fonts.load(`600 16px "Golos Text"`, name),
        ])
      : Promise.resolve();
    Promise.race([fonts.catch(() => {}), sleep(300)]).then(() => {
      if (live) setEnter({ phase: 'measure' });
    });
    return () => {
      live = false;
      if (!finished.current) entered = false; // unmounted mid-entrance (StrictMode, or an early click to the CV)
    };
  }, [lede, name]);

  // 2. The sentence is in words: group them by their rendered line and play; at the end, rest on the
  // same line nodes. Swapping them for plain text there would paint the sentence as a new, larger
  // text at ~1 s, and the browser would report that as the page's LCP. The lines go back to plain
  // text only when they could be wrong: the column changes width, or a font arrives late.
  useLayoutEffect(() => {
    if (enter?.phase === 'play') {
      const { lines } = enter;
      const t = setTimeout(() => {
        finished.current = true;
        setEnter({ phase: 'rest', lines });
      }, END + 80);
      return () => clearTimeout(t);
    }
    if (enter?.phase === 'rest') {
      const col = sentence.current?.parentElement;
      if (!col) return;
      const plain = () => setEnter(null);
      const w0 = col.getBoundingClientRect().width;
      const ro =
        typeof ResizeObserver === 'function'
          ? new ResizeObserver(() => {
              if (Math.abs(col.getBoundingClientRect().width - w0) > 0.5) plain();
            })
          : null;
      ro?.observe(col);
      document.fonts?.addEventListener?.('loadingdone', plain);
      return () => {
        ro?.disconnect();
        document.fonts?.removeEventListener?.('loadingdone', plain);
      };
    }
    if (enter?.phase !== 'measure' || !sentence.current) return;
    const rows: string[][] = [];
    let top: number | null = null;
    sentence.current.querySelectorAll<HTMLElement>('[data-w]').forEach((w) => {
      if (top === null || Math.abs(w.offsetTop - top) > 2) {
        rows.push([]);
        top = w.offsetTop;
      }
      rows[rows.length - 1].push(w.textContent ?? '');
    });
    setEnter({ phase: 'play', lines: rows.map((r) => r.join(' ')) });
  }, [enter]);

  let body: ReactNode = lede;
  let actStyle: CSSProperties | undefined;
  if (enter?.phase === 'measure') {
    body = lede.split(/\s+/).map((w, i) => (
      <Fragment key={i}>
        {i > 0 && ' '}
        <span data-w="">{w}</span>
      </Fragment>
    ));
  } else if (enter?.phase === 'play' || enter?.phase === 'rest') {
    const play = enter.phase === 'play';
    const n = enter.lines.length;
    const step = Math.min(80, (END - WIPE - START) / n);
    body = enter.lines.map((l, i) => (
      <Fragment key={i}>
        {i > 0 && ' '}
        <span className="mono-line">
          <span className="mono-ink" style={play ? { animationDelay: `${Math.round(START + i * step)}ms` } : undefined}>
            {l}
          </span>
        </span>
      </Fragment>
    ));
    if (play) actStyle = { animationDelay: `${Math.round(Math.min(START + n * step, END - FADE))}ms` };
  }

  const state =
    enter?.phase === 'play' ? ' is-play' : enter?.phase === 'hold' || enter?.phase === 'measure' ? ' is-hold' : '';

  return (
    <section ref={section} className={`mono wrap${state}`} aria-labelledby={nameId}>
      <div className="mono-grid grid">
        <div className="mono-id">
          <h1 className="mono-name" id={nameId}>
            {name}
          </h1>
          {lines.map((l, i) => (
            <p key={i} className="mono-sub">
              {l}
            </p>
          ))}
        </div>

        <div className="mono-disc" aria-hidden={decorative || undefined}>
          {disc}
        </div>

        <div className="mono-body">
          <p className="mono-lede" ref={sentence}>
            {body}
          </p>
          {action && (
            <p className="mono-act" style={actStyle}>
              {action}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
