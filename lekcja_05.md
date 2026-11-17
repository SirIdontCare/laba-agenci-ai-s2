# Lekcja 5 — Agent pamięta: baza danych na Supabase

Do tej pory Twój agent zapominał wszystko po odświeżeniu strony. Dziś dostaje **zeszyt**: bazę danych Supabase. Zapisze w niej rozmowy, pokaże ich listę i zapamięta, jak masz na imię.

**Na koniec zajęć wrzucasz na czat kursu jeden zrzut ekranu:** nowa rozmowa, w której agent wita Cię po imieniu albo odpowiada na pytanie „Co o mnie wiesz?”.

## Jak pracujemy

Każdy warsztat ma trzy poziomy. **Poziom wybierasz sam i możesz go zmieniać między warsztatami.**

| Poziom | Dla kogo | Co to znaczy |
|---|---|---|
| 🟢 **Minimum** | dla każdego | To wystarczy, żeby zaliczyć warsztat i iść dalej. |
| 🔵 **Standard** | gdy minimum działa i zostało kilka minut | Ta sama funkcja, tylko dopracowana. |
| 🟣 **Dla szybkich** | gdy standard działa | To samo na Twoim własnym temacie. |

Zasady:

- Zrobione minimum = warsztat zaliczony. Nikt nie zostaje w tyle, jeśli ma minimum.
- Każdy poziom to **jeden prompt** — kopiujesz go do asystenta (Codex albo Claude Code) i czekasz na wynik.
- Coś nie działa dłużej niż 3 minuty? Skopiuj treść błędu do asystenta i napisz: „Napraw ten błąd”. Jeśli dalej nie działa — podnieś rękę.
- Kluczy i haseł **nigdy** nie wklejasz do czatu z asystentem ani do kodu. Trafiają tylko do pliku `.env.local` i do ustawień Vercel.

## Przed startem (5 minut)

**Potrzebujesz konta Supabase** (darmowe). Załóż je na https://supabase.com — najszybciej kontem GitHub.

**Twoja aplikacja z lekcji 4 działa?** Uruchom ją (`npm run dev`, w Windows PowerShell `npm.cmd run dev`), zaloguj się hasłem, napisz „Cześć”. Jeśli dostajesz odpowiedź — przejdź do kroku 0.

**Nie działa albo jej nie masz?** Nie naprawiaj jej teraz. Weź gotowy projekt w stanie „po lekcji 4”:

1. Pobierz materiały kursu. W terminalu, w folderze na swoje projekty, wpisz:

   ```bash
   git clone https://github.com/SirIdontCare/laba-agenci-ai-s2.git
   ```

   Masz już ten folder z poprzednich zajęć? Wejdź do niego i wpisz `git pull`.
2. Skopiuj folder `starter_lekcja_05` w swoje miejsce na projekty i otwórz w nim terminal. To od teraz Twój projekt.
3. Wpisz `npm install` (Windows PowerShell: `npm.cmd install`).
4. Skopiuj do tego folderu swój plik `.env.local` z poprzedniego projektu. Nie masz go? Skopiuj `.env.example` jako `.env.local` i uzupełnij wartości.
5. Wpisz `npm run dev` i otwórz http://localhost:3000.

### Krok 0 — jeden prompt na początek

Otwórz asystenta w folderze aplikacji i wklej to **raz**. Kolejne prompty wklejaj w tej samej rozmowie.

```text
Dziś dodajemy do tej aplikacji trwałą pamięć w bazie Supabase. Zanim cokolwiek zmienisz:

1. Przeczytaj AGENTS.md i package.json. Sprawdź wersje: next, ai, @ai-sdk/react.
2. Nie pisz kodu z pamięci. AI SDK sprawdzaj w node_modules/ai/docs/ (zapis rozmów:
   04-ai-sdk-ui/03-chatbot-message-persistence.mdx), Next.js w node_modules/next/dist/docs/.
   Bibliotekę @supabase/supabase-js zainstalujemy za chwilę — jej użycie sprawdzaj w plikach typów.
3. Z bazą łączy się wyłącznie serwer, przez jeden plik lib/supabase.ts i zmienne
   SUPABASE_URL oraz SUPABASE_SECRET_KEY. Ten klucz nie może trafić do przeglądarki:
   żadnego NEXT_PUBLIC_, żadnego importu w komponentach klienckich.
4. Każdy endpoint najpierw sprawdza sesję i bez niej zwraca 401 — zanim dotknie bazy albo modelu.
5. Nie czytaj i nie wypisuj wartości z .env.local.
6. Rozmawiaj ze mną po polsku, prostym językiem. Po każdej zmianie uruchom build,
   napraw błędy i napisz w 3 punktach, co zrobiłeś i jak to sprawdzić w przeglądarce.

Na razie niczego nie zmieniaj. Napisz tylko, w których plikach jest czat, endpoint rozmowy
i instrukcja (charakter) agenta.
```

