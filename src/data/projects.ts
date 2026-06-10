export const CATEGORIES = [
  'AI & Automation',
  'Web & Apps',
  'Mobile',
  'Client Delivery',
  'Tooling & Observability',
] as const;

export type Category = (typeof CATEGORIES)[number];

export type ProjectLink = {
  label: string;
  href: string;
};

/**
 * A screenshot or short GIF of a project. Files live in
 * `public/screenshots/<project-id>/` and are referenced root-relative
 * (e.g. `/screenshots/trading-agent/dashboard.png`); GIFs are plain `<img>`s.
 * The FIRST item is also used as the card thumbnail.
 */
export type ProjectMedia = {
  src: string;
  /** Describe what the screenshot shows — required for accessibility. */
  alt: string;
  /** Short line shown under the image in the case study gallery. */
  caption?: string;
};

/** One box in the "Architecture & structure" grid of a case study. */
export type ArchNode = {
  title: string;
  detail: string;
  tech?: string[];
};

/** One step in the "How it works" pipeline/agent timeline. `actor` is rendered as a pill. */
export type WorkflowStep = {
  /** e.g. 'Claude', 'Human', 'System', 'GitHub' — free text, shown as a pill. */
  actor: string;
  title: string;
  detail: string;
};

/** A big headline number in the dossier metric strip (e.g. value "0", label "Runtime deps"). */
export type CaseStudyMetric = {
  value: string;
  label: string;
};

/**
 * Rich, on-site case study for a project. Entirely optional and owner-written —
 * every section is optional, so a project can have a lot or a little. Reached at
 * `#project/<id>` and surfaced via a button in the project modal.
 */
export type ProjectCaseStudy = {
  /** 1–2 short paragraphs shown under the title. */
  intro: string;
  /** Big headline numbers shown right under the header. */
  metrics?: CaseStudyMetric[];
  architecture?: ArchNode[];
  workflow?: WorkflowStep[];
  decisions?: string[];
  guardrails?: string[];
  challenges?: string[];
  outcomes?: string[];
  /** Privacy / "more on request" line shown at the bottom. */
  privacyNote?: string;
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  /** One-line summary shown on the card. */
  blurb: string;
  year: string;
  status: 'In production' | 'Active development' | 'Maintained' | 'Completed';
  featured: boolean;
  categories: Category[];
  tech: string[];
  /** Bullet points shown in the detail modal. */
  highlights: string[];
  /** Live, public site — shows a "Visit site" link in the card corner + modal. */
  liveUrl?: string;
  /** Screenshots/GIFs — first one becomes the card thumbnail; all show in the case study gallery. */
  media?: ProjectMedia[];
  links?: ProjectLink[];
  note?: string;
  /** Optional rich on-site case study (renders a button in the modal + a `#project/<id>` page). */
  caseStudy?: ProjectCaseStudy;
};

