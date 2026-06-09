import { describe, expect, it } from 'vitest';
import { CATEGORIES, projects } from './projects';
import { profile } from './profile';

// Structural smoke tests for the data layer — the part of the site that
// changes most often. They guard the invariants the UI relies on.

describe('projects data integrity', () => {
  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it('ids are unique and url-safe (used as #project/<id> routes)', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('every project has the fields the card renders', () => {
    for (const p of projects) {
      expect(p.title.trim()).not.toBe('');
      expect(p.subtitle.trim()).not.toBe('');
      expect(p.blurb.trim()).not.toBe('');
      expect(p.year.trim()).not.toBe('');
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
});

describe('profile data integrity', () => {
  it('contact and site urls are well-formed', () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(profile.github).toMatch(/^https:\/\/github\.com\//);
    expect(profile.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\//);
    expect(profile.siteUrl).toMatch(/^https:\/\//);
  });
});
