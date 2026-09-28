type Props = {
  /** What the drawing shows, read out in place of it. */
  alt: string;
  /** The easter egg (personal.contourEasterEgg): off, the mouth's hit area and the joint are not rendered. */
  egg: boolean;
};

/**
 * The Personal circle: an original contour drawing, a nod to the handle (shikamaru1010) rather than
 * a picture of anyone. Someone lies on a low hill with his hands behind his head and a knee up,
 * a spiky high ponytail in the grass, watching three clouds; his long shadow runs down the slope
 * to a shogi piece. The accent field, warm ink lines, one far cloud in bone, 720 × 720.
 *
 * Inline rather than an <img>, so personal.css can reach inside it: the clouds drift (the only
 * motion), phones get screen-pixel lines without the smallest details, and the egg works. With
 * `egg`, a pointer resting on the mouth (a transparent circle over it, the only part that takes
 * the pointer) brings out a joint with a glowing ember and a little smoke that rises behind the
 * elbow; it fades when the pointer leaves. Hover-capable pointers only, never focusable, aria-hidden.
 */
export default function ContourArt({ alt, egg }: Props): JSX.Element {
  return (
    <svg className="mono-media p-art" viewBox="0 0 720 720" role="img" aria-label={alt}>
      <circle cx="360" cy="360" r="360" fill="#FF6A3D" />
      <g
        className="p-art-ink"
        fill="none"
        stroke="#15130F"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="p-cloud" d="M146 230H330A34 34 0 0 0 282 190A46 46 0 0 0 196 186A31 31 0 0 0 136 224" />
        <path className="p-cloud" d="M452 300H586A23 23 0 0 0 555 272A31 31 0 0 0 499 267A21 21 0 0 0 458 296" />
        <path
          className="p-cloud p-far p-fine"
          stroke="#EEE6D8"
          d="M470 150H536A14 14 0 0 0 517 133A19 19 0 0 0 483 131A13 13 0 0 0 466 148"
        />
        {/* the hill */}
        <path d="M-10 530Q60 502 150 499Q360 492 570 499Q660 502 730 530" />
        {/* head and ponytail */}
        <path d="M140.9 427.8A36 36 0 1 1 120.8 444" />
        <path d="M117.2 452.7Q92 436 66 432L84.6 448.5Q62 444 43.7 446.2L82 460.7Q66 466 54.6 470.9Q88 480 119.4 477.2" />
        {/* the arm behind the head: outer contour, then the inner one */}
        <path d="M120.8 444C132 414 148 376 162 352Q174 332 190 346C214 374 244 408 266 440" />
        <path d="M140.9 427.8C150 410 162 388 174 370C196 396 222 424 244 445" />
        {/* neck, chest and belly, then the raised knee */}
        <path d="M184.6 446.8C200 456 222 452 240 446C280 434 326 438 354 450C370 456 384 455 392 450" />
        <path d="M392 450C416 420 440 388 458 366Q472 348 488 360C506 394 522 436 536 468C548 476 562 482 572 488Q580 494 576 498" />
        <path d="M410 496C428 466 450 438 470 404C490 426 508 456 520 497" />
        {/* the knee's long shadow, down the slope to the shogi piece */}
        <path d="M410 496C392 530 348 566 312 590C356 568 452 530 520 497" />
        <path d="M276 612H310L307 584L293 574L279 584Z" />
        <path className="p-fine" d="M556 592Q552 580 544 572M562 592Q562 578 566 566M568 592Q574 582 584 576" />
      </g>
      {egg && (
        <>
          <circle className="p-art-mouth" cx="170" cy="430" r="30" fill="none" />
          <g className="p-art-egg" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* the arm's band: the smoke passes behind it */}
            <mask id="p-art-arm">
              <rect width="720" height="720" fill="#fff" />
              <path
                fill="#000"
                stroke="#000"
                strokeWidth="8"
                d="M120.8 444C132 414 148 376 162 352Q174 332 190 346C214 374 244 408 266 440L244 445C222 424 196 396 174 370C162 388 150 410 140.9 427.8Z"
              />
            </mask>
            <path stroke="#15130F" strokeWidth="4.5" d="M167 430.5L168.5 392.4L179.5 393.6L173 431.1" />
            <path stroke="#15130F" strokeWidth="3" d="M174 391C177 387 171 384 175 379" />
            <circle className="p-ember" cx="174" cy="393" r="4" fill="#FFD2B8" />
            <g className="p-smoke" mask="url(#p-art-arm)" stroke="#EEE6D8" strokeWidth="3.5">
              <path d="M175 386C170 374 182 366 178 354C174 342 186 334 184 322C182 310 194 302 194 290C194 278 204 272 204 260" />
              <path d="M180 382C188 370 180 358 190 346C200 334 192 322 204 310C214 300 208 290 218 280C226 272 222 262 230 254" />
              <path d="M170 380C164 368 172 358 168 346C164 336 172 328 170 318C168 308 176 302 176 294" />
            </g>
          </g>
        </>
      )}
    </svg>
  );
}
