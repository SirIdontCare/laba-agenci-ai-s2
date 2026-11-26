import { createBrowserClient } from "@supabase/ssr";

// ============================================================
// KLIENT SUPABASE DLA PRZEGLĄDARKI — tylko do logowania, rejestracji i wylogowania.
// Używa klucza publishable (zmienne NEXT_PUBLIC_…), który może trafić do przeglądarki.
// Sesję zapisuje w ciasteczkach, dzięki czemu widzi ją także serwer.
// Danych (rozmów, profilu) przeglądarka nie czyta z bazy sama — robi to serwer.
// ============================================================

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const AUTH_MISSING =
  "Logowanie nie jest skonfigurowane: brakuje NEXT_PUBLIC_SUPABASE_URL albo NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
  "Uzupełnij je w pliku .env.local i uruchom serwer ponownie.";

export function isAuthConfigured(): boolean {
  return Boolean(url && key);
}

export function supabaseBrowser() {
  if (!url || !key) throw new Error(AUTH_MISSING);
  return createBrowserClient(url, key);
}
