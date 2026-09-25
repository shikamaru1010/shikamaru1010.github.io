// Exports the shape of my work log (dnevnik) to src/data/worklog.json:
// how many entries I wrote on which days. Nothing else leaves the folder.
//
//   npm run worklog [-- <dir>]
//
// It lists the folder (default ../dokumentacija/dnevnik next to the repo) and
// looks ONLY at file names that start with a date (YYYY-MM-DD, then .txt or .md).
// It never opens, reads or stats a file, and it never writes or prints a file
// name or slug: the only output is dates and counts. Local only, never run in CI.

import { readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.resolve(process.argv[2] ?? path.resolve(repoRoot, '..', 'dokumentacija', 'dnevnik'));
const OUTPUT_PATH = path.join(repoRoot, 'src', 'data', 'worklog.json');

const NAME = /^(\d{4}-\d{2}-\d{2})[^\/]*\.(txt|md)$/i;

/** True for a real calendar date written as YYYY-MM-DD. */
function isCalendarDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** Today's date in Belgrade, as YYYY-MM-DD. */
function todayInBelgrade() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Belgrade',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

async function main() {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    console.error('Work log folder not found. Pass it as an argument: npm run worklog -- <dir>');
    process.exit(1);
  }

  const asOf = todayInBelgrade();
  const counts = new Map();
  let future = 0;
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const match = NAME.exec(entry.name);
    if (!match || !isCalendarDate(match[1])) continue;
    const day = match[1];
    if (day > asOf) {
      future += 1;
      continue;
    }
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  const days = Object.fromEntries([...counts.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  const total = [...counts.values()].reduce((sum, n) => sum + n, 0);
  const payload = { asOf, total, days };

  await writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
  console.log(`Wrote ${total} entries on ${counts.size} days (as of ${asOf}).`);
  if (future) console.log(`Skipped ${future} entries dated after ${asOf}.`);
}

main();
