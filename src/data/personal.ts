// Everything the Personal mode says, in one place so I can edit it.
// Templates use {placeholders}, filled by fill() in src/lib/format.ts.
import { profile } from './profile';

export type NowItem = { lead: string; text: string };
export type BrainDomain = { name: string; project?: { id: string; label: string }; text?: string };
export type ElsewhereLink = { label: string; href: string; text: string };

export const personal = {
  firstName: profile.firstName,
  nameCyrillic: ['Ратко', 'Шишовић'],
  signCaption: 'Same name, in Serbian Cyrillic.',
  line: 'I write down what I build.',
  intro:
    'Fourth-year student at FON, intern at Podyx, based in Belgrade. Outside work and study I build tools for myself, and two of them write into the same Obsidian vault.',
  photo: {
    src: '/ratko/ratko-square.webp',
    width: 800,
    height: 800,
    alt: 'Ratko outdoors in bright sun, wearing sunglasses and a hoodie',
  },
  log: {
    heading: 'Work log',
    asOf: 'As of {date}',
    headline: '{total} entries on {days} days since {first}.',
    note: 'The log is called dnevnik and it is written in Serbian. Only the dates are public, never the entries.',
    busiest: 'Busiest day: {count} entries on {date}',
    monthSummary: '{month}: {entries} entries on {days} days',
  },
  nowHeading: 'Now',
  nowUpdated: 'Updated {month}',
  nowUpdatedAt: '2026-09-25',
  now: [
    { lead: 'Interning', text: 'at Podyx since July, on a product more than 200 studios use.' },
    {
      lead: 'Building',
      text: 'BelgradeBuddy, an app for people who have just arrived in my city. The phrasebook has to work when the signal doesn’t.',
    },
    {
      lead: 'Running',
      text: 'tradingAgent, a daily S&P 500 rotation with a human in the loop: me. Its sibling, cryptoAgent, applies the same patterns to a crypto portfolio.',
    },
    {
      lead: 'Studying',
      text: 'Information Systems and Technologies at FON, fourth year. Graduation is planned for 2027.',
    },
  ] as NowItem[],
  toolsLead: 'Tools I live in:',
  tools: ['Obsidian', 'the terminal', 'Git', 'Claude Code', 'Grok'],
  thought: {
    heading: 'Today’s thought',
    provenance: 'Today’s thought. Picked each morning by a GitHub Action from {poolSize} quotes I’ve checked.',
  },
  brain: {
    heading: 'The Brain',
    sub: 'Side projects, mostly built for myself',
    lede: 'One Obsidian vault, three domains, and links and queries that reach across all of them.',
    domains: [
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
    ] as BrainDomain[],
    emptyText: 'No agent yet.',
    plannedLead: 'Planned:',
    planned: 'an orchestrator that routes each request to the right agent and reads across all three.',
  },
  offlineHeading: 'Off screen',
  /** Renders only when filled. Only real things, written by me; never invented. */
  offline: [] as string[],
  elsewhereHeading: 'Elsewhere',
  elsewhere: [
    { label: 'GitHub', href: profile.github, text: profile.githubHandle },
    { label: 'LinkedIn', href: profile.linkedin, text: profile.linkedinHandle },
    { label: 'Email', href: `mailto:${profile.email}`, text: profile.email },
  ] as ElsewhereLink[],
  footPlace: profile.city,
};

export type Personal = typeof personal;
