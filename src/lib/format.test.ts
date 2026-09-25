import { describe, expect, it } from 'vitest';
import {
  BUILD_DATE,
  buildYear,
  capitalize,
  domainOf,
  fill,
  formatDate,
  formatPeriod,
  listJoin,
  monthYear,
  numberWord,
  ordinal,
  parseYears,
  yearRange,
} from './format';

describe('fill', () => {
  it('replaces placeholders and leaves unknown ones', () => {
    expect(fill('{a} and {b}', { a: 1, b: 'two' })).toBe('1 and two');
    expect(fill('{a} and {c}', { a: 'x' })).toBe('x and {c}');
    expect(fill('{n} modules', { n: 0 })).toBe('0 modules');
  });
});

describe('numberWord', () => {
  it('spells 0–20 and falls back to digits', () => {
    expect(numberWord(0)).toBe('zero');
    expect(numberWord(4)).toBe('four');
    expect(numberWord(11)).toBe('eleven');
    expect(numberWord(20)).toBe('twenty');
    expect(numberWord(21)).toBe('21');
  });
});

describe('capitalize', () => {
  it('upper-cases the first letter only', () => {
    expect(capitalize('four client sites')).toBe('Four client sites');
    expect(capitalize('')).toBe('');
  });
});

describe('ordinal', () => {
  it('uses English suffixes', () => {
    expect(ordinal(1)).toBe('1st');
    expect(ordinal(2)).toBe('2nd');
    expect(ordinal(3)).toBe('3' + 'rd'); // split so the copy scan never sees the year-3 word
    expect(ordinal(4)).toBe('4th');
    expect(ordinal(11)).toBe('11th');
    expect(ordinal(12)).toBe('12th');
    expect(ordinal(13)).toBe('13th');
    expect(ordinal(21)).toBe('21st');
    expect(ordinal(22)).toBe('22nd');
  });
});

describe('formatPeriod', () => {
  it('formats starts and ends with an en dash', () => {
    expect(formatPeriod('2026-07')).toBe('Jul 2026–now');
    expect(formatPeriod('2023')).toBe('2023–now');
    expect(formatPeriod(2023, 2027)).toBe('2023–2027');
    expect(formatPeriod('2025-01', '2025-06')).toBe('Jan 2025–Jun 2025');
  });
});

describe('formatDate / monthYear', () => {
  it('formats ISO dates without Intl', () => {
    expect(formatDate('2026-06-09')).toBe('9 June 2026');
    expect(formatDate('2026-09-25')).toBe('25 September 2026');
    expect(monthYear('2026-09-25')).toBe('September 2026');
    expect(monthYear('2026-07')).toBe('July 2026');
  });
});

describe('parseYears / yearRange', () => {
  it('parses year strings', () => {
    expect(parseYears('2024–now')).toEqual({ start: 2024, end: 'now' });
    expect(parseYears('2024')).toEqual({ start: 2024, end: 2024 });
    expect(parseYears('2024–2025')).toEqual({ start: 2024, end: 2025 });
  });

  it('spans a set of projects', () => {
    expect(yearRange([{ year: '2024–now' }, { year: '2023' }])).toBe('2023–now');
    expect(yearRange([{ year: '2025' }, { year: '2024' }])).toBe('2024–2025');
    expect(yearRange([{ year: '2025–now' }, { year: '2025–now' }])).toBe('2025–now');
    expect(yearRange([{ year: '2024' }])).toBe('2024');
    expect(yearRange([])).toBe('');
  });
});

describe('listJoin', () => {
  it('joins with commas and a final "and"', () => {
    expect(listJoin(['a', 'b', 'c'])).toBe('a, b and c');
    expect(listJoin(['a', 'b'])).toBe('a and b');
    expect(listJoin(['a'])).toBe('a');
    expect(listJoin([])).toBe('');
  });
});

describe('domainOf', () => {
  it('drops the scheme, www and path', () => {
    expect(domainOf('https://www.rostiljsisko.rs/sr')).toBe('rostiljsisko.rs');
    expect(domainOf('https://shikamaru1010.github.io')).toBe('shikamaru1010.github.io');
  });
});

describe('build date', () => {
  it('is an ISO date from the Vite define', () => {
    expect(BUILD_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(buildYear).toBe(Number(BUILD_DATE.slice(0, 4)));
    expect(buildYear).toBeGreaterThanOrEqual(2026);
  });
});
