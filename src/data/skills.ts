// Each skill next to where it was used. Evidence points at real project ids
// (src/data/projects.ts) or FON courses (education.courses in experience.ts);
// data.test.ts checks that every reference resolves.
export type Evidence = { project: string; part?: string } | { course: string } | { text: string };
/**
 * `name` is written as it reads mid-sentence: proper names capitalized ('Python'), common
 * nouns in lower case ('agent pipelines'). The Skills table capitalizes the first letter;
 * the CV joins them into one line and capitalizes only the first.
 * `cvOnly`: listed on the CV but not in the site's Skills table, where Experience already
 * says it (the FON coursework and the tools used alongside it).
 */
export type Skill = { name: string; evidence: Evidence[]; cvOnly?: boolean };
export type SkillGroup = { label: string; skills: Skill[]; cvOnly?: boolean };

const internal = 'internal system';
const menu = 'QR menu';

export const skillGroups: SkillGroup[] = [
  {
    label: 'Programming languages',
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
      { name: 'MySQL, Oracle', evidence: [{ course: 'Databases' }], cvOnly: true },
    ],
  },
  {
    label: 'AI and automation',
    skills: [
      { name: 'Claude and OpenRouter tool use', evidence: [{ project: 'trading-agent' }, { project: 'mesara' }, { project: 'belgrade-buddy' }] },
      { name: 'agent pipelines', evidence: [{ project: 'trading-agent' }, { project: 'mesara', part: internal }, { project: 'student-brain-agent' }] },
      { name: 'APScheduler', evidence: [{ project: 'mesara', part: internal }] },
      { name: 'data pipelines', evidence: [{ project: 'trading-agent' }] },
    ],
  },
  {
    label: 'Tools and workflow',
    skills: [
      { name: 'Git and GitHub', evidence: [{ project: 'dev-dashboard' }] },
      { name: 'PowerShell and bash', evidence: [{ project: 'dev-dashboard', part: 'nightly git log' }] },
      { name: 'Docker', evidence: [{ project: 'mesara' }] },
      { name: 'Obsidian', evidence: [{ project: 'dev-dashboard' }, { project: 'student-brain-agent' }] },
    ],
  },
  {
    label: 'Networking and CS',
    cvOnly: true,
    skills: [
      { name: 'TCP/IP, HTTP, Wireshark, sockets', evidence: [{ course: 'Computer networks and internet technologies' }] },
      { name: 'GNS3, Cisco Packet Tracer', evidence: [{ text: 'Hands-on, alongside the FON curriculum' }] },
      { name: 'optimization and operations research', evidence: [{ course: 'Operations research 1 and 2' }] },
    ],
  },
  {
    label: 'Practice',
    skills: [
      { name: 'REST APIs', evidence: [{ project: 'crypto-agent' }, { project: 'mesara', part: 'ordering API' }] },
      { name: 'internationalization', evidence: [{ project: 'mesara' }, { project: 'belgrade-buddy' }] },
      { name: 'testing with Vitest', evidence: [{ project: 'brand-app' }] },
      { name: 'observability and logging', evidence: [{ project: 'dev-dashboard' }, { project: 'trading-agent' }] },
    ],
  },
];

/** Real skills with no project on the site to point to. */
export const alsoUsed = ['Figma', 'Agile', 'technical writing'];

/** The Skills table on the site: everything that is not CV-only. */
export const siteSkillGroups: SkillGroup[] = skillGroups
  .filter((g) => !g.cvOnly)
  .map((g) => ({ ...g, skills: g.skills.filter((s) => !s.cvOnly) }))
  .filter((g) => g.skills.length > 0);
