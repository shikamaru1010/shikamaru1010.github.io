import { profile } from '../data/profile';
import dailyMessage from '../data/daily-message.json';

export default function Footer() {
  return (
    <footer className="no-print border-t border-border">
      <div className="container-page py-10">
        <figure className="mx-auto max-w-2xl text-center">
          <blockquote className="text-pretty text-[15px] italic leading-relaxed text-fg/75">
            “{dailyMessage.text}”
          </blockquote>
          <figcaption className="mt-2 font-mono text-xs text-subtle">
            — generated daily by a small AI worker
          </figcaption>
        </figure>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-subtle sm:flex-row">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </span>
          <span className="font-mono">A new thought each day</span>
        </div>
      </div>
    </footer>
  );
}