Do lekcji 7 Twoja aplikacja ma jedno wspólne hasło, więc ma jednego „właściciela”. Osobne konta i osobne dane dla każdej osoby dodamy w lekcji 7.

---

## Warsztat 1 — Supabase: projekt i tabele przez Dashboard (20 min)

**Po co:** baza to zeszyt agenta. Zakładasz ją raz, klikając w przeglądarce — bez instalowania czegokolwiek na komputerze.

**Gotowe, gdy:** projekt i tabela są utworzone w Dashboardzie.

### 🟢 Minimum — projekt i pierwsza tabela

Klikasz razem z prowadzącym:

1. Wejdź na https://supabase.com/dashboard i kliknij **New project**.
2. Wpisz nazwę projektu, np. `agent-kurs`.
3. Przy haśle do bazy (**Database Password**) kliknij generowanie hasła i zapisz je w bezpiecznym miejscu. Dziś nie będzie potrzebne.
4. Wybierz region w Europie. Pozostałe ustawienia zostaw domyślne.
5. Kliknij **Create new project** i poczekaj 1–2 minuty, aż projekt się uruchomi.
6. W menu po lewej otwórz **Table Editor** i kliknij **New table**.
7. W polu **Name** wpisz `conversations`. Opcję Row Level Security (RLS) zostaw **włączoną** — dzięki niej tabela nie jest publiczna.
8. Kolumny `id` i `created_at` są już na liście — zostaw je. Kliknij **Add column** i dodaj kolumnę `title` typu `text`.
9. Kliknij **Save**.

Teraz połącz projekt z aplikacją. Potrzebujesz dwóch wartości:

10. Kliknij **Connect** u góry strony i skopiuj adres projektu (**Project URL**).
11. Otwórz **Settings → API Keys** i skopiuj klucz **secret** (zaczyna się od `sb_secret_`).
12. Otwórz plik `.env.local` w swoim projekcie, dopisz dwie linie, zapisz plik i uruchom serwer ponownie:

```dotenv
SUPABASE_URL=tu_wklej_adres_projektu
SUPABASE_SECRET_KEY=tu_wklej_klucz_secret
```

Klucz secret jest jak klucz do całego zeszytu. Zostaje tylko w `.env.local`.

Zgubiłeś się w panelu? Wklej asystentowi:

```text
Jestem w Supabase Dashboard i tworzę tabelę conversations w Table Editor
(kolumny: id, created_at, title typu text; RLS włączony). Prowadź mnie krok po kroku:
podawaj jedno kliknięcie naraz i czekaj, aż napiszę „zrobione”. Nie zastępuj klikania skryptem SQL.
Nie proś mnie o wklejanie kluczy — mają trafić tylko do .env.local.
```

**Sprawdź:** w **Table Editor** widzisz tabelę `conversations` z kolumnami `id`, `created_at`, `title`. **Minimum zrobione.**

### 🔵 Standard — pozostałe dwie tabele i relacja

Dodaj w Table Editor jeszcze dwie tabele. W obu zostaw `id`, `created_at` i włączony RLS.

| Tabela | Kolumny do dodania |
|---|---|
| `messages` | `conversation_id` (typ `int8`, relacja do `conversations.id`, przy usunięciu rozmowy: **Cascade**), `role` (`text`), `content` (`text`) |
| `user_profiles` | `name` (`text`), `preferences` (`jsonb`) |

