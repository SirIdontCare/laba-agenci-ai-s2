# Starter — agent po lekcji 7

Gotowa, działająca aplikacja w stanie „po lekcji 7”. Użyj jej, jeśli Twój projekt z poprzednich zajęć nie działa albo chcesz zacząć lekcję 8 z czystego miejsca.

## Co już działa

- czat z odpowiedzią pisaną na żywo (streaming),
- **konta użytkowników przez Supabase Auth (lekcja 7)**:
  - strona `/login` z zakładkami „Zaloguj się” i „Załóż konto” (e-mail i hasło, minimum 8 znaków) oraz przyciskiem „Zaloguj się przez Google”,
  - bez logowania każda strona (`/`, `/dashboard`, `/upload`) przenosi na `/login`, a każdy endpoint w `app/api/` odpowiada kodem 401,
  - w nagłówku widać zalogowaną osobę — imię i zdjęcie z konta Google albo sam e-mail — oraz przycisk „Wyloguj”,
  - **każde konto ma własne dane**: rozmowy, wiadomości i profil należą do zalogowanej osoby (kolumna `user_id`), a pilnuje tego sama baza regułami RLS — konto B nie zobaczy rozmów konta A, nawet gdyby w kodzie aplikacji był błąd,
- charakter chatbota i przykłady odpowiedzi (plik `lib/persona.ts`),
- wyszukiwanie w internecie z listą „Źródła”, zdjęcia (Vision), generowanie obrazów i przycisk „Analiza JSON” — tak jak po lekcji 3,
- **trwała pamięć w bazie Supabase (lekcja 5)**:
  - rozmowy zapisują się w tabelach `conversations` i `messages` — po odświeżeniu strony (F5) wczytuje się ostatnia rozmowa,
  - przycisk „Nowa rozmowa” zaczyna pustą rozmowę; stara zostaje w bazie,
  - zapisywany jest tekst wiadomości; zamiast zdjęć i obrazów w bazie jest dopisek „[obraz]”,
  - narzędzie `zapiszProfil` zapamiętuje to, co powiesz o sobie wprost (imię, miasto, upodobania), w tabeli `user_profiles` — każda osoba ma jeden wiersz, który jest aktualizowany,
  - przed każdą odpowiedzią serwer wczytuje profil i dołącza go do instrukcji agenta, więc agent pamięta Cię także w nowej rozmowie,
- **baza wiedzy z Twoich dokumentów — RAG (lekcja 6)** — wspólna dla wszystkich zalogowanych osób:
  - strona `/upload` (link „Baza wiedzy” w nagłówku czatu): wpisujesz tytuł, wklejasz treść do 20 000 znaków i klikasz „Dodaj do bazy wiedzy”,
  - serwer zapisuje dokument w tabeli `documents` i dzieli treść na fragmenty: jeden akapit (tekst oddzielony pustą linią) to jeden fragment, a akapit dłuższy niż 800 znaków jest dzielony na granicy zdania,
  - każdy fragment trafia do tabeli `chunks` razem z embeddingiem — listą 1536 liczb opisującą jego znaczenie,
  - narzędzie `searchKnowledge` zamienia pytanie na embedding tym samym modelem i pobiera z bazy 3 najbliższe znaczeniem fragmenty (funkcja `match_chunks`),
  - na pytania o firmę agent odpowiada tylko z tych fragmentów i dopisuje linię „📎 Źródło: [tytuł dokumentu]”; gdy odpowiedzi w nich nie ma, pisze „Nie mam tej informacji w bazie wiedzy” i nie zgaduje,
- **osiem narzędzi z lekcji 4** — wszystkie korzystają z darmowych danych, bez dodatkowych kluczy:

  | Narzędzie | Co robi | Skąd bierze dane |
  |---|---|---|
  | `pogoda` | prognoza dla miasta i dnia | Open-Meteo |
  | `waluty` | kurs waluty wobec złotego i przeliczenie kwoty | NBP |
  | `swieta` | dni wolne od pracy w kraju i roku | Nager.Date |
  | `wikipedia` | streszczenie hasła i link | polska Wikipedia |
  | `kalkulator` | dodawanie, odejmowanie, mnożenie, dzielenie | — |
  | `czas` | data i godzina w strefie czasowej | zegar serwera |
  | `notatki` | zapisz notatkę, pokaż notatki | pamięć serwera (znikają po restarcie) |
  | `diagnostyka` | model, lista narzędzi, limit kroków, czy zmienne są ustawione (tak/nie) | — |

  Dziewiąte narzędzie, `zapiszProfil`, doszło na lekcji 5 i zapisuje dane w Twojej bazie. Dziesiąte, `searchKnowledge`, doszło na lekcji 6 i szuka w bazie wiedzy.

