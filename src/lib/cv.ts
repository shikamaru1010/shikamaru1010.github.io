// One CV, many formats. buildCv() joins the CV copy (data/cv.ts) with the facts it points at
// (profile, experience, education, projects) into a plain structure; the CV page and its PDF
// render it (Resume.tsx), and the serializers below write the text formats. scripts/export-cv.mjs
// writes them into public/ (with the DOCX), and cv.test.ts checks the committed files still match.
// No DOM, no Node APIs: the browser bundle and the scripts share this file.
import { cv, type CvProject, type CvRole } from '../data/cv';
import { education, experience, languages } from '../data/experience';
import { profile } from '../data/profile';
import { projectById } from '../data/projects';
import { UPDATED, domainOf, ordinal, shortPoint } from './format';

export type CvLink = { text: string; href?: string };
export type CvEntry = {
  title: string;
  org?: string;
  when: string;
  /** Location for a role; the stack for a project. */
  detail?: string;
  link?: CvLink;
  points: string[];
};
export type CvDoc = {
  name: string;
  title: string;
  contact: CvLink[];
  summary: string;
  headings: typeof cv.headings;
  skills: { label: string; items: string[] }[];
  experience: CvEntry[];
  projects: CvEntry[];
  education: { degree: string; school: string; when: string; status: string; coursework: string };
  languages: string[];
  meta: { subject: string; keywords: string[]; updated: string; siteUrl: string };
};

/** CV dates: 'Jul 2026 – Present', '2023 – Present', '2023 – 2027 (expected)'. */
export function cvPeriod(start: string | number, end?: string | number, expected = false): string {
  const to = end === undefined || end === '' ? 'Present' : `${shortPoint(end)}${expected ? ' (expected)' : ''}`;
  return `${shortPoint(start)} – ${to}`;
}

/** A projects.ts `year` ('2025–now', '2024') in CV form ('2025 – Present', '2024'). */
function projectPeriod(year: string): string {
  return year.replace(/–now$/, ' – Present').replace(/(\d)–(\d)/, '$1 – $2');
}

function role(r: CvRole): CvEntry {
  const x = experience.find((e) => e.org === r.org);
  if (!x) throw new Error(`data/cv.ts: no experience entry with org "${r.org}"`);
  return {
    title: r.title ?? x.role,
    org: r.orgLabel ?? x.org,
    when: cvPeriod(x.start, x.end),
    detail: r.location,
    link: r.url ? { text: domainOf(r.url), href: r.url } : undefined,
    points: r.points,
  };
}

function project(p: CvProject): CvEntry {
  const base = p.id ? projectById(p.id) : undefined;
  if (p.id && !base) throw new Error(`data/cv.ts: no project with id "${p.id}"`);
  const url = p.url ?? base?.liveUrl ?? (p.id ? undefined : profile.siteUrl);
  return {
    title: p.name ?? base!.title,
    when: p.when ?? projectPeriod(base!.year),
    detail: p.stack.join(', '),
    link: url ? { text: domainOf(url), href: url } : undefined,
    points: p.points,
  };
}

export function buildCv(): CvDoc {
  const contact: CvLink[] = [
    { text: profile.location },
    { text: profile.email, href: `mailto:${profile.email}` },
    ...(profile.phone ? [{ text: profile.phone, href: `tel:${profile.phone.replace(/[^\d+]/g, '')}` }] : []),
    { text: `linkedin.com/in/${profile.linkedinHandle}`, href: profile.linkedin },
    { text: `github.com/${profile.githubHandle}`, href: profile.github },
    { text: domainOf(profile.siteUrl), href: profile.siteUrl },
  ];
  return {
    name: profile.name,
    title: cv.title,
    contact,
    summary: cv.summary.join(' '),
    headings: cv.headings,
    skills: cv.skills,
    experience: cv.experience.map(role),
    projects: cv.projects.map(project),
    education: {
      degree: education.degree,
      school: education.school,
      when: cvPeriod(education.start, education.expectedEnd, true),
      status: `${ordinal(education.year)} year`,
      coursework: cv.education.coursework,
    },
    languages: languages.map((l) => `${l.name} (${l.level})`),
    meta: {
      subject: cv.subject,
      keywords: cv.skills.flatMap((g) => g.items).slice(0, 24),
      updated: UPDATED,
      siteUrl: profile.siteUrl,
    },
  };
}

/** Every word a reader (or a parser) sees, in reading order: what the audit and the tests count. */
export function cvText(d: CvDoc): string {
  const entry = (e: CvEntry) => [e.title, e.org, e.when, e.detail, e.link?.text, ...e.points].filter(Boolean).join('\n');
  return [
    d.name,
    d.title,
    d.contact.map((c) => c.text).join(' · '),
    d.headings.summary,
    d.summary,
    d.headings.skills,
    ...d.skills.map((g) => `${g.label}: ${g.items.join(', ')}`),
    d.headings.experience,
    ...d.experience.map(entry),
    d.headings.projects,
    ...d.projects.map(entry),
    d.headings.education,
    d.education.degree,
    d.education.school,
    d.education.when,
    d.education.status,
    `Relevant coursework: ${d.education.coursework}`,
    d.headings.languages,
    d.languages.join(' · '),
  ].join('\n');
}