```text
Jestem w Supabase Dashboard, w Table Editor. Mam już tabelę conversations (id, created_at, title).
Przeprowadź mnie krok po kroku przez utworzenie dwóch tabel:
- messages: conversation_id (int8, klucz obcy do conversations.id, usuwanie kaskadowe), role (text), content (text),
- user_profiles: name (text), preferences (jsonb).
W obu zostają id i created_at, RLS ma być włączony, bez żadnych polityk.
Podawaj jedno kliknięcie naraz i czekaj na moje „zrobione”. Nie zastępuj klikania skryptem SQL.
Na końcu powiedz mi, gdzie w panelu sprawdzę, że RLS jest włączony we wszystkich trzech tabelach.
```

**Sprawdź:** w Table Editor są trzy tabele. Kolumna `conversation_id` w tabeli `messages` jest powiązana z tabelą `conversations`. RLS jest włączony w każdej z nich.

### 🟣 Dla szybkich — pola z Twojego tematu

Pomyśl, co Twój agent powinien zapamiętać o rozmowie albo o osobie w **Twoim** temacie. Przykłady: asystent biegacza — ulubiony dystans; asystent sklepu — rozmiar i ulubiona kategoria.

```text
Mój agent to [temat]. Zaproponuj trzy rzeczy o użytkowniku, które warto zapamiętać w tym temacie,
i napisz, jak je zapisać w kolumnie preferences (jsonb) tabeli user_profiles — z przykładem
jednego wiersza. Nie dodawaj nowych tabel. Potem przeprowadź mnie przez ręczne dodanie
jednego przykładowego wiersza w Table Editor.
```

**Sprawdź:** w tabeli `user_profiles` jest jeden wiersz z Twoimi przykładowymi preferencjami. Usuń go przed warsztatem 3.

---

## Warsztat 2 — Trwałe rozmowy i /history (20 min)

**Po co:** rozmowa, która znika po odświeżeniu strony, to tablica. Rozmowa zapisana w bazie to zeszyt — możesz do niej wrócić jutro.

**Gotowe, gdy:** po F5 rozmowa nadal jest na ekranie.

### 🟢 Minimum — rozmowa przetrwa F5

Nie masz jeszcze tabeli `messages`? Nic nie szkodzi — asystent poda Ci gotowy kod do wklejenia w Supabase.

```text
Zapisuj rozmowy w Supabase, żeby przetrwały odświeżenie strony.

- Zainstaluj @supabase/supabase-js i utwórz lib/supabase.ts (tylko serwer, zmienne
  SUPABASE_URL i SUPABASE_SECRET_KEY).
- Tabele: conversations (id, created_at, title) oraz messages (id, created_at,
  conversation_id → conversations.id, role, content). Jeśli którejś brakuje albo potrzebujesz
  dodatkowej kolumny, daj mi jeden gotowy skrypt SQL do wklejenia w Supabase → SQL Editor
  (RLS włączony, bez polityk, uprawnienia dla roli service_role) i poczekaj, aż napiszę „wklejone”.
- Pierwsza wiadomość tworzy nową rozmowę. Wiadomość użytkownika i gotową odpowiedź agenta
  zapisuj po zakończeniu odpowiedzi — raz, w dobrej kolejności, bez duplikatów
  (nie zapisuj każdego kawałka streamingu osobno).
- Zapisuj tekst wiadomości. Obrazów nie zapisuj w bazie — zamiast nich wstaw krótki dopisek „[obraz]”.
- Po odświeżeniu strony wczytaj ostatnią rozmowę z bazy i pokaż ją w czacie.
- Dodaj przycisk „Nowa rozmowa”, który zaczyna pustą rozmowę i nie kasuje starej.
- Zapis i odczyt działają tylko po sprawdzeniu sesji.
```

**Sprawdź:** napisz dwie wiadomości, poczekaj na odpowiedzi i naciśnij **F5**. Rozmowa nadal jest na ekranie? Zajrzyj jeszcze do Table Editor → `messages`: są tam cztery wiersze. **Minimum zrobione.**

### 🔵 Standard — strona /history

```text
Dodaj stronę /history — listę zapisanych rozmów, jak pasek boczny w ChatGPT.

- Lista pokazuje tytuł rozmowy (początek pierwszej wiadomości), datę i liczbę wiadomości;
  najnowsze na górze.
- Kliknięcie otwiera właściwą rozmowę w czacie. Kolejne wiadomości dopisują się do niej,
  a nie do innej rozmowy.
- Przycisk „Nowa rozmowa” jest też na tej stronie.
- W czacie dodaj link „Historia”.
- Strona i jej dane są dostępne tylko po sprawdzeniu sesji.
- Sprawdź sam: kolejność wiadomości po F5, brak podwójnych wpisów i to, że dwie rozmowy się nie mieszają.
```

