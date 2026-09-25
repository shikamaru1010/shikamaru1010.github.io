import type { ReactNode } from 'react';

const NBH = '‑';

/** A word with a hyphen inside ('customer-facing', 'client-server', 'real‑time'), as one capture. */
const COMPOUND = /([\p{L}\p{N}]+(?:[-‑][\p{L}\p{N}]+)+)/u;

/**
 * Running text never breaks a compound at its hyphen: each hyphenated word goes into a no-wrap
 * span (.nw in base.css), so the line breaks before or after it. The data may still write the
 * hyphen as U+2011 ('SPY‑overlap'); Golos Text has no glyph for it, so it is printed as an
 * ordinary hyphen inside the span: the same break rule, in the page's own hyphen.
 */
export function keepCompounds(text: string): ReactNode {
  const parts = text.split(COMPOUND);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="nw">
        {part.replaceAll(NBH, '-')}
      </span>
    ) : (
      part
    ),
  );
}
