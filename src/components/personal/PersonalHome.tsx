import { personal } from '../../data/personal';

// STUB (foundation). Owned by personal (C): replace the body, keep the signature.
export default function PersonalHome(): JSX.Element {
  return (
    <>
      <section className="p-hero wrap" aria-labelledby="p-name">
        <h1 className="p-name" id="p-name" data-fit>
          {personal.firstName}
        </h1>
        <p className="p-line">{personal.line}</p>
      </section>
      <section className="wrap p-sec" id="log" aria-labelledby="log-h">
        <h2 id="log-h">{personal.log.heading}</h2>
      </section>
      <section className="wrap p-sec" id="now" aria-labelledby="now-h">
        <h2 id="now-h">{personal.nowHeading}</h2>
      </section>
      <section className="wrap p-sec" id="thought" aria-labelledby="thought-h">
        <h2 id="thought-h">{personal.thought.heading}</h2>
      </section>
      <section className="wrap p-sec" id="brain" aria-labelledby="brain-h">
        <h2 id="brain-h">{personal.brain.heading}</h2>
      </section>
      <section className="wrap p-sec" id="elsewhere" aria-labelledby="else-h">
        <h2 id="else-h">{personal.elsewhereHeading}</h2>
      </section>
    </>
  );
}
