export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'HTML / CSS'],
  },
  {
    label: 'Frameworks',
    items: ['Next.js', 'React', 'React Native (Expo)', 'Vite', 'FastAPI', 'Node.js'],
  },
  {
    label: 'Databases',
    items: ['PostgreSQL / Supabase', 'SQLite', 'MySQL', 'Oracle'],
  },
  {
    label: 'AI & Automation',
    items: ['Claude / OpenRouter tool-use', 'Grok', 'Agent pipelines', 'APScheduler', 'Data pipelines'],
  },
  {
    label: 'Tools & Workflow',
    items: ['CLI / Terminal (PowerShell, bash)', 'Git & GitHub', 'Docker', 'Obsidian', 'Figma'],
  },
  {
    label: 'Networking & CS',
    items: ['TCP/IP', 'Wireshark', 'Socket programming', 'GNS3', 'Cisco Packet Tracer', 'Optimization / OR'],
  },
  {
    label: 'Practices',
    items: ['REST APIs', 'i18n', 'Testing (Vitest)', 'Observability & logging', 'Agile', 'Technical writing'],
  },
];

// Highlighted differentiators shown near the top of the page.
export const principles: { title: string; body: string }[] = [
  {
    title: 'Make the invisible visible',
    body: 'Every system I build gets dashboards, structured logs and clear state. If I can’t see what’s happening in ten seconds, it isn’t done.',
  },
  {
    title: 'Fail safely and explainably',
    body: 'Circuit breakers, limits, approval gates, offline fallbacks and decision logs. When external APIs misbehave, the system degrades gracefully and leaves a trail.',
  },
  {
    title: 'Design for the person on the other end',
    body: 'Whether it’s a stressed traveller or a business owner running daily reports, the interface and error messages have to actually help.',
  },
];
