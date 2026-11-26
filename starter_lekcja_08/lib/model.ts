import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// Jedno miejsce, w którym aplikacja łączy się z modelem.
// Klucz i nazwa modelu pochodzą z pliku .env.local (lokalnie) albo z ustawień Vercel (online).

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Model do rozmowy. Wyszukiwanie Google ("native") działa z modelami Gemini.
export const MODEL_ID = process.env.OPENROUTER_MODEL || "google/gemini-3.8-flash";

// Model do generowania obrazów (Nano Banana 2).
export const IMAGE_MODEL_ID = "google/gemini-3.1-flash-image-preview";

// Model embeddingów (lekcja 6): zamienia tekst na listę liczb opisującą jego znaczenie.
// Ten sam model służy do zapisu dokumentów i do pytań — inaczej liczby nie byłyby porównywalne.
// text-embedding-3-small zwraca 1536 liczb; tyle samo ma kolumna embedding w baza.sql.
export const EMBEDDING_MODEL_ID = process.env.OPENROUTER_EMBEDDING_MODEL || "openai/text-embedding-3-small";

export function chatModel() {
  return openrouter.chat(MODEL_ID);
}

export function imageModel() {
  return openrouter.imageModel(IMAGE_MODEL_ID);
}

export function embeddingModel() {
  return openrouter.textEmbeddingModel(EMBEDDING_MODEL_ID);
}

// Gotowe narzędzie wyszukiwania w internecie. Wyszukiwanie wykonuje OpenRouter,
// a do nas wracają źródła (adresy stron), na których model oparł odpowiedź.
export function webSearchTool() {
  return openrouter.tools.webSearch({ maxResults: 3, engine: "native" });
}

export function isModelConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}