- **etykiety użytych narzędzi** nad odpowiedzią, np. „🌤️ pogoda”, „💱 waluty”,
- **pętla ReAct** — pod etykietami lista kroków po kolei, np. „Kroki: 1. waluty → 2. kalkulator”,
- **limit 6 kroków** na jedno zadanie — po dojściu do limitu agent pisze „Zatrzymałem się po 6 krokach” i pokazuje, co zdążył ustalić,
- **strona `/dashboard` (asystent podróży)** — wpisujesz miasto i datę, dostajesz pięć kart (pogoda, waluty, święta, Wikipedia, czas) z nazwą źródła i godziną pobrania, przycisk „Odśwież” oraz krótkie podsumowanie od agenta. Dostępna tylko po zalogowaniu; link jest w nagłówku czatu.

Aplikacja używa dwóch kluczy Supabase:

| Klucz | Do czego służy | Kto go widzi |
|---|---|---|
| publishable (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) | logowanie oraz rozmowy, wiadomości i profil — czytane i zapisywane „jako zalogowana osoba”, więc danych pilnuje RLS | może trafić do przeglądarki; sam niczego nie otwiera |
| secret (`SUPABASE_SECRET_KEY`) | wspólna baza wiedzy (`documents`, `chunks`, `match_chunks`) | tylko serwer; przeglądarka nigdy go nie dostaje |

Rozmowy i profil zapisane przed lekcją 7 nie mają właściciela (puste `user_id`), więc po zalogowaniu ich nie widać — to poprawne. Notatki z narzędzia `notatki` nadal są w pamięci serwera i są wspólne dla wszystkich kont.

Strona `/upload` ma na razie sam formularz. Nie ma jeszcze listy dokumentów, usuwania ani zastępowania starszej wersji — dokument usuniesz w Supabase → Table Editor → `documents` (jego fragmenty znikną razem z nim).

## Uruchomienie (15 minut)

1. Skopiuj ten folder w swoje miejsce na projekty (np. `Dokumenty/projekty/moj-agent`) i otwórz w nim terminal.
2. Zainstaluj biblioteki:

   ```bash
   npm install
   ```

   W Windows PowerShell wpisuj `npm.cmd` zamiast `npm`.

3. Skopiuj plik `.env.example` jako `.env.local` i uzupełnij wartości. Jeśli masz `.env.local` z poprzedniego projektu — po prostu skopiuj go tutaj. Sprawdź tylko, czy model to `google/gemini-3.8-flash` (wyszukiwanie i zdjęcia działają z modelami Gemini). Zmienne `CHAT_PASSWORD` i `SESSION_SECRET` nie są już potrzebne — możesz je usunąć.
4. Sprawdź, czy w `.env.local` są dwie zmienne bazy: `SUPABASE_URL` (adres projektu) i `SUPABASE_SECRET_KEY` (klucz secret, zaczyna się od `sb_secret_`). Nie masz jeszcze projektu Supabase? Załóż go według części A i C warsztatu 1 lekcji 5.
5. Dopisz w `.env.local` dwie zmienne logowania — bez spacji i bez cudzysłowów:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=tu_wklej_adres_projektu
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_wklej_klucz_publishable
   ```

   Adres projektu jest ten sam co w `SUPABASE_URL`. Klucz publishable znajdziesz w Supabase → **Settings** → **API Keys** (albo pod przyciskiem **Connect**); zaczyna się od `sb_publishable_`. To inny klucz niż secret.
6. Sprawdź, czy w `.env.local` jest model embeddingów:

   ```dotenv
   OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-small
   ```

   Jeśli prowadzący podał inną nazwę — wpisz tę od prowadzącego.
7. Utwórz tabele i reguły. Otwórz swój projekt w Supabase → **SQL Editor**, wklej całą treść pliku `baza.sql` z tego folderu i kliknij **Run**. Skrypt włącza dodatek `vector`, tworzy tylko to, czego brakuje, i dodaje część z lekcji 7: kolumnę `user_id`, reguły RLS „tylko własne wiersze” i uprawnienia dla zalogowanych osób. Jeśli masz już tabele z lekcji 5 i 6, zostają razem z danymi.
8. Ustaw logowanie w Supabase → **Authentication**:
   - **Sign In / Providers** → **Email**: sprawdź, że jest włączony, wyłącz przełącznik **Confirm email** i kliknij **Save**. Bez tego nowe konto czeka na kliknięcie linku z e-maila, a darmowa poczta Supabase wysyła tylko kilka wiadomości na godzinę.
   - **URL Configuration**: w polu **Site URL** wpisz `http://localhost:3000`, a w części **Redirect URLs** dodaj `http://localhost:3000/**` (z dwiema gwiazdkami) i zapisz.