**Sprawdź:** zrób dwie rozmowy na różne tematy. Wejdź na `/history`, otwórz starszą, dopisz jedną wiadomość i naciśnij F5. Wiadomość jest w tej rozmowie, do której ją dopisałeś.

### 🟣 Dla szybkich — historia dopasowana do Twojego agenta

```text
Dopracuj historię rozmów pod temat mojego agenta ([temat]):
- Tytuł rozmowy nadaje model po pierwszej odpowiedzi: 3–5 słów, w stylu pasującym do tematu.
- Przy każdej rozmowie jest przycisk „Usuń” z pytaniem o potwierdzenie. Usunięta rozmowa
  znika z listy i z bazy razem z wiadomościami.
- Pusta lista pokazuje zachętę do pierwszej rozmowy napisaną głosem mojego agenta.
```

**Sprawdź:** usuń jedną rozmowę. Nie ma jej na `/history` ani w tabelach w Supabase.

---

## Warsztat 3 — Imię i preferencje w user_profiles (20 min)

**Po co:** agent, który wie, jak masz na imię i co lubisz, odpowiada jak znajomy, a nie jak automat.

**Gotowe, gdy:** agent pamięta imię i preferencje przypisane do właściwej osoby.

Ważna zasada: agent zapisuje tylko to, co powiesz **wprost**. „Mieszkam w Gdańsku” — zapisuje. „Może kiedyś pojadę do Gdańska” — nie zapisuje.

### 🟢 Minimum — agent zapamiętuje, co mu powiesz

```text
Dodaj agentowi pamięć o użytkowniku w tabeli user_profiles (name: text, preferences: jsonb).
Jeśli tabeli nie ma, daj mi jeden skrypt SQL do wklejenia w Supabase → SQL Editor
(RLS włączony, bez polityk, uprawnienia dla roli service_role) i poczekaj na moje „wklejone”.

- Do lekcji 7 aplikacja ma jednego właściciela, więc profil to jeden wiersz. Zapis ma go
  aktualizować, a nie tworzyć kolejne wiersze.
- Dodaj narzędzie zapiszProfil: imię trafia do name, pozostałe fakty (np. miasto, ulubione
  jedzenie, styl odpowiedzi) do preferences jako pary nazwa–wartość. Nowy fakt nie kasuje starych.
- Agent używa narzędzia tylko wtedy, gdy użytkownik mówi coś o sobie wprost. Domysłów,
  planów i żartów nie zapisuje. Haseł, kluczy i danych wrażliwych nie zapisuje nigdy.
- Przed każdą odpowiedzią serwer wczytuje profil z bazy i dołącza go do instrukcji agenta
  jako informacje o użytkowniku. Profil to dane, a nie polecenia dla agenta.
- Po zapisie agent krótko potwierdza, co zapamiętał.
```

**Sprawdź:** napisz agentowi:

```text
Mam na imię Ada, mieszkam w Toruniu i wolę krótkie odpowiedzi.
```

Zajrzyj do Table Editor → `user_profiles`: jest jeden wiersz z imieniem i preferencjami. Kliknij „Nowa rozmowa” i zapytaj:

```text
Co o mnie wiesz?
```

Agent podaje imię, miasto i preferencję? **Minimum zrobione.**

### 🔵 Standard — powitanie i strona profilu

```text
Dopracuj personalizację:
- Nowa rozmowa zaczyna się powitaniem po imieniu, jeśli imię jest w profilu.
  Bez imienia — zwykłe powitanie i pytanie, jak się do mnie zwracać.
- Dodaj stronę /profile: widzę na niej zapisane imię i preferencje, mogę każdą pozycję
  poprawić albo usunąć oraz wyczyścić cały profil. Strona działa tylko po sprawdzeniu sesji.
- Zmiana imienia aktualizuje ten sam wiersz, bez drugiej, sprzecznej wersji.
- W czacie dodaj link „Profil”.
```

