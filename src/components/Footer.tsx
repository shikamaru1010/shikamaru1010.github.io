import { profile } from '../data/profile';
import { quoteOfTheDay } from '../data/quotes';

export default function Footer() {
  const quote = quoteOfTheDay();
  return (
    <footer className="no-print border-t border-border">
      <div className="container-page py-10">
        <figure className="mx-auto max-w-2xl text-center">
          <blockquote className="text-pretty text-[15px] italic leading-relaxed text-fg/75">
            “{quote.text}”
          </blockquote>
          <figcaption className="mt-2 font-mono text-xs text-subtle">— {quote.author}</figcaption>
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
