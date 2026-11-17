import { generateImage, tool } from "ai";
import { z } from "zod";
import { MODEL_ID, imageModel, webSearchTool } from "@/lib/model";
import { pobierzCzas, pobierzKurs, pobierzPogode, pobierzSwieta, pobierzWikipedie, policz, teraz } from "@/lib/sources";

// ============================================================
// NARZĘDZIA AGENTA.
// Model sam decyduje, którego użyć — na podstawie opisu (description).
// Własne narzędzie dodajesz tutaj, a jego etykietę w app/components/Chat.tsx.
// Funkcje pobierające dane z internetu są w lib/sources.ts.
// ============================================================

export const MAX_STEPS = 6; // najwyżej tyle kroków modelu na jedno zadanie
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
  steps?: number; // ile kroków wykonał agent
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

// ---------- Osiem narzędzi z lekcji 4 ----------

const dataSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data w formacie RRRR-MM-DD")
  .describe("Dzień w formacie RRRR-MM-DD, np. 2026-11-18");

const pogoda = tool({
  description:
    "Prognoza pogody dla miasta na wybrany dzień (dziś i do 16 dni naprzód): temperatura, opady, wiatr. " +
    "Użyj zawsze, gdy ktoś pyta o pogodę. Gdy pytanie brzmi „jutro” albo „w sobotę”, " +
    "najpierw sprawdź dzisiejszą datę narzędziem czas. Jeśli miasto nie istnieje, powiedz to — nie wymyślaj prognozy.",
  inputSchema: z.object({
    miasto: z.string().min(1).max(80).describe("Nazwa miasta, np. Lizbona"),
    data: dataSchema.optional().describe("Dzień prognozy w formacie RRRR-MM-DD. Bez tego pola: dziś."),
  }),
  execute: async ({ miasto, data }) => pobierzPogode(miasto, data),
});

const waluty = tool({
  description:
    "Aktualny średni kurs waluty obcej wobec złotego z NBP oraz przeliczenie kwoty w tej walucie na złote. " +
    "Użyj przy pytaniach o kursy walut i ceny w obcej walucie. Wynik zawiera datę kursu " +
    "(NBP publikuje kursy w dni robocze). Żeby przeliczyć złote na walutę obcą, weź kurs stąd " +
    "i podziel kwotę narzędziem kalkulator.",
  inputSchema: z.object({
    waluta: z.string().length(3).describe("Trzyliterowy kod waluty, np. EUR, USD, GBP, CHF"),
    kwota: z.number().positive().optional().describe("Kwota w walucie obcej do przeliczenia na złote"),
  }),
  execute: async ({ waluta, kwota }) => pobierzKurs(waluta, kwota),
});

const swieta = tool({
  description:
    "Lista dni wolnych od pracy (świąt państwowych) w podanym kraju i roku. " +
    "Użyj przy planowaniu terminów, podróży i spotkań oraz przy pytaniach „czy to dzień wolny”.",
  inputSchema: z.object({
    kodKraju: z.string().length(2).describe("Dwuliterowy kod kraju ISO, np. PL, PT, DE, IT"),
    rok: z.number().int().min(1975).max(2075).describe("Rok, np. 2026"),
  }),
  execute: async ({ kodKraju, rok }) => pobierzSwieta(kodKraju, rok),
});

const wikipedia = tool({
  description:
    "Krótkie streszczenie hasła z polskiej Wikipedii i link do artykułu. " +
    "Użyj, gdy potrzebujesz wiedzy encyklopedycznej o miejscu, osobie, pojęciu lub wydarzeniu. Podaj link w odpowiedzi.",
  inputSchema: z.object({
    haslo: z.string().min(1).max(120).describe("Hasło do wyszukania, np. Lizbona"),
  }),
  execute: async ({ haslo }) => pobierzWikipedie(haslo),
});

