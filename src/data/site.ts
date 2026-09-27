// UI chrome: every label, title and template the interface prints that is not
// a fact about me. Facts live in profile / experience / projects / skills /
// personal. Templates use {placeholders}, filled by fill() in src/lib/format.ts.
export const site = {
  titles: {
    professional: 'Ratko Šišović · Software developer',
    personal: 'Ratko · Personal',
    cv: 'Ratko Šišović · CV',
    study: '{project} · Case study · Ratko Šišović',
  },
  themeColor: { professional: '#F2F1EC', personal: '#15130F' },
  skip: 'Skip to content',
  newTab: '(opens in a new tab)',
  mode: {
    groupLabel: 'Site mode',
    labels: { professional: 'Professional', personal: 'Personal' },
    announce: { professional: 'Professional mode', personal: 'Personal mode' },
  },
  nav: {
    label: 'Sections',
    professional: [
      { href: '#work', label: 'Work' },
      { href: '#experience', label: 'Experience' },
      { href: '#skills', label: 'Skills' },
      { href: '#contact', label: 'Contact' },
    ],
    personal: [
      { href: '#now', label: 'Now' },
      { href: '#brain', label: 'Side projects' },
      { href: '#elsewhere', label: 'Elsewhere' },
    ],
    cv: 'CV',
  },
  turnPage: {
    toPersonal: 'Switch to the personal side',
    toProfessional: 'Switch to the professional side',
  },
  hero: {
    role: '{role}, {city}',
    viewCv: 'View CV',
    /** The time axis: one bar per role since its start, and the degree to its expected end. */
    axis: {
      caption: 'Work and study since {year}',
      since: 'since {point}',
      study: '{school}, {ordinal} year',
      expected: 'B.Sc. expected {year}',
      studyDetail: '{field}, {school}, since {start}',
      /** Read by screen readers after a bar's label. */
      detail: ': {detail}',
    },
    /** The strip under the axis. Its terms are for screen readers only. */
    strip: { languages: 'Languages', contact: 'Contact', language: '{name} ({level})' },
  },
  work: {
    heading: 'Work',
    clients: 'Client work',
    systems: 'Systems and automation',
    smaller: 'Other projects',
    tableCaption: 'Client websites, with the stack, engineering notes and years of each',
    columns: {
      client: 'Client',
      about: 'About',
      stack: 'Stack and engineering notes',
      year: 'Year',
      shot: 'Phone screenshot',
    },
    plateLabel: 'Screenshots of the selected client site',
    caseStudy: 'Case study',
  },
  experience: {
    heading: 'Experience',
    coursework: 'Relevant coursework',
    eduMeta: '{short}, {university} · {ordinal} year',
  },
  skills: {
    heading: 'Skills',
    also: 'Also: {list}.',
  },
  contact: {
    heading: 'Contact',
    copy: 'Copy address',
    copied: 'Copied',
    copyFailed: 'Could not copy. The address is {email}.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    code: 'Code',
    codeNote: 'Client repositories and the trading strategy are private. I am happy to walk through the code and architecture on request.',
  },
  cv: {
    label: 'CV',
    /** The one-page PDF that `npm run pdf` writes into public/. */
    pdf: '/Ratko_Sisovic_CV.pdf',
    back: 'Back to the site',
    download: 'Download PDF',
    print: 'Print',
    experience: 'Experience',
    projects: 'Selected projects',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    coursework: 'Coursework',
    also: 'Also',
    updated: 'Updated {date}',
    /** The line under the name: the current role and the year of study. */
    roleLine: '{role} at {org} · {ordinal}-year student at {school}',
    /** The degree's period and year of study. */
    eduYears: '{period}, {ordinal} year',
  },
  study: {
    label: 'Case study',
    headNav: 'Links',
    nextNav: 'Case studies',
    back: 'Back to the site',
    next: 'Next case study',
    meta: { status: 'Status', years: 'Years', stack: 'Stack', live: 'Live site' },
    sections: {
      metrics: 'At a glance',
      architecture: 'Architecture',
      flow: 'How it works',
      decisions: 'Decisions',
      guardrails: 'Guardrails',
      challenges: 'Challenges',
      outcomes: 'Outcomes',
      privacy: 'Privacy',
    },
    legend: { system: 'Automated step', person: 'Human step' },
  },
};

export type Site = typeof site;