export const projects: Project[] = [
  {
    id: 'trading-agent',
    title: 'tradingAgent',
    subtitle: 'AI-driven daily trading pipeline',
    blurb:
      'Python + Claude agent that runs a daily S&P 500 rotation end to end — data, scoring, risk, execution — with live dashboards and human-in-the-loop approval.',
    year: '2025 — present',
    status: 'Active development',
    featured: true,
    categories: ['AI & Automation', 'Tooling & Observability'],
    tech: ['Python', 'Claude tool-use', 'FastAPI', 'Interactive Brokers / Alpaca', 'Telegram', 'yfinance'],
    highlights: [
      'Full daily pipeline: market-calendar check, concurrent price fetch for ~500 tickers, technical + fundamental scoring with an SPY-overlap penalty, then risk-aware position sizing.',
      'Safety first: circuit breakers, position limits, retry logic, persisted state, and explicit human approval over Telegram before anything executes.',
      'Built custom live + historical dashboards (FastAPI) so the portfolio state, P&L and every decision are visible and explainable in seconds.',
      'Designed to fail safely and leave a clear audit trail — the system has to be debuggable when external APIs misbehave.',
    ],
    note: 'Private repo (proprietary strategy). Architecture and code walk-through available on request.',
  },
  {
    id: 'belgrade-buddy',
    title: 'BelgradeBuddy AI',
    subtitle: 'AI companion app for international visitors',
    blurb:
      'A React Native (Expo) + Supabase mobile app for international Expo 2027 visitors: an AI chatbot with smart model routing, an arrival wizard, offline support and real-time features.',
    year: '2025 — present',
    status: 'Active development',
    featured: true,
    categories: ['Mobile', 'AI & Automation', 'Web & Apps'],
    tech: ['React Native (Expo)', 'NativeWind', 'Supabase', 'Edge Functions', 'OpenRouter / Claude', 'i18n'],
    highlights: [
      'Context-aware AI chatbot with smart model routing to balance quality, latency and cost.',
      'Offline-first by design: phrasebook and FAQ keep working with no signal — built for stressed travellers in low-connectivity moments.',
      'Real-time features via Supabase, an arrival wizard for high-stress first-hour scenarios, and full internationalization (EN/SR + more).',
      'Heavy focus on graceful degradation and genuinely helpful error states.',
    ],
    note: 'Large solo product — full spec and phased roadmap, currently in active development.',
  },
  {
    id: 'dev-dashboard',
    title: 'dev-dashboard + "Brain" system',
    subtitle: 'Self-built developer observability & knowledge tooling',
    blurb:
      'A Next.js + TypeScript tool that scans all my local git repos and GitHub, aggregates activity and stats, and syncs structured data into an Obsidian knowledge base.',
    year: '2025 — present',
    status: 'Maintained',
    featured: true,
    categories: ['Tooling & Observability', 'Web & Apps', 'AI & Automation'],
    tech: ['Next.js 16', 'TypeScript', 'Node', 'Tailwind 4', 'Git', 'GitHub API', 'Obsidian', 'PowerShell'],
    highlights: [
      'Scans dozens of repositories and GitHub accounts, then aggregates activity into one dashboard so I always know what is active and what needs attention.',
      'Syncs into a structured second-brain knowledge base (developerBrain) — searchable history and structured data, exactly what good operational systems need.',
      'Zero third-party runtime dependencies by design; custom git/GitHub/Obsidian integration libraries.',
      'Part of a larger personal automation + agent system (with a planned orchestrator that routes requests to the right agent).',
    ],
    note: 'Used daily as my own monitoring and productivity layer.',
    // Detailed case study — drafted from a scan of the local repo (case-study-scan skill);
    // secrets / paths / email scrubbed. Tier: DETAILED (own tooling). Edit freely.
    caseStudy: {
      intro:
        'The observability layer over my own work, dev-dashboard scans every local git repository and my GitHub account, merges them into one view, and syncs structured notes into a unified Obsidian "second brain" — so I always know what is active, paused or abandoned, and the knowledge base stays current without manual upkeep. Built with zero third-party runtime dependencies, it is the first working slice of a larger personal agent system.',
      metrics: [
        { value: '0', label: 'Runtime deps' },
        { value: '40+', label: 'Languages detected' },
        { value: '30+', label: 'Project types' },
        { value: '3', label: 'Brain domains' },
      ],
      architecture: [
        {
          title: 'Local repo scanner',
          detail:
            'A recursive filesystem walker that finds projects by .git plus file markers, handles nested repos, and filters out tutorials, vendored code and noise.',
          tech: ['Node', 'git CLI'],
        },
        {
          title: 'Git extractor',
          detail:
            'Runs the native git CLI per repo for commit count, last-commit date, branch and remote — respecting .gitignore and submodule edge cases for free.',
          tech: ['git', 'child_process'],
        },
        {
          title: 'GitHub sync',
          detail:
            'Paginated GitHub API fetch of every owned repo with stars and descriptions, merged into the local view by matching remote URLs.',
          tech: ['GitHub API', 'fetch'],
        },
        {
          title: 'Aggregation + cache',
          detail:
            'Merges local and GitHub data, dedupes, classifies each project active / paused / abandoned by recency, and caches the result to disk.',
          tech: ['TypeScript'],
        },
        {
          title: 'Dashboard UI',
          detail:
            'A Next.js App Router dashboard surfacing project status, language and type distributions, and commit totals at a glance.',
          tech: ['Next.js 16', 'React 19', 'Tailwind 4'],
        },
        {
          title: 'Obsidian brain sync',
          detail:
            'Writes idempotent project notes into the vault — auto frontmatter + README section — while preserving everything I write by hand below a manual marker.',
          tech: ['Obsidian', 'Markdown'],
        },
        {
          title: 'Nightly git log',
          detail:
            "A scheduled PowerShell task records each day's commits into the developer brain automatically, following the same idempotent + manual-marker pattern.",
          tech: ['PowerShell', 'Task Scheduler'],
        },
        {
          title: 'Agent manifest (planned)',
          detail:
            'A defined agent hierarchy (orchestrator → per-domain agents) intended to synthesize cross-domain insights across the three brains.',
          tech: ['YAML'],
        },
      ],
      workflow: [
        {
          actor: 'Human',
          title: 'Trigger a scan',
          detail: 'I hit Refresh in the dashboard (or call the scan endpoint).',
        },
        {
          actor: 'System',
          title: 'Scan local repos',
          detail:
            'The walker finds repos by .git and file markers, then pulls commit count, last activity and branch via the git CLI.',
        },
        {
          actor: 'GitHub',
          title: 'Pull remote repos',
          detail: 'The GitHub API returns all my owned repos with stars and descriptions.',
        },
        {
          actor: 'Data',
          title: 'Merge & classify',
          detail:
            'Local and GitHub are matched by remote URL, deduped, sorted by activity and classified active / paused / abandoned, then cached.',
        },
        {
          actor: 'Human',
          title: 'Review the dashboard',
          detail: 'One view of every project, the language mix, and what needs attention.',
        },
        {
          actor: 'System',
          title: 'Sync to the brain',
          detail:
            'Active projects are written as idempotent notes into the Obsidian vault, preserving my hand-written sections.',
        },
        {
          actor: 'System',
          title: 'Nightly log',
          detail:
            "A scheduled task appends each day's commits into the developer brain — no manual upkeep.",
        },
      ],
      decisions: [
        'Zero third-party runtime dependencies — custom git / GitHub / Obsidian integration so I control behaviour and keep the supply-chain surface minimal.',
        'Native git CLI over parsing .git internals — it respects .gitignore and handles submodules and edge cases for free.',
        'Detect non-git projects by file markers (Docker, design files, game engines, VMs) so design and infra work counts, not just code.',
        'One unified Obsidian vault across three domains (student / developer / life) so [[links]] and queries span everything.',
        'Classify status by days-since-activity (active ≤30d, paused ≤180d, otherwise abandoned) — simple and predictable.',
      ],
      guardrails: [
        'Read-only scanning — the tool observes, it never mutates a source repo.',
        'Idempotent sync with a manual-edit marker — re-running never clobbers notes I wrote by hand.',
        'Per-project error isolation — a failing repo is logged and skipped so the sync continues.',
        'The scan degrades gracefully when a data source is unavailable, rather than failing the whole run.',
        'Configurable scan roots — scanning can be limited to chosen folders for speed and privacy.',
      ],
      challenges: [
        'Telling real projects apart from tutorials, vendored code and generic folders took multi-heuristic filtering.',
        'Nested repositories — a vault that is itself a git repo containing more repos — meant the walker could not stop at the first .git.',
        'Matching local repos to their GitHub counterparts across ssh and https remote formats.',
        'Keeping the Obsidian sync idempotent while preserving hand-written content.',
        'Windows path handling — illegal filename characters, symlink loops, and full-disk scan performance.',
      ],
      outcomes: [
        'Used as my own monitoring and productivity layer — one place shows what is active, paused or abandoned across all my repos.',
        'The developer brain stays current automatically: project notes and a daily commit log sync without manual upkeep.',
        'The first working slice of a larger agent system, with a planned orchestrator to synthesize across the three brains.',
      ],
      privacyNote:
        'Overview of my own internal tooling. Full code and a deeper walk-through are available on request.',
    },
  },
  {
    id: 'mesara',
    title: 'Mesara Šisko',
    subtitle: 'Internal business system + digital QR menu (client)',
    blurb:
      'Production work for a Serbian butcher/grill business: a Django + AI internal operations system, plus a Next.js QR menu & ordering app — real requirements, real users.',
    year: '2024 — present',
    status: 'In production',
    featured: true,
    categories: ['Client Delivery', 'AI & Automation', 'Web & Apps'],
    tech: ['Django', 'SQLite', 'Claude agents', 'APScheduler', 'Next.js 16', 'React 19', 'Supabase', 'Docker'],
    highlights: [
      'Internal ops system: daily sales/costs, P&L reports, and Serbian-regulation PDF declarations, on scheduled cycles (APScheduler).',
      'Multi-agent AI setup — an AI "manager" plus section workers, with a learning loop that improves from user corrections.',
      'Digital QR menu & ordering app (Next.js 16 / React 19, Supabase, Zustand, Resend email, Framer Motion): bilingual SR/EN, real-time order notifications, Dockerized, deployed on Vercel + Supabase.',
      'Direct work with the business owner — turning real operational pain into software, with compliance and reporting that have to be precise.',
    ],
    liveUrl: 'https://www.rostiljsisko.rs/sr',
    note: 'Private client repos. Live site deployed; in active use and maintained.',
    // High-level case study — scanned the live QR/ordering web-app (case-study-scan skill);
    // Tier: STRICT (client). No secrets, no customer data, no business logic / pricing.
    caseStudy: {
      intro:
        'Mesara Šisko is production software for a Serbian butcher and grill business, delivered as two connected parts: a customer-facing QR menu and ordering app, and an internal operations system. Diners scan a QR code to browse a bilingual menu, order with help from an AI chatbot, and track their order in real time, while the kitchen receives and updates orders live — and behind the scenes, scheduled AI agents handle daily reporting and compliance paperwork. Real requirements, real users, in active use.',
      metrics: [
        { value: '2', label: 'Languages (SR / EN)' },
        { value: 'Real-time', label: 'Order tracking' },
        { value: 'AI', label: 'Menu chatbot' },
        { value: 'Live', label: 'In production' },
      ],
      architecture: [
        {
          title: 'Bilingual menu',
          detail:
            'A category-based digital menu in Serbian and English, with search, images and per-size pricing, opened straight from a QR code.',
          tech: ['Next.js 16', 'next-intl'],
        },
        {
          title: 'Cart & checkout',
          detail:
            'A persisted client cart with size and quantity options, with order totals re-checked on the server at checkout.',
          tech: ['Zustand', 'TypeScript'],
        },
        {
          title: 'Ordering API',
          detail:
            'Validates each order against the live menu, records it, and notifies the restaurant.',
          tech: ['Supabase', 'Resend'],
        },
        {
          title: 'AI chatbot',
          detail:
            'A menu-aware assistant embedded on every page that answers questions and helps assemble an order in plain language.',
          tech: ['OpenRouter'],
        },
        {
          title: 'Kitchen dashboard',
          detail:
            'An access-protected, real-time board where staff move orders new → preparing → done, with an audio alert on each new order.',
          tech: ['Supabase real-time'],
        },
        {
          title: 'Internal operations system',
          detail:
            'A separate Django + AI system that compiles daily P&L reports and Serbian-regulation PDF declarations on scheduled cycles.',
          tech: ['Django', 'APScheduler', 'Claude agents'],
        },
      ],
      workflow: [
        {
          actor: 'Customer',
          title: 'Scan & browse',
          detail: "A QR code opens the bilingual menu on the customer's phone.",
        },
        {
          actor: 'Customer',
          title: 'Build the order',
          detail: 'Items go into a persisted cart, with help from the AI chatbot when needed.',
        },
        {
          actor: 'System',
          title: 'Validate & record',
          detail:
            'The order is checked against the live menu, recorded, and the restaurant is notified.',
        },
        {
          actor: 'Staff',
          title: 'Prepare',
          detail:
            'The kitchen dashboard shows the order in real time; staff move it new → preparing → done.',
        },
        {
          actor: 'Customer',
          title: 'Track',
          detail: 'The customer sees live status updates until the order is ready.',
        },
        {
          actor: 'System',
          title: 'Back office',
          detail:
            'On a schedule, the internal system compiles daily reports and compliance PDFs for the owner.',
        },
      ],
      decisions: [
        'Bilingual (Serbian + English) from day one, with localized URLs, to serve both locals and Zlatibor-area tourists.',
        'Mobile-first, since scanning a QR code on a phone is the main way in.',
        'Real-time via Supabase subscriptions so the kitchen and the customer stay in sync without polling.',
        'Server-side price validation — the client cart total is never trusted at checkout.',
        'An AI chatbot to cut friction: answer menu questions and help assemble an order in plain language.',
        'A simple, owner-friendly internal system that turns daily operational pain (reports, declarations) into scheduled automation.',
      ],
      guardrails: [
        'Every order is validated against the live menu before it is accepted, so totals cannot be tampered with.',
        'Rate limiting on the ordering and chat endpoints to prevent abuse.',
        'The kitchen dashboard is access-protected.',
        'Bad input and backend hiccups are caught and returned cleanly instead of failing silently.',
        'Security headers are set at the framework level (HSTS, frame and content-type protections).',
      ],
      challenges: [
        'Making the chatbot reliably understand colloquial Serbian menu requests — sizes, combos, "remove the salad".',
        'Full internationalization — every string and menu item maintained in both languages.',
        'Real-time coordination between the kitchen and customer views, including reconnect edge cases.',
        'Weight-based pricing needed a custom cart UI plus strict server-side validation.',
        'Keeping a snappy experience on mobile despite a large menu and many images.',
      ],
      outcomes: [
        'Live in production at the restaurant, serving real customers and staff.',
        'Real-time ordering: the kitchen gets orders instantly and customers track status to completion.',
        'Bilingual reach for locals and tourists, with an AI chatbot lowering the barrier to order.',
        'The internal system saves the owner daily manual work on reports and regulatory paperwork.',
      ],
      privacyNote:
        'Private client repositories. This is a high-level overview — business logic, configuration and customer data are not shown. The live ordering site is public; a deeper walk-through is available on request.',
    },
  },

  // ---------- More projects (compact list) ----------
  {
    id: 'crypto-agent',
    title: 'cryptoAgent',
    subtitle: 'Automated crypto portfolio agent',
    blurb:
      'A sibling of tradingAgent applying the same reliable-automation playbook to crypto portfolio management.',
    year: '2025',
    status: 'Active development',
    featured: false,
    categories: ['AI & Automation'],
    tech: ['Python', 'REST APIs', 'Automation'],
    highlights: [
      'Reuses the observability, retry and guardrail patterns from tradingAgent for a different asset class and exchange APIs.',
    ],
  },
  {
    id: 'student-brain-agent',
    title: 'student-brain-agent',
    subtitle: 'AI agent for academic knowledge',
    blurb:
      'A Node.js AI agent that processes academic material and generates structured notes in an Obsidian knowledge base.',
    year: '2025',
    status: 'Maintained',
    featured: false,
    categories: ['AI & Automation', 'Tooling & Observability'],
    tech: ['Node.js', 'Obsidian API', 'AI'],
    highlights: [
      'Turns raw study material into linked, structured notes — part of the same second-brain ecosystem as dev-dashboard.',
    ],
  },
  {
    id: 'pilatiq',
    title: 'Pilatiq Reformeri',
    subtitle: 'Catalog site for a Pilates reformer brand (client)',
    blurb:
      'A production catalog website for Pilatiq Pilates reformers — clean product presentation with variants and strong visuals, built for search visibility and a smooth client handoff.',
    year: '2024',
    status: 'In production',
    featured: true,
    categories: ['Client Delivery', 'Web & Apps'],
    tech: ['React', 'Vite', 'SEO', 'Responsive design'],
    highlights: [
      'Designed and built the product catalog with variants and strong visuals for a Pilates equipment brand.',
      'Optimized for SEO and performance, then handed off cleanly to the client.',
      'Iterated with the client across multiple sprints, from brief to live site.',
    ],
    liveUrl: 'https://pilatiq.rs/',
  },
  {
    id: 'brand-app',
    title: 'Brand Management App',
    subtitle: 'Tested CRUD single-page app',
    blurb:
      'A React + TypeScript SPA for managing brand entries with full CRUD, client-side routing and a component/integration test suite.',
    year: '2024',
    status: 'Completed',
    featured: false,
    categories: ['Web & Apps'],
    tech: ['React 18', 'TypeScript', 'Vite', 'Vitest', 'Testing Library'],
    highlights: [
      'Full CRUD with form validation and client-side routing, backed by Vitest + Testing Library tests.',
    ],
  },
  {
    id: 'stan-pro-tim',
    title: 'Stan Pro Tim',
    subtitle: 'Website for a property-management company, Zlatibor (client)',
    blurb:
      'A multi-page website for a Zlatibor property-management company: a custom brand palette, service pages, testimonials and a clear contact path.',
    year: '2023',
    status: 'In production',
    featured: true,
    categories: ['Client Delivery', 'Web & Apps'],
    tech: ['JavaScript', 'HTML/CSS', 'Responsive design'],
    highlights: [
      'Gathered requirements from the client and designed around a custom brand palette.',
      'Built service pages, testimonials and a contact section with a responsive, mobile-first layout.',
      'Delivered from brief to live — deployed and maintained.',
    ],
    liveUrl: 'https://stanprotim.rs/',
  },
  {
    id: 'kutlesic-vikendice',
    title: 'Kutlešić Vikendice',
    subtitle: 'Website for holiday cottages (client)',
    blurb:
      'A presentation website for Kutlešić Vikendice (holiday cottages): a clean, inviting layout that showcases the accommodation, with responsive design and easy contact.',
    year: '2023',
    status: 'In production',
    featured: true,
    categories: ['Client Delivery', 'Web & Apps'],
    tech: ['JavaScript', 'HTML/CSS', 'Responsive design'],
    highlights: [
      'Showcased the cottages with a clean, inviting visual layout.',
      'Responsive, mobile-first design with a straightforward contact path for guests.',
      'Delivered end to end for the client — design, build and deployment.',
    ],
    liveUrl: 'https://vikendicekutlesic.rs/',
  },
  {
    id: 'dsa-java',
    title: 'Data Structures & Algorithms',
    subtitle: 'Java coursework (FON)',
    blurb:
      'Eight Java projects covering linked lists, circular lists, binary trees and sorting algorithms, completed across exam cycles.',
    year: '2024',
    status: 'Completed',
    featured: false,
    categories: ['Tooling & Observability'],
    tech: ['Java', 'Eclipse', 'Algorithms'],
    highlights: [
      'Singly/doubly/circular linked lists, binary trees and sorting algorithms implemented from scratch.',
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const moreProjects = projects.filter((p) => !p.featured);
