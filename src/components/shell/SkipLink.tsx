import type { MouseEvent } from 'react';
import { site } from '../../data/site';

/** Skips to <main id="main">. A click handler, so the hash router never sees "#main". */
export default function SkipLink(): JSX.Element {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  };
  return (
    <a className="skip" href="#main" onClick={onClick}>
      {site.skip}
    </a>
  );
}
