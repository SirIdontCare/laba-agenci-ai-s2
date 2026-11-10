import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// Jedno miejsce, w którym aplikacja łączy się z modelem.
// Klucz i nazwa modelu pochodzą z pliku .env.local (lokalnie) albo z ustawień Vercel (online).

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const MODEL_ID = process.env.OPENROUTER_MODEL || "openai/gpt-6-luna";

export function chatModel() {
  return openrouter.chat(MODEL_ID);
}

export function isModelConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}
