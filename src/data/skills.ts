// Skills by area: the site's Skills section and the CV's skills lines.
/**
 * `name` is written as it reads mid-sentence: proper names capitalized ('Python'), common
 * nouns in lower case ('agent pipelines'). The Skills section capitalizes the first letter;
 * the CV joins them into one line and capitalizes only the first.
 * `cvOnly`: listed on the CV but not in the site's Skills section, where Experience already
 * says it (the FON coursework and the tools used alongside it).
 */
export type Skill = { name: string; cvOnly?: boolean };
export type SkillGroup = { label: string; skills: Skill[]; cvOnly?: boolean };

export const skillGroups: SkillGroup[] = [
  {
    label: 'Programming languages',
    skills: [{ name: 'Python' }, { name: 'TypeScript' }, { name: 'JavaScript, HTML and CSS' }, { name: 'Java' }, { name: 'SQL' }],
  },
  {
    label: 'Frameworks',
    skills: [
      { name: 'Next.js' },
      { name: 'React' },
      { name: 'React Native (Expo)' },
      { name: 'Django' },
      { name: 'FastAPI' },
      { name: 'Node.js' },
      { name: 'Vite' },
    ],
  },
  {
    label: 'Databases',
    skills: [{ name: 'PostgreSQL / Supabase' }, { name: 'SQLite' }, { name: 'MySQL, Oracle', cvOnly: true }],
  },
  {
    label: 'AI and automation',
    skills: [{ name: 'Claude and OpenRouter tool use' }, { name: 'agent pipelines' }, { name: 'APScheduler' }, { name: 'data pipelines' }],
  },
  {
    label: 'Tools and workflow',
    skills: [{ name: 'Git and GitHub' }, { name: 'PowerShell and bash' }, { name: 'Docker' }, { name: 'Obsidian' }],
  },
  {
    label: 'Networking and CS',
    cvOnly: true,
    skills: [
      { name: 'TCP/IP, HTTP, Wireshark, sockets' },
      { name: 'GNS3, Cisco Packet Tracer' },
      { name: 'optimization and operations research' },
    ],
  },
  {
    label: 'Practice',
    skills: [{ name: 'REST APIs' }, { name: 'internationalization' }, { name: 'testing with Vitest' }, { name: 'observability and logging' }],
  },
];

/** Real skills the groups do not name. */
export const alsoUsed = ['Figma', 'Agile', 'technical writing'];

/** The Skills section on the site: everything that is not CV-only. */
export const siteSkillGroups: SkillGroup[] = skillGroups
  .filter((g) => !g.cvOnly)
  .map((g) => ({ ...g, skills: g.skills.filter((s) => !s.cvOnly) }))
  .filter((g) => g.skills.length > 0);
