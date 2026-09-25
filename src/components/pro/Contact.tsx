import { profile } from '../../data/profile';
import { site } from '../../data/site';

// STUB (foundation). Owned by pro-profile (A): replace the body, keep the signature.
export default function Contact(): JSX.Element {
  return (
    <section className="contact ink-plate" id="contact" aria-labelledby="contact-h">
      <div className="wrap">
        <h2 id="contact-h" className="label">
          {site.contact.heading}
        </h2>
        <a className="mail" href={`mailto:${profile.email}`} data-fit>
          {profile.email}
        </a>
      </div>
    </section>
  );
}
