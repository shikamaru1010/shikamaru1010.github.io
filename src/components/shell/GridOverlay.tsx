/** The page grid drawn over everything; shown by `html.show-grid` (the colophon's button). */
export default function GridOverlay(): JSX.Element {
  return (
    <div className="grid-overlay" aria-hidden="true">
      <div className="wrap grid">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
}
