const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

export async function generateTextAnthropic({ prompt, model, maxTokens = 8192 }) {
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
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }

  const data = await res.json();
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
  return generateTextAnthropic({ prompt, model: gen.textModel });
}
