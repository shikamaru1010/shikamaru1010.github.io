import { describe, expect, it } from 'vitest';
import { quotePool } from '../../scripts/quote-pool.mjs';
import dailyMessage from './daily-message.json';
import { education, experience, languages } from './experience';
import { personal } from './personal';
import { profile } from './profile';
import { projectById } from './projects';
import { alsoUsed, siteSkillGroups, skillGroups } from './skills';

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const isCalendarDate = (iso: string) => {
  if (!ISO.test(iso)) return false;
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
};

describe('daily-message.json', () => {
  it('has the fields scripts/generate-daily-message.mjs writes (the page reads text and author)', () => {
    expect(Object.keys(dailyMessage).sort()).toEqual(['author', 'generatedAt', 'index', 'poolSize', 'text']);
    expect(isCalendarDate(dailyMessage.generatedAt)).toBe(true);
  });

  it('poolSize and index match scripts/quote-pool.mjs (run `npm run daily-message` after editing the pool)', () => {
    expect(dailyMessage.poolSize).toBe(quotePool.length);
    expect(Number.isInteger(dailyMessage.index)).toBe(true);
    expect(quotePool[dailyMessage.index]).toEqual({ text: dailyMessage.text, author: dailyMessage.author });
  });
});

describe('skills.ts: skills by area', () => {
  it('every group has a label and at least one named skill', () => {
    for (const group of skillGroups) {
      expect(group.label.trim()).not.toBe('');
      expect(group.skills.length).toBeGreaterThan(0);
      for (const skill of group.skills) expect(skill.name.trim(), group.label).not.toBe('');
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

  it('the site leaves out exactly the CV-only groups and skills', () => {
    const onSite = siteSkillGroups.flatMap((g) => g.skills.map((s) => s.name));
    const all = skillGroups.flatMap((g) => g.skills.map((s) => ({ name: s.name, cvOnly: Boolean(g.cvOnly || s.cvOnly) })));
    expect(onSite).toEqual(all.filter((s) => !s.cvOnly).map((s) => s.name));
    for (const g of siteSkillGroups) expect(g.skills.length, g.label).toBeGreaterThan(0);
  });
});

describe('personal.ts', () => {
  it('the first name is the profile’s, and every Now item has a lead word and a text', () => {
    expect(personal.firstName).toBe(profile.firstName);
    expect(personal.now.length).toBeGreaterThan(0);
    for (const item of personal.now) {
      expect(item.lead.trim()).not.toBe('');
      expect(item.text.trim()).not.toBe('');
    }
  });

  it('brain domains link real projects, and the lede names every domain', () => {
    for (const d of personal.brain.domains) {
      if (d.project) expect(projectById(d.project.id), d.project.id).toBeDefined();
      expect(personal.brain.lede.toLowerCase()).toContain(d.name.toLowerCase());
    }
  });

  it('offline is a list, and the links are my real profiles', () => {
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

  it('a short role, where given, is a word of the full role', () => {
    for (const x of experience) {
      if (x.roleShort !== undefined) expect(x.role.split(' '), x.org).toContain(x.roleShort);
    }
  });

  it('each hero sentence is one sentence (who and where are in the lines above it)', () => {
    for (const s of [profile.lede, personal.line]) {
      expect(s.trim()).not.toBe('');
      expect(s).toMatch(/\.$/);
      expect(s.slice(0, -1)).not.toMatch(/[.!?](\s|$)/);
    }
  });
});
