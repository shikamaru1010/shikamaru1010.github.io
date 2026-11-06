import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { education, experience, languages } from './data/experience';
import { personal } from './data/personal';
import { profile } from './data/profile';
import { projects } from './data/projects';
import { site } from './data/site';
import { alsoUsed, skillGroups } from './data/skills';

// Words and typography. The accented letter is built from its code point so
// this file itself never contains the word it bans.

const repo = fileURLToPath(new URL('..', import.meta.url));
const self = fileURLToPath(import.meta.url);
const e = String.fromCharCode(0xe9);

const BANNED: Array<[string, RegExp]> = [
  ['the accented CV word (use "CV")', new RegExp(`r${e}sum${e}|r${e}sume|resum${e}`, 'i')],
  ['an outdated year of study', /\b3rd\b/i],
  ['an outdated year of study', /\bthird[\s-]+year\b/i],
];

function walk(dir: string, exts: RegExp): string[] {
  return (readdirSync(dir, { recursive: true }) as string[])
    .map((f) => join(dir, f))
    .filter((f) => exts.test(f));
}

function scannedFiles(): string[] {
  const src = walk(join(repo, 'src'), /\.(ts|tsx|json|css)$/);
  const scripts = readdirSync(join(repo, 'scripts'))
    .filter((f) => f.endsWith('.mjs'))
    .map((f) => join(repo, 'scripts', f));
  return [...src, ...scripts, join(repo, 'index.html'), join(repo, 'README.md')].filter((f) => f !== self);
}

describe('banned words in source, scripts, index.html and README', () => {
  it('finds none', () => {
    const hits: string[] = [];
    for (const file of scannedFiles()) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        for (const [what, re] of BANNED) {
          if (re.test(line)) hits.push(`${relative(repo, file)}:${i + 1} ${what}`);
        }
      });
    }
    expect(hits).toEqual([]);
  });
});

/** Every string value reachable from a data export, with its path. */
function strings(value: unknown, path: string, out: Array<[string, string]> = []): Array<[string, string]> {
  if (typeof value === 'string') out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) strings(v, `${path}.${k}`, out);
  }
  return out;
}

describe('typography in data strings', () => {
  const data = { profile, personal, site, experience, education, languages, skillGroups, alsoUsed, projects };

  it('uses typographic quotes and no em dashes', () => {
    const bad: string[] = [];
    for (const [name, value] of Object.entries(data)) {
      for (const [path, s] of strings(value, name)) {
        if (s.includes("'")) bad.push(`${path}: straight apostrophe`);
        if (s.includes('"')) bad.push(`${path}: straight double quote`);
        if (s.includes('—')) bad.push(`${path}: em dash`);
      }
    }
    expect(bad).toEqual([]);
  });
});

describe('the old design system is gone', () => {
  const FONT = /(family=|font-family\s*:[^;]*)(Inter\b|Space\+?\s?Grotesk|JetBrains|Roboto|Poppins|Montserrat)/i;

  it('no banned fonts in index.html or any stylesheet', () => {
    const files = [join(repo, 'index.html'), ...walk(join(repo, 'src'), /\.css$/)];
    for (const f of files) expect(readFileSync(f, 'utf8'), relative(repo, f)).not.toMatch(FONT);
  });

  it('no framer-motion import in src', () => {
    for (const f of walk(join(repo, 'src'), /\.(ts|tsx)$/)) {
      if (f === self) continue;
      expect(readFileSync(f, 'utf8'), relative(repo, f)).not.toMatch(/from\s+['"]framer-motion['"]|import\(['"]framer-motion['"]\)/);
    }
  });

  it('package.json has no framer-motion or tailwindcss', () => {
    const pkg = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(deps).not.toHaveProperty('framer-motion');
    expect(deps).not.toHaveProperty('tailwindcss');
  });
});
