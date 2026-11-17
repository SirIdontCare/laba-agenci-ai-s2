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

Cztery słowa, które dziś padną:

| Słowo | Co to jest | W zeszycie |
|---|---|---|
| **Projekt** | Twoja własna baza danych w Supabase, z własnym adresem i kluczami | cały zeszyt |
| **Tabela** | lista rzeczy jednego rodzaju, np. rozmów | jedna strona z rubrykami |
| **Kolumna** | jedna cecha każdej pozycji, np. tytuł | rubryka |
| **Wiersz** | jedna zapisana pozycja, np. jedna rozmowa | jedna linijka |

**Relacja** to powiązanie dwóch tabel: każda wiadomość „wie”, do której rozmowy należy. Zrobisz ją na poziomie Standard.

Panel Supabase jest po angielsku i co jakiś czas zmienia wygląd. Jeśli przycisk nazywa się u Ciebie trochę inaczej niż tutaj, szukaj najbliższego odpowiednika albo zapytaj asystenta (prompt na końcu poziomu Minimum).

### 🟢 Minimum — projekt i pierwsza tabela

Klikasz razem z prowadzącym.

**Część A — załóż projekt (czyli bazę)**

1. Wejdź na https://supabase.com/dashboard i zaloguj się (najszybciej kontem GitHub).
2. Pierwsze logowanie? Supabase poprosi najpierw o utworzenie **organizacji** — to tylko „teczka” na projekty. Wpisz dowolną nazwę i wybierz plan **Free**.
3. Kliknij **New project**.
4. Wypełnij formularz:

   | Pole | Co wpisać |
   |---|---|
   | nazwa projektu (**Project name**) | `agent-kurs` |
   | hasło do bazy (**Database Password**) | kliknij generowanie hasła i zapisz je w bezpiecznym miejscu. Dziś nie będzie potrzebne. |
   | **Region** | dowolny w Europie, np. Frankfurt |
   | pozostałe opcje | zostaw domyślne, niczego nie wyłączaj |

5. Kliknij **Create new project** i poczekaj 1–2 minuty. Projekt jest gotowy, gdy zamiast komunikatu o przygotowywaniu widzisz stronę główną projektu z menu po lewej.

**Część B — utwórz tabelę `conversations` (lista rozmów)**

6. W menu po lewej otwórz **Table Editor** (ikona tabeli) i kliknij **New table**. Z prawej strony wysunie się panel.
7. W polu **Name** wpisz `conversations` — małymi literami, bez spacji i polskich znaków.
8. Opcja **Enable Row Level Security (RLS)** jest zaznaczona — **zostaw ją zaznaczoną**. Dzięki niej tabela nie jest publiczna: nikt z internetu jej nie przeczyta.
9. Niżej, w części **Columns**, są już dwie kolumny. Nie zmieniaj ich:

   | Kolumna | Typ | Do czego służy |
   |---|---|---|
   | `id` | `int8` | numer rozmowy; baza nadaje go sama: 1, 2, 3… |
   | `created_at` | `timestamptz` | data i godzina utworzenia; baza wpisuje ją sama |

10. Kliknij **Add column**. W nowym wierszu wpisz nazwę `title`, a w polu typu wybierz z listy `text`. To będzie tytuł rozmowy.
11. Kliknij **Save** na dole panelu. Po chwili tabela `conversations` pojawi się na liście po lewej.

**Część C — połącz projekt z aplikacją**

Potrzebujesz dwóch wartości: adresu projektu i klucza.

12. Kliknij **Connect** u góry strony. Skopiuj adres projektu (**Project URL**) — wygląda tak: `https://abcdefgh.supabase.co`.
13. W menu po lewej otwórz **Settings** (ikona koła zębatego) → **API Keys**. Znajdź klucz **secret** — zaczyna się od `sb_secret_`. Jeśli na liście nie ma jeszcze żadnego, utwórz go na tej stronie. Skopiuj klucz ikoną kopiowania.
14. Otwórz plik `.env.local` w swoim projekcie (obok `package.json`) i dopisz na końcu dwie linie — bez spacji i bez cudzysłowów:

