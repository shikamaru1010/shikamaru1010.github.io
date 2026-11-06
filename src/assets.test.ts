import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { site } from './data/site';

// The generated files in public/: the share card, the favicon, the CV PDF, the hero's code
// loop, and the Search Console verification file that must never be deleted.

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

/** Width and height of a WebP (lossy VP8, lossless VP8L or extended VP8X). */
function webpSize(buf: Buffer): [number, number] {
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (chunk === 'VP8L') {
    const b = buf.readUInt32LE(21);
    return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1];
  }
  return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1]; // VP8X
}

describe('the hero code loop (public/hero, site.hero.loop)', () => {
  const file = (src: string) => readFileSync(pub(src.slice(1)));
  const L = site.hero.loop;

  it('is a VP9 WebM and an H.264 MP4, both without sound', () => {
    const webm = file(L.webm);
    expect(webm.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])), 'EBML header').toBe(true);
    expect(webm.includes('V_VP9'), 'VP9 track').toBe(true);
    expect(webm.includes('A_OPUS') || webm.includes('A_VORBIS'), 'an audio track').toBe(false);

    const mp4 = file(L.mp4);
    expect(mp4.toString('ascii', 4, 8)).toBe('ftyp');
    expect(mp4.includes('avc1'), 'H.264 track').toBe(true);
    // every track's handler (hdlr: size, type, version/flags, pre_defined, handler_type) is video
    const handlers: string[] = [];
    for (let i = mp4.indexOf('hdlr'); i !== -1; i = mp4.indexOf('hdlr', i + 4)) handlers.push(mp4.toString('ascii', i + 12, i + 16));
    expect(handlers.length).toBeGreaterThan(0);
    expect(handlers.filter((h) => h !== 'vide' && h !== 'mdir'), 'non-video tracks').toEqual([]);
  });

  it('has a square WebP poster of the loop size', () => {
    const poster = file(L.poster);
    expect(poster.toString('ascii', 0, 4)).toBe('RIFF');
    expect(poster.toString('ascii', 8, 12)).toBe('WEBP');
    expect(webpSize(poster)).toEqual([L.size, L.size]);
  });
});
