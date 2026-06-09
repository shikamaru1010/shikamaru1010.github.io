import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { profile } from './data/profile';

// Structural checks for the SEO surface: JSON-LD must stay valid JSON and in
// sync with profile.ts, and the static SEO files must reference the live URL.

const html = readFileSync('index.html', 'utf8');

describe('JSON-LD structured data', () => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

  it('exists and parses as JSON', () => {
    expect(match).not.toBeNull();
    expect(() => JSON.parse(match![1])).not.toThrow();
  });

  it('describes the right person, consistent with profile.ts', () => {
    const ld = JSON.parse(match![1]);
    expect(ld['@type']).toBe('Person');
    expect(ld.name).toBe(profile.name);
    expect(ld.url.replace(/\/$/, '')).toBe(profile.siteUrl);
    expect(ld.sameAs).toContain(profile.github);
    expect(ld.sameAs).toContain(profile.linkedin);
  });
});

describe('static SEO files', () => {
  it('robots.txt points to the sitemap on the live domain', () => {
    const robots = readFileSync('public/robots.txt', 'utf8');
    expect(robots).toContain(`Sitemap: ${profile.siteUrl}/sitemap.xml`);
  });

  it('sitemap.xml lists the live root url', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8');
    expect(sitemap).toContain(`<loc>${profile.siteUrl}/</loc>`);
  });
});
