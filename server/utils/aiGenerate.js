import {
  buildAiUserPrompt,
  extractJsonObject,
  normalizeAiTemplate,
} from './aiTemplate.js';
import { generateRawJsonWithGemini } from './geminiGenerate.js';
import { generateRawJsonWithMistral } from './mistralGenerate.js';

function getAiProvider() {
  const provider = String(process.env.AI_PROVIDER || 'gemini').trim().toLowerCase();
  if (provider === 'mistral' || provider === 'devstral') return 'mistral';
  return 'gemini';
}

function isProviderConfigured(provider) {
  if (provider === 'mistral') return Boolean(process.env.MISTRAL_API_KEY);
  return Boolean(process.env.GEMINI_API_KEY);
}

export function getActiveAiProvider() {
  return getAiProvider();
}

export function assertAiProviderConfigured() {
  const provider = getAiProvider();
  if (!isProviderConfigured(provider)) {
    const keyName = provider === 'mistral' ? 'MISTRAL_API_KEY' : 'GEMINI_API_KEY';
    throw new Error(`${keyName} is not configured for AI_PROVIDER=${provider}`);
  }
  return provider;
}

async function generateRawJson(provider, userPrompt) {
  if (provider === 'mistral') {
    return generateRawJsonWithMistral(userPrompt);
  }
  return generateRawJsonWithGemini(userPrompt);
}

export async function generateAiPortfolio({ prompt, profile, preferences }) {
  const provider = assertAiProviderConfigured();
  const userPrompt = buildAiUserPrompt({ prompt, profile, preferences });

  let lastError = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const promptForAttempt =
        attempt === 0
          ? userPrompt
          : `${userPrompt}\n\nPrevious response was invalid. Return ONLY valid JSON matching the schema.`;
      const text = await generateRawJson(provider, promptForAttempt);
      const parsed = extractJsonObject(text);
      const normalized = normalizeAiTemplate(parsed, profile);
      return {
        ...normalized,
        provider,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Failed to generate portfolio');
}
