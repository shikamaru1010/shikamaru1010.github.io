import { domainOf } from '../lib/format';

export const CATEGORIES = [
  'AI & Automation',
  'Web & Apps',
  'Mobile',
  'Client Delivery',
  'Tooling & Observability',
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * A real screenshot of a live site. Files live in `public/screenshots/<id>/`
 * and are referenced root-relative. Clients carry exactly two: the desktop
 * capture first, then the phone. projects.test.ts checks the files exist and
 * that `width`/`height` match the webp headers.
 */
export type ProjectMedia = {
  /** Root-relative, e.g. '/screenshots/mesara/desktop.webp'. */
  src: string;
  /** Starts with the site’s domain, then says what the capture shows. */
  alt: string;
  width: number;
  height: number;
  device: 'desktop' | 'phone';
  /** Desktop item only: the caption shown on the plate. */
  caption?: string;
  /** Smaller copies of the same capture for `srcset` (scripts/image-variants.mjs writes them). */
  variants?: Array<{ src: string; width: number }>;
  /** Desktop item only: the 320 × 200 thumbnail in the plate's contact strip. */
  thumb?: string;
};

/** One stop of a pipeline figure. `person` stops are drawn as circles, `system` stops as squares. */
export type PipelineStep = { label: string; note: string; actor: 'system' | 'person' };

/** The figure drawn on the page grid for a system project. */
export type SystemFigure =
  | { kind: 'pipeline'; caption: string; steps: PipelineStep[] }
  | {
      kind: 'status-axis';
      caption: string;
      scaleNote: string;
      daysPerColumn: number;
      maxDays: number;
      thresholds: { active: number; paused: number };
      activeNote: string;
    }
  | {
      kind: 'signal';
      caption: string;
      aside: string;
      online: { label: string; note: string };
      offline: { label: string; note: string };
    };

/** One box in the architecture grid of a case study. */
export type ArchNode = {
  title: string;
  detail: string;
  tech?: string[];
};

/** One step in the "How it works" flow of a case study. */
export type WorkflowStep = {
  /** Who acts, as written next to the step: 'Customer', 'Me', 'System', 'GitHub'… */
  actor: string;
  /** A person is drawn as a circle, the system as a square (DECISIONS 10). */
  kind: 'person' | 'system';
  title: string;
  detail: string;
};

/** A headline number in the case study "At a glance" strip. The value is a number ('40+'), never a word. */
export type CaseStudyMetric = {
  value: string;
  label: string;
};

/** Rich on-site case study, reached at `#project/<id>`. Every section is optional. */
export type ProjectCaseStudy = {
  intro: string;
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
  blurb: string;
  year: string;
  status: 'In production' | 'Active development' | 'Maintained' | 'Completed';
  /** Shown instead of `status` where a plainer word fits better ('Used daily'). */
  statusNote?: string;
  featured: boolean;
  categories: Category[];
  tech: string[];
  /**
   * Source notes, not rendered: the long-form facts the blurb, the engineering notes and the CV
   * are reworded from. Keep them true; they are where a new line of copy should come from.
   */
  highlights?: string[];
  /** Live, public site. */
  liveUrl?: string;
  /** Screenshots: desktop first, then phone. */
  media?: ProjectMedia[];
  /** Source note, not rendered: repository access and status. */
  note?: string;
  /** 1–2 short, checkable engineering facts, reworded from highlights / caseStudy. */
  notes?: string[];
  /** Systems only: the figure drawn on the page grid. */
  figure?: SystemFigure;
  caseStudy?: ProjectCaseStudy;
};

export type StudyProject = Project & { caseStudy: ProjectCaseStudy };

const desktop = (id: string, alt: string, caption: string): ProjectMedia => ({
  src: `/screenshots/${id}/desktop.webp`,
  alt,
  width: 1440,
  height: 900,
  device: 'desktop',
  caption,
  variants: [{ src: `/screenshots/${id}/desktop-720.webp`, width: 720 }],
  thumb: `/screenshots/${id}/thumb.webp`,
});

const phone = (id: string, alt: string): ProjectMedia => ({
  src: `/screenshots/${id}/mobile.webp`,
  alt,
  width: 780,
  height: 1688,
  device: 'phone',
  variants: [{ src: `/screenshots/${id}/mobile-480.webp`, width: 480 }],
});

export const projects: Project[] = [
  // ---------- Client sites, live ----------
  {
    id: 'mesara',
    title: 'Mesara Šisko',
    subtitle: 'QR menu and ordering app, plus an internal operations system',
    blurb:
      'Production software for a Serbian butcher and grill business: a Next.js QR menu and ordering app, and a Django and AI system for internal operations.',
    year: '2024–now',
    status: 'In production',
    featured: true,
    categories: ['Client Delivery', 'AI & Automation', 'Web & Apps'],
    tech: ['Next.js 16', 'Supabase', 'Django', 'Claude agents', 'React 19', 'APScheduler', 'SQLite', 'Docker'],
    highlights: [
      'Internal ops system: daily sales/costs, P&L reports, and Serbian-regulation PDF declarations, on scheduled cycles (APScheduler).',
      'Multi-agent AI setup: an AI “manager” plus section workers, with a learning loop that improves from user corrections.',
      'Digital QR menu & ordering app (Next.js 16 / React 19, Supabase, Zustand, Resend email, Framer Motion): bilingual SR/EN, real-time order notifications, Dockerized, deployed on Vercel + Supabase.',
      'Direct work with the business owner, turning real operational pain into software, with compliance and reporting that have to be precise.',
    ],
    liveUrl: 'https://www.rostiljsisko.rs/sr',
    note: 'Private client repos. Live site deployed; in active use and maintained.',
    notes: [
      'Order totals are re-checked on the server at checkout. The cart total sent by the client is never trusted.',
      'Kitchen and customer stay in sync through Supabase real-time subscriptions, with no polling.',
    ],
    media: [
      desktop(
        'mesara',
        'rostiljsisko.rs on a desktop: the red Šisko logo and a Cyrillic welcome over a dark photo of grilled meat',
        'Bilingual SR/EN menu, orders tracked in real time.',
      ),
      phone(
        'mesara',
        'rostiljsisko.rs on a phone: the red Cyrillic Šisko logo and the welcome, with buttons for the menu and online ordering',
      ),
    ],
    // High-level case study (client work): no secrets, customer data, business logic or pricing.
    caseStudy: {
      intro:
        'Mesara Šisko is production software for a Serbian butcher and grill business, delivered as two connected parts: a customer-facing QR menu and ordering app, and an internal operations system. Diners scan a QR code to browse a bilingual menu, order with help from an AI chatbot and track their order in real time, while the kitchen receives and updates orders live. Scheduled AI agents handle daily reporting and compliance paperwork. It is in active use.',
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
            'A persisted client cart with size and quantity options.',
          tech: ['Zustand', 'TypeScript'],
        },
        {
          title: 'Ordering API',
          detail: 'Records each order and notifies the restaurant.',
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
          kind: 'person',
          title: 'Scan & browse',
          detail: 'A QR code opens the bilingual menu on the customer’s phone.',
        },
        {
          actor: 'Customer',
          kind: 'person',
          title: 'Build the order',
          detail: 'Items go into a persisted cart, with help from the AI chatbot when needed.',
        },
        {
          actor: 'System',
          kind: 'system',
          title: 'Validate & record',
          detail: 'The order is checked against the live menu, recorded, and the restaurant is notified.',
        },
        {
          actor: 'Staff',
          kind: 'person',
          title: 'Prepare',
          detail: 'The kitchen dashboard shows the order in real time; staff move it new → preparing → done.',
        },
        {
          actor: 'Customer',
          kind: 'person',
          title: 'Track',
          detail: 'The customer sees live status updates until the order is ready.',
        },
        {
          actor: 'System',
          kind: 'system',
          title: 'Back office',
          detail: 'On a schedule, the internal system compiles daily reports and compliance PDFs for the owner.',
        },
      ],
      decisions: [
        'Bilingual (Serbian + English) from day one, with localized URLs, to serve both locals and Zlatibor-area tourists.',
        'Mobile-first, since scanning a QR code on a phone is the main way in.',
        'Real-time via Supabase subscriptions so the kitchen and the customer stay in sync without polling.',
        'An AI chatbot that answers menu questions and helps build an order in plain language.',
        'An owner-friendly internal system that produces the daily reports and declarations on a schedule.',
      ],
      guardrails: [
        'Every order is validated against the live menu before it is accepted, so totals cannot be tampered with.',
        'Rate limiting on the ordering and chat endpoints to prevent abuse.',
        'The kitchen dashboard is access-protected.',
        'Invalid input and backend errors return a clear error instead of failing silently.',
        'Security headers are set at the framework level (HSTS, frame and content-type protections).',
      ],
      challenges: [
        'Making the chatbot reliably understand colloquial Serbian menu requests: sizes, combos, “remove the salad”.',
        'Full internationalization: every string and menu item maintained in both languages.',
        'Real-time coordination between the kitchen and customer views, including reconnect edge cases.',
        'Weight-based pricing needed a custom cart UI plus strict server-side validation.',
        'Keeping the menu fast on phones despite its size and many images.',
      ],
      outcomes: [
        'Live in production at the restaurant, used by customers and kitchen staff.',
        'Real-time ordering: the kitchen gets orders instantly and customers track status to completion.',
        'Bilingual reach for locals and tourists.',
        'The internal system saves the owner daily manual work on reports and regulatory paperwork.',
      ],
      privacyNote:
        'Private client repositories. This is a high-level overview: business logic, configuration and customer data are not shown. The live ordering site is public, and a deeper walk-through is available on request.',
    },
  },
  {
    id: 'pilatiq',
    title: 'Pilatiq Reformeri',
    subtitle: 'Product catalog for a Pilates reformer brand',
    blurb:
      'A production catalog site for Pilatiq Pilates reformers: products with variants and strong visuals, built for search visibility and a smooth handoff to the client.',
    year: '2024',
    status: 'In production',
    featured: true,
    categories: ['Client Delivery', 'Web & Apps'],
    tech: ['React', 'Vite'],
    highlights: [
      'Designed and built the product catalog with variants and strong visuals for a Pilates equipment brand.',
      'Optimized for SEO and performance, then handed off cleanly to the client.',
      'Iterated with the client across multiple sprints, from brief to live site.',
    ],
    liveUrl: 'https://pilatiq.rs/',
    notes: ['Optimized for SEO and performance.'],
    media: [
      desktop(
        'pilatiq',
        'pilatiq.rs on a desktop: a Pilates reformer in a bright studio, under a purple header',
        'Catalog with product variants and strong visuals.',
      ),
      phone('pilatiq', 'pilatiq.rs on a phone: a Pilates reformer in a bright studio, under a purple header'),
    ],
  },
  {
    id: 'stan-pro-tim',
    title: 'Stan Pro Tim',
    subtitle: 'Site for a property-management company in Zlatibor',
    blurb:
      'A multi-page website for a Zlatibor property-management company: a custom brand palette, service pages, testimonials and a clear contact path.',
    year: '2023',
    status: 'In production',
    featured: true,
    categories: ['Client Delivery', 'Web & Apps'],
    tech: ['JavaScript', 'HTML', 'CSS'],
    highlights: [
      'Gathered requirements from the client and designed around a custom brand palette.',
      'Built service pages, testimonials and a contact section with a responsive, mobile-first layout.',
      'Delivered from brief to live, then deployed and maintained.',
    ],
    liveUrl: 'https://stanprotim.rs/',
    notes: ['Designed around a custom brand palette, from requirements gathered with the client.'],
    media: [
      desktop(
        'stan-pro-tim',
        'stanprotim.rs on a desktop: a stone and timber residential building in Zlatibor behind the company name',
        'Service pages, testimonials, a clear way to get in touch.',
      ),
      phone('stan-pro-tim', 'stanprotim.rs on a phone: a residential building in Zlatibor behind the company name'),
    ],
  },
  {
    id: 'kutlesic-vikendice',
    title: 'Kutlešić Vikendice',
    subtitle: 'Site for holiday cottages',
    blurb:
      'A presentation website for Kutlešić Vikendice (holiday cottages): a clean, inviting layout that showcases the accommodation, with responsive design and easy contact.',
    year: '2023',
    status: 'In production',
    featured: true,
    categories: ['Client Delivery', 'Web & Apps'],
    tech: ['JavaScript', 'HTML', 'CSS'],
    highlights: [
      'Showcased the cottages with a clean, inviting visual layout.',
      'Responsive, mobile-first design with a straightforward contact path for guests.',
      'Delivered end to end for the client: design, build and deployment.',
    ],
    liveUrl: 'https://vikendicekutlesic.rs/',
    notes: ['Mobile-first, with a short path from the cottages to getting in touch.'],
    media: [
      desktop(
        'kutlesic-vikendice',
        'vikendicekutlesic.rs on a desktop: a timber holiday cottage on a green lawn',
        'Designed, built and deployed end to end.',
      ),
      phone('kutlesic-vikendice', 'vikendicekutlesic.rs on a phone: a timber holiday cottage with call and WhatsApp buttons'),
    ],
  },

  // ---------- Systems of my own ----------
  {
    id: 'trading-agent',
    title: 'tradingAgent',
    subtitle: 'AI-driven daily trading pipeline',
    blurb:
      'A Python and Claude agent that runs a daily S&P 500 rotation from start to finish: data, scoring, risk, execution. A FastAPI dashboard shows the portfolio, P&L and the reason behind every decision.',
    year: '2025–now',
    status: 'Active development',
    featured: true,
    categories: ['AI & Automation', 'Tooling & Observability'],
    tech: ['Python', 'Claude tool use', 'FastAPI', 'Interactive Brokers / Alpaca', 'Telegram', 'yfinance'],
    highlights: [
      'Full daily pipeline: market-calendar check, concurrent price fetch for ~500 tickers, technical + fundamental scoring with an SPY-overlap penalty, then risk-aware position sizing.',
      'Safety first: circuit breakers, position limits, retry logic, persisted state, and explicit human approval over Telegram before anything executes.',
      'Built custom live + historical dashboards (FastAPI) so the portfolio state, P&L and every decision are visible and explainable in seconds.',
      'Designed to fail safely and leave a clear audit trail: the system has to be debuggable when external APIs misbehave.',
    ],
    note: 'Private repo (proprietary strategy). Architecture and code walk-through available on request.',
    notes: ['Every decision is logged, so a bad day can be traced when an external API misbehaves.'],
    figure: {
      kind: 'pipeline',
      caption: 'One trading day',
      steps: [
        { label: 'Check', note: 'Is the market open today?', actor: 'system' },
        { label: 'Fetch', note: 'Prices for ~500 tickers, concurrently, with retries', actor: 'system' },
        { label: 'Score', note: 'Technical + fundamental, with an SPY-overlap penalty', actor: 'system' },
        { label: 'Size', note: 'Against circuit breakers and position limits', actor: 'system' },
        { label: 'Approve', note: 'Me, on Telegram. Nothing executes before this.', actor: 'person' },
        { label: 'Execute', note: 'Place the order and log the reason', actor: 'system' },
      ],
    },
  },
  {
    id: 'dev-dashboard',
    title: 'dev-dashboard + Brain',
    subtitle: 'Developer observability and knowledge tooling, built for myself',
    blurb:
      'Scans the git repositories on my machine plus my GitHub account, marks each project active, paused or abandoned, and writes a note for every active one into my Obsidian vault without overwriting what I wrote by hand. It uses no third-party libraries for the git, GitHub and Obsidian integrations; I wrote them myself.',
    year: '2025–now',
    status: 'Maintained',
    statusNote: 'Used daily',
    featured: true,
    categories: ['Tooling & Observability', 'Web & Apps', 'AI & Automation'],
    tech: ['Next.js 16', 'TypeScript', 'Node', 'Tailwind 4', 'Git', 'GitHub API', 'Obsidian', 'PowerShell'],
    highlights: [
      'Scans dozens of repositories and GitHub accounts, then aggregates activity into one dashboard so I always know what is active and what needs attention.',
      'Syncs into a structured second-brain knowledge base (developerBrain): searchable history and structured data.',
      'Zero third-party runtime dependencies by design; custom git/GitHub/Obsidian integration libraries.',
      'Part of a larger personal automation + agent system (with a planned orchestrator that routes requests to the right agent).',
    ],
    note: 'Used daily as my own monitoring and productivity layer.',
    notes: [
      'Read-only on the repositories it scans: it never changes a source repo.',
      'A repository that fails to scan is logged and skipped, and the rest of the sync continues.',
    ],
    figure: {
      kind: 'status-axis',
      caption: 'Status, by days since the last commit',
      scaleNote: 'Drawn to scale, 0 to 360 days',
      daysPerColumn: 30,
      maxDays: 360,
      thresholds: { active: 30, paused: 180 },
      activeNote: 'Gets a note in the vault',
    },
    // Detailed case study of my own tooling; secrets, paths and email scrubbed.
    caseStudy: {
      intro:
        'dev-dashboard is the observability layer over my own work. It scans my local git repositories and my GitHub account, merges them into one view, and syncs structured notes into one Obsidian “second brain”, so I can see what is active, paused or abandoned and the notes stay current without manual upkeep. The scanner and the sync use no third-party libraries. It is the first working slice of a larger personal agent system.',
      metrics: [
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
            'Runs the native git CLI per repo for commit count, last-commit date, branch and remote.',
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
            'A Next.js App Router dashboard showing project status, language and type distributions, and commit totals.',
          tech: ['Next.js 16', 'React 19', 'Tailwind 4'],
        },
        {
          title: 'Obsidian brain sync',
          detail:
            'Writes idempotent project notes into the vault (auto frontmatter plus a README section) while preserving everything I write by hand below a manual marker.',
          tech: ['Obsidian', 'Markdown'],
        },
        {
          title: 'Nightly git log',
          detail:
            'A scheduled PowerShell task records each day’s commits into the developer brain automatically, following the same idempotent, manual-marker pattern.',
          tech: ['PowerShell', 'Task Scheduler'],
        },
        {
          title: 'Agent manifest (planned)',
          detail:
            'A defined agent hierarchy (orchestrator → per-domain agents) intended to read across all three domains of the vault.',
          tech: ['YAML'],
        },
      ],
      workflow: [
        {
          actor: 'Me',
          kind: 'person',
          title: 'Trigger a scan',
          detail: 'I press Refresh in the dashboard, or call the scan endpoint.',
        },
        {
          actor: 'System',
          kind: 'system',
          title: 'Scan local repos',
          detail:
            'The walker finds repos by .git and file markers, then pulls commit count, last activity and branch via the git CLI.',
        },
        {
          actor: 'GitHub',
          kind: 'system',
          title: 'Pull remote repos',
          detail: 'The GitHub API returns all my owned repos with stars and descriptions.',
        },
        {
          actor: 'System',
          kind: 'system',
          title: 'Merge & classify',
          detail:
            'Local and GitHub are matched by remote URL, deduped, sorted by activity and classified active / paused / abandoned, then cached.',
        },
        {
          actor: 'Me',
          kind: 'person',
          title: 'Review the dashboard',
          detail: 'One view of every project, the language mix, and what needs attention.',
        },
        {
          actor: 'System',
          kind: 'system',
          title: 'Sync to the brain',
          detail:
            'Active projects are written as idempotent notes into the Obsidian vault, preserving my hand-written sections.',
        },
        {
          actor: 'System',
          kind: 'system',
          title: 'Nightly log',
          detail: 'A scheduled task appends each day’s commits into the developer brain.',
        },
      ],
      decisions: [
        'No third-party libraries in the scanner and the sync: the git, GitHub and Obsidian integrations are my own, so I control the behavior and keep the supply-chain surface small.',
        'Native git CLI over parsing .git internals: it respects .gitignore and handles submodules and edge cases for free.',
        'Detect non-git projects by file markers (Docker, design files, game engines, VMs) so design and infra work counts, not just code.',
        'One unified Obsidian vault across three domains (student, developer, life), so [[links]] and queries span everything.',
        'Classify status by days since the last activity (active ≤30d, paused ≤180d, otherwise abandoned): simple and predictable.',
      ],
      guardrails: [
        'Read-only scanning: the tool observes, it never changes a source repo.',
        'Idempotent sync with a manual-edit marker: re-running never overwrites notes I wrote by hand.',
        'Per-project error isolation: a failing repo is logged and skipped, so the sync continues.',
        'The scan degrades gracefully when a data source is unavailable, rather than failing the whole run.',
        'Configurable scan roots: scanning can be limited to chosen folders for speed and privacy.',
      ],
      challenges: [
        'Telling real projects apart from tutorials, vendored code and generic folders took multi-heuristic filtering.',
        'Nested repositories (a vault that is itself a git repo containing more repos) meant the walker could not stop at the first .git.',
        'Matching local repos to their GitHub counterparts across ssh and https remote formats.',
        'Keeping the Obsidian sync idempotent while preserving hand-written content.',
        'Windows path handling: illegal filename characters, symlink loops and full-disk scan performance.',
      ],
      outcomes: [
        'Used as my own monitoring and productivity layer: one place shows what is active, paused or abandoned across all my repos.',
        'Project notes and a daily commit log sync into the vault automatically.',
      ],
      privacyNote: 'Overview of my own internal tooling. Full code and a deeper walk-through are available on request.',
    },
  },
  {
    id: 'belgrade-buddy',
    title: 'BelgradeBuddy AI',
    subtitle: 'AI companion app for international visitors',
    blurb:
      'A React Native and Supabase app for international visitors to Belgrade. The AI chat routes each question to a model that balances quality, latency and cost, and an arrival wizard covers the first hour after arriving. The interface is in English, Serbian and more.',
    year: '2025–now',
    status: 'Active development',
    statusNote: 'Mobile, in development',
    featured: true,
    categories: ['Mobile', 'AI & Automation', 'Web & Apps'],
    tech: ['React Native (Expo)', 'NativeWind', 'Supabase', 'Edge Functions', 'OpenRouter / Claude', 'i18n'],
    highlights: [
      'Context-aware AI chatbot with smart model routing to balance quality, latency and cost.',
      'Offline-first by design: the phrasebook and FAQ keep working with no signal, built for stressed travelers in low-connectivity moments.',
      'Real-time features via Supabase, an arrival wizard for high-stress first-hour scenarios, and full internationalization (EN/SR + more).',
      'Heavy focus on graceful degradation and genuinely helpful error states.',
    ],
    note: 'Large solo product with a full spec and a phased roadmap, in active development.',
    notes: ['Built to degrade gracefully, with helpful error states.'],
    figure: {
      kind: 'signal',
      caption: 'What works where',
      aside: 'Offline-first by design',
      online: { label: 'Online', note: 'AI chat with model routing, and the real-time features' },
      offline: { label: 'No signal', note: 'The phrasebook and FAQ keep working' },
    },
  },

  // ---------- Smaller projects ----------
  {
    id: 'crypto-agent',
    title: 'cryptoAgent',
    subtitle: 'The tradingAgent playbook applied to a crypto portfolio',
    blurb:
      'A sibling of tradingAgent applying the same reliable-automation playbook to crypto portfolio management.',
    year: '2025',
    status: 'Active development',
    featured: false,
    categories: ['AI & Automation'],
    tech: ['Python', 'REST APIs'],
    highlights: [
      'Reuses the observability, retry and guardrail patterns from tradingAgent for a different asset class and exchange APIs.',
    ],
  },
  {
    id: 'student-brain-agent',
    title: 'student-brain-agent',
    subtitle: 'Turns study material into linked notes in Obsidian',
    blurb:
      'A Node.js AI agent that processes academic material and generates structured notes in an Obsidian knowledge base.',
    year: '2025',
    status: 'Maintained',
    featured: false,
    categories: ['AI & Automation', 'Tooling & Observability'],
    tech: ['Node.js', 'Obsidian API'],
    highlights: [
      'Turns raw study material into linked, structured notes, part of the same second-brain ecosystem as dev-dashboard.',
    ],
  },
  {
    id: 'brand-app',
    title: 'Brand Management App',
    subtitle: 'CRUD single-page app with component and integration tests',
    blurb:
      'A React + TypeScript SPA for managing brand entries with full CRUD, client-side routing and a component/integration test suite.',
    year: '2024',
    status: 'Completed',
    featured: false,
    categories: ['Web & Apps'],
    tech: ['React 18', 'TypeScript', 'Vite', 'Vitest', 'Testing Library'],
    highlights: ['Full CRUD with form validation and client-side routing, backed by Vitest + Testing Library tests.'],
  },
  {
    id: 'dsa-java',
    title: 'Data Structures & Algorithms',
    subtitle: 'Eight Java projects: linked and circular lists, binary trees, sorting',
    blurb:
      'Eight Java projects covering linked lists, circular lists, binary trees and sorting algorithms, completed across exam cycles.',
    year: '2024',
    status: 'Completed',
    featured: false,
    categories: ['Tooling & Observability'],
    tech: ['Java', 'Eclipse'],
    highlights: ['Singly/doubly/circular linked lists, binary trees and sorting algorithms implemented from scratch.'],
  },
];

/** Client sites, live (the index). */
export const clientProjects = projects.filter((p) => p.categories.includes('Client Delivery'));
/** Systems of my own (each with a figure). */
export const systemProjects = projects.filter((p) => p.featured && !p.categories.includes('Client Delivery'));
/** Smaller projects (the compact list). */
export const smallerProjects = projects.filter((p) => !p.featured);
/** Projects with a `#project/<id>` case study page. */
export const studyProjects = projects.filter((p): p is StudyProject => Boolean(p.caseStudy));
/** The projects the CV sheet lists, in order. */
export const cvProjectIds = ['mesara', 'trading-agent', 'dev-dashboard', 'belgrade-buddy', 'pilatiq'] as const;

export function projectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

/** The home-page anchor of a project's row: `client-`, `system-` or `also-` + id. */
export function projectAnchor(p: Project): string {
  if (p.categories.includes('Client Delivery')) return `client-${p.id}`;
  if (p.featured) return `system-${p.id}`;
  return `also-${p.id}`;
}

/** Hostname of the live site without 'www.' ('rostiljsisko.rs'), if there is one. */
export function projectDomain(p: Project): string | undefined {
  return p.liveUrl ? domainOf(p.liveUrl) : undefined;
}
