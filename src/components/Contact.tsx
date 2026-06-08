import { useState } from 'react';
import { profile } from '../data/profile';
import Reveal from './Reveal';
import { Check, GitHub, LinkedIn, Mail, Pin } from './icons';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyPitch = async () => {
    try {
      await navigator.clipboard.writeText(`${profile.pitch}\n\n— ${profile.name} · ${profile.siteUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="contact" className="container-page scroll-mt-20 py-20">
      <Reveal>
        <div className="ambient card overflow-hidden p-8 sm:p-12">
          <div className="eyebrow">Get in touch</div>
          <h2 className="mt-2 max-w-2xl text-2xl font-semibold sm:text-3xl">
            Let’s talk — I’m open to internships and remote / hybrid roles.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            I’m looking for a place to keep growing as an engineer, contribute real work, and take
            ownership. The fastest way to reach me is email — happy to share code, architecture and
            project walk-throughs.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent('Opportunity for Ratko Šišović')}`}
              className="btn-primary"
            >
              <Mail width={16} height={16} />
              {profile.email}
            </a>
            <button onClick={copyPitch} className="btn-ghost">
              {copied ? <Check width={16} height={16} /> : null}
              {copied ? 'Copied!' : 'Copy 3-sentence pitch'}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Pin width={14} height={14} className="text-subtle" />
              {profile.location}
            </span>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
            >
              <GitHub width={14} height={14} />
              {profile.githubHandle}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
            >
              <LinkedIn width={14} height={14} />
              {profile.linkedinHandle}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
