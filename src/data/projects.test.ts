import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  clientProjects,
  cvProjectIds,
  projectById,
  projectDomain,
  projects,
  smallerProjects,
  studyProjects,
  systemProjects,
} from './projects';
import { profile } from './profile';

// Structural tests for the data layer, the part of the site that changes most
// often. They guard the invariants the UI relies on.

const publicFile = (src: string) => new URL(`../../public${src}`, import.meta.url);

/** Width and height from a webp header (VP8X, VP8 or VP8L). */
function webpSize(buf: Buffer): { width: number; height: number } {
  expect(buf.toString('ascii', 0, 4)).toBe('RIFF');
  expect(buf.toString('ascii', 8, 12)).toBe('WEBP');
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  }
  if (chunk === 'VP8 ') {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  throw new Error(`unknown webp chunk ${chunk}`);
}

describe('projects data integrity', () => {
  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it('ids are unique and url-safe (used as #project/<id> routes)', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('every project has the fields the page renders', () => {
    for (const p of projects) {
      expect(p.title.trim()).not.toBe('');
      expect(p.subtitle.trim()).not.toBe('');
      expect(p.blurb.trim()).not.toBe('');
      expect(p.year.trim()).not.toBe('');
      expect(p.year).toMatch(/^\d{4}(–(\d{4}|now))?$/);
      expect(p.tech.length).toBeGreaterThan(0);
      expect(p.highlights.length).toBeGreaterThan(0);
    }
  });

  it('categories reference the canonical CATEGORIES list', () => {
    for (const p of projects) {
      expect(p.categories.length).toBeGreaterThan(0);
      for (const c of p.categories) expect(CATEGORIES).toContain(c);
    }
  });

  it('links and liveUrl are absolute http(s) urls', () => {
    for (const p of projects) {
      if (p.liveUrl) expect(p.liveUrl).toMatch(/^https?:\/\//);
      for (const l of p.links ?? []) expect(l.href).toMatch(/^https?:\/\//);
    }
  });

  it('case studies, when present, have a non-empty intro', () => {
    for (const p of projects) {
      if (p.caseStudy) expect(p.caseStudy.intro.trim()).not.toBe('');
    }
  });

  it('is grouped into four clients, three systems and four smaller projects, in page order', () => {
    expect(projects.map((p) => p.id)).toEqual([
      'mesara',
      'pilatiq',
      'stan-pro-tim',
      'kutlesic-vikendice',
      'trading-agent',
      'dev-dashboard',
      'belgrade-buddy',
      'crypto-agent',
      'student-brain-agent',
      'brand-app',
      'dsa-java',
    ]);
    expect(clientProjects.map((p) => p.id)).toEqual(['mesara', 'pilatiq', 'stan-pro-tim', 'kutlesic-vikendice']);
    expect(systemProjects.map((p) => p.id)).toEqual(['trading-agent', 'dev-dashboard', 'belgrade-buddy']);
    expect(smallerProjects.map((p) => p.id)).toEqual(['crypto-agent', 'student-brain-agent', 'brand-app', 'dsa-java']);
  });
});

describe('engineering notes', () => {
  it('clients and systems carry 1–2 short notes; smaller projects none', () => {
    for (const p of [...clientProjects, ...systemProjects]) {
      expect(p.notes, p.id).toBeDefined();
      expect(p.notes!.length, p.id).toBeGreaterThanOrEqual(1);
      expect(p.notes!.length, p.id).toBeLessThanOrEqual(2);
      for (const n of p.notes!) {
        expect(n.trim()).not.toBe('');
        expect(n.length, n).toBeLessThanOrEqual(140);
      }
    }
    for (const p of smallerProjects) expect(p.notes, p.id).toBeUndefined();
  });
});

describe('media', () => {
  it('every client has a desktop and a phone screenshot of its live site', () => {
    for (const p of clientProjects) {
      const domain = projectDomain(p);
      expect(domain, p.id).toBeDefined();
      expect(p.media, p.id).toHaveLength(2);
      const [desk, phone] = p.media!;
      expect(desk).toMatchObject({ device: 'desktop', width: 1440, height: 900 });
      expect(phone).toMatchObject({ device: 'phone', width: 780, height: 1688 });
      expect(desk.caption?.trim(), p.id).toBeTruthy();
      for (const m of p.media!) {
        expect(m.src).toMatch(/^\/screenshots\/[a-z0-9-]+\/(desktop|mobile)\.webp$/);
        expect(m.alt.startsWith(`${domain} `), m.alt).toBe(true);
      }
    }
  });

  it('every media file exists and its webp header matches width and height', () => {
    for (const p of projects) {
      for (const m of p.media ?? []) {
        const file = publicFile(m.src);
        expect(existsSync(file), m.src).toBe(true);
        expect(webpSize(readFileSync(file)), m.src).toEqual({ width: m.width, height: m.height });
      }
    }
  });
});

describe('figures', () => {
  it('every system has a figure', () => {
    for (const p of systemProjects) expect(p.figure, p.id).toBeDefined();
    for (const p of [...clientProjects, ...smallerProjects]) expect(p.figure, p.id).toBeUndefined();
  });

  it('the pipeline has exactly one step where a person steps in', () => {
    for (const p of systemProjects) {
      if (p.figure?.kind !== 'pipeline') continue;
      expect(p.figure.steps.filter((s) => s.actor === 'person')).toHaveLength(1);
    }
  });

  it('the status axis is drawn to scale and matches the case study', () => {
    const dd = projectById('dev-dashboard')!;
    expect(dd.figure?.kind).toBe('status-axis');
    if (dd.figure?.kind !== 'status-axis') return;
    const { daysPerColumn, maxDays, thresholds } = dd.figure;
    expect(maxDays / daysPerColumn).toBe(12);
    expect(thresholds.active % daysPerColumn).toBe(0);
    expect(thresholds.paused % daysPerColumn).toBe(0);
    const decisions = dd.caseStudy!.decisions!.join(' ');
    expect(decisions).toContain(`≤${thresholds.active}d`);
    expect(decisions).toContain(`≤${thresholds.paused}d`);
  });
});

describe('helpers', () => {
  it('the CV lists real projects', () => {
    for (const id of cvProjectIds) expect(projectById(id), id).toBeDefined();
  });

  it('exactly Mesara and dev-dashboard have case studies', () => {
    expect(studyProjects.map((p) => p.id)).toEqual(['mesara', 'dev-dashboard']);
  });

  it('projectDomain drops www and the path', () => {
    expect(projectDomain(projectById('mesara')!)).toBe('rostiljsisko.rs');
    expect(projectDomain(projectById('trading-agent')!)).toBeUndefined();
  });
});

describe('profile data integrity', () => {
  it('contact and site urls are well-formed', () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(profile.github).toMatch(/^https:\/\/github\.com\//);
    expect(profile.github.endsWith(profile.githubHandle)).toBe(true);
    expect(profile.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\//);
    expect(profile.siteUrl).toMatch(/^https:\/\//);
    expect(profile.name).toBe(`${profile.firstName} ${profile.lastName}`);
  });
});
