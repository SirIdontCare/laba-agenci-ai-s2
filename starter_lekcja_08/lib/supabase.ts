import "server-only"; // ten plik wolno importować tylko po stronie serwera — inaczej build się zatrzyma
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// KLIENT „ADMIN” — połączenie z bazą kluczem secret. Tylko dla WSPÓLNEJ bazy wiedzy
// (tabele documents i chunks, funkcja match_chunks — plik lib/knowledge.ts).
// Klucz secret omija RLS i otwiera całą bazę, dlatego:
// - nie dostaje przedrostka NEXT_PUBLIC_,
// - tego pliku nie importujemy w komponentach z "use client",
// - rozmów, wiadomości i profilu NIE czytamy tym klientem. Do danych użytkownika służy
//   klient zalogowanej osoby z lib/supabase-server.ts — wtedy danych pilnuje RLS.
// ============================================================

export const DATABASE_MISSING =
  "Baza wiedzy nie jest podłączona: brakuje SUPABASE_URL albo SUPABASE_SECRET_KEY. " +
  "Uzupełnij je w pliku .env.local i uruchom serwer ponownie. Do tego czasu nie da się dodawać ani przeszukiwać dokumentów.";

export const DATABASE_ERROR =
  "Nie udało się wczytać rozmowy z bazy Supabase. Sprawdź, czy w Supabase → SQL Editor został uruchomiony " +
  "cały skrypt baza.sql (razem z częścią „Lekcja 7”).";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

let client: SupabaseClient | null = null;

// Zwraca połączenie kluczem secret. Tworzymy je raz, przy pierwszym użyciu.
export function supabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error(DATABASE_MISSING);

  if (!client) {
    client = createClient(url, key, {
      // Ten klient nie loguje żadnego użytkownika — używa tylko klucza secret.
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
