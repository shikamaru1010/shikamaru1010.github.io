# Ratko Šišović, portfolio

A data-driven personal site in two modes, plus a one-page CV exported to PDF, DOCX, Markdown and JSON Resume.
Built with **Vite + React + TypeScript** and plain CSS (no UI framework, no animation library).

**Live:** https://shikamaru1010.github.io

---

## Two modes

The site has two personas, and the URL decides which one you see:

| URL | Mode |
| --- | --- |
| `/` or `/?mode=professional` | **Professional**: paper and ink, one vermilion mark. Work (the client index with a desktop and phone plate, systems, other projects), experience, skills, contact. |
| `/?mode=personal` | **Personal**: warm ink, bone text. First name, now, today’s thought, side projects, links. |

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
npm run check          # browser checks of history, focus and routing (needs `npm run dev` running)
```

Scripts that import `.ts` data files use Node’s type stripping: **Node ≥ 22.18** (developed on Node 24).

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `preview` / `test` | as above |
| `npm run pdf` | stamps today’s date into `src/data/updated.json` and the `<lastmod>` of `public/sitemap.xml`, writes the CV’s other formats (`cv:export`), builds, and renders `/#resume` to a tagged `public/Ratko_Sisovic_CV.pdf` with Title, Author, Subject and Keywords set; fails unless it is exactly one A4 page. `-- --keep-date` re-renders without moving the date. |
| `npm run cv:export` | writes `public/cv.md`, `public/resume.json` (JSON Resume v1.0.0), `public/Ratko_Sisovic_CV.docx` and `public/llms.txt` from the same CV model as the PDF (`scripts/export-cv.mjs`). |
| `npm run cv:audit` | grades the committed CV the way ATS and CV graders do: the PDF’s text layer and reading order (needs poppler’s `pdftotext`), contact details, length, bullets, verbs, numbers, keywords, dates, and the other formats; prints a score, exits 1 on a hard failure. |
| `npm run check` | drives the running dev server (or `node scripts/check-behaviour.mjs <url>`) through Back, Forward, the mode switch and keyboard returns; exits 1 on any failure. Local only, like `npm run pdf`. |
| `npm run images` | writes the smaller copies of the screenshots that `srcset` uses (`scripts/image-variants.mjs`). Run after replacing a screenshot. |
| `npm run daily-message` | picks today’s quote from `scripts/quote-pool.mjs` into `src/data/daily-message.json` (also run every morning by a GitHub Action). |
| `npm run og` | renders `public/og-image.png` (2400 × 1260). |

---

## Where the content lives

Every visible fact comes from `src/data/`. You almost never touch the components.

| What to change | File |
| --- | --- |
| Name, role, lede, contact, site URL, meta description | `src/data/profile.ts` |
| Projects: clients, systems, smaller projects, screenshots, engineering notes, case studies | `src/data/projects.ts` |
| Roles, education, courses, languages | `src/data/experience.ts` |
| Skills by area (`cvOnly` keeps a skill or a group on the CV only) | `src/data/skills.ts` |
| Everything the Personal mode says | `src/data/personal.ts` |
| Interface labels, titles and templates (not facts) | `src/data/site.ts` |
| Today’s thought (generated daily) | `src/data/daily-message.json` |

Rules the tests enforce (`src/copy.test.ts`, `src/data/*.test.ts`):

- Say **CV**, never the accented French word. The degree is in its 4th year.
- Data strings use typographic quotes and apostrophes (’ “ ”) and no em dashes.
- Every client has two real screenshots in `public/screenshots/<id>/` (desktop 1440 × 900, phone 780 × 1688)
  whose alt text starts with the site’s domain.
- After editing `scripts/quote-pool.mjs`, run `npm run daily-message`: `daily-message.json` records the
  pool size and the quote’s index, and a test checks both against the pool.

### CV and its formats

- The CV copy lives in **`src/data/cv.ts`**, in CV register: no first person, every point opens with a
  verb, numbers where the data has them, standard section names (Summary, Technical Skills, Experience,
  Projects, Education, Languages). Names, dates, schools and links come from the other data files.
- `src/lib/cv.ts` joins them into one CV model. The page at **`/#resume`** renders it (one column, in
  reading order, contact details in the body, real `•` bullets in the text layer: the layout ATS parsers
  read correctly), and so does every export:

  | URL | For |
  | --- | --- |
  | `/Ratko_Sisovic_CV.pdf` | uploads; one tagged A4 page with document info |
  | `/Ratko_Sisovic_CV.docx` | sites and recruiters that ask for Word (real headings and bullets, no tables) |
  | `/cv.md` | pasting into forms, and AI tools |
  | `/resume.json` | JSON Resume tools and AI agents |
  | `/llms.txt` | AI agents looking for the CV (llmstxt.org) |

- `src/lib/cv.test.ts` holds the copy to those rules and fails when a committed export no longer matches
  the data (“run npm run cv:export”). `npm run cv:audit` grades the PDF itself.
- `profile.phone` is empty until set; the CV and every export show it once it is (graders expect one).
- `public/Ratko_Sisovic_CV.pdf` is committed and served at `/Ratko_Sisovic_CV.pdf`. Regenerate it after
  changing data: `npm run pdf`, then commit the PDF, `src/data/updated.json` **and** `public/sitemap.xml`.
- `updated.json` also keeps `cvHash`, a fingerprint of the text the PDF was printed from. `npm test`
  computes the same from the data and fails with “CV content changed: run npm run pdf” when a CV line
  changed without a new PDF.
- `src/data/updated.json` is the site’s one “Updated” date: the PDF’s metadata, `resume.json` and the sitemap carry it
  (the © at the foot of the site pages takes its year), so they always agree. It moves when you regenerate the CV,
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
  Every step between blocks and sections is on it; the few small px values left are optical (a line of
  text under its hairline, a marker on its line). The CV sheet has its own print scale.
- **Colour:** Professional paper `#F2F1EC`, ink `#111110`, one vermilion `#D83218`; Personal `#15130F` /
  `#EEE6D8` / `#FF6A3D`. Hairline rules, no shadows, no rounded corners.
- **Files:** `src/styles/tokens.css` (tokens), `base.css` (reset, grid, type roles, shared primitives),
  `shell.css` (header, switch, foot line, wipe). Each section imports its own CSS next to its component.
- **Motion:** only the mode wipe and short hover transitions; all of it respects `prefers-reduced-motion`.
- **Links:** every external link is an `ExternalLink` (`src/components/shell/`): a new tab, `rel`, the
  hidden “(opens in a new tab)” and, where it is shown, the ↗. A case study has no in-page `#` links:
  the hash router would read one as a route and leave the page.

---

## Deploy

`master` deploys to GitHub Pages through `.github/workflows/deploy.yml`. Routing uses hashes
(`/#resume`, `/#project/mesara`), so no SPA rewrite rules are needed.

Update workflow: `edit src/data/*.ts → npm run dev → npm test → npm run pdf → commit → push`.
