# Starter — agent po lekcji 6

Gotowa, działająca aplikacja w stanie „po lekcji 6”. Użyj jej, jeśli Twój projekt z poprzednich zajęć nie działa albo chcesz zacząć lekcję 7 z czystego miejsca.

## Co już działa

- czat z odpowiedzią pisaną na żywo (streaming),
- ekran hasła — bez hasła nikt nie wejdzie do czatu, do dashboardu ani do modelu,
- charakter chatbota i przykłady odpowiedzi (plik `lib/persona.ts`),
- wyszukiwanie w internecie z listą „Źródła”, zdjęcia (Vision), generowanie obrazów i przycisk „Analiza JSON” — tak jak po lekcji 3,
- **trwała pamięć w bazie Supabase (lekcja 5)**:
  - rozmowy zapisują się w tabelach `conversations` i `messages` — po odświeżeniu strony (F5) wczytuje się ostatnia rozmowa,
  - przycisk „Nowa rozmowa” zaczyna pustą rozmowę; stara zostaje w bazie,
  - zapisywany jest tekst wiadomości; zamiast zdjęć i obrazów w bazie jest dopisek „[obraz]”,
  - narzędzie `zapiszProfil` zapamiętuje to, co powiesz o sobie wprost (imię, miasto, upodobania), w tabeli `user_profiles` — w jednym wierszu, który jest aktualizowany,
  - przed każdą odpowiedzią serwer wczytuje profil i dołącza go do instrukcji agenta, więc agent pamięta Cię także w nowej rozmowie,
- **baza wiedzy z Twoich dokumentów — RAG (lekcja 6)**:
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
- **strona `/dashboard` (asystent podróży)** — wpisujesz miasto i datę, dostajesz pięć kart (pogoda, waluty, święta, Wikipedia, czas) z nazwą źródła i godziną pobrania, przycisk „Odśwież” oraz krótkie podsumowanie od agenta. Dostępna tylko po zalogowaniu hasłem; link jest w nagłówku czatu.

Z bazą łączy się wyłącznie serwer, kluczem secret z pliku `.env.local`. Przeglądarka nigdy nie dostaje tego klucza.

Strona `/upload` ma na razie sam formularz. Nie ma jeszcze listy dokumentów, usuwania ani zastępowania starszej wersji — dokument usuniesz w Supabase → Table Editor → `documents` (jego fragmenty znikną razem z nim).

## Uruchomienie (10 minut)

1. Skopiuj ten folder w swoje miejsce na projekty (np. `Dokumenty/projekty/moj-agent`) i otwórz w nim terminal.
2. Zainstaluj biblioteki:

   ```bash
   npm install
   ```

   W Windows PowerShell wpisuj `npm.cmd` zamiast `npm`.

3. Skopiuj plik `.env.example` jako `.env.local` i uzupełnij wartości. Jeśli masz `.env.local` z poprzedniego projektu — po prostu skopiuj go tutaj, nazwy są te same. Sprawdź tylko, czy model to `google/gemini-3.8-flash` (wyszukiwanie i zdjęcia działają z modelami Gemini).
4. Sprawdź, czy w `.env.local` są dwie zmienne bazy: `SUPABASE_URL` (adres projektu) i `SUPABASE_SECRET_KEY` (klucz secret, zaczyna się od `sb_secret_`). Nie masz jeszcze projektu Supabase? Załóż go według części A i C warsztatu 1 lekcji 5.
5. Sprawdź, czy w `.env.local` jest model embeddingów:

   ```dotenv
   OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-small
   ```

   Jeśli prowadzący podał inną nazwę — wpisz tę od prowadzącego.
6. Utwórz tabele. Otwórz swój projekt w Supabase → **SQL Editor**, wklej całą treść pliku `baza.sql` z tego folderu i kliknij **Run**. Skrypt włącza dodatek `vector` i tworzy tylko to, czego brakuje — jeśli masz już tabele z lekcji 5 i 6, zostają razem z danymi.
7. Uruchom:

   ```bash
   npm run dev
   ```

8. Otwórz http://localhost:3000 i wpisz swoje hasło.

## Sprawdź, czy działa

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

Agent podaje imię, miasto i preferencję. W Supabase → Table Editor zobaczysz wiersze w tabelach `conversations`, `messages` i `user_profiles`.

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
| Czerwony komunikat „Baza nie jest podłączona…” nad czatem | W `.env.local` brakuje `SUPABASE_URL` albo `SUPABASE_SECRET_KEY`. Uzupełnij je (bez spacji i cudzysłowów), zapisz plik i uruchom serwer ponownie. |
| Czerwony komunikat „Nie udało się połączyć z bazą Supabase…” | Sprawdź adres i klucz w `.env.local`, a potem uruchom `baza.sql` w Supabase → SQL Editor. Dokładna treść błędu jest w terminalu, w którym działa `npm run dev`. |
| Po F5 rozmowa znika | Zajrzyj do tabeli `messages`. Pusta — problem z zapisem; treść błędu jest w terminalu. Są wiersze — problem z odczytem. Skopiuj błąd do asystenta. |
| Błąd „permission denied for table …” w terminalu | Uruchom `baza.sql` jeszcze raz — linie `grant` nadają uprawnienia. RLS zostaje włączony. |
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
| `lib/supabase.ts` | jedyne połączenie z bazą Supabase — tylko po stronie serwera |
| `lib/conversations.ts` | zapis i odczyt rozmów (tabele `conversations` i `messages`) |
| `lib/profile.ts` | profil użytkownika (tabela `user_profiles`) i fragment instrukcji z informacjami o użytkowniku |
| `lib/knowledge.ts` | baza wiedzy: podział tekstu na fragmenty, import dokumentu z embeddingami, wyszukiwanie fragmentów (tabele `documents` i `chunks`) |
| `baza.sql` | definicje pięciu tabel i funkcji `match_chunks` do wklejenia w Supabase → SQL Editor |
| `lib/sources.ts` | funkcje pobierające dane: pogoda, waluty, święta, Wikipedia, kalkulator, czas |
| `lib/trip.ts` | pięć kart asystenta podróży — składane z funkcji z `lib/sources.ts` |
| `lib/model.ts` | połączenie z modelem przez OpenRouter (rozmowa, obrazy, wyszukiwanie, embeddingi) |
| `lib/session.ts` | hasło i sesja |
| `app/api/agent/route.ts` | agent: tryb `chat` (streaming, narzędzia, limit kroków, profil w instrukcji, zapis rozmowy po zakończeniu odpowiedzi) oraz tryb `analyze` (analiza JSON) |
| `app/page.tsx` | strona główna: sprawdza sesję i wczytuje ostatnią rozmowę z bazy |
| `app/api/image/route.ts` | generowanie obrazu z przycisku „Wygeneruj obraz” |
| `app/components/Chat.tsx` | wygląd czatu: przycisk „Nowa rozmowa”, etykiety narzędzi, lista kroków, komunikat o limicie, źródła, zdjęcia, obrazy |
| `app/upload/page.tsx` | strona `/upload`: sprawdza sesję i pokazuje formularz z `app/components/UploadForm.tsx` |
| `app/api/upload/route.ts` | import dokumentu: sesja, sprawdzenie pól, zapis dokumentu i fragmentów z embeddingami |
| `app/dashboard/page.tsx` | strona `/dashboard`: formularz, pięć kart, podsumowanie od agenta |
