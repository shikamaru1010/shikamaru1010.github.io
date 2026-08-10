// Calls OpenRouter once to generate a fresh, original one-liner for the
// footer's daily message, then overwrites src/data/daily-message.json.
// Run by .github/workflows/daily-message.yml on a 24h schedule — the
// workflow commits the updated file only if generation succeeds, so a
// failed/unreachable API just leaves yesterday's message in place.

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUTPUT_PATH = fileURLToPath(new URL('../src/data/daily-message.json', import.meta.url));
const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5';
const MAX_LEN = 160;

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error('Missing OPENROUTER_API_KEY environment variable.');
  process.exit(1);
}

const SYSTEM_PROMPT = `You write a single short original aphorism for the footer of a software
engineer's portfolio site. Topic: building software, shipping real products, engineering craft,
persistence, or designing for real users — pick one angle, don't cover all of them at once.
Rules: one sentence, under ${MAX_LEN} characters, no quotation marks, no author attribution,
no emoji, no hashtags, no markdown. Sound like a sharp original thought, not a cliché.
Reply with ONLY the sentence, nothing else.`;

async function requestMessage() {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://shikamaru1010.github.io/',
      'X-Title': 'Portfolio daily message generator',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 1,
      max_tokens: 100,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw || typeof raw !== 'string') {
    throw new Error(`Unexpected OpenRouter response shape: ${JSON.stringify(data)}`);
  }

  return raw.trim().replace(/^["“]|["”]$/g, '').trim();
}

async function main() {
  let text;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const candidate = await requestMessage();
    if (candidate.length > 0 && candidate.length <= MAX_LEN) {
      text = candidate;
      break;
    }
    console.warn(`Attempt ${attempt} produced an unusable message (${candidate.length} chars), retrying...`);
  }

  if (!text) {
    console.error('Failed to generate a usable message after retries.');
    process.exit(1);
  }

  const payload = {
    text,
    generatedAt: new Date().toISOString().slice(0, 10),
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
  console.log('Wrote new daily message:', payload);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
