<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Zasady tego projektu (kurs Agenci AI)

- Rozmawiaj z autorem po polsku, prostym językiem. Autor nie musi być programistą.
- Biblioteki: Next.js 16, AI SDK 7 (`ai`, `@ai-sdk/react`), `@openrouter/ai-sdk-provider`, `@supabase/supabase-js`, `@supabase/ssr`, `zod`. Zanim użyjesz funkcji z tych bibliotek, sprawdź ją w `node_modules/ai/docs/` albo w plikach typów — nazwy różnią się od starszych wersji (np. `instructions`, `inputSchema`, `stopWhen: isStepCount(n)`, `toUIMessageStream`).
- Model i klucz są w jednym miejscu: `lib/model.ts`. Charakter chatbota: `lib/persona.ts`. Narzędzia agenta: `lib/tools.ts` (zestaw dla zalogowanej osoby tworzy `createAgentTools(auth)`). Funkcje pobierające dane z darmowych API: `lib/sources.ts` (używają ich narzędzia i strona `/dashboard`).
- Logowanie: Supabase Auth (e-mail i hasło oraz Google), pakiet `@supabase/ssr`. Zanim zmienisz logowanie, sprawdź aktualną dokumentację Supabase „Server-Side Auth for Next.js” i pliki typów pakietu. W tej wersji Next.js plik pośredniczący nazywa się `proxy.ts` (nie `middleware.ts`).
- Trzy klienty Supabase — każdy w swoim pliku, nie twórz kolejnych:
  - `lib/supabase-server.ts` — serwer, klient zalogowanej osoby: klucz publishable (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) + sesja z ciasteczek. Funkcja `getAuth()` zwraca `{ user, db }` albo `null`. Tylko przez `auth.db` czytamy i zapisujemy rozmowy, wiadomości i profil — wtedy danych pilnuje RLS.
  - `lib/supabase-browser.ts` — przeglądarka: tylko logowanie, rejestracja i wylogowanie (`app/components/LoginForm.tsx`, `app/components/UserMenu.tsx`). Przeglądarka nie czyta danych z bazy sama.
  - `lib/supabase.ts` — serwer, klucz secret (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`), funkcja `supabaseAdmin()`. Omija RLS, dlatego służy wyłącznie wspólnej bazie wiedzy (`lib/knowledge.ts`). Żadnego `NEXT_PUBLIC_` przy kluczu secret i żadnego importu tego pliku w komponentach z `"use client"`.
- Kto jest zalogowany, ustala wyłącznie serwer: `getAuth()` wywołuje `supabase.auth.getClaims()`, które sprawdza podpis sesji. Nie używaj na serwerze `getSession()` i nigdy nie bierz identyfikatora użytkownika z formularza, adresu strony ani z odpowiedzi modelu.
- `proxy.ts` odświeża sesję i przenosi niezalogowanych na `/login`, ale to tylko pierwsza bramka. Każda strona z danymi (`app/page.tsx`, `app/dashboard/page.tsx`, `app/upload/page.tsx` i każda nowa) sama wywołuje `getAuth()` i bez zalogowanej osoby robi `redirect("/login")`.
- Każdy endpoint w `app/api/` zaczyna się od `const auth = await getAuth(); if (!auth) return unauthorized();` — odpowiedź 401, zanim dotknie bazy albo modelu.
- Dane użytkownika i RLS: tabele `conversations`, `messages` i `user_profiles` mają kolumnę `user_id` (domyślnie `auth.uid()`), włączony RLS i polityki „tylko własne wiersze” dla roli `authenticated`. Kolumnę `user_id` wypełnia baza — nie przyjmuj jej z przeglądarki. Profil to jeden wiersz na osobę (unikalny `user_id`, zapis przez `upsert`). Zapis i odczyt rozmów: `lib/conversations.ts`. Profil: `lib/profile.ts`. Nowa tabela z danymi użytkownika dostaje taki sam zestaw: `user_id`, RLS, polityka, `grant … to authenticated`.
- Definicje tabel i polityk: `baza.sql` — gdy potrzebujesz zmiany w bazie, podaj autorowi gotowy skrypt SQL do wklejenia w Supabase → SQL Editor (bezpieczny do ponownego uruchomienia, RLS włączony) i dopisz go do `baza.sql`.
- Logowanie przez Google: przycisk w `LoginForm.tsx` (`signInWithOAuth`), powrót w `app/auth/callback/route.ts` (`exchangeCodeForSession`). Client ID i Client Secret są tylko w panelu Supabase — nigdy w kodzie ani w `.env.local`. Imię i zdjęcie pochodzą z `user_metadata` (`full_name` albo `name`, `avatar_url` albo `picture`); przy koncie e-mailowym ich nie ma — wtedy pokazujemy e-mail.
- Baza wiedzy (RAG) jest wspólna dla wszystkich zalogowanych osób i korzysta z klucza secret przez `supabaseAdmin()`. Dokumenty dodaje strona `/upload` i endpoint `app/api/upload/route.ts` (tabele `documents` i `chunks`, kolumna `embedding` typu `vector(1536)`). Agent szuka w niej narzędziem `searchKnowledge`, które wywołuje funkcję `match_chunks` w bazie. Model embeddingów jest w `lib/model.ts` (zmienna `OPENROUTER_EMBEDDING_MODEL`) — ten sam do zapisu dokumentów i do pytań. Embeddingi sprawdzaj w `node_modules/ai/docs/03-ai-sdk-core/30-embeddings.mdx` (`embed`, `embedMany`).
- Nie czytaj, nie wypisuj i nie zmieniaj wartości w `.env.local`. Możesz podawać tylko nazwy zmiennych.
- Po zmianach uruchom `npm run build` i napraw błędy. Na końcu napisz w 3 punktach, co zrobiłeś i jak to sprawdzić w przeglądarce.