const mdLink = (l: CvLink) => (l.href ? `[${l.text}](${l.href})` : l.text);

export function cvToMarkdown(d: CvDoc): string {
  const entry = (e: CvEntry) =>
    [
      `### ${e.org ? `${e.title} · ${e.org}` : e.title}`,
      '',
      [e.detail, e.link && mdLink(e.link), e.when].filter(Boolean).join(' · '),
      '',
      ...e.points.map((p) => `- ${p}`),
      '',
    ].join('\n');
  return [
    `# ${d.name}`,
    '',
    `**${d.title}**`,
    '',
    d.contact.map(mdLink).join(' · '),
    '',
    `## ${d.headings.summary}`,
    '',
    d.summary,
    '',
    `## ${d.headings.skills}`,
    '',
    ...d.skills.map((g) => `- **${g.label}:** ${g.items.join(', ')}`),
    '',
    `## ${d.headings.experience}`,
    '',
    ...d.experience.map(entry),
    `## ${d.headings.projects}`,
    '',
    ...d.projects.map(entry),
    `## ${d.headings.education}`,
    '',
    `### ${d.education.degree}`,
    '',
    `${d.education.school} · ${d.education.status} · ${d.education.when}`,
    '',
    `Relevant coursework: ${d.education.coursework}.`,
    '',
    `## ${d.headings.languages}`,
    '',
    d.languages.join(' · '),
    '',
  ].join('\n');
}

/** The CV as JSON Resume v1.0.0 (jsonresume.org), the format resume tools and AI agents read. */
export function cvToJsonResume(d: CvDoc) {
  const iso = (x: string | number) => String(x); // 'YYYY' or 'YYYY-MM' is valid ISO 8601 for the schema
  const work = cv.experience.map((r, i) => {
    const x = experience.find((e) => e.org === r.org)!;
    const e = d.experience[i];
    return {
      name: e.org,
      position: e.title,
      ...(r.url ? { url: r.url } : {}),
      location: r.location,
      startDate: iso(x.start),
      ...(x.end ? { endDate: iso(x.end) } : {}),
      highlights: e.points,
    };
  });
  const projects = cv.projects.map((p, i) => {
    const e = d.projects[i];
    const base = p.id ? projectById(p.id) : undefined;
    const start = (base?.year ?? p.when ?? '').slice(0, 4);
    return {
      name: e.title,
      highlights: e.points,
      keywords: p.stack,
      ...(e.link?.href ? { url: e.link.href } : {}),
      ...(start ? { startDate: start } : {}),
    };
  });
  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: d.name,
      label: d.title,
      email: profile.email,
      ...(profile.phone ? { phone: profile.phone } : {}),
      url: profile.siteUrl,
      summary: d.summary,
      location: { city: profile.city, countryCode: 'RS' },
      profiles: [
        { network: 'LinkedIn', username: profile.linkedinHandle, url: profile.linkedin },
        { network: 'GitHub', username: profile.githubHandle, url: profile.github },
      ],
    },
    work,
    education: [
      {
        institution: d.education.school,
        area: education.field,
        studyType: 'B.Sc.',
        startDate: iso(education.start),
        endDate: iso(education.expectedEnd),
        courses: d.education.coursework.split(/, (?![^(]*\))/),
      },
    ],
    skills: d.skills.map((g) => ({ name: g.label, keywords: g.items })),
    languages: languages.map((l) => ({ language: l.name, fluency: l.level.charAt(0).toUpperCase() + l.level.slice(1) })),
    projects,
    meta: { canonical: `${profile.siteUrl}/resume.json`, version: 'v1.0.0', lastModified: d.meta.updated },
  };
}

/** llms.txt (llmstxt.org): where an AI agent finds the CV as text and as data. */
export function cvToLlmsTxt(d: CvDoc): string {
  const site = profile.siteUrl;
  return [
    `# ${d.name}`,
    '',
    `> ${d.title}, based in ${profile.location}. ${cv.summary[0]}`,
    '',
    '## CV',
    '',
    `- [CV in Markdown](${site}/cv.md): the full CV as text`,
    `- [JSON Resume](${site}/resume.json): the same CV as structured data (jsonresume.org v1.0.0)`,
    `- [CV as PDF](${site}/Ratko_Sisovic_CV.pdf): one A4 page`,
    `- [CV as DOCX](${site}/Ratko_Sisovic_CV.docx): the same content for Word and application forms`,
    '',
    '## Links',
    '',
    `- [Portfolio](${site}/): client work, projects and experience`,
    `- [GitHub](${profile.github})`,
    `- [LinkedIn](${profile.linkedin})`,
    `- Email: ${profile.email}`,
    '',
  ].join('\n');
}
