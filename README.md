# Ratko Šišović, portfolio

A data-driven personal site in two modes, plus a one-page CV that also exports to PDF.
Built with **Vite + React + TypeScript** and plain CSS (no UI framework, no animation library).

**Live:** https://shikamaru1010.github.io

---

## Two modes

The site has two personas, and the URL decides which one you see:

| URL | Mode |
| --- | --- |
| `/` or `/?mode=professional` | **Professional**: paper and ink, one vermilion mark. Work (each client site with its own screenshots), experience, skills, contact. |
| `/?mode=personal` | **Personal**: warm ink, bone text. First name, now, work log, today’s thought, side projects, links. |

- Any other value (or none) means Professional. The mode is never stored: a shared link decides.
- The **Professional | Personal** switch in the header changes mode in place (no reload), updates the URL
  with `history.replaceState` and keeps any `#hash`. It is a radiogroup (Arrow keys, Home, End) built on
  two real `?mode=` links, so Ctrl/Cmd-click opens a mode in a new tab.
- The switch plays one wipe (View Transitions). With `prefers-reduced-motion` it switches instantly.
- Back and Forward follow the URL: an entry of the other mode switches back to it (no wipe), and
  returning from the CV or a case study restores the place you left, in either mode, with keyboard
  focus back on the link you left by.
- An inline script in `index.html` sets `<html data-mode>` before first paint, so there is no flash of the
  other palette. `src/lib/mode.test.ts` runs that script against the app’s own parsers.
- `#resume` (the CV) and `#project/<id>` (case studies) always use the Professional palette.

---

## Quick start

```bash
npm install
npm run dev            # local dev server
npm run build          # type-check + production build into dist/
npm run preview        # preview the production build
npm test               # vitest: data integrity, copy rules, render, SEO
```

Scripts that import `.ts` data files use Node’s type stripping: **Node ≥ 22.18** (developed on Node 24).

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `preview` / `test` | as above |
| `npm run pdf` | stamps today’s date into `src/data/updated.json` and the `<lastmod>` of `public/sitemap.xml`, builds, and renders `/#resume` to `public/Ratko_Sisovic_CV.pdf`; fails unless it is exactly one A4 page. `-- --keep-date` re-renders without moving the date. |
| `npm run images` | writes the smaller copies of the screenshots and the photo that `srcset` uses (`scripts/image-variants.mjs`). Run after replacing a screenshot or the photo. |
| `npm run daily-message` | picks today’s quote from `scripts/quote-pool.mjs` into `src/data/daily-message.json` (also run every morning by a GitHub Action). |
| `npm run worklog` | counts my work-log entries per day into `src/data/worklog.json` (see below). |
| `npm run og` | renders `public/og-image.png` (2400 × 1260). |

---

## Where the content lives

Every visible fact comes from `src/data/`. You almost never touch the components.

| What to change | File |
| --- | --- |
| Name, role, lede, contact, site URL, meta description | `src/data/profile.ts` |
| Projects: clients, systems, smaller projects, screenshots, engineering notes, figures, case studies | `src/data/projects.ts` |
| Roles, education, courses, languages | `src/data/experience.ts` |
| Skills, each with the projects or courses where it was used (`cvOnly` keeps one on the CV only) | `src/data/skills.ts` |
| Everything the Personal mode says | `src/data/personal.ts` |
| Interface labels, titles and templates (not facts) | `src/data/site.ts` |
| Work-log counts (generated, dates and counts only) | `src/data/worklog.json` |
| Today’s thought (generated daily) | `src/data/daily-message.json` |

Rules the tests enforce (`src/copy.test.ts`, `src/data/*.test.ts`):

- Say **CV**, never the accented French word. The degree is in its 4th year.
- Data strings use typographic quotes and apostrophes (’ “ ”) and no em dashes.
- Every skill’s evidence points at a real project id or FON course.
- Every client has two real screenshots in `public/screenshots/<id>/` (desktop 1440 × 900, phone 780 × 1688)
  whose alt text starts with the site’s domain.
- After editing `scripts/quote-pool.mjs`, run `npm run daily-message`: the page says how many quotes the
  pool holds, and a test checks that number.

### Work log

`npm run worklog [-- <dir>]` lists `../dokumentacija/dnevnik` (or `<dir>`) and looks only at file names that
start with a date (`YYYY-MM-DD…txt|md`). It never opens a file and never writes a name: `worklog.json` is
`{ asOf, total, days: { "YYYY-MM-DD": count } }`. Local only; it does not run in CI.

### CV and PDF

- The CV is the same data rendered as a print-ready A4 sheet at **`/#resume`** (the “CV” link in the header).
- `public/Ratko_Sisovic_CV.pdf` is committed and served at `/Ratko_Sisovic_CV.pdf`. Regenerate it after
  changing data: `npm run pdf`, then commit the PDF **and** `src/data/updated.json`.
- `src/data/updated.json` is the site’s one “Updated” date: the colophon line that ends every page, the CV
  page, the PDF and the sitemap all carry it, so they always agree. It moves when you regenerate the CV,
  not with the daily rebuild that refreshes the quote.

---

## Design system

- **One family:** Golos Text (variable 400–900, Latin and Cyrillic), with a metric-matched Arial (Roboto on Android) fallback.
- **Five sizes, deliberately quiet:** 13 / 16 / 21 / 36 / 56 px at ≥ 1280 px (13 / 16 / 20 / 32 / 48 at
  721–1279, 13 / 16 / 18 / 26 / 38 on phones): labels, body, names and ledes, section heads, and the name.
  Weight 600 at most. Nothing is fitted to the width of the page. Tokens `--t1`…`--t5` in
  `src/styles/tokens.css`.
- **Grid:** 12 columns (4 on phones), 40 px margins and 24 px gutters on desktop.
- **Spacing:** one scale, `--sp-1`…`--sp-10` (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 144 px) in `tokens.css`.
- **Colour:** Professional paper `#F2F1EC`, ink `#111110`, one vermilion `#D83218`; Personal `#15130F` /
  `#EEE6D8` / `#FF6A3D`. Hairline rules, no shadows, no rounded corners.
- **Files:** `src/styles/tokens.css` (tokens), `base.css` (reset, grid, type roles, shared primitives),
  `shell.css` (header, switch, colophon line, wipe). Each section imports its own CSS next to its component.
- **Motion:** only the mode wipe and short hover transitions; all of it respects `prefers-reduced-motion`.

---

## Deploy

`master` deploys to GitHub Pages through `.github/workflows/deploy.yml`. Routing uses hashes
(`/#resume`, `/#project/mesara`), so no SPA rewrite rules are needed.

Update workflow: `edit src/data/*.ts → npm run dev → npm test → npm run pdf → commit → push`.
