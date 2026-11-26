import "server-only"; // ten plik wolno importować tylko po stronie serwera
import { cookies } from "next/headers";
import { connection } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// KLIENT ZALOGOWANEJ OSOBY (serwer) i sprawdzanie, kto jest zalogowany.
// Klient powstaje od nowa przy każdym zapytaniu: klucz publishable + sesja z ciasteczek.
// Baza widzi wtedy konkretną osobę, a RLS oddaje tylko jej wiersze
// (rozmowy, wiadomości, profil). Klucz publishable sam niczego nie otwiera.
// ============================================================

// Zalogowana osoba — tyle, ile aplikacja o niej potrzebuje.
export type AppUser = {
  id: string; // identyfikator konta w Supabase (ten sam trafia do kolumny user_id)
  email: string;
  name: string | null; // imię i nazwisko z konta Google; przy logowaniu e-mailem brak
  avatarUrl: string | null; // zdjęcie z konta Google; przy logowaniu e-mailem brak
};

export type Auth = {
  user: AppUser;
  db: SupabaseClient; // klient tej osoby — do rozmów, wiadomości i profilu
};

function createUserClient(url: string, key: string, cookieStore: Awaited<ReturnType<typeof cookies>>): SupabaseClient {
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Strona (Server Component) nie może zapisywać ciasteczek — to nie błąd.
          // Sesję odświeża plik proxy.ts przy każdym wejściu.
        }
      },
    },
  });
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

// Kto jest zalogowany? Zwraca osobę i jej klienta bazy albo null, gdy nikt.
// getClaims() SPRAWDZA podpis sesji — nie ufa samemu ciasteczku. Nie używaj tu getSession().
// Identyfikator użytkownika bierzemy wyłącznie stąd: nigdy z formularza, adresu ani od modelu.
export async function getAuth(): Promise<Auth | null> {
  // connection() i ciasteczka zawsze na początku: dzięki temu strona powstaje przy każdym wejściu,
  // a nie raz podczas budowania aplikacji.
  await connection();
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null; // bez konfiguracji logowania nikt nie jest zalogowany

  const db = createUserClient(url, key, cookieStore);
  const { data, error } = await db.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) return null;

  // Dane z konta Google są w user_metadata. Nazwy pól: full_name albo name, avatar_url albo picture.
  // Przy koncie założonym e-mailem i hasłem tych pól nie ma — wtedy zostaje sam e-mail.
  const metadata = (claims.user_metadata ?? {}) as Record<string, unknown>;
  const avatar = text(metadata.avatar_url) ?? text(metadata.picture);

  return {
    db,
    user: {
      id: claims.sub,
      email: text(claims.email) ?? "",
      name: text(metadata.full_name) ?? text(metadata.name),
      // Adres zdjęcia przyjmujemy tylko wtedy, gdy zaczyna się od https://.
      avatarUrl: avatar?.startsWith("https://") ? avatar : null,
    },
  };
}

// Odpowiedź endpointu, gdy nikt nie jest zalogowany.
export function unauthorized(): Response {
  return Response.json({ error: "Brak dostępu. Zaloguj się." }, { status: 401 });
}
