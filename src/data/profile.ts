// Who I am, in one place. Kept import-free: scripts/generate-og.mjs imports it
// with Node's type stripping.
export const profile = {
  name: 'Ratko Šišović',
  firstName: 'Ratko',
  lastName: 'Šišović',
  role: 'Software developer',
  location: 'Belgrade, Serbia',
  city: 'Belgrade',
  email: 'ralesisko@gmail.com',
  github: 'https://github.com/shikamaru1010',
  githubHandle: 'shikamaru1010',
  linkedin: 'https://www.linkedin.com/in/ratko%C5%A1i%C5%A1ovi%C4%87/',
  linkedinHandle: 'ratkošišović',
  siteUrl: 'https://shikamaru1010.github.io',
  availability: 'Open to future opportunities.',
  /** The hero's one sentence; who, where and since when are in the hero's time axis. */
  lede: 'I build websites and internal tools for local businesses, and automation systems in Python and TypeScript.',
  /** Under the CV's role line, which already says Podyx and FON: only what that line lacks. */
  cvSummary:
    'Since 2023 I have built websites and internal tools for local businesses, and since 2025 automation systems of my own in Python and TypeScript.',
  metaDescription:
    'Ratko Šišović, software developer in Belgrade. Software engineering intern at Podyx and 4th-year Information Systems student at FON, University of Belgrade.',
};

export type Profile = typeof profile;
