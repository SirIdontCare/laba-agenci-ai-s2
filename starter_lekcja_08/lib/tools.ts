import { generateImage, tool } from "ai";
import { z } from "zod";
import { searchChunks } from "@/lib/knowledge";
import { MODEL_ID, imageModel, webSearchTool } from "@/lib/model";
import { saveProfile } from "@/lib/profile";
import { pobierzCzas, pobierzKurs, pobierzPogode, pobierzSwieta, pobierzWikipedie, policz, teraz } from "@/lib/sources";
import { DATABASE_MISSING, isDatabaseConfigured } from "@/lib/supabase";
import type { Auth } from "@/lib/supabase-server";

// ============================================================
// NARZĘDZIA AGENTA.
// Model sam decyduje, którego użyć — na podstawie opisu (description).
// Własne narzędzie dodajesz tutaj (i na liście w createAgentTools na końcu pliku),
// a jego etykietę w app/components/Chat.tsx.
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
  conversationId?: number; // numer rozmowy w bazie, do której należy ta odpowiedź
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

// Notatki trzymamy w pamięci serwera: znikają po restarcie i są wspólne dla wszystkich kont.
// (Rozmowy i profil są już w bazie, osobno dla każdej osoby — patrz narzędzie zapiszProfil niżej.)
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

// ---------- Pamięć o użytkowniku (lekcja 5; od lekcji 7 osobno dla każdego konta) ----------

// To narzędzie powstaje dla konkretnej zalogowanej osoby: „auth” pochodzi z sesji
// sprawdzonej na serwerze. Model nie podaje i nie może zmienić tego, czyj profil zapisuje.
const zapiszProfil = (auth: Auth) => tool({
  description:
    "Zapisuje w bazie fakty o użytkowniku, żeby pamiętać je w kolejnych rozmowach. " +
    "Użyj TYLKO wtedy, gdy użytkownik mówi coś o sobie wprost, np. „Mam na imię Ada”, „Mieszkam w Toruniu”, " +
    "„Wolę krótkie odpowiedzi”. Nie zapisuj domysłów, planów („może kiedyś…”) ani żartów. " +
    "Nigdy nie zapisuj haseł, kluczy, numerów dokumentów i kart ani innych danych wrażliwych. " +
    "Podaj tylko nowe fakty — wcześniej zapisane zostają w profilu.",
  inputSchema: z.object({
    imie: z.string().min(1).max(80).optional().describe("Imię użytkownika — tylko gdy je podał"),
    preferencje: z
      .array(
        z.object({
          nazwa: z.string().min(1).max(40).describe("Krótka nazwa faktu, np. miasto, ulubione jedzenie, styl odpowiedzi"),
          wartosc: z.string().min(1).max(200).describe("Wartość, np. Toruń, pierogi, krótko"),
        }),
      )
      .max(10)
      .optional()
      .describe("Pozostałe fakty o użytkowniku jako pary nazwa–wartość"),
  }),
  execute: async ({ imie, preferencje }) => {
    const nowe: Record<string, string> = {};
    for (const fakt of preferencje ?? []) nowe[fakt.nazwa.trim().toLowerCase()] = fakt.wartosc.trim();
    const noweImie = imie?.trim() || undefined;
    if (!noweImie && Object.keys(nowe).length === 0) {
      return { blad: "Nie podano żadnego faktu do zapisania.", pobrano: teraz() };
    }

    try {
      const profil = await saveProfile(auth, noweImie, nowe);
      const zapisane = Object.entries(nowe).map(([nazwa, wartosc]) => `${nazwa}: ${wartosc}`);
      if (noweImie) zapisane.unshift(`imię: ${noweImie}`);
      return { profil, opis: `Zapisano w profilu — ${zapisane.join(", ")}`, pobrano: teraz() };
    } catch (error) {
      console.error("Nie udało się zapisać profilu:", error);
      return { blad: "Nie udało się zapisać profilu w bazie. Sprawdź tabelę user_profiles w Supabase.", pobrano: teraz() };
    }
  },
});

// ---------- Baza wiedzy (lekcja 6) ----------

const searchKnowledge = tool({
  description:
    "Wyszukiwanie w bazie wiedzy firmy (dokumenty dodane na stronie /upload). " +
    "Używaj przy każdym pytaniu o firmę, ofertę, ceny, zasady i regulamin. " +
    "Zwraca 3 najlepiej pasujące fragmenty: tytuł dokumentu, treść fragmentu i podobieństwo (od 0 do 1). " +
    "Fragment na podobny temat to jeszcze nie odpowiedź — sprawdź, czy naprawdę odpowiada na pytanie.",
  inputSchema: z.object({
    pytanie: z.string().min(1).max(500).describe("Pytanie użytkownika własnymi słowami, np. Ile kosztuje pakiet Start?"),
  }),
  execute: async ({ pytanie }) => {
    if (!isDatabaseConfigured()) return { blad: DATABASE_MISSING, pobrano: teraz() };
    try {
      const fragmenty = await searchChunks(pytanie);
      return {
        fragmenty,
        opis:
          fragmenty.length > 0
            ? `Znaleziono fragmenty: ${fragmenty.length} (${[...new Set(fragmenty.map((f) => f.tytul))].join(", ")})`
            : "Baza wiedzy jest pusta — nie ma w niej żadnych fragmentów.",
        pobrano: teraz(),
      };
    } catch (error) {
      console.error("Nie udało się przeszukać bazy wiedzy:", error);
      return {
        blad: "Nie udało się przeszukać bazy wiedzy. Sprawdź model embeddingów oraz tabele documents i chunks w Supabase.",
        pobrano: teraz(),
      };
    }
  },
});

// Czy zmienna środowiskowa jest ustawiona? Zwracamy tylko tak/nie — nigdy wartość.
function ustawiona(nazwa: string): "tak" | "nie" {
  return process.env[nazwa] ? "tak" : "nie";
}

const diagnostyka = (nazwyNarzedzi: () => string[]) => tool({
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
      NEXT_PUBLIC_SUPABASE_URL: ustawiona("NEXT_PUBLIC_SUPABASE_URL"),
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ustawiona("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
      SUPABASE_URL: ustawiona("SUPABASE_URL"),
      SUPABASE_SECRET_KEY: ustawiona("SUPABASE_SECRET_KEY"),
      OPENROUTER_EMBEDDING_MODEL: ustawiona("OPENROUTER_EMBEDDING_MODEL"),
    },
    opis: `Model ${MODEL_ID}, ${nazwyNarzedzi().length} narzędzi, limit ${MAX_STEPS} kroków`,
    pobrano: teraz(),
  }),
});

// Zestaw narzędzi dla jednej zalogowanej osoby. Endpoint tworzy go przy każdym zapytaniu,
// bo zapiszProfil musi wiedzieć, czyj profil zapisuje.
export function createAgentTools(auth: Auth) {
  const nazwy: string[] = [];
  const tools = {
    wyszukiwanie: webSearchTool(),
    generujObraz,
    pogoda,
    waluty,
    swieta,
    wikipedia,
    kalkulator,
    czas,
    notatki,
    zapiszProfil: zapiszProfil(auth),
    searchKnowledge,
    diagnostyka: diagnostyka(() => nazwy),
  };
  nazwy.push(...Object.keys(tools));
  return tools;
}

export type AgentTools = ReturnType<typeof createAgentTools>;
