import type { ReactNode } from 'react';

export default function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}
