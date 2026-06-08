import { profile } from '../data/profile';

export default function Footer() {
  return (
    <footer className="no-print border-t border-border">
      <div className="container-page flex flex-col items-center justify-between gap-2 py-8 text-xs text-subtle sm:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </span>
        <span className="font-mono">Built with React, TypeScript & Tailwind</span>
      </div>
    </footer>
  );
}
