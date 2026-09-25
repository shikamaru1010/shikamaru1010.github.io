import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
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
    }
  });

  it('every project is in one of the three groups of Work', () => {
    for (const p of projects) expect(['client', 'system', 'smaller'], p.id).toContain(p.group);
  });

  it('liveUrl is an absolute http(s) url', () => {
    for (const p of projects) {
      if (p.liveUrl) expect(p.liveUrl).toMatch(/^https?:\/\//);
    }
  });

  it('case studies, when present, have a non-empty intro', () => {
    for (const p of projects) {
      if (p.caseStudy) expect(p.caseStudy.intro.trim()).not.toBe('');
    }
  });

  it('"At a glance" shows numbers only, never a word dressed as a figure', () => {
    for (const p of studyProjects) {
      for (const m of p.caseStudy.metrics ?? []) expect(m.value, `${p.id}: ${m.label}`).toMatch(/^\d[\d.,]*\+?$/);
    }
  });

  it('every workflow step says whether a person or the system acts', () => {
    for (const p of studyProjects) {
      for (const s of p.caseStudy.workflow ?? []) {
        expect(['person', 'system'], `${p.id}: ${s.title}`).toContain(s.kind);
        expect(s.actor.trim(), `${p.id}: ${s.title}`).not.toBe('');
      }
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
  it('clients and systems carry at most 2 short notes (none where the stack says enough); smaller projects none', () => {
    for (const p of [...clientProjects, ...systemProjects]) {
      expect(p.notes?.length ?? 0, p.id).toBeLessThanOrEqual(2);
      for (const n of p.notes ?? []) {
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

  it('the smaller copies (npm run images) exist, keep the aspect ratio and are smaller', () => {
    for (const p of clientProjects) {
      for (const m of p.media!) {
        expect(m.variants?.length, m.src).toBeGreaterThan(0);
        for (const v of m.variants!) {
          const size = webpSize(readFileSync(publicFile(v.src)));
          expect(size.width, v.src).toBe(v.width);
          expect(v.width).toBeLessThan(m.width);
          expect(Math.abs(size.height - (m.height * v.width) / m.width), v.src).toBeLessThanOrEqual(1);
        }
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
