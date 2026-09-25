import { useEffect, useState, type MouseEvent } from 'react';
import { site } from '../../data/site';
import { isPlainClick, withMode, type Mode } from '../../lib/mode';
import { setMode } from '../../lib/useMode';

/** The last link of each mode: a real `?mode=` link that switches in place and moves focus to the toggle. */
export default function TurnThePage({ to }: { to: Mode }): JSX.Element {
  const [href, setHref] = useState(`?mode=${to}`);

  useEffect(() => {
    const update = () => setHref(withMode(location.href, to));
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, [to]);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return;
    e.preventDefault();
    setMode(to, { focusToggle: true });
  };

  return (
    <a className="turn u" href={href} onClick={onClick}>
      <span>
        {to === 'personal' ? site.turnPage.toPersonal : site.turnPage.toProfessional}
        <span aria-hidden="true">&nbsp;→</span>
      </span>
    </a>
  );
}
