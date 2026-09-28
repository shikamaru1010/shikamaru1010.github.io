type Props = {
  /** What the picture shows, read out in place of it. */
  alt: string;
  /** The easter egg (personal.contourEasterEgg): off, the mouth's hit area and the joint are not rendered. */
  egg: boolean;
};

/** The ink layer: the owner's Shikamaru panel as warm-ink lines on transparency (black kept, white dropped). */
export const ART_SRC = '/personal/shikamaru-ink.webp';

/**
 * The Personal circle: Shikamaru Nara (the handle is shikamaru1010) in warm ink on the accent
 * field, 720 × 720, clipped to the circle.
 *
 * Inline SVG rather than an <img>, so personal.css can reach inside it for the egg: with `egg`,
 * a mouse resting on the mouth (a transparent circle over it, the only part that takes the
 * pointer) brings out a joint at the corner of the mouth with a glowing ember and a little smoke
 * rising past the ear; it fades when the pointer leaves. Hover-capable pointers only, never
 * focusable, aria-hidden.
 */
export default function ContourArt({ alt, egg }: Props): JSX.Element {
  return (
    <svg className="mono-media p-art" viewBox="0 0 720 720" role="img" aria-label={alt}>
      <clipPath id="p-art-clip">
        <circle cx="360" cy="360" r="360" />
      </clipPath>
      <circle cx="360" cy="360" r="360" fill="#FF6A3D" />
      <image href={ART_SRC} width="720" height="720" clipPath="url(#p-art-clip)" />
      {egg && (
        <>
          <circle className="p-art-mouth" cx="356" cy="494" r="24" fill="none" />
          <g className="p-art-egg" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* the joint: thin at the lips, a little wider at the lit end */}
            <path fill="#EEE6D8" stroke="#15130F" strokeWidth="3.5" d="M368.2 493.2L439.3 512.9L434.7 527.1L365.8 500.8Z" />
            <path stroke="#15130F" strokeWidth="2.5" d="M379.6 496.4L377.4 504.2" />
            <circle className="p-ember" cx="439" cy="520" r="5.5" fill="#FFD2B8" />
            <g className="p-smoke" stroke="#EEE6D8" strokeWidth="3.5">
              <path d="M441 510C434 494 450 482 444 466C438 450 454 438 448 422C442 406 458 394 452 378" />
              <path d="M446 512C456 496 446 482 458 466C468 452 458 438 470 424C480 410 472 398 482 384" />
              <path d="M436 510C428 496 436 484 430 470C424 456 432 446 428 432" />
            </g>
          </g>
        </>
      )}
    </svg>
  );
}