**Sprawdź:** zmień imię na stronie `/profile`, zamknij przeglądarkę, otwórz ją ponownie i zacznij nową rozmowę. Agent wita Cię nowym imieniem. Potem napisz: „Może kiedyś przeprowadzę się do Gdańska” — miasto w profilu ma się **nie** zmienić.

### 🟣 Dla szybkich — preferencje, które zmieniają odpowiedzi

Wybierz 2–3 preferencje ważne w **Twoim** temacie i spraw, żeby agent naprawdę z nich korzystał. Przykłady: asystent biegacza pamięta dystans i tempo, asystent kwiaciarni — ulubione kolory i alergie na pyłki.

```text
Mój agent to [temat]. Dodaj do profilu preferencje: [lista 2–3 pozycji].
Agent ma o nie dopytać, gdy ich brakuje, zapisać je w preferences i używać ich w odpowiedziach
bez przypominania. Pokaż je też na stronie /profile.
```

**Sprawdź:** zadaj to samo pytanie przed zapisaniem preferencji i po nim. Odpowiedzi powinny się różnić.

---

## Pokaż, co zrobiłeś

Wrzuć na czat kursu **jeden zrzut ekranu**: nowa rozmowa, w której agent wita Cię po imieniu albo odpowiada na „Co o mnie wiesz?”. Dopisz jedno zdanie: który poziom zrobiłeś w każdym warsztacie.

Jeśli publikujesz zmiany na Vercel: w projekcie na Vercel otwórz **Environment Variables**, dodaj `SUPABASE_URL` i `SUPABASE_SECRET_KEY`, kliknij **Save** i opublikuj aplikację ponownie. Bez tego wersja online nie połączy się z bazą.

## Praca domowa (12 pkt)

**Powiedz agentowi trzy rzeczy o sobie: imię, miasto, ulubione jedzenie. Zamknij przeglądarkę, otwórz ponownie i zapytaj, co o Tobie wie. Zrzut na czat.**

| Kryterium | Punkty |
|---|---|
| Trzy fakty są zapisane w Supabase | 4 |
| Po ponownym otwarciu agent je podaje | 4 |
| Zrzut na czacie | 4 |

Oddajesz na czacie kursu: zrzuty ekranu albo link. Wystarczą dwa zrzuty — wiersz w tabeli `user_profiles` i odpowiedź agenta po ponownym otwarciu przeglądarki.

Jeśli agent nie zapisuje któregoś faktu, wklej asystentowi:

```text
Powiedziałem agentowi: „[Twoje zdanie]”, ale w tabeli user_profiles nie ma [czego brakuje].
Sprawdź opis narzędzia zapiszProfil i instrukcję agenta, popraw i powiedz, jak to sprawdzić.
```

## Gdy coś nie działa

| Co widzisz | Co zrobić |
|---|---|
| Projekt w Supabase długo się tworzy | To normalne przez 1–2 minuty. Po 5 minutach odśwież stronę panelu. |
| Błąd o braku `SUPABASE_URL` albo `SUPABASE_SECRET_KEY` | Sprawdź nazwy w `.env.local` (bez spacji i cudzysłowów), zapisz plik i uruchom serwer ponownie. |
| Błąd „permission denied” albo „row-level security” | Skopiuj cały komunikat do asystenta i dopisz: „Aplikacja ma łączyć się z bazą tylko z serwera, kluczem secret. Nie wyłączaj RLS. Jeśli brakuje uprawnień, daj mi SQL do wklejenia w SQL Editor”. |
| Po F5 rozmowa znika | Zajrzyj do tabeli `messages`. Pusta — problem z zapisem. Są wiersze — problem z odczytem. Napisz to asystentowi. |
| Wiadomości zapisują się podwójnie | Napisz: „Każda wiadomość ma być zapisana raz. Znajdź, gdzie zapis wykonuje się dwa razy”. |
| Agent „zapomniał”, choć w bazie jest wiersz | Problem jest w odczycie, nie w modelu. Napisz: „Sprawdź, czy profil jest wczytywany z bazy i dołączany do instrukcji przy każdej odpowiedzi”. |
| Po zmianach nic nie działa | Napisz do asystenta: „Cofnij ostatnią zmianę i wróć do działającej wersji”. W ostateczności weź `starter_lekcja_05`. |
