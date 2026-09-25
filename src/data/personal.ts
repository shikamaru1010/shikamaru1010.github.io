// Everything the Personal mode says, in one place so I can edit it.
// Templates use {placeholders}, filled by fill() in src/lib/format.ts.
import { profile } from './profile';

export type NowItem = { lead: string; text: string };
/** A domain of the vault. Only domains with a project or a text are drawn; the lede names all three. */
export type BrainDomain = { name: string; project?: { id: string; label: string }; text?: string };
export type ElsewhereLink = { label: string; href: string; text: string };

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
  line: 'I build tools for my own work and study.',
  intro: 'Based in Belgrade. Two of these tools, student-brain-agent and dev-dashboard, write into the same Obsidian vault.',
  /**
   * Luminance-only copies of ratko-square.webp (scripts/image-variants.mjs): the duotone filter
   * keeps only luminance, so the colour file would look the same at five times the bytes.
   * index.html's pre-paint script preloads the same srcset and sizes (mode.test.ts checks).
   */
  photo: {
    src: '/ratko/ratko-square-l.webp',
    srcset: '/ratko/ratko-square-l-480.webp 480w, /ratko/ratko-square-l.webp 800w',
    sizes: '(max-width: 720px) calc(100vw - 32px), (max-width: 1100px) 50vw, 40vw',
    width: 800,
    height: 800,
    alt: 'Ratko outdoors in bright sun, wearing sunglasses and a hoodie',
  },
  log: {
    heading: 'Work log',
    asOf: 'As of {date}',
    headline: '{total} entries on {days} days since {first}.',
    note: 'I keep a daily engineering log, written in Serbian. Only the entry dates are shown here.',
    busiest: 'Busiest day: {count} entries on {date}',
    monthSummary: '{month}: {entries} entries on {days} days',
    monthCount: '{entries} entries on {days} days',
    oneEntry: 'One entry',
    /** The templates say "entries" and "days"; where a count is 1, these words replace them. */
    singular: { entries: 'entry', days: 'day' },
  },
  nowHeading: 'Now',
  nowUpdated: 'Updated {date}',
  nowUpdatedAt: '2026-09-25',
  now,
  toolsLead: 'Daily tools:',
  tools: ['Obsidian', 'the terminal', 'Git', 'Claude Code', 'Grok'],
  thought: {
    heading: 'Today’s thought',
    provenance: 'Selected each morning by a GitHub Action from a list of {poolSize} quotes.',
  },
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
  footPlace: profile.city,
};

export type Personal = typeof personal;
