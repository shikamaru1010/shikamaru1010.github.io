/**
 * The Personal photo's duotone: luminance mapped from the page's
 * warm ink (#15130F, shadows) to its bone (#EEE6D8, highlights), so the photo
 * is printed in the page's own two inks. `.p-photo img` references it with
 * `filter: url(#duotone-personal)`. Rendered once, in PersonalHome.
 */
export default function DuotoneFilter(): JSX.Element {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <filter id="duotone-personal" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values=".2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.082 0.933" />
          <feFuncG type="table" tableValues="0.075 0.902" />
          <feFuncB type="table" tableValues="0.059 0.847" />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}
