import { describe, expect, it } from 'vitest';
import { sectionScrollTop } from './scroll';

const base = { viewport: 900, head: 64, gap: 24 };

describe('sectionScrollTop', () => {
  it('skips the top padding so the content starts just under the header when the section is long', () => {
    // content: 2144 → 5000, taller than the 836px below the header
    expect(sectionScrollTop({ ...base, top: 2000, padTop: 144, height: 3000 })).toBe(2144 - 64 - 24);
  });

  it('centres a section that fits below the header', () => {
    // content 500px tall in 836px: 168px above and below it
    expect(sectionScrollTop({ ...base, top: 2000, padTop: 144, height: 644 })).toBe(2144 - 64 - 168);
  });

  it('never returns a negative position', () => {
    expect(sectionScrollTop({ ...base, top: 0, padTop: 0, height: 200 })).toBe(0);
  });
});
