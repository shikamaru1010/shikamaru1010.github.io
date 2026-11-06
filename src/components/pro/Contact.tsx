import { useEffect, useRef, useState } from 'react';
import { profile } from '../../data/profile';
import { site } from '../../data/site';
import { fill } from '../../lib/format';
import ExternalLink from '../shell/ExternalLink';
import './contact.css';

const C = site.contact;

/** Clipboard API first; the old execCommand path for browsers or contexts without it. */
async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  const ok = document.execCommand('copy');
  field.remove();
  if (!ok) throw new Error('copy failed');
}

/** Professional ends on an ink plate: the address, a copy button, and the other ways in (the CV is in the header and the hero). */
export default function Contact(): JSX.Element {
  const [status, setStatus] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = async () => {
    clearTimeout(timer.current);
    setStatus(''); // so a second "Copied" is announced again
    try {
      await copyText(profile.email);
      requestAnimationFrame(() => setStatus(C.copied));
      timer.current = setTimeout(() => setStatus(''), 2000);
    } catch {
      setStatus(fill(C.copyFailed, { email: profile.email }));
    }
  };

  const at = profile.email.indexOf('@');

  return (
    <section className="contact ink-plate" id="contact" aria-labelledby="contact-h">
      <div className="wrap">
        <header className="sec-head grid">
          <h2 className="h2" id="contact-h">
            {C.heading}
          </h2>
          <p className="sec-note">{profile.availability}</p>
        </header>

        <p className="contact-mail">
          <a className="mail" href={`mailto:${profile.email}`}>
            {profile.email.slice(0, at)}
            <span className="at">@</span>
            {profile.email.slice(at + 1)}
          </a>
        </p>

        <p className="copy-row">
          <button type="button" className="copy" onClick={onCopy}>
            {C.copy}
          </button>
          <span className="copy-status label" role="status">
            {status}
          </span>
        </p>

        <dl className="reach grid">
          <div>
            <dt>{C.github}</dt>
            <dd>
              <ExternalLink className="u" href={profile.github}>
                {profile.githubHandle}
              </ExternalLink>
            </dd>
          </div>
          <div>
            <dt>{C.linkedin}</dt>
            <dd>
              <ExternalLink className="u" href={profile.linkedin}>
                {profile.linkedinHandle}
              </ExternalLink>
            </dd>
          </div>
          <div className="reach-walk">
            <dt>{C.code}</dt>
            <dd>{C.codeNote}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
