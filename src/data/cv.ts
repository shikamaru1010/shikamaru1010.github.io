// The CV's own copy, in CV register: no first person, every point opens with a verb, and numbers
// wherever the data has one. Names, dates, links and schools come from profile / experience /
// projects, so the site and the CV cannot disagree on a fact. src/lib/cv.ts turns this into the one
// structure every format is written from: the CV page and its PDF (Resume.tsx), and cv.md,
// resume.json, the DOCX and llms.txt (scripts/export-cv.mjs).
//
// ATS rules this copy follows: standard section names, one column, dates as "Mon YYYY – Present",
// skills as plain comma lists, and each claim traceable to the data. Edit freely, then run
// `npm run pdf` (it regenerates every format) and `npm run cv:audit`.

export type CvRole = {
  /** Matches an entry of experience.ts by its `org`: the dates come from there. */
  org: string;
  /** The title as a recruiter searches for it; experience.ts `role` when absent. */
  title?: string;
  /** How the employer reads on the CV; `org` when absent. */
  orgLabel?: string;
  url?: string;
  location: string;
  points: string[];
};

export type CvProject = {
  /** A projects.ts id (title, years and live URL come from there), or a free-standing entry. */
  id?: string;
  name?: string;
  url?: string;
  when?: string;
  stack: string[];
  points: string[];
};

export const cv = {
  /** The line under the name: the role the CV is for. The current job is in Experience. */
  title: 'Software Developer · Full-stack web and automation',
  /** Two sentences: who and where now; what was delivered, with what, and how. */
  summary: [
    'Software engineering intern at Podyx and 4th-year Information Systems & Technologies student at FON, University of Belgrade (B.Sc. expected 2027).',
    'Since 2023, delivered four production websites and an internal operations system for local businesses, working directly with the owners from requirements to deployment.',
  ],
  /** Plain keyword lines: ATS match these literally, so each item is the name a job ad would use. */
  skills: [
    { label: 'Programming languages', items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL', 'HTML', 'CSS'] },
    { label: 'Frontend', items: ['React', 'Next.js', 'React Native (Expo)', 'Tailwind CSS', 'Vite', 'Zustand'] },
    { label: 'Backend and data', items: ['Node.js', 'FastAPI', 'Django', 'REST APIs', 'PostgreSQL', 'Supabase', 'SQLite', 'MySQL', 'Oracle'] },
    { label: 'AI and automation', items: ['Claude API (tool use)', 'OpenRouter', 'LLM agent pipelines', 'APScheduler'] },
    { label: 'DevOps and tools', items: ['Git', 'GitHub Actions (CI/CD)', 'Docker', 'Vercel', 'Linux', 'Bash', 'PowerShell', 'Figma'] },
    { label: 'Testing and practice', items: ['Vitest', 'Testing Library', 'i18n', 'logging and observability', 'Agile'] },
  ],
  experience: [
    {
      org: 'Podyx',
      url: 'https://www.podyx.com/',
      location: 'Belgrade, Serbia (hybrid)',
      points: [
        'Ship features and fixes in the production codebase of an all-in-one SaaS platform for podcast and creative studios (bookings, payments, invoicing), used by more than 200 studios worldwide.',
        'Work through tickets and code review in an established engineering team.',
      ],
    },
    {
      org: 'Freelance',
      title: 'Freelance Web and Internal Tools Developer',
      orgLabel: 'Self-employed',
      location: 'Belgrade, Serbia',
      points: [
        'Delivered four production websites for local businesses (Mesara Šisko, Pilatiq Reformeri, Stan Pro Tim, Kutlešić Vikendice), working directly with the owners from requirements to deployment and support.',
        'Built the internal operations system for Mesara Šisko (Django, APScheduler, Claude agents): scheduled daily sales, cost and P&L reports and the PDF declarations Serbian regulations require, replacing daily manual work.',
        'Built the same client’s bilingual (Serbian/English) QR menu and ordering app in Next.js, React and Supabase: real-time order sync between kitchen and guests, server-side validation of order totals, email notifications; Dockerized and deployed on Vercel.',
      ],
    },
  ] as CvRole[],
  projects: [
    {
      id: 'trading-agent',
      stack: ['Python', 'FastAPI', 'Claude API', 'Interactive Brokers / Alpaca', 'Telegram'],
      points: [
        'Automated a daily S&P 500 rotation: concurrent price fetch for about 500 tickers, technical and fundamental scoring, risk-aware sizing, and FastAPI dashboards for the portfolio, P&L and each decision.',
        'Added circuit breakers, position limits, retries and persisted state; no order executes before a human approves it on Telegram.',
      ],
    },
    {
      id: 'dev-dashboard',
      stack: ['Next.js', 'TypeScript', 'Node.js', 'GitHub API'],
      points: [
        'Built a dashboard that scans dozens of local and GitHub repositories, marks each project active, paused or abandoned, and writes a note per active project into an Obsidian vault; the git, GitHub and Obsidian integrations use no third-party runtime dependencies.',
      ],
    },
    {
      id: 'belgrade-buddy',
      stack: ['React Native (Expo)', 'Supabase', 'OpenRouter / Claude'],
      points: [
        'Building a mobile app for international visitors to Belgrade: an AI chat that picks a model for each question by quality, latency and cost, plus an offline phrasebook and FAQ.',
      ],
    },
  ] as CvProject[],
  education: {
    coursework:
      'Software design (GoF patterns, 3-tier architecture), databases, data structures and algorithms, information systems design (UML), computer networks (TCP/IP, HTTP), operations research',
  },
  /** Section names exactly as ATS expect them. */
  headings: {
    summary: 'Summary',
    skills: 'Technical Skills',
    experience: 'Experience',
    projects: 'Projects',
    education: 'Education',
    languages: 'Languages',
  },
  /** PDF metadata (scripts/generate-pdf.mjs) and the JSON Resume label. */
  subject: 'Software developer, full-stack web and automation, Belgrade, Serbia',
};

export type Cv = typeof cv;
