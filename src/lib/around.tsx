import type { ReactNode } from 'react';

/** Puts `node` where `{key}` sits in `template` (so a date can be a real <time>). */
export function around(template: string, key: string, node: ReactNode): ReactNode {
  const [before, after = ''] = template.split(`{${key}}`);
  return (
    <>
      {before}
      {node}
      {after}
    </>
  );
}
