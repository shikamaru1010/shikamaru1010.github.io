import type { MouseEvent } from 'react';
import { site } from '../../data/site';
import { focusMain } from '../../lib/focus';

/** Skips to <main id="main">. A click handler, so the hash router never sees "#main". */
export default function SkipLink(): JSX.Element {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    focusMain()?.scrollIntoView();
  };
  return (
    <a className="skip" href="#main" onClick={onClick}>
      {site.skip}
    </a>
  );
}