9. Uruchom:

   ```bash
   npm run dev
   ```

10. Otwórz http://localhost:3000. Aplikacja przenosi na `/login`. Kliknij „Załóż konto”, wpisz e-mail i hasło (minimum 8 znaków) — jesteś w czacie, a w nagłówku widać Twój e-mail.

**Logowanie przez Google** działa dopiero po skonfigurowaniu dostawcy Google w Supabase i klienta OAuth w Google Cloud — krok po kroku w warsztacie 3 lekcji 7. Logowanie e-mailem i hasłem działa bez tego. W kodzie i w `.env.local` nie ma Client ID ani Client Secret: wpisujesz je tylko w panelu Supabase.

## Sprawdź, czy działa

Najpierw logowanie. Kliknij „Wyloguj” i wpisz w pasku adresu `http://localhost:3000/upload` — wracasz na `/login`. Zaloguj się ponownie. W Supabase → **Authentication → Users** widać Twoje konto.

Zadaj w czacie te pytania — przy każdym powinna pojawić się etykieta narzędzia i lista kroków:

```text
Jaka będzie jutro pogoda w Lizbonie?
```

```text
Sprawdź kurs euro, a potem policz, ile euro dostanę za 1500 zł.
```

Teraz pamięć. Napisz:

```text
Mam na imię Ada, mieszkam w Toruniu i wolę krótkie odpowiedzi.
```

Nad odpowiedzią powinna pojawić się etykieta „🧠 zapiszProfil”. Naciśnij **F5** — rozmowa nadal jest na ekranie. Kliknij „Nowa rozmowa” i zapytaj:

```text
Co o mnie wiesz?
```

Agent podaje imię, miasto i preferencję. W Supabase → Table Editor zobaczysz wiersze w tabelach `conversations`, `messages` i `user_profiles` — każdy z Twoim identyfikatorem w kolumnie `user_id`.

Teraz prywatność. Otwórz okno incognito (Ctrl+Shift+N), wejdź na http://localhost:3000 i załóż drugie konto — adres może być wymyślony, np. `test-b@example.com`. Czat drugiego konta jest pusty, a na pytanie „Co o mnie wiesz?” agent odpowiada, że nic. Każde konto widzi tylko swoje rozmowy i swój profil.

Teraz baza wiedzy. Kliknij „Baza wiedzy” w nagłówku. W polu „Tytuł” wpisz `Cennik 2026`, a w pole „Treść” wklej kilka akapitów oddzielonych pustą linią, np. cennik z lekcji 6. Kliknij „Dodaj do bazy wiedzy”. Pod formularzem pojawi się komunikat „Zapisano dokument „Cennik 2026”: 5 fragmentów” (liczba = liczba akapitów). W Supabase → Table Editor → `chunks` jest tyle samo wierszy, a kolumna `embedding` jest wypełniona liczbami.

Wróć do czatu, kliknij „Nowa rozmowa” i zapytaj o coś z dokumentu:

```text
Ile kosztuje pakiet Start w firmie Kwantowy Borsuk?
```

Nad odpowiedzią jest etykieta „📚 searchKnowledge”, a na końcu linia „📎 Źródło: Cennik 2026”. Potem zapytaj o coś, czego w dokumentach nie ma:

```text
Jaki jest numer telefonu do działu sprzedaży?
```