const kalkulator = tool({
  description:
    "Dokładne działanie na dwóch liczbach: dodawanie, odejmowanie, mnożenie albo dzielenie. " +
    "Użyj zawsze, gdy trzeba coś policzyć — nie licz w pamięci. Przy dłuższych rachunkach wywołaj kilka razy, " +
    "podając wynik poprzedniego działania jako liczbę w następnym.",
  inputSchema: z.object({
    dzialanie: z.enum(["dodaj", "odejmij", "pomnoz", "podziel"]).describe("Rodzaj działania"),
    a: z.number().describe("Pierwsza liczba"),
    b: z.number().describe("Druga liczba"),
  }),
  execute: async ({ dzialanie, a, b }) => policz(dzialanie, a, b),
});

const czas = tool({
  description:
    "Aktualna data, dzień tygodnia i godzina w podanej strefie czasowej (domyślnie Polska) oraz różnica względem Polski. " +
    "Użyj zawsze, gdy pytanie zależy od bieżącej daty lub godziny: „dziś”, „jutro”, „za ile dni”, " +
    "„która godzina w…”. Nie zgaduj daty z pamięci.",
  inputSchema: z.object({
    strefa: z
      .string()
      .max(60)
      .optional()
      .describe("Strefa czasowa w postaci Kontynent/Miasto, np. Europe/Lisbon. Bez tego pola: Europe/Warsaw."),
  }),
  execute: async ({ strefa }) => pobierzCzas(strefa),
});

// Notatki trzymamy w pamięci serwera: znikają po restarcie i są wspólne dla wszystkich.
// Trwałą pamięć (bazę danych) dodajemy na następnej lekcji.
const zapisaneNotatki: { tresc: string; zapisano: string }[] = [];

const notatki = tool({
  description:
    "Notatnik użytkownika. Akcja „zapisz” dodaje notatkę, akcja „pokaz” zwraca wszystkie zapisane notatki. " +
    "Użyj, gdy ktoś prosi o zapamiętanie, zanotowanie albo pokazanie notatek.",
  inputSchema: z.object({
    akcja: z.enum(["zapisz", "pokaz"]).describe("zapisz — dodaj notatkę, pokaz — pokaż wszystkie"),
    tresc: z.string().max(500).optional().describe("Treść notatki (wymagana przy akcji zapisz)"),
  }),
  execute: async ({ akcja, tresc }) => {
    if (akcja === "zapisz") {
      const tekst = tresc?.trim();
      if (!tekst) return { blad: "Podaj treść notatki do zapisania.", pobrano: teraz() };
      zapisaneNotatki.push({ tresc: tekst, zapisano: teraz() });
    }
    return {
      notatki: zapisaneNotatki,
      opis:
        akcja === "zapisz"
          ? `Zapisano notatkę. Liczba notatek: ${zapisaneNotatki.length}`
          : `Liczba notatek: ${zapisaneNotatki.length}`,
      pobrano: teraz(),
    };
  },
});

// Czy zmienna środowiskowa jest ustawiona? Zwracamy tylko tak/nie — nigdy wartość.
function ustawiona(nazwa: string): "tak" | "nie" {
  return process.env[nazwa] ? "tak" : "nie";
}

function nazwyNarzedzi(): string[] {
  return Object.keys(agentTools);
}

const diagnostyka = tool({
  description:
    "Sprawdza stan agenta: nazwa modelu, lista dostępnych narzędzi, limit kroków oraz to, " +
    "czy wymagane zmienne środowiskowe są ustawione (tylko tak/nie). Użyj, gdy ktoś pyta, " +
    "czy wszystko działa, jaki to model albo jakie masz narzędzia.",
  inputSchema: z.object({}),
  execute: async () => ({
    model: MODEL_ID,
    narzedzia: nazwyNarzedzi(),
    limitKrokow: MAX_STEPS,
    zmienneSrodowiskowe: {
      OPENROUTER_API_KEY: ustawiona("OPENROUTER_API_KEY"),
      CHAT_PASSWORD: ustawiona("CHAT_PASSWORD"),
      SESSION_SECRET: ustawiona("SESSION_SECRET"),
    },
    opis: `Model ${MODEL_ID}, ${nazwyNarzedzi().length} narzędzi, limit ${MAX_STEPS} kroków`,
    pobrano: teraz(),
  }),
});

export const agentTools = {
  wyszukiwanie: webSearchTool(),
  generujObraz,
  pogoda,
  waluty,
  swieta,
  wikipedia,
  kalkulator,
  czas,
  notatki,
  diagnostyka,
};
