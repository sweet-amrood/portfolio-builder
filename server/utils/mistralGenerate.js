import { AI_SYSTEM_PROMPT } from './aiTemplate.js';

function getMistralConfig() {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY is not configured');
  }

  const baseUrl = (process.env.MISTRAL_BASE_URL || 'https://api.mistral.ai/v1').replace(/\/$/, '');
  const model = process.env.MISTRAL_MODEL || 'devstral-2-latest';

  return { apiKey, baseUrl, model };
}

export async function generateRawJsonWithMistral(userPrompt) {
  const { apiKey, baseUrl, model } = getMistralConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 8192,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error?.message ||
      data?.detail ||
      raw ||
      `Mistral request failed (${response.status})`;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }

  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim()) {
    return content;
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('')
      .trim();
    if (text) return text;
  }

  throw new Error('Mistral returned an empty response');
}
