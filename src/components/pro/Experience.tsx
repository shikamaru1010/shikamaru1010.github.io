import { site } from '../../data/site';

// STUB (foundation). Owned by pro-profile (A): replace the body, keep the signature.
export default function Experience(): JSX.Element {
  return (
    <section className="sec" id="experience" aria-labelledby="exp-h">
      <div className="wrap">
        <header className="sec-head grid">
          <h2 className="h2" id="exp-h">
            {site.experience.heading}
          </h2>
        </header>
      </div>
    </section>
  );
}
