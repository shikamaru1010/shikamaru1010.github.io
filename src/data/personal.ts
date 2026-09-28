// Everything the Personal mode says, in one place so I can edit it.
import { profile } from './profile';

export type NowItem = { lead: string; text: string };
/** A domain of the vault. Only domains with a project or a text are drawn; the lede names all three. */
export type BrainDomain = { name: string; project?: { id: string; label: string }; text?: string };
export type ElsewhereLink = { label: string; href: string; text: string };
/** A group of the tools I work with every day: 5–10 in total, the ones I'd name first. */
export type ToolGroup = { label: string; items: string[] };

const now: NowItem[] = [
  { lead: 'Interning', text: 'at Podyx since July 2026, on a SaaS platform used by more than 200 studios.' },
  {
    lead: 'Building',
    text: 'BelgradeBuddy, a mobile app for visitors to Belgrade, with an offline phrasebook and FAQ.',
  },
  {
    lead: 'Running',
    text: 'tradingAgent, a daily S&P 500 rotation pipeline that waits for my approval before any trade. cryptoAgent applies the same approach to a crypto portfolio.',
  },
  {
    lead: 'Studying',
    text: 'Information Systems & Technologies at FON, 4th year. Graduation is planned for 2027.',
  },
];

const domains: BrainDomain[] = [
  {
    name: 'Student',
    project: { id: 'student-brain-agent', label: 'student-brain-agent' },
    text: 'turns study material into linked notes.',
  },
  {
    name: 'Developer',
    project: { id: 'dev-dashboard', label: 'dev-dashboard' },
    text: 'writes a note for every active project and keeps what I wrote by hand. A nightly task adds the day’s commits.',
  },
  { name: 'Life' },
];

const elsewhere: ElsewhereLink[] = [
  { label: 'GitHub', href: profile.github, text: profile.githubHandle },
  { label: 'LinkedIn', href: profile.linkedin, text: profile.linkedinHandle },
  { label: 'Email', href: `mailto:${profile.email}`, text: profile.email },
];

export const personal = {
  firstName: profile.firstName,
  nameCyrillic: ['Ратко', 'Шишовић'],
  signCaption: 'My name in Serbian Cyrillic.',
  /** The hero's one sentence, beside the photo. */
  line: 'I build tools for my own work and study.',
  /** The line under the first name. */
  intro: 'Based in Belgrade.',
  /**
   * Luminance-only copies of ratko-square.webp (scripts/image-variants.mjs): the duotone filter
   * keeps only luminance, so the colour file would look the same at five times the bytes.
   * `sizes` is the hero circle's width (monolith.css): one column on phones, four columns at
   * 721–860, three to 1100, two above. index.html's pre-paint script preloads the same srcset
   * and sizes (mode.test.ts checks).
   */
  photo: {
    src: '/ratko/ratko-square-l.webp',
    srcset: '/ratko/ratko-square-l-480.webp 480w, /ratko/ratko-square-l.webp 800w',
    sizes: '(max-width: 720px) 25vw, (max-width: 860px) 34vw, (max-width: 1100px) 25vw, 16vw',
    width: 800,
    height: 800,
    alt: 'Ratko outdoors in bright sun, wearing sunglasses and a hoodie',
  },
  nowHeading: 'Now',
  now,
  toolsLead: 'Daily tools',
  tools: [
    { label: 'Editor & AI', items: ['VS Code', 'Cursor', 'Claude Code'] },
    { label: 'Frontend', items: ['TypeScript', 'React', 'Next.js'] },
    { label: 'Backend', items: ['Python', 'Node.js', 'Supabase'] },
    { label: 'Workflow', items: ['Git', 'Docker'] },
  ] as ToolGroup[],
  thought: { heading: 'Today’s thought' },
  brain: {
    heading: 'Side projects',
    lede: 'One Obsidian vault, organized into three domains (student, developer and life), with notes and queries that link across them.',
    domains,
    plannedLead: 'Planned:',
    planned: 'an orchestrator that routes each request to the right agent and reads across all three.',
  },
  offlineHeading: 'Off screen',
  /** Renders only when filled. Only real things, written by me; never invented. */
  offline: [] as string[],
  elsewhereHeading: 'Elsewhere',
  elsewhere,
};

export type Personal = typeof personal;