```dotenv
SUPABASE_URL=tu_wklej_adres_projektu
SUPABASE_SECRET_KEY=tu_wklej_klucz_secret
```

15. Zapisz plik. W terminalu zatrzymaj serwer (Ctrl+C) i uruchom go ponownie (`npm run dev`) — nowe zmienne wczytują się dopiero przy starcie.

Klucz secret jest jak klucz do całego zeszytu. Zostaje tylko w `.env.local`. Na tej samej stronie jest też klucz **publishable** — dziś go nie używamy.

Zgubiłeś się w panelu? Wklej asystentowi:

```text
Jestem w Supabase Dashboard i tworzę tabelę conversations w Table Editor
(kolumny: id, created_at, title typu text; RLS włączony). Prowadź mnie krok po kroku:
podawaj jedno kliknięcie naraz i czekaj, aż napiszę „zrobione”. Nie zastępuj klikania skryptem SQL.
Nie proś mnie o wklejanie kluczy — mają trafić tylko do .env.local.
```

**Sprawdź:** w **Table Editor** widzisz tabelę `conversations` z kolumnami `id`, `created_at`, `title`, a w `.env.local` są dwie nowe linie. **Minimum zrobione.**

### 🔵 Standard — pozostałe dwie tabele i relacja

Dodasz dwie tabele: `messages` (wiadomości) i `user_profiles` (to, co agent wie o Tobie). W obu zostaw `id`, `created_at` i zaznaczony RLS — tak jak przy `conversations`.

**Część A — tabela `messages` i relacja do `conversations`**

Jedna rozmowa ma wiele wiadomości. Dlatego każda wiadomość dostaje rubrykę `conversation_id` z numerem swojej rozmowy. Relacja pilnuje dwóch rzeczy: nie da się zapisać wiadomości do rozmowy, której nie ma, a usunięcie rozmowy usuwa też jej wiadomości.

1. **Table Editor → New table**, w polu **Name** wpisz `messages`.
2. Kliknij **Add column** trzy razy i dodaj:

   | Nazwa | Typ | Do czego służy |
   |---|---|---|
   | `conversation_id` | `int8` | numer rozmowy, do której należy wiadomość. Typ musi być **taki sam** jak typ `id` w `conversations`. |
   | `role` | `text` | kto to napisał: `user` albo `assistant` |
   | `content` | `text` | treść wiadomości |

3. Teraz relacja. W tym samym panelu zjedź niżej do części **Foreign keys** i kliknij **Add foreign key relation**. (W niektórych wersjach panelu to ikona łańcucha obok kolumny `conversation_id`.)
4. W okienku relacji ustaw:

   | Pole | Co wybrać |
   |---|---|
   | schemat | `public` |
   | tabela, do której prowadzi relacja | `conversations` |
   | kolumna z tabeli `messages` (po lewej) | `conversation_id` |
   | kolumna z tabeli `conversations` (po prawej) | `id` |
   | co zrobić, gdy rozmowa zostanie usunięta (**Action if referenced row is removed**) | **Cascade** — usunięcie rozmowy usuwa jej wiadomości |
   | co zrobić przy zmianie (**Action if referenced row is updated**) | zostaw domyślne |

5. Zatwierdź okienko relacji (**Save**), a potem całą tabelę (**Save** na dole panelu).

**Część B — tabela `user_profiles`**

6. **New table**, **Name**: `user_profiles`. Dodaj dwie kolumny:

   | Nazwa | Typ | Do czego służy |
   |---|---|---|
   | `name` | `text` | Twoje imię |
   | `preferences` | `jsonb` | „szuflada” na dowolne fakty, np. miasto i ulubione jedzenie — bez dodawania nowej kolumny na każdy z nich |

7. Kliknij **Save**. Ta tabela nie ma relacji.

**Część C — sprawdź, że relacja działa**

