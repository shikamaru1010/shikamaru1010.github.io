import { site } from '../../data/site';

// STUB (foundation). Owned by pro-profile (A): replace the body, keep the signature.
export default function Skills(): JSX.Element {
  return (
    <section className="sec" id="skills" aria-labelledby="skills-h">
      <div className="wrap">
        <header className="sec-head grid">
          <h2 className="h2" id="skills-h">
            {site.skills.heading}
          </h2>
          <p className="sec-note">{site.skills.note}</p>
        </header>
      </div>
    </section>
  );
}
