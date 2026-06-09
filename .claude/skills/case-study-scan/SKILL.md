---
name: case-study-scan
description: Scan a local project repository and draft a privacy-safe `caseStudy` object for the portfolio's src/data/projects.ts. Use when adding a new project case study, or refreshing an existing one after shipping features. Produces a draft for the owner to review — never publishes automatically.
---

# Case Study Scanner

Turn a local project repo into a detailed, **accurate**, **privacy-safe** draft of a
`caseStudy` object for `src/data/projects.ts`. The owner (Ratko) reviews the draft before
it goes live. The goal is "the most realistic picture of the project, safely" — so we read
real source, but never leak secrets, strategy, or client data.

This skill is **token-efficient by design**: it scans incrementally (cheap signals first,
deep reads only where they matter) and delegates the heavy file reading to a **subagent**
so the main conversation stays lean.

## Inputs
1. **Project path** — absolute path to the local repo (e.g. `C:\Users\Ratko Sisovic\Desktop\...\dev-dashboard`).
2. **Target id** — the `Project.id` in `projects.ts` this maps to (e.g. `dev-dashboard`).
3. **Sensitivity tier** — defaults from the table below; can be overridden per run.

If the path or id is missing, ask for it before scanning.

## The incremental scan loop (token optimization)

Run as a **subagent** (Explore or general-purpose, `run_in_background: false`) so all the
raw file reading happens in an isolated context and only a compact digest returns. Instruct
the subagent to follow these phases and **stop early** once it has enough signal:

**Phase 0 — Hard ignore list (never read):**
`node_modules`, `.git/objects`, `dist`, `build`, `.next`, `out`, `coverage`,
lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`), `*.min.*`, binaries,
images/media, and **any `.env`, secrets, keys, or credential files** (their *values* are
never read; only the *names* of `.env.example` keys may be noted).

**Phase 1 — Cheap structural pass (do this first, it's usually enough for 60%):**
- Directory tree, depth-limited (~2–3 levels), skipping the ignore list.
- `README*`, `docs/`, and any architecture/notes markdown.
- Manifests: `package.json`, `pyproject.toml` / `requirements.txt`, `Dockerfile`,
  `docker-compose.yml`, framework configs (next.config, vite.config, etc.).
- `git log --oneline -30` and the top-level folder names (these reveal the modules).

**Phase 2 — Targeted deep reads (only the few files that define the system):**
- Entry points / main (`main.*`, `index.*`, `app.*`, `server.*`, `cli.*`).
- The orchestrator / agent / pipeline file(s) if present.
- One representative file per major module identified in Phase 1.
- Stop as soon as the architecture and flow are clear. Do **not** read the whole repo.

**Phase 3 — Digest:** the subagent returns a compact structured digest (not raw files):
languages/frameworks, modules + one-line purpose each, the runtime flow, notable
engineering decisions, anything that looks sensitive (flag, don't quote), and any hard
numbers safe to surface as metrics.

## Mapping the digest → `caseStudy` (the TS shape)

Draft each field of `ProjectCaseStudy` (see `src/data/projects.ts` for the exact type):

- `intro` — 1 short paragraph: what it is, what it does, why it exists.
- `metrics` — 3–4 punchy, **true** headline numbers (`{ value, label }`). Examples:
  `0 Runtime deps`, `Dozens Repos tracked`, `Daily In active use`. No invented numbers.
- `architecture[]` — one `ArchNode` per real module: `{ title, detail, tech? }`.
- `workflow[]` — the runtime/pipeline steps as `{ actor, title, detail }`. `actor` is the
  thing acting at that step: `System`, `Human`, `Claude`, `Data`, `GitHub`, etc.
- `decisions[]` — real engineering choices and *why*.
- `guardrails[]` — safety/limits/fallbacks (retries, circuit breakers, read-only, approvals).
- `challenges[]` — what was genuinely hard.
- `outcomes[]` — results / how it's used.
- `privacyNote` — the "what's withheld + more on request" line (see tiers).

Match the existing tone (concise, first-person, concrete). Anything you inferred but
aren't sure of goes into a separate **"CONFIRM" list**, not silently into the data.

## Sensitivity tiers (safe by default, per-project overrides)

Default for any project not listed = **SAFE** (treat as STRICT until told otherwise).

| Tier | Projects | What's allowed |
|------|----------|----------------|
| **DETAILED** | `dev-dashboard`, `student-brain-agent`, `dsa-java`, `brand-app` | Real module names, structure, decisions, tech. Owner's own tooling / coursework. |
| **MODERATE** | `belgrade-buddy`, `pilatiq`, `stan-pro-tim`, `kutlesic-vikendice` | Architecture, flow, stack, UX decisions. No secrets, no end-user/client PII. |
| **STRICT (high-level)** | `trading-agent`, `crypto-agent`, `mesara` | Only high-level pipeline + risk/guardrail layers. **No** strategy/formulas, **no** client data, **no** keys, **no** file-level internals. |

## Privacy pass (always, every tier)

Before emitting, scrub the draft. **Never include:** API keys / tokens / secrets, `.env`
values, credentials, trading strategy logic or parameters, client names beyond what's
already public in `projects.ts`, personal data of end users, internal URLs, or anything the
owner would not put on a public site. When in doubt, drop it and add a CONFIRM note.

Every draft gets a `privacyNote`. STRICT projects get a firm one
(e.g. "Private repo — strategy and internals withheld; deeper walk-through on request").

## Output

1. A ready-to-paste TypeScript block:
   ```ts
   caseStudy: {
     intro: '...',
     metrics: [ ... ],
     architecture: [ ... ],
     workflow: [ ... ],
     decisions: [ ... ],
     guardrails: [ ... ],
     challenges: [ ... ],
     outcomes: [ ... ],
     privacyNote: '...',
   },
   ```
2. A short **CONFIRM** list: things inferred that the owner should verify or fill in.
3. A one-line note of which files/signals it was based on (no secrets).

Then offer to insert it into the matching project object in `src/data/projects.ts`
(after the existing `note`/fields), run `npm run build` to verify, and remind the owner to
review before committing/deploying.

## Refresh mode
When re-run on a project that already has a `caseStudy`, diff the new digest against the
existing one and propose **only** the changes (new modules, new outcomes, updated metrics),
preserving the owner's hand-edited wording where it still holds.
