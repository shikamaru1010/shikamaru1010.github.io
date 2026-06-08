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
  links?: ProjectLink[];
  note?: string;
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
    note: 'Private repo (contains API keys / strategy). Architecture and code walk-through available on request.',
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
    tech: ['Next.js 16', 'TypeScript', 'Tailwind 4', 'Git', 'GitHub API', 'Obsidian'],
    highlights: [
      'Scans dozens of repositories and GitHub accounts, then aggregates activity into one dashboard so I always know what is active and what needs attention.',
      'Syncs into a structured second-brain knowledge base (developerBrain) — searchable history and structured data, exactly what good operational systems need.',
      'Zero third-party runtime dependencies by design; custom git/GitHub/Obsidian integration libraries.',
      'Part of a larger personal automation + agent system (with a planned orchestrator that routes requests to the right agent).',
    ],
    note: 'Used daily as my own monitoring and productivity layer.',
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
    note: 'Private client repos. Delivered, in active use and maintained.',
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
    id: 'botakralj',
    title: 'Botakralj / Pilatiq',
    subtitle: 'Product catalog site for a Pilates equipment brand',
    blurb:
      'A production catalog website with visuals, product variants, SEO and client handoff, delivered over several sprints.',
    year: '2024',
    status: 'In production',
    featured: false,
    categories: ['Client Delivery', 'Web & Apps'],
    tech: ['React', 'Vite', 'SEO'],
    highlights: [
      'Visual design, product variants and a clean client handoff; iterated with the client across multiple sprints.',
    ],
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
    id: 'client-sites',
    title: 'Freelance client websites',
    subtitle: 'Stan Pro Tim · Kutlešić · restaurant menus',
    blurb:
      'Several delivered production websites for real clients — from requirements gathering and design to deployment and maintenance.',
    year: '2022 — 2024',
    status: 'In production',
    featured: false,
    categories: ['Client Delivery', 'Web & Apps'],
    tech: ['JavaScript', 'React', 'Node.js', 'Docker', 'HTML/CSS'],
    highlights: [
      'Stan Pro Tim (Zlatibor) property-management site, Kutlešić company site, and restaurant menu/ordering sites — each from brief to live, responsive delivery.',
    ],
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
