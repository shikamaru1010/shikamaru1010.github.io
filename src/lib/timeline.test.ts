import { describe, expect, it } from 'vitest';
import { education, experience } from '../data/experience';
import { BUILD_DATE, careerAxis, monthsFrom, monthsTo } from './timeline';

const starts = [...experience.map((x) => x.start), education.start];

describe('monthsFrom / monthsTo', () => {
  it('counts whole months to a start, by month only where there is one', () => {
    expect(monthsFrom('2026-07', 2023)).toBe(42);
    expect(monthsFrom('2025', 2023)).toBe(24);
    expect(monthsFrom(2023, 2023)).toBe(0);
    expect(monthsFrom(2028, 2023)).toBe(60);
  });

  it('counts the day as a fraction of its month', () => {
    expect(monthsTo('2023-01-01', 2023)).toBe(0);
    expect(monthsTo('2026-09-25', 2023)).toBeCloseTo(44.8, 5);
    expect(monthsTo('2024-02-15', 2023)).toBeCloseTo(13 + 14 / 29, 5); // a leap February
  });
});

describe('careerAxis', () => {
  it('runs 2023 to 2027 today, with today on 25 September 2026 at 44.8 months', () => {
    const axis = careerAxis(starts, education.expectedEnd, '2026-09-25');
    expect(axis.first).toBe(2023);
    expect(axis.years).toEqual([2023, 2024, 2025, 2026, 2027]);
    expect(axis.span).toBe(60);
    expect(axis.today).toBe(44.8);
  });

  it('grows a year when today reaches the last one, so today always has room to its right', () => {
    const axis = careerAxis(starts, 2027, '2027-11-30');
    expect(axis.years[axis.years.length - 1]).toBe(2028);
    expect(axis.span).toBe(72);
    expect(axis.today).toBeCloseTo(58.97, 2);
  });

  it('clamps today to the axis', () => {
    expect(careerAxis(starts, 2027, '2020-03-01').today).toBe(0);
    for (const day of ['2023-01-01', '2024-06-30', '2026-12-31', '2027-12-31', '2031-05-01']) {
      const axis = careerAxis(starts, 2027, day);
      expect(axis.today, day).toBeGreaterThanOrEqual(0);
      expect(axis.today, day).toBeLessThan(axis.span);
    }
  });

  it('takes today from the build date (Vite define)', () => {
    expect(BUILD_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(BUILD_DATE).toBe(__BUILD_DATE__);
    const axis = careerAxis(starts, education.expectedEnd, BUILD_DATE);
    expect(axis.today).toBeCloseTo(monthsTo(BUILD_DATE, axis.first), 2);
  });
});
