const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

/**
 * `max_tokens` bounds thinking *plus* response text. Claude Sonnet 5 runs
 * adaptive thinking by default, so the 8192 that comfortably fit a recipe on
 * Sonnet 4.6 can now be spent before the JSON is finished — which surfaces
 * downstream as a JSON parse error rather than as a truncation. 16k leaves
 * room for both while staying well inside HTTP timeouts.
 */
export async function generateTextAnthropic({ prompt, model, maxTokens = 16000, effort = 'medium' }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Set ANTHROPIC_API_KEY in .env');

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      thinking: { type: 'adaptive' },
      output_config: { effort },
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }

  const data = await res.json();

  // Fail loudly on a truncated generation. Without this the half-written JSON
  // reaches the parser and reports a syntax error at some arbitrary offset,
  // which looks like a bad prompt rather than an exhausted token budget.
  if (data.stop_reason === 'max_tokens') {
    throw new Error(
      `Anthropic response hit max_tokens (${maxTokens}) before finishing. ` +
        `Raise maxTokens or lower generation.effort in content/config.json.`,
    );
  }
  if (data.stop_reason === 'refusal') {
    throw new Error(`Anthropic declined this prompt (${data.stop_details?.category ?? 'unknown'}).`);
  }

  const block = data.content?.find((b) => b.type === 'text');
  if (!block?.text) throw new Error('No text in Anthropic response');
  return block.text;
}

const KIE_CLAUDE_URL = 'https://api.kie.ai/claude/v1/messages';

/**
 * Claude through kie.ai, for an account with a kie.ai balance and no
 * Anthropic one. kie.ai serves Anthropic's Messages format at its own URL,
 * with differences its model pages describe (November 2026):
 *   - auth is `Authorization: Bearer <key>`, not x-api-key;
 *   - responses stream unless `stream: false` is sent;
 *   - thinking is a boolean `thinkingFlag`, with no effort setting;
 *   - max_tokens defaults to 4096, too few for a guide, so it is always sent.
 * kie.ai can report errors as HTTP 200 with a `code`/`msg` body, so the body
 * is checked as well as the status.
 *
 * The previous version of this function called an OpenAI-style
 * /v1/chat/completions URL that kie.ai does not serve. It had never run.
 */
export async function generateTextKie({ prompt, model, maxTokens = 16000, thinking = true }) {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error('Set KIE_API_KEY for the kie text provider');

  const res = await fetch(KIE_CLAUDE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      stream: false,
      thinkingFlag: thinking,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`kie.ai text: non-JSON response (HTTP ${res.status}): ${raw.slice(0, 300)}`);
  }

  // A bare { code, msg } envelope is an error even under HTTP 200.
  const message = data.content ? data : data.data;
  if (!res.ok || !message?.content) {
    const detail = data.msg ?? data.error?.message ?? raw.slice(0, 300);
    throw new Error(`kie.ai text error (HTTP ${res.status}, code ${data.code ?? '-'}): ${detail}`);
  }

  if (message.stop_reason === 'max_tokens') {
    throw new Error(
      `kie.ai response hit max_tokens (${maxTokens}) before finishing. ` +
        `Raise generation.maxTokens in content/config.json.`,
    );
  }
  if (message.stop_reason === 'refusal') {
    throw new Error('kie.ai: the model declined this prompt.');
  }

  const text = message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
  if (!text) throw new Error(`No text in kie.ai response: ${raw.slice(0, 300)}`);
  return text;
}

export async function generateText({ prompt, config }) {
  const gen = config.generation;
  if (gen.textProvider === 'kie') {
    return generateTextKie({
      prompt,
      model: gen.kieTextModel,
      maxTokens: gen.maxTokens,
      thinking: gen.kieThinking !== false,
    });
  }
  return generateTextAnthropic({
    prompt,
    model: gen.textModel,
    maxTokens: gen.maxTokens,
    effort: gen.effort,
  });
}
