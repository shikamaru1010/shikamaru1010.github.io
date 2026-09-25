// Each skill next to where it was used. Evidence points at real project ids
// (src/data/projects.ts) or FON courses (education.courses in experience.ts);
// data.test.ts checks that every reference resolves.
export type Evidence = { project: string; part?: string } | { course: string } | { text: string };
export type Skill = { name: string; evidence: Evidence[] };
export type SkillGroup = { label: string; skills: Skill[] };

const internal = 'internal system';
const menu = 'QR menu';

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    skills: [
      { name: 'Python', evidence: [{ project: 'trading-agent' }, { project: 'crypto-agent' }, { project: 'mesara', part: internal }] },
      { name: 'TypeScript', evidence: [{ project: 'dev-dashboard' }, { project: 'mesara', part: menu }, { project: 'brand-app' }] },
      { name: 'JavaScript, HTML and CSS', evidence: [{ project: 'stan-pro-tim' }, { project: 'kutlesic-vikendice' }] },
      { name: 'Java', evidence: [{ project: 'dsa-java' }, { course: 'Software design' }] },
      { name: 'SQL', evidence: [{ project: 'mesara', part: internal }, { course: 'Databases' }] },
    ],
  },
  {
    label: 'Frameworks',
    skills: [
      { name: 'Next.js', evidence: [{ project: 'mesara', part: menu }, { project: 'dev-dashboard' }] },
      { name: 'React', evidence: [{ project: 'pilatiq' }, { project: 'brand-app' }, { project: 'mesara', part: menu }] },
      { name: 'React Native (Expo)', evidence: [{ project: 'belgrade-buddy' }] },
      { name: 'Django', evidence: [{ project: 'mesara', part: internal }] },
      { name: 'FastAPI', evidence: [{ project: 'trading-agent' }] },
      { name: 'Node.js', evidence: [{ project: 'student-brain-agent' }, { project: 'dev-dashboard' }] },
      { name: 'Vite', evidence: [{ project: 'pilatiq' }, { project: 'brand-app' }] },
    ],
  },
  {
    label: 'Databases',
    skills: [
      { name: 'PostgreSQL / Supabase', evidence: [{ project: 'mesara', part: menu }, { project: 'belgrade-buddy' }] },
      { name: 'SQLite', evidence: [{ project: 'mesara', part: internal }] },
      { name: 'MySQL, Oracle', evidence: [{ course: 'Databases' }] },
    ],
  },
  {
    label: 'AI and automation',
    skills: [
      { name: 'Claude and OpenRouter tool use', evidence: [{ project: 'trading-agent' }, { project: 'mesara' }, { project: 'belgrade-buddy' }] },
      { name: 'Agent pipelines', evidence: [{ project: 'trading-agent' }, { project: 'mesara', part: internal }, { project: 'student-brain-agent' }] },
      { name: 'APScheduler', evidence: [{ project: 'mesara', part: internal }] },
      { name: 'Data pipelines', evidence: [{ project: 'trading-agent' }] },
    ],
  },
  {
    label: 'Tools and workflow',
    skills: [
      { name: 'Git and GitHub', evidence: [{ project: 'dev-dashboard' }] },
      { name: 'The terminal (PowerShell, bash)', evidence: [{ project: 'dev-dashboard', part: 'nightly git log' }] },
      { name: 'Docker', evidence: [{ project: 'mesara' }] },
      { name: 'Obsidian', evidence: [{ project: 'dev-dashboard' }, { project: 'student-brain-agent' }] },
    ],
  },
  {
    label: 'Networking and CS',
    skills: [
      { name: 'TCP/IP, HTTP, Wireshark, sockets', evidence: [{ course: 'Computer networks and internet technologies' }] },
      { name: 'GNS3, Cisco Packet Tracer', evidence: [{ text: 'Hands-on, alongside the FON curriculum' }] },
      { name: 'Optimization and operations research', evidence: [{ course: 'Operations research 1 and 2' }] },
    ],
  },
  {
    label: 'Practice',
    skills: [
      { name: 'REST APIs', evidence: [{ project: 'crypto-agent' }, { project: 'mesara', part: 'ordering API' }] },
      { name: 'Internationalization', evidence: [{ project: 'mesara' }, { project: 'belgrade-buddy' }] },
      { name: 'Testing with Vitest', evidence: [{ project: 'brand-app' }] },
      { name: 'Observability and logging', evidence: [{ project: 'dev-dashboard' }, { project: 'trading-agent' }] },
    ],
  },
];

/** Real skills with no project on the site to point to. */
export const alsoUsed = ['Figma', 'Grok', 'Agile', 'technical writing'];
