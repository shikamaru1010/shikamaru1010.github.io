import { profile } from '../../data/profile';

// STUB (foundation). Owned by pro-profile (A): replace the body, keep the signature.
export default function Hero(): JSX.Element {
  return (
    <section className="hero wrap" aria-labelledby="name">
      <h1 className="name" id="name" data-fit>
        <span>{profile.firstName}</span> <span>{profile.lastName}</span>
      </h1>
      <p className="lead">
        {profile.lede}{' '}
        <a className="u" href="#resume">
          {profile.ledeCv}
        </a>
      </p>
    </section>
  );
}
