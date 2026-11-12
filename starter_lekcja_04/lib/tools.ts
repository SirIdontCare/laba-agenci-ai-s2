import { generateImage, tool } from "ai";
import { z } from "zod";
import { imageModel, webSearchTool } from "@/lib/model";

// ============================================================
// NARZĘDZIA AGENTA.
// Model sam decyduje, którego użyć — na podstawie opisu (description).
// Własne narzędzie dodajesz tutaj, a jego etykietę w app/components/Chat.tsx.
// ============================================================

export const MAX_STEPS = 5;
export const MAX_IMAGE_PROMPT = 500;

// Wynik generowania obrazu — w tej postaci trafia do przeglądarki.
export type ImageResult = {
  image?: string; // obraz jako adres "data:image/png;base64,..."
  model?: string; // identyfikator modelu z odpowiedzi API
  error?: string; // komunikat po polsku, gdy się nie udało
};

// Dodatkowe informacje o odpowiedzi, które serwer dosyła do przeglądarki.
export type AgentMetadata = {
  model?: string; // model, który faktycznie odpowiedział
  fetchedAt?: string; // data i godzina odpowiedzi (dla listy „Źródła”)
  stoppedAtLimit?: boolean; // agent doszedł do limitu kroków
};

// Wspólna funkcja: używa jej endpoint /api/image oraz narzędzie generujObraz.
export async function createImage(prompt: string): Promise<ImageResult> {
  try {
    const result = await generateImage({ model: imageModel(), prompt });
    return {
      image: `data:${result.image.mediaType};base64,${result.image.base64}`,
      model: result.calls[0]?.response.modelId,
    };
  } catch {
    return {
      error: "Nie udało się wygenerować obrazu. Model obrazów może być teraz niedostępny — spróbuj za chwilę.",
    };
  }
}

// Function calling: zwykła funkcja napisana przez nas.
const aktualnyCzas = tool({
  description:
    "Zwraca dzisiejszą datę, dzień tygodnia i godzinę w Polsce (strefa Europe/Warsaw). " +
    "Użyj zawsze, gdy pytanie zależy od bieżącej daty lub godziny: „dziś”, „jutro”, „wczoraj”, " +
    "„za ile dni”, „który dziś dzień”, „ile zostało do…”. Nie zgaduj daty z pamięci.",
  inputSchema: z.object({}),
  execute: async () => {
    const now = new Date();
    const format = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("pl-PL", { timeZone: "Europe/Warsaw", ...options }).format(now);
    return {
      data: format({ year: "numeric", month: "long", day: "numeric" }),
      dzienTygodnia: format({ weekday: "long" }),
      godzina: format({ hour: "2-digit", minute: "2-digit" }),
      strefa: "Europe/Warsaw",
    };
  },
});

const generujObraz = tool({
  description:
    "Generuje obraz na podstawie opisu. Użyj, gdy użytkownik prosi o grafikę, plakat, logo, ilustrację lub zdjęcie. " +
    "Obraz zobaczy użytkownik w rozmowie — nie wklejaj go do odpowiedzi.",
  inputSchema: z.object({
    opis: z.string().min(1).max(MAX_IMAGE_PROMPT).describe("Dokładny opis obrazu: co na nim jest, styl, kolory"),
  }),
  execute: async ({ opis }) => createImage(opis),
  // Do przeglądarki idzie cały obraz, ale do modelu wraca tylko krótki tekst.
  toModelOutput: ({ output }) => ({
    type: "text",
    value: output.error ? `Błąd: ${output.error}` : "obraz wygenerowany",
  }),
});

export const agentTools = {
  wyszukiwanie: webSearchTool(),
  aktualnyCzas,
  generujObraz,
};
