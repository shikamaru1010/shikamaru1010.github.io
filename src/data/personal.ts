// Everything the Personal mode says, in one place so I can edit it.
// Templates use {placeholders}, filled by fill() in src/lib/format.ts.
import { profile } from './profile';

export type NowItem = { lead: string; text: string };
export type BrainDomain = { name: string; project?: { id: string; label: string }; text?: string };
export type ElsewhereLink = { label: string; href: string; text: string };

export const personal = {
  firstName: profile.firstName,
  nameCyrillic: ['Ратко', 'Шишовић'],
  signCaption: 'My name in Serbian Cyrillic.',
  line: 'I build tools for my own work and study.',
  intro:
    'Fourth-year student at FON and software engineering intern at Podyx, based in Belgrade. Outside work and study I build tools for myself; two of them write into the same Obsidian vault.',
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
    note: 'I keep a daily engineering log, written in Serbian. Only the entry dates are shown here.',
    busiest: 'Busiest day: {count} entries on {date}',
    monthSummary: '{month}: {entries} entries on {days} days',
    monthCount: '{entries} entries on {days} days',
    oneEntry: 'One entry',
  },
  nowHeading: 'Now',
  nowUpdated: 'Updated {month}',
  nowUpdatedAt: '2026-09-25',
  now: [
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
      text: 'Information Systems and Technologies at FON, fourth year. Graduation is planned for 2027.',
    },
  ] as NowItem[],
  toolsLead: 'Daily tools:',
  tools: ['Obsidian', 'the terminal', 'Git', 'Claude Code', 'Grok'],
  thought: {
    heading: 'Today’s thought',
    provenance: 'Selected each morning by a GitHub Action from {poolSize} verified quotes.',
  },
  brain: {
    heading: 'Side projects',
    sub: 'Tools built for my own use',
    lede: 'One Obsidian vault, organised into three domains, with notes and queries that link across them.',
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
