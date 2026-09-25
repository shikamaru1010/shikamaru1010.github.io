import type { ReactNode } from 'react';

const NBH = '\u2011';

/**
 * The data writes a compound that must not break at its hyphen ('real‑time', 'SPY‑overlap') with
 * U+2011. Golos Text has no glyph for it, so it is shown with an ordinary hyphen inside a
 * no-wrap span (.nw in base.css): the same break rule, in the page's own hyphen.
 */
export function keepCompounds(text: string): ReactNode {
  if (!text.includes(NBH)) return text;
  return text.split(/(\S*\u2011\S*)/).map((part, i) =>
    part.includes(NBH) ? (
      <span key={i} className="nw">
        {part.replaceAll(NBH, '-')}
      </span>
    ) : (
      part
    ),
  );
}
