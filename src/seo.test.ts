import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { profile } from './data/profile';
import { site } from './data/site';

// Structural checks for the SEO surface: JSON-LD must stay valid JSON and in
// sync with profile.ts, the head must match site.ts, and the static SEO files
// must reference the live URL.

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
const html = read('../index.html');
/** content of <meta name|property="key" content="…"> (attributes may sit on separate lines). */
const meta = (attr: 'name' | 'property', key: string) =>
  html.match(new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`))?.[1];

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
    expect(ld.jobTitle).toBe(profile.role);
    expect(ld.url.replace(/\/$/, '')).toBe(profile.siteUrl);
    expect(ld.email).toBe(`mailto:${profile.email}`);
    expect(ld.sameAs).toContain(profile.github);
    expect(ld.sameAs).toContain(profile.linkedin);
  });
});

describe('document head', () => {
  it('title, description and theme-color come from site.ts / profile.ts', () => {
    expect(html.match(/<title>([^<]*)<\/title>/)?.[1]).toBe(site.titles.professional);
    expect(meta('name', 'description')).toBe(profile.metaDescription);
    expect(meta('name', 'theme-color')).toBe(site.themeColor.professional);
    expect(meta('property', 'og:title')).toBe(site.titles.professional);
    expect(meta('property', 'og:description')).toBe(profile.metaDescription);
    expect(meta('name', 'twitter:description')).toBe(profile.metaDescription);
  });

  it('declares the new OG image size', () => {
    expect(meta('property', 'og:image')).toBe(`${profile.siteUrl}/og-image.png`);
    expect(meta('property', 'og:image:width')).toBe('2400');
    expect(meta('property', 'og:image:height')).toBe('1260');
  });

  it('loads Golos Text only, plus the arrows face', () => {
    expect(html).toContain('https://fonts.googleapis.com/css2?family=Golos+Text:wght@400..900&display=swap"');
    expect(html).toContain(
      'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400..900&display=swap&text=%E2%86%90%E2%86%92%E2%86%97%E2%89%A4"',
    );
    expect(html).not.toMatch(/family=(Inter|JetBrains|Space)/);
  });

  it('the pre-paint mode script replaced the old theme script', () => {
    expect(html).toContain('<script data-prepaint>');
    expect(html).toContain('<html lang="en" data-mode="professional" data-route="home">');
    expect(html).not.toContain("localStorage.getItem('theme')");
  });
});

describe('static SEO files', () => {
  it('robots.txt points to the sitemap on the live domain', () => {
    const robots = read('../public/robots.txt');
    expect(robots).toContain(`Sitemap: ${profile.siteUrl}/sitemap.xml`);
  });

  it('sitemap.xml lists the live root url', () => {
    const sitemap = read('../public/sitemap.xml');
    expect(sitemap).toContain(`<loc>${profile.siteUrl}/</loc>`);
  });

  it('the Search Console verification file is still there', () => {
    expect(read('../public/google41f9898f330a62c6.html').length).toBeGreaterThan(0);
  });
});