Agent pisze, że nie ma tej informacji w bazie wiedzy — i nie podaje żadnego numeru.

Potem kliknij „Asystent podróży” w nagłówku, wpisz „Lizbona” i datę w najbliższych dniach. Powinno pojawić się pięć kart z godzinami pobrania. Prognoza pogody sięga najwyżej 16 dni naprzód — przy dalszej dacie karta pogody pokaże brak danych, a pozostałe karty działają normalnie.

## Gdy coś nie działa

| Co widzisz | Co zrobić |
|---|---|
| Na `/login`: „Logowanie nie jest skonfigurowane…” | W `.env.local` brakuje `NEXT_PUBLIC_SUPABASE_URL` albo `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Uzupełnij je (bez spacji i cudzysłowów), zapisz plik i uruchom serwer ponownie — nowe zmienne wczytują się dopiero przy starcie. |
| Na `/login`: „Konto czeka na potwierdzenie adresu e-mail…” | W Supabase → Authentication → Sign In / Providers → Email wyłącz **Confirm email** i zapisz. Potem załóż konto na inny adres albo usuń poprzednie w Authentication → Users. |
| Na `/login`: „Nie udało się połączyć z Supabase…” | Sprawdź, czy `NEXT_PUBLIC_SUPABASE_URL` to pełny adres projektu (zaczyna się od `https://`), i czy masz internet. |
| Po kliknięciu „Zaloguj się przez Google” błąd albo powrót na `/login` z komunikatem | Dostawca Google nie jest skonfigurowany albo Twój adres nie jest na liście użytkowników testowych w Google Cloud. Przejdź warsztat 3 lekcji 7. Sprawdź też **Redirect URLs** w Supabase → Authentication → URL Configuration. |
| Po zalogowaniu znów ląduję na `/login` | Klucz w `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` jest z innego projektu niż adres albo to nie jest klucz publishable. Popraw, zapisz plik i uruchom serwer ponownie. |
| Czerwony komunikat „Nie udało się wczytać rozmowy z bazy Supabase…” nad czatem | Uruchom cały `baza.sql` w Supabase → SQL Editor — także część „Lekcja 7”. Dokładna treść błędu jest w terminalu, w którym działa `npm run dev`. |
| Po zalogowaniu nie widzę starych rozmów | Tak ma być. Rozmowy sprzed lekcji 7 nie mają właściciela, a każde konto widzi tylko swoje. |
| Po F5 rozmowa znika | Zajrzyj do tabeli `messages`. Pusta — problem z zapisem; treść błędu jest w terminalu. Są wiersze — problem z odczytem. Skopiuj błąd do asystenta. |
| Błąd „permission denied for table …” albo „row-level security” w terminalu | Uruchom `baza.sql` jeszcze raz — linie `grant` nadają uprawnienia, a część „Lekcja 7” dodaje polityki. RLS zostaje włączony. |
| Na `/upload`: „Baza wiedzy nie jest podłączona…” | W `.env.local` brakuje `SUPABASE_URL` albo `SUPABASE_SECRET_KEY`. Uzupełnij je, zapisz plik i uruchom serwer ponownie. |
| Na `/upload`: „Nie udało się zapisać dokumentu w bazie…” | Brakuje tabel bazy wiedzy. Uruchom `baza.sql` w Supabase → SQL Editor. |
| Na `/upload`: „Nie udało się utworzyć embeddingów…” | Sprawdź w `.env.local` zmienną `OPENROUTER_EMBEDDING_MODEL` i klucz `OPENROUTER_API_KEY`, zapisz plik i uruchom serwer ponownie. Jeśli błąd w terminalu mówi o modelu albo dostępie — zgłoś prowadzącemu. |
| Na `/upload`: „Nie udało się zapisać fragmentów w bazie…” | Najczęściej model zwraca inną liczbę liczb niż 1536. Dokładna treść błędu jest w terminalu. Tabela `chunks` już istnieje, więc poproś asystenta o gotowy SQL, który poprawi kolumnę `embedding` i funkcję `match_chunks`. |
| Agent nie używa bazy wiedzy albo odpowiada z internetu | Kliknij „Nowa rozmowa” i zapytaj jeszcze raz. Sprawdź w `chunks`, czy kolumna `embedding` nie jest pusta. Zasady dla agenta są w `lib/persona.ts`, w części „Baza wiedzy”. |

