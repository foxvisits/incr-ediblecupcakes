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

export async function generateTextKie({ prompt, model }) {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error('Set KIE_API_KEY in .env for kie text provider');

  // Kie unified chat-style endpoint (OpenAI-compatible pattern used by many Kie LLM models)
  const res = await fetch('https://api.kie.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Kie LLM error ${res.status}: ${err}. Tip: set textProvider to "anthropic" in content/config.json`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('No text in Kie LLM response');
  return text;
}

export async function generateText({ prompt, config }) {
  const gen = config.generation;
  if (gen.textProvider === 'kie') {
    return generateTextKie({ prompt, model: gen.kieTextModel });
  }
  return generateTextAnthropic({
    prompt,
    model: gen.textModel,
    maxTokens: gen.maxTokens,
    effort: gen.effort,
  });
}
