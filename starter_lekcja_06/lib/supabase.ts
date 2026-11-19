import "server-only"; // ten plik wolno importować tylko po stronie serwera — inaczej build się zatrzyma
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// JEDYNE miejsce, w którym aplikacja łączy się z bazą Supabase.
// Adres i klucz pochodzą z .env.local (lokalnie) albo z ustawień Vercel (online).
// Klucz secret otwiera całą bazę, dlatego:
// - nie dostaje przedrostka NEXT_PUBLIC_,
// - tego pliku nie importujemy w komponentach z "use client".
// ============================================================

export const DATABASE_MISSING =
  "Baza nie jest podłączona: brakuje SUPABASE_URL albo SUPABASE_SECRET_KEY. " +
  "Uzupełnij je w pliku .env.local i uruchom serwer ponownie. Do tego czasu rozmowy i profil nie są zapisywane.";

export const DATABASE_ERROR =
  "Nie udało się połączyć z bazą Supabase. Sprawdź adres i klucz w .env.local oraz to, " +
  "czy w Supabase → SQL Editor został uruchomiony skrypt baza.sql.";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

let client: SupabaseClient | null = null;

// Zwraca połączenie z bazą. Tworzymy je raz, przy pierwszym użyciu.
export function supabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error(DATABASE_MISSING);

  if (!client) {
    client = createClient(url, key, {
      // Serwer nie loguje żadnego użytkownika Supabase — używa tylko klucza secret.
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
