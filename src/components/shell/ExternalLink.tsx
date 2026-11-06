import type { AnchorHTMLAttributes } from 'react';
import NewTab from './NewTab';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & {
  href: string;
  /** Show the visible ↗ after the text. */
  mark?: boolean;
};

/**
 * A link that opens in a new tab: `target`, `rel`, the visually hidden "(opens in a new tab)"
 * and, with `mark`, the visible ↗ (kept on the last word's line by a no-break space, and inside
 * the underline). Every external link on the site is one of these (README, Design system).
 */
export default function ExternalLink({ mark, children, ...rest }: Props): JSX.Element {
  return (
    <a {...rest} target="_blank" rel="noreferrer">
      {children}
      {mark && (
        <span aria-hidden="true">
          {' ↗'}
        </span>
      )}
      <NewTab />
    </a>
  );
}
