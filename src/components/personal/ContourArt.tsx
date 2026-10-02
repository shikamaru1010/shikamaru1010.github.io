type Props = {
  /** What the picture shows, read out in place of it. */
  alt: string;
};

/** The ink layer: the owner's Shikamaru panel as warm-ink lines on transparency (black kept, white dropped). */
export const ART_SRC = '/personal/shikamaru-ink.webp';

/**
 * The Personal circle: Shikamaru Nara (the handle is shikamaru1010) in warm ink on the accent
 * field, 720 × 720, clipped to the circle. Decorative apart from its description; nothing in it
 * takes the pointer.
 */
export default function ContourArt({ alt }: Props): JSX.Element {
  return (
    <svg className="mono-media p-art" viewBox="0 0 720 720" role="img" aria-label={alt}>
      <clipPath id="p-art-clip">
        <circle cx="360" cy="360" r="360" />
      </clipPath>
      <circle cx="360" cy="360" r="360" fill="#FF6A3D" />
      <image href={ART_SRC} width="720" height="720" clipPath="url(#p-art-clip)" />
    </svg>
  );
}
