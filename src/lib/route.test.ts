import { describe, expect, it } from 'vitest';
import { clientProjects, projectAnchor, projects, smallerProjects, systemProjects } from '../data/projects';
import { parseRoute } from './route';

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
