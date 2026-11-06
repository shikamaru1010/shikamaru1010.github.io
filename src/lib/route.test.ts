import { describe, expect, it } from 'vitest';
import { clientProjects, projectAnchor, projects, smallerProjects, systemProjects } from '../data/projects';
import { parseRoute, routeKey, scrollStep } from './route';

describe('parseRoute', () => {
  it('empty hash is home', () => {
    expect(parseRoute('')).toEqual({ kind: 'home' });
    expect(parseRoute('#')).toEqual({ kind: 'home' });
  });

  it('#resume is the CV', () => {
    expect(parseRoute('#resume')).toEqual({ kind: 'cv' });
  });

  it('a project with a case study is a study page', () => {
    expect(parseRoute('#project/mesara')).toEqual({ kind: 'study', id: 'mesara' });
    expect(parseRoute('#project/dev-dashboard')).toEqual({ kind: 'study', id: 'dev-dashboard' });
  });

  it('a project without a case study lands on its row, with the hash rewritten', () => {
    expect(parseRoute('#project/pilatiq')).toEqual({ kind: 'home', anchor: 'client-pilatiq', rewriteHash: '#client-pilatiq' });
    expect(parseRoute('#project/trading-agent')).toEqual({
      kind: 'home',
      anchor: 'system-trading-agent',
      rewriteHash: '#system-trading-agent',
    });
    expect(parseRoute('#project/crypto-agent')).toEqual({
      kind: 'home',
      anchor: 'also-crypto-agent',
      rewriteHash: '#also-crypto-agent',
    });
  });

  it('an unknown project strips the hash', () => {
    expect(parseRoute('#project/nope')).toEqual({ kind: 'home', rewriteHash: '' });
    expect(parseRoute('#project/')).toEqual({ kind: 'home', rewriteHash: '' });
  });

  it('any other hash is a home anchor', () => {
    expect(parseRoute('#work')).toEqual({ kind: 'home', anchor: 'work' });
    expect(parseRoute('#top')).toEqual({ kind: 'home', anchor: 'top' });
    expect(parseRoute('#client-mesara')).toEqual({ kind: 'home', anchor: 'client-mesara' });
  });

  it('a malformed percent-escape never throws (it is kept as it is)', () => {
    expect(parseRoute('#client-%')).toEqual({ kind: 'home', anchor: 'client-%' });
    expect(parseRoute('#client-%E0%A4%A')).toEqual({ kind: 'home', anchor: 'client-%E0%A4%A' });
    expect(parseRoute('#project/%')).toEqual({ kind: 'home', rewriteHash: '' });
  });
});

describe('routeKey', () => {
  it('a different case study is a different page', () => {
    expect(routeKey({ kind: 'study', id: 'mesara' })).not.toBe(routeKey({ kind: 'study', id: 'dev-dashboard' }));
    expect(routeKey({ kind: 'home', anchor: 'work' })).toBe(routeKey({ kind: 'home' }));
    expect(routeKey({ kind: 'cv' })).toBe('cv');
  });
});

describe('scrollStep', () => {
  const home = parseRoute('');
  const study = (id: string) => parseRoute(`#project/${id}`);

  it('first mount: only a real anchor is scrolled to; focus stays', () => {
    expect(scrollStep(null, parseRoute('#skills'))).toEqual({ scroll: { kind: 'anchor', id: 'skills' }, focus: false });
    expect(scrollStep(null, home)).toEqual({ scroll: { kind: 'native' }, focus: false });
    expect(scrollStep(null, study('mesara'))).toEqual({ scroll: { kind: 'native' }, focus: false });
  });

  it('study → the next study opens at its top and moves focus (the "Next case study" link)', () => {
    expect(scrollStep(routeKey(study('mesara')), study('dev-dashboard'))).toEqual({ scroll: { kind: 'top' }, focus: true });
  });

  it('home → CV or a study opens at the top and moves focus', () => {
    expect(scrollStep('home', parseRoute('#resume'))).toEqual({ scroll: { kind: 'top' }, focus: true });
    expect(scrollStep('home', study('mesara'))).toEqual({ scroll: { kind: 'top' }, focus: true });
  });

  it('back to home: the saved position first, then the anchor, then the top', () => {
    expect(scrollStep('cv', home, 900)).toEqual({ scroll: { kind: 'restore', y: 900 }, focus: true });
    expect(scrollStep('cv', parseRoute('#top'), 900)).toEqual({ scroll: { kind: 'restore', y: 900 }, focus: true });
    expect(scrollStep('study:mesara', parseRoute('#client-mesara'))).toEqual({
      scroll: { kind: 'anchor', id: 'client-mesara' },
      focus: true,
    });
    expect(scrollStep('cv', home)).toEqual({ scroll: { kind: 'top' }, focus: true });
  });

  it('home → home: the browser jumps to a plain anchor; a rewritten hash is scrolled to (or the top)', () => {
    expect(scrollStep('home', parseRoute('#work'))).toEqual({ scroll: { kind: 'native' }, focus: false });
    expect(scrollStep('home', parseRoute('#project/pilatiq'))).toEqual({
      scroll: { kind: 'anchor', id: 'client-pilatiq' },
      focus: false,
    });
    expect(scrollStep('home', parseRoute('#project/nope'))).toEqual({ scroll: { kind: 'top' }, focus: false });
  });

  it('the same study again does nothing', () => {
    expect(scrollStep('study:mesara', study('mesara'))).toEqual({ scroll: { kind: 'native' }, focus: false });
  });
});

describe('projectAnchor', () => {
  it('uses the group prefix of the anchor contract', () => {
    for (const p of clientProjects) expect(projectAnchor(p)).toBe(`client-${p.id}`);
    for (const p of systemProjects) expect(projectAnchor(p)).toBe(`system-${p.id}`);
    for (const p of smallerProjects) expect(projectAnchor(p)).toBe(`also-${p.id}`);
  });

  it('every project routes somewhere', () => {
    for (const p of projects) {
      const r = parseRoute(`#project/${p.id}`);
      expect(r.kind === 'study' || (r.kind === 'home' && r.anchor === projectAnchor(p))).toBe(true);
    }
  });
});
