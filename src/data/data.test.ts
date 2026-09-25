import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { quotePool } from '../../scripts/quote-pool.mjs';
import dailyMessage from './daily-message.json';
import { education, experience, languages } from './experience';
import { personal } from './personal';
import { profile } from './profile';
import { projectById } from './projects';
import { alsoUsed, skillGroups } from './skills';
import worklog from './worklog.json';

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const isCalendarDate = (iso: string) => {
  if (!ISO.test(iso)) return false;
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
};
const publicFile = (src: string) => new URL(`../../public${src}`, import.meta.url);

describe('worklog.json (dates and counts only)', () => {
  const log = worklog as { asOf: string; total: number; days: Record<string, number> };

  it('has exactly asOf, total and days', () => {
    expect(Object.keys(log).sort()).toEqual(['asOf', 'days', 'total']);
    expect(isCalendarDate(log.asOf)).toBe(true);
    expect(Number.isInteger(log.total)).toBe(true);
  });

  it('days are real dates, sorted, unique, within the log period, with positive counts', () => {
    const keys = Object.keys(log.days);
    expect([...keys].sort()).toEqual(keys);
    expect(new Set(keys).size).toBe(keys.length);
    for (const day of keys) {
      expect(isCalendarDate(day), day).toBe(true);
      expect(day >= '2026-06-01', day).toBe(true);
      expect(day <= log.asOf, day).toBe(true);
      const n = log.days[day];
      expect(Number.isInteger(n) && n > 0, `${day}: ${n}`).toBe(true);
    }
  });

  it('total is the sum of the days', () => {
    expect(Object.values(log.days).reduce((a, b) => a + b, 0)).toBe(log.total);
  });

  it('carries no other data (no file names or slugs)', () => {
    // Apart from the three key names, the file is digits and punctuation only.
    const text = JSON.stringify(log).replace(/"(asOf|total|days)":/g, '');
    expect(text).not.toMatch(/[A-Za-z]/);
  });
});

describe('daily-message.json', () => {
  it('has the fields the Personal page reads', () => {
    expect(Object.keys(dailyMessage).sort()).toEqual(['author', 'generatedAt', 'index', 'poolSize', 'text']);
    expect(isCalendarDate(dailyMessage.generatedAt)).toBe(true);
  });

  it('poolSize and index match scripts/quote-pool.mjs (run `npm run daily-message` after editing the pool)', () => {
    expect(dailyMessage.poolSize).toBe(quotePool.length);
    expect(Number.isInteger(dailyMessage.index)).toBe(true);
    expect(quotePool[dailyMessage.index]).toEqual({ text: dailyMessage.text, author: dailyMessage.author });
  });
});

describe('skills.ts: each skill next to where it was used', () => {
  const courseNames = new Set(education.courses.map((c) => c.name));

  it('every skill has evidence that resolves to a real project or course', () => {
    for (const group of skillGroups) {
      expect(group.label.trim()).not.toBe('');
      expect(group.skills.length).toBeGreaterThan(0);
      for (const skill of group.skills) {
        expect(skill.evidence.length, skill.name).toBeGreaterThanOrEqual(1);
        for (const e of skill.evidence) {
          if ('project' in e) {
            expect(projectById(e.project), `${skill.name}: ${e.project}`).toBeDefined();
            if (e.part !== undefined) expect(e.part.trim()).not.toBe('');
          } else if ('course' in e) {
            expect(courseNames.has(e.course), `${skill.name}: ${e.course}`).toBe(true);
          } else {
            expect(e.text.trim()).not.toBe('');
          }
        }
      }
    }
  });

  it('skill names are unique', () => {
    const names = skillGroups.flatMap((g) => g.skills.map((s) => s.name));
    expect(new Set(names).size).toBe(names.length);
  });

  it('alsoUsed is a list of real words', () => {
    expect(alsoUsed.length).toBeGreaterThan(0);
    for (const s of alsoUsed) expect(s.trim()).not.toBe('');
  });
});

describe('personal.ts', () => {
  it('required strings are filled', () => {
    const required = [
      personal.firstName,
      personal.signCaption,
      personal.line,
      personal.intro,
      personal.photo.alt,
      personal.log.heading,
      personal.log.asOf,
      personal.log.headline,
      personal.log.note,
      personal.log.busiest,
      personal.log.monthSummary,
      personal.nowHeading,
      personal.nowUpdated,
      personal.toolsLead,
      personal.thought.heading,
      personal.thought.provenance,
      personal.brain.heading,
      personal.brain.sub,
      personal.brain.lede,
      personal.brain.emptyText,
      personal.brain.plannedLead,
      personal.brain.planned,
      personal.offlineHeading,
      personal.elsewhereHeading,
      personal.footPlace,
      ...personal.nameCyrillic,
      ...personal.tools,
    ];
    for (const s of required) expect(s.trim()).not.toBe('');
    expect(personal.firstName).toBe(profile.firstName);
    expect(personal.now.length).toBeGreaterThan(0);
    for (const item of personal.now) {
      expect(item.lead.trim()).not.toBe('');
      expect(item.text.trim()).not.toBe('');
    }
    expect(personal.thought.provenance).toContain('{poolSize}');
  });

  it('the photo exists under public/', () => {
    expect(existsSync(publicFile(personal.photo.src))).toBe(true);
  });

  it('brain domains link real projects', () => {
    for (const d of personal.brain.domains) {
      if (d.project) expect(projectById(d.project.id), d.project.id).toBeDefined();
    }
  });

  it('now is dated, offline is a list, and the links are my real profiles', () => {
    expect(isCalendarDate(personal.nowUpdatedAt)).toBe(true);
    expect(Array.isArray(personal.offline)).toBe(true);
    const hrefs = Object.fromEntries(personal.elsewhere.map((l) => [l.label, l.href]));
    expect(hrefs).toEqual({ GitHub: profile.github, LinkedIn: profile.linkedin, Email: `mailto:${profile.email}` });
  });
});

describe('experience.ts', () => {
  it('is the 4th year of a 2023–2027 degree', () => {
    expect(education.year).toBe(4);
    expect(education.start).toBe(2023);
    expect(education.expectedEnd).toBe(2027);
  });

  it('starts and ends parse as YYYY or YYYY-MM', () => {
    for (const x of experience) {
      expect(x.start).toMatch(/^\d{4}(-(0[1-9]|1[0-2]))?$/);
      if (x.end) expect(x.end).toMatch(/^\d{4}(-(0[1-9]|1[0-2]))?$/);
      expect(x.points.length).toBeGreaterThan(0);
    }
  });

  it('languages have levels', () => {
    for (const l of languages) {
      expect(l.name.trim()).not.toBe('');
      expect(l.level.trim()).not.toBe('');
    }
  });

  it('the lede says 4th-year and Podyx', () => {
    expect(profile.lede).toContain('4th-year');
    expect(profile.lede).toContain('Podyx');
  });
});
