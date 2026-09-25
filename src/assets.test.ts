import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The generated files in public/: the share card, the favicon, the CV PDF, and the
// Search Console verification file that must never be deleted.

const pub = (name: string) => new URL(`../public/${name}`, import.meta.url);

describe('public assets', () => {
  it('og-image.png is a PNG of 2400 × 1260 (IHDR)', () => {
    const buf = readFileSync(pub('og-image.png'));
    expect(buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(true);
    expect(buf.toString('ascii', 12, 16)).toBe('IHDR');
    expect(buf.readUInt32BE(16)).toBe(2400);
    expect(buf.readUInt32BE(20)).toBe(1260);
  });

  it('favicon.svg is the ink square with the vermilion mark, not the old indigo monogram', () => {
    const svg = readFileSync(pub('favicon.svg'), 'utf8');
    expect(svg).toContain('#111110');
    expect(svg).toContain('#D83218');
    expect(svg.toLowerCase()).not.toContain('#4f46e5');
    expect(svg).not.toMatch(/Space Grotesk/i);
    expect(svg).not.toMatch(/<text/i); // needs no web font to draw
  });

  it('the CV PDF exists and has exactly one page', () => {
    const pdf = readFileSync(pub('Ratko_Sisovic_CV.pdf'));
    expect(pdf.toString('latin1', 0, 5)).toBe('%PDF-');
    // Same count as scripts/generate-pdf.mjs: one "/Type /Page" per page ("/Pages" is the tree).
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    expect(pages).toBe(1);
  });

  it('the Google Search Console verification file is still there', () => {
    expect(existsSync(pub('google41f9898f330a62c6.html'))).toBe(true);
  });
});