8. W menu po lewej otwórz **Database → Schema Visualizer**. Widzisz trzy tabele i linię łączącą `messages.conversation_id` z `conversations.id`.
9. Wróć do **Table Editor**, otwórz `conversations`, kliknij **Insert → Insert row**, wpisz w `title` słowo `test` i zapisz. Zapamiętaj numer `id` nowego wiersza (pewnie 1).
10. Otwórz `messages`, kliknij **Insert → Insert row**. W `conversation_id` wpisz ten numer, w `role` wpisz `user`, w `content` — `próba`. Zapisz.
11. Spróbuj dodać drugi wiersz z `conversation_id` równym `999`. Baza odmówi — takiej rozmowy nie ma. Tak ma być.
12. Wróć do `conversations`, zaznacz wiersz `test` i usuń go. Zajrzyj do `messages` — wiadomość `próba` też zniknęła. To jest właśnie **Cascade**.

Gdyby coś szło inaczej niż w krokach, wklej asystentowi:

```text
Jestem w Supabase Dashboard, w Table Editor. Mam już tabelę conversations (id, created_at, title).
Przeprowadź mnie krok po kroku przez utworzenie dwóch tabel:
- messages: conversation_id (int8, klucz obcy do conversations.id, usuwanie kaskadowe), role (text), content (text),
- user_profiles: name (text), preferences (jsonb).
W obu zostają id i created_at, RLS ma być włączony, bez żadnych polityk.
Podawaj jedno kliknięcie naraz i czekaj na moje „zrobione”. Nie zastępuj klikania skryptem SQL.
Na końcu powiedz mi, gdzie w panelu sprawdzę, że RLS jest włączony we wszystkich trzech tabelach.
```

**Sprawdź:** w Table Editor są trzy tabele, Schema Visualizer pokazuje linię między `messages` i `conversations`, a test z kroków 9–12 zadziałał. RLS jest włączony w każdej tabeli.

**Klikanie nie wyszło i kończy się czas?** Nie blokuj się. Otwórz **SQL Editor** w menu po lewej, wklej poniższy skrypt i kliknij **Run**. Tworzy brakujące tabele z relacją; istniejących nie rusza.

```sql
create table if not exists public.conversations (
  id bigint generated by default as identity primary key,
  created_at timestamptz not null default now(),
  title text
);

create table if not exists public.messages (
  id bigint generated by default as identity primary key,
  created_at timestamptz not null default now(),
  conversation_id bigint not null references public.conversations (id) on delete cascade,
  role text,
  content text
);

create table if not exists public.user_profiles (
  id bigint generated by default as identity primary key,
  created_at timestamptz not null default now(),
  name text,
  preferences jsonb
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.user_profiles enable row level security;

grant all on table public.conversations to service_role;
grant all on table public.messages to service_role;
grant all on table public.user_profiles to service_role;
```

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
| Błąd „permission denied for table …” | Klucz secret nie ma uprawnień do tabeli. Otwórz **SQL Editor**, wklej trzy ostatnie linie (`grant all …`) ze skryptu z warsztatu 1 i kliknij **Run**. RLS zostaje włączony. |
| Błąd o „row-level security” | Skopiuj cały komunikat do asystenta i dopisz: „Aplikacja ma łączyć się z bazą tylko z serwera, kluczem secret. Nie wyłączaj RLS”. |
| Nie da się utworzyć relacji | Sprawdź, czy `conversation_id` ma typ `int8` — taki sam jak `id` w `conversations`. Inny typ blokuje relację. |
| Po F5 rozmowa znika | Zajrzyj do tabeli `messages`. Pusta — problem z zapisem. Są wiersze — problem z odczytem. Napisz to asystentowi. |
| Wiadomości zapisują się podwójnie | Napisz: „Każda wiadomość ma być zapisana raz. Znajdź, gdzie zapis wykonuje się dwa razy”. |
| Agent „zapomniał”, choć w bazie jest wiersz | Problem jest w odczycie, nie w modelu. Napisz: „Sprawdź, czy profil jest wczytywany z bazy i dołączany do instrukcji przy każdej odpowiedzi”. |
| Po zmianach nic nie działa | Napisz do asystenta: „Cofnij ostatnią zmianę i wróć do działającej wersji”. W ostateczności weź `starter_lekcja_05`. |
