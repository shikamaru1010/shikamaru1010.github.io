export type Experience = {
  role: string;
  org: string;
  location: string;
  period: string;
  points: string[];
  tech?: string[];
};

export const experience: Experience[] = [
  {
    role: 'Freelance Web & Internal Tools Developer',
    org: 'Independent',
    location: 'Belgrade, Serbia',
    period: '2023 — Present',
    points: [
      'Deliver production web apps and internal tools for local businesses — from understanding the problem through development, deployment and ongoing support.',
      'Built a Django + AI internal system for a butcher/grill business: daily P&L reports, Serbian-regulation PDF declarations and scheduled cycles.',
      'Shipped a production catalog site (Pilatiq Reformeri) and several client websites, working directly with owners on requirements and iteration.',
    ],
    tech: ['Python/Django', 'JavaScript', 'Node.js', 'Docker', 'Tailwind', 'AI integrations'],
  },
  {
    role: 'Independent Systems Builder — Automation & Reliability',
    org: 'Personal projects',
    location: 'Remote',
    period: '2025 — Present',
    points: [
      'Build complex automated systems that must run reliably and stay diagnosable — agents, data pipelines and observability tooling.',
      'Built tradingAgent — a daily AI trading pipeline with live FastAPI dashboards, risk guardrails, circuit breakers and human-in-the-loop approval.',
      'Built dev-dashboard + "Brain" — monitoring over dozens of repos, syncing into a structured knowledge base with zero runtime dependencies.',
    ],
    tech: ['Python', 'TypeScript', 'Next.js', 'React Native', 'FastAPI', 'REST APIs'],
  },
];

export type Education = {
  school: string;
  degree: string;
  period: string;
  detail: string;
  courses: string[];
};

export const education: Education = {
  school: 'Faculty of Organizational Sciences (FON), University of Belgrade',
  degree: 'B.Sc. — Information Systems & Technologies (TEP module)',
  period: '2023 — Present (3rd year, expected 2027)',
  detail:
    'FON is the Faculty of Organizational Sciences — alongside the technical core, the programme builds management, economics and strong mathematics foundations (organizational + analytical thinking). Beyond the curriculum I work hands-on with Wireshark, GNS3, Cisco Packet Tracer, Docker and Linux tooling.',
  courses: [
    'Computer Networks & Internet Technologies — TCP/IP, HTTP, Wireshark, Python sockets',
    'Software Design — GoF patterns, 3-tier architecture, Java / JDBC, client-server project',
    'Information Systems Design — UML, requirements analysis, system modeling',
    'Operations Research 1 & 2 — linear programming, optimization, Markov chains',
    'Mathematics — Calculus, Discrete Mathematics, Probability & Statistics, Numerical Analysis',
    'Management & Organization — management, economics, systems theory (FON core)',
    'Databases, Data Structures & Algorithms',
  ],
};

export const languages = [
  { name: 'Serbian', level: 'Native' },
  { name: 'English', level: 'Professional working proficiency' },
];