## Zrób z niego swój projekt

Otwórz `lib/persona.ts` i zmień nazwę, powitanie, opis, przykłady oraz podpowiedzi obrazów na własny temat. Albo poproś asystenta:

```text
Zmień chatbota w pliku lib/persona.ts na: [opisz swój pomysł, np. asystent małej kwiaciarni w Krakowie].
Dopasuj nazwę, powitanie, zasady, dwa przykłady odpowiedzi i trzy podpowiedzi obrazów. Reszty aplikacji nie zmieniaj.
```

## Gdzie co jest

| Plik | Co robi |
|---|---|
| `lib/persona.ts` | charakter chatbota, zasady używania narzędzi, bazy wiedzy i pracy krok po kroku, kształt analizy JSON |
| `lib/tools.ts` | narzędzia agenta (opisy, sprawdzanie danych wejściowych) i limit kroków `MAX_STEPS` |
| `proxy.ts` | działa przed każdą stroną i endpointem: odświeża sesję i przenosi niezalogowanych na `/login` |
| `lib/supabase-server.ts` | serwer: klient zalogowanej osoby (klucz publishable + sesja z ciasteczek) i funkcja `getAuth()`, która sprawdza, kto jest zalogowany |
| `lib/supabase-browser.ts` | przeglądarka: klient Supabase tylko do logowania, rejestracji i wylogowania |
| `lib/supabase.ts` | serwer: klient z kluczem secret — tylko dla wspólnej bazy wiedzy |
| `lib/conversations.ts` | zapis i odczyt rozmów zalogowanej osoby (tabele `conversations` i `messages`) |
| `lib/profile.ts` | profil zalogowanej osoby (tabela `user_profiles`, jeden wiersz na konto) i fragment instrukcji z informacjami o użytkowniku |
| `lib/knowledge.ts` | baza wiedzy: podział tekstu na fragmenty, import dokumentu z embeddingami, wyszukiwanie fragmentów (tabele `documents` i `chunks`) |
| `baza.sql` | definicje pięciu tabel, funkcji `match_chunks` oraz kolumn `user_id` i reguł RLS z lekcji 7 — do wklejenia w Supabase → SQL Editor |
| `lib/sources.ts` | funkcje pobierające dane: pogoda, waluty, święta, Wikipedia, kalkulator, czas |
| `lib/trip.ts` | pięć kart asystenta podróży — składane z funkcji z `lib/sources.ts` |
| `lib/model.ts` | połączenie z modelem przez OpenRouter (rozmowa, obrazy, wyszukiwanie, embeddingi) |
| `app/login/page.tsx` | strona `/login`; formularz jest w `app/components/LoginForm.tsx` (e-mail i hasło, Google, komunikaty błędów po polsku) |
| `app/auth/callback/route.ts` | powrót z logowania przez Google: wymienia kod na sesję i przenosi do czatu |
| `app/components/UserMenu.tsx` | zalogowana osoba w nagłówku (imię, zdjęcie albo e-mail) i przycisk „Wyloguj” |
| `app/api/agent/route.ts` | agent: tryb `chat` (streaming, narzędzia, limit kroków, profil w instrukcji, zapis rozmowy po zakończeniu odpowiedzi) oraz tryb `analyze` (analiza JSON) |
| `app/page.tsx` | strona główna: sprawdza, kto jest zalogowany, i wczytuje ostatnią rozmowę tej osoby |
| `app/api/image/route.ts` | generowanie obrazu z przycisku „Wygeneruj obraz” |
| `app/components/Chat.tsx` | wygląd czatu: przycisk „Nowa rozmowa”, etykiety narzędzi, lista kroków, komunikat o limicie, źródła, zdjęcia, obrazy |
| `app/upload/page.tsx` | strona `/upload`: sprawdza logowanie i pokazuje formularz z `app/components/UploadForm.tsx` |
| `app/api/upload/route.ts` | import dokumentu: sprawdzenie logowania i pól, zapis dokumentu i fragmentów z embeddingami |
| `app/dashboard/page.tsx` | strona `/dashboard`: formularz, pięć kart, podsumowanie od agenta |
