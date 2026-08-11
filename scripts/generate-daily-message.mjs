// Picks the day's footer quote from the verified pool (quote-pool.mjs) and
// overwrites src/data/daily-message.json. Run by .github/workflows/daily-
// message.yml on a 24h schedule — deterministic by calendar day (UTC), so
// re-running on the same day always yields the same pick.

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { quotePool } from './quote-pool.mjs';

const OUTPUT_PATH = fileURLToPath(new URL('../src/data/daily-message.json', import.meta.url));

function pickForToday(date = new Date()) {
  const dayNumber = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  const index = ((dayNumber % quotePool.length) + quotePool.length) % quotePool.length;
  return quotePool[index];
}

async function main() {
  const quote = pickForToday();
  const payload = {
    text: quote.text,
    author: quote.author,
    generatedAt: new Date().toISOString().slice(0, 10),
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
  console.log('Wrote daily message:', payload);
}

main();
