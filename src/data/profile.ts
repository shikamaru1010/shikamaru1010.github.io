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
  lede: 'I’m a software engineering intern at Podyx and a 4th-year Information Systems & Technologies student at FON, University of Belgrade. Since 2023 I have delivered websites and internal tools for local businesses, and I build automation systems in Python and TypeScript with monitoring, guardrails and human approval steps.',
  cvSummary:
    'Software engineering intern at Podyx and 4th-year Information Systems & Technologies student at FON, University of Belgrade. Since 2023 I have built websites and internal tools for local businesses. Since 2025 I have also built my own agent pipelines, data pipelines and monitoring, with guardrails, retries and decision logs so a failure can be traced.',
  metaDescription:
    'Ratko Šišović, software developer in Belgrade. Software engineering intern at Podyx and 4th-year Information Systems student at FON, University of Belgrade.',
};

export type Profile = typeof profile;
