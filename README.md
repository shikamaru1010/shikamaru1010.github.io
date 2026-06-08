# Ratko Šišović — Developer Portfolio

A fast, elegant, data-driven personal portfolio + one-page résumé, built with
**Vite + React + TypeScript + Tailwind CSS**. Light/dark themes, searchable &
filterable projects, and a print-optimized résumé that also exports to a
standalone PDF.

**Live:** _add your URL here after deploying_ · update `siteUrl` in `src/data/profile.ts`

---

## Quick start

```bash
npm install
npm run dev        # local dev at http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # preview the production build
npm run pdf        # regenerate public/Ratko_Sisovic_CV.pdf (run AFTER npm run build)
```

Requires Node 18+ (developed on Node 24).

---

## Keeping it up to date (the whole point of a living portfolio)

All content lives in plain TypeScript data files — **you almost never touch the
components.** Edit a file, save, and the dev server hot-reloads instantly.

| What to change | File |
| --- | --- |
| Name, role, headline, about, contact, pitch, site URL | `src/data/profile.ts` |
| Projects (featured + more) | `src/data/projects.ts` |
| Skills groups + "how I work" principles | `src/data/skills.ts` |
| Experience, education, languages | `src/data/experience.ts` |

### Add a new project

Append an object to the `projects` array in `src/data/projects.ts`:

```ts
{
  id: 'my-project',
  title: 'My Project',
  subtitle: 'One-line role/type',
  blurb: 'One sentence shown on the card.',
  year: '2026',
  status: 'In production',      // In production | Active development | Maintained | Completed
  featured: true,               // true = big card up top, false = compact list
  categories: ['Web & Apps'],   // see CATEGORIES in the same file
  tech: ['React', 'TypeScript'],
  highlights: ['Bullet shown in the detail modal.'],
  links: [{ label: 'GitHub', href: 'https://...' }], // optional
  note: 'Optional note shown in the modal.',          // optional
}
```

Filtering, search and the result count update automatically.

---

## Résumé / PDF

- The résumé is the same data rendered as a print-optimized sheet at **`/#resume`**
  (also reachable via the "Résumé" button in the nav).
- **Browser export:** open `/#resume` → *Print / Save as PDF* → choose "Save as PDF".
- **Standalone file:** `public/Ratko_Sisovic_CV.pdf` is committed and served at
  `/Ratko_Sisovic_CV.pdf` (the "Download PDF" button). Regenerate it whenever you
  change your data:

  ```bash
  npm run build && npm run pdf
  ```

  This renders `/#resume` from the production build with headless Chrome
  (via `puppeteer`) and writes the PDF to both `public/` and `dist/`. Commit the
  updated `public/Ratko_Sisovic_CV.pdf`.

---

## Theming

Colors are CSS variables in `src/index.css` (`:root` = light, `.dark` = dark),
mapped to semantic Tailwind classes (`bg`, `surface`, `fg`, `muted`, `accent`, …)
in `tailwind.config.ts`. Change the accent in one place:

```css
:root  { --accent: 79 70 229; }     /* indigo-600 (R G B channels) */
.dark  { --accent: 129 140 248; }   /* indigo-400 */
```

Theme choice is stored in `localStorage` and applied before first paint
(inline script in `index.html`) so there's no flash.

---

## Deploy

The repo itself is part of the portfolio — push it public.

```bash
git add -A && git commit -m "Update portfolio"
git push
```

- **Vercel / Netlify (recommended):** import the repo. Framework: **Vite**,
  build command `npm run build`, output dir `dist`. Auto-deploys on every push.
  After your first deploy, set `siteUrl` in `src/data/profile.ts` to the live URL.
- **GitHub Pages:** set `base: '/<repo-name>/'` in `vite.config.ts`, then publish
  `dist/` (e.g. via a GitHub Actions workflow).

Navigation uses hash routing (`/#resume`), so no SPA rewrite rules are needed.

### Update workflow
`edit src/data/*.ts → npm run dev (preview) → npm run build && npm run pdf → commit → push (auto-deploy)`

---

## Tailoring for a specific role

The site is general-purpose. To lean into a specific role (e.g. a technical
support / infrastructure position) without forking it, lightly adjust the About
copy / pitch in `src/data/profile.ts` and reorder skills in `src/data/skills.ts`.
The networking coursework (TCP/IP, Wireshark, sockets) and the observability /
reliability angle of the projects are already there to emphasize.

---

## Tech

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Framer Motion (subtle, respects
`prefers-reduced-motion`) · Puppeteer (dev-only, for the PDF). Accessible: semantic
HTML, focus-visible rings, ARIA on filters and the modal (focus trap, Esc to close),
live region for the result count.
