import { site } from '../../data/site';

// STUB (foundation). Owned by work (B): replace the body, keep the signature.
export default function Work(): JSX.Element {
  return (
    <section className="sec work" id="work" aria-labelledby="work-h">
      <div className="wrap">
        <header className="sec-head grid">
          <h2 className="h2" id="work-h">
            {site.work.heading}
          </h2>
        </header>
      </div>
    </section>
  );
}
