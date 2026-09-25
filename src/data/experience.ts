// Roles, education and languages. `start` / `end` are 'YYYY' or 'YYYY-MM';
// src/lib/format.ts turns them into periods ('Jul 2026–now').
export type Experience = {
  role: string;
  org: string;
  location: string;
  start: string;
  end?: string;
  points: string[];
  /** How many of `points` the CV sheet shows (the rest are covered by its Selected projects). All when absent. */
  cvPoints?: number;
  tech?: string[];
  /** The label on the hero's time axis, where `org` alone would not say the role ('Podyx, intern'). `org` when absent. */
  short?: string;
  /** What the role covers, in a few words: the hero's time axis reads it to screen readers after the label. */
  summary?: string;
};

export const experience: Experience[] = [
  {
    role: 'Software Engineering Intern',
    org: 'Podyx',
    location: 'Belgrade, hybrid/remote',
    start: '2026-07',
    short: 'Podyx, intern',
    summary: 'software engineering',
    points: [
      'Podyx is an all-in-one platform for podcast and creative studios: bookings, payments, invoicing and client management, used by more than 200 studios worldwide.',
      'I ship features and fixes in its production codebase, working through tickets and code review in an established team.',
    ],
  },
  {
    role: 'Web and Internal Tools Developer',
    org: 'Freelance',
    location: 'Belgrade',
    start: '2023',
    summary: 'websites and internal tools for local businesses',
    points: [
      'Websites and internal tools for local businesses, from the first conversation with the owner to deployment and ongoing support.',
      'For Mesara Šisko I built the internal system that produces daily P&L reports and the PDF declarations Serbian regulations require, on a schedule.',
      'I also delivered several client websites, working directly with the owners on requirements and iterations.',
    ],
    tech: ['Python/Django', 'JavaScript', 'Node.js', 'Docker', 'Tailwind', 'AI integrations'],
  },
  {
    role: 'Independent Systems',
    org: 'Personal projects',
    location: '',
    start: '2025',
    summary: 'agent pipelines, data pipelines and monitoring',
    points: [
      'Agent pipelines, data pipelines and monitoring of my own, built with guardrails and logs so a failure can be traced.',
      'tradingAgent runs a daily AI trading pipeline with FastAPI dashboards, circuit breakers and my approval on Telegram before anything executes.',
      'dev-dashboard monitors dozens of my repositories and syncs them into my Obsidian vault through git, GitHub and Obsidian integrations I wrote myself.',
    ],
    cvPoints: 1,
    tech: ['Python', 'TypeScript', 'Next.js', 'React Native', 'FastAPI', 'REST APIs'],
  },
];

export type Course = { name: string; detail?: string; featured?: boolean };

const courses: Course[] = [
  { name: 'Computer networks and internet technologies', detail: 'TCP/IP, HTTP, Wireshark, Python sockets', featured: true },
  { name: 'Software design', detail: 'GoF patterns, 3-tier architecture, Java and JDBC, a client-server project', featured: true },
  { name: 'Information systems design', detail: 'UML, requirements analysis, system modeling', featured: true },
  { name: 'Operations research 1 and 2', detail: 'linear programming, optimization, Markov chains', featured: true },
  { name: 'Mathematics', detail: 'calculus, discrete mathematics, probability and statistics, numerical analysis' },
  { name: 'Management and organization', detail: 'management, economics, systems theory' },
  { name: 'Databases', featured: true },
  { name: 'Data structures and algorithms', featured: true },
];

export const education = {
  school: 'Faculty of Organizational Sciences (FON), University of Belgrade',
  short: 'FON',
  university: 'University of Belgrade',
  field: 'Information Systems & Technologies',
  degree: 'B.Sc. Information Systems & Technologies',
  /** Not shown: it needs its English name first. */
  module: 'TEP module',
  start: 2023,
  expectedEnd: 2027,
  year: 4,
  detail:
    'FON pairs the technical core with management, economics and a lot of mathematics. Outside the curriculum I work hands-on with Wireshark, GNS3, Cisco Packet Tracer, Docker and Linux tooling.',
  courses,
};

export type Education = typeof education;

export type Language = {
  name: string;
  level: string;
  /** The level where a row is tight (the hero's strip). `level` when absent. */
  levelShort?: string;
};

export const languages: Language[] = [
  { name: 'Serbian', level: 'native' },
  { name: 'English', level: 'professional working proficiency', levelShort: 'professional working' },
];
