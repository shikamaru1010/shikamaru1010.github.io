export const profile = {
  name: 'Ratko Šišović',
  initials: 'RS',
  role: 'Software Developer',
  // Short, scannable positioning line shown in the hero.
  tagline: 'Full-stack · Automation & AI · Reliable systems',
  location: 'Belgrade, Serbia',
  status: 'Open to internships & remote / hybrid roles',
  education: '3rd-year Information Systems & Technologies — FON, University of Belgrade',

  email: 'ralesisko@gmail.com',
  github: 'https://github.com/shikamaru1010',
  githubHandle: 'shikamaru1010',
  linkedin: 'https://www.linkedin.com/in/ratko%C5%A1i%C5%A1ovi%C4%87/',
  linkedinHandle: 'ratkošišović',

  // Public URL of this site (GitHub Pages user site) — used by "Copy pitch".
  siteUrl: 'https://shikamaru1010.github.io',

  about: [
    'I build software that has to keep working — automated systems with real observability, full-stack web and mobile apps, and internal tools that businesses actually run on. I care about the unglamorous parts: clear logs, graceful failure, and interfaces people understand without a manual.',
    "I'm in my third year of Information Systems & Technologies at FON (University of Belgrade), where I've built strong fundamentals in software design, databases (Oracle, MySQL, SQLite), computer networks (TCP/IP, Wireshark, sockets), WEB development (static and dynamic web applications) and optimization — and I pair that with a lot of hands-on building outside the curriculum.",
    'Across personal projects and freelance client work I own the whole loop: understanding the problem, designing and shipping it, then keeping it healthy in production. I like roles where technical depth meets clear communication and making complex things run smoothly.',
  ],

  // Three-sentence elevator pitch — copied to clipboard by the "Copy pitch" button.
  pitch:
    "I'm Ratko Šišović, a 3rd-year Information Systems student at FON (Belgrade) and a software developer working across full-stack web, mobile, and Python automation/AI. I've built and operated production-grade systems — an AI trading agent with live dashboards and risk guardrails, an AI mobile companion app, developer observability tooling, and internal business systems for real clients. I'm looking for an internship or a remote/hybrid role where I can combine strong fundamentals with hands-on delivery and genuine ownership.",
};

export type Profile = typeof profile;
