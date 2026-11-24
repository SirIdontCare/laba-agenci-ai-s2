# Lekcja 7 — Agent dla wielu osób: logowanie i prywatne dane

Do tej pory do Twojej aplikacji wchodziło się jednym wspólnym hasłem, a wszyscy widzieli te same rozmowy. Dziś każda osoba dostaje **własne konto**: loguje się e-mailem albo kontem Google i widzi tylko swoje rozmowy.

**Na koniec zajęć wrzucasz na czat kursu jeden zrzut ekranu:** Twoja aplikacja po zalogowaniu — z Twoim imieniem (i avatarem, jeśli logujesz się przez Google).

## Jak pracujemy

Każdy warsztat ma trzy poziomy. **Poziom wybierasz sam i możesz go zmieniać między warsztatami.**

| Poziom | Dla kogo | Co to znaczy |
|---|---|---|
| 🟢 **Minimum** | dla każdego | To wystarczy, żeby zaliczyć warsztat i iść dalej. |
| 🔵 **Standard** | gdy minimum działa i zostało kilka minut | Ta sama funkcja, tylko dopracowana. |
| 🟣 **Dla szybkich** | gdy standard działa | Wyzwanie: sprawdź, czy da się to obejść, albo zrób to na własnym temacie. |

Zasady:

- Zrobione minimum = warsztat zaliczony. Nikt nie zostaje w tyle, jeśli ma minimum.
- Prompty są gotowe — kopiujesz je do asystenta (Codex albo Claude Code) i czekasz na wynik.
- Coś nie działa dłużej niż 3 minuty? Znajdź błąd (tabela niżej), skopiuj go do asystenta i napisz: „Napraw ten błąd”. Jeśli dalej nie działa — podnieś rękę.
- Kluczy i haseł **nigdy** nie wklejasz do czatu z asystentem ani do kodu. Trafiają tylko do pliku `.env.local`, do ustawień Vercel i do formularzy w panelach Supabase i Google.

**Przy każdym prompcie postępuj tak samo:**

1. Wklej prompt do asystenta — w tej samej rozmowie, w której wkleiłeś prompt z kroku 0.
2. Asystent może pytać o zgodę na zmianę plików albo uruchomienie polecenia — zgadzaj się. O klucze i hasła nie powinien pytać; gdyby zapytał, niczego nie wklejaj.
3. Poczekaj — zwykle kilka minut. W tym czasie zrób zadanie „Gdy asystent pracuje” spod promptu.
4. Asystent skończył, gdy napisze w 3 punktach, co zrobił. Widzisz błąd? Napisz: „Napraw ten błąd”.
5. Odśwież stronę w przeglądarce (F5). Serwer nie działa? Uruchom go ponownie: `npm run dev` (Windows PowerShell: `npm.cmd run dev`).

**Gdzie szukać błędu**

| Gdzie | Jak wygląda | Co skopiować |
|---|---|---|
| na stronie aplikacji | czerwony komunikat w formularzu albo w czacie | cały komunikat |
| w terminalu, w którym działa `npm run dev` | czerwone linie, często ze słowem `Error` | ostatnie 10–20 linii |
| w oknie asystenta | asystent sam pisze, że build się nie udał | nic — napisz tylko „Napraw to i uruchom build ponownie” |
| w Supabase, SQL Editor | komunikat pod polem z kodem | cały komunikat |
| na stronie Google podczas logowania | strona z napisem `Error 400` albo „Odmowa dostępu” | kod błędu i jedno zdanie spod niego |

Zaznacz tekst myszą, skopiuj (Ctrl+C) i wklej do asystenta razem ze zdaniem: „Napraw ten błąd”. Jeśli w skopiowanym tekście widzisz coś, co wygląda jak klucz (`sb_secret_…`, `sk-or-…`, `GOCSPX-…`) — usuń ten kawałek przed wklejeniem.

## Słowa, które dziś padną

| Słowo | Co to jest | W bloku mieszkalnym |
|---|---|---|
| **Konto** | zapis w bazie: ta osoba istnieje i ma swój identyfikator | lokator wpisany na listę mieszkańców |
| **Sesja** | dowód, że jesteś zalogowany; przeglądarka trzyma go w ciasteczku | brelok do klatki — działa, dopóki go nie oddasz |
| **RLS** (Row Level Security) | reguła w bazie sprawdzana przy każdym wierszu | zamek w drzwiach każdego mieszkania, nie tylko na klatce |
| **Polityka** | jedna taka reguła, np. „widzisz tylko wiersze ze swoim identyfikatorem” | „Twój klucz otwiera tylko Twoje drzwi” |
| **OAuth** | logowanie przez inną usługę (dziś: Google), bez podawania jej hasła aplikacji | portier, który zna lokatora i ręczy za niego |

Wspólne hasło z lekcji 1 to jeden klucz do klatki dla wszystkich: wiadomo, że ktoś go ma, ale nie wiadomo kto — i wszystkie mieszkania stoją otworem.

## Przed startem (5 minut)

**Potrzebujesz konta Google** (zwykły Gmail wystarczy) — przyda się w warsztacie 3.

**Twoja aplikacja z lekcji 6 działa?** Uruchom ją (`npm run dev`, w Windows PowerShell `npm.cmd run dev`), zaloguj się hasłem, napisz „Cześć”. Jeśli dostajesz odpowiedź — przejdź do kroku 0.

**Nie działa albo jej nie masz?** Nie naprawiaj jej teraz. Weź gotowy projekt w stanie „po lekcji 6”:

1. Pobierz materiały kursu. W terminalu, w folderze na swoje projekty, wpisz:

   ```bash
   git clone https://github.com/SirIdontCare/laba-agenci-ai-s2.git
   ```

   Masz już ten folder z poprzednich zajęć? Wejdź do niego i wpisz `git pull`.
2. Skopiuj folder `starter_lekcja_07` w swoje miejsce na projekty i otwórz w nim terminal. To od teraz Twój projekt.
3. Wpisz `npm install` (Windows PowerShell: `npm.cmd install`).
4. Skopiuj do tego folderu swój plik `.env.local` z poprzedniego projektu. Nie masz go? Skopiuj `.env.example` jako `.env.local` i uzupełnij wartości.
5. Gotowy projekt potrzebuje tabel z lekcji 5 i 6. Otwórz swój projekt w Supabase → **SQL Editor**, wklej całą treść pliku `baza.sql` z folderu projektu i kliknij **Run**. Skrypt tworzy tylko to, czego brakuje.
6. Wpisz `npm run dev` i otwórz http://localhost:3000.

### Krok 0 — jeden prompt na początek

Otwórz asystenta w folderze aplikacji i wklej to **raz**. Kolejne prompty wklejaj w tej samej rozmowie.

```text
Dziś zamieniamy wspólne hasło na prawdziwe konta użytkowników przez Supabase Auth.
Zanim cokolwiek zmienisz:

1. Przeczytaj AGENTS.md i package.json. Sprawdź wersję next i @supabase/supabase-js.
2. Nie pisz kodu z pamięci. Aktualny sposób łączenia Supabase Auth z Next.js (App Router,
   pakiet @supabase/ssr) sprawdź w dokumentacji Supabase „Server-Side Auth for Next.js”
   i w plikach typów pakietu. Next.js sprawdzaj w node_modules/next/dist/docs/ — w tej wersji
   plik pośredniczący nazywa się proxy.ts, a strony czytające ciasteczka muszą być dynamiczne.
3. Tożsamość użytkownika ustala wyłącznie serwer na podstawie zweryfikowanej sesji.
   Nigdy nie bierz identyfikatora użytkownika z formularza, adresu strony ani z odpowiedzi modelu.
4. Każdy endpoint najpierw sprawdza sesję i bez niej zwraca 401 — zanim dotknie bazy albo modelu.
5. Nie czytaj i nie wypisuj wartości z .env.local.
6. Rozmawiaj ze mną po polsku, prostym językiem. Po każdej zmianie uruchom build,
   napraw błędy i napisz w 3 punktach, co zrobiłeś i jak to sprawdzić w przeglądarce.

Na razie niczego nie zmieniaj. Wypisz tylko wszystkie miejsca, które dziś korzystają
ze wspólnego hasła (lib/session.ts), oraz wszystkie endpointy i strony, które trzeba chronić.
```

---

## Warsztat 1 — Logowanie e-mail i hasło (20 min)

**Po co:** wspólne hasło mówi tylko „ktoś zna hasło”. Konto mówi, **kim** jesteś — a bez tego nie da się oddzielić Twoich danych od cudzych.

**Gotowe, gdy:** logowanie działa; niezalogowany nie odczytuje danych ani nie uruchamia API.

Panele Supabase i Google są po angielsku i co jakiś czas zmieniają wygląd. Jeśli przycisk nazywa się u Ciebie trochę inaczej niż tutaj, szukaj najbliższego odpowiednika albo zapytaj prowadzącego.

### 🟢 Minimum — strona /login

**Część A — trzy ustawienia w Supabase**

1. Wejdź na https://supabase.com/dashboard i otwórz swój projekt (`agent-kurs`) — ten sam co w lekcjach 5 i 6.
2. W menu po lewej kliknij **Authentication** (ikona osoby). W bocznej liście wybierz **Sign In / Providers**.
3. Na liście dostawców kliknij **Email**. Sprawdź, że jest włączony. Wyłącz przełącznik **Confirm email** i kliknij **Save**.

   Dlaczego: z włączonym potwierdzaniem Supabase wysyła do nowej osoby e-mail z linkiem. Darmowa poczta Supabase wysyła tylko 2 wiadomości na godzinę i tylko na adresy osób z Twojego zespołu w Supabase. Koledzy z kursu nie mogliby założyć u Ciebie konta. Wyłączenie potwierdzania to uproszczenie na czas kursu.
4. W bocznej liście wybierz **URL Configuration**. W polu **Site URL** wpisz `http://localhost:3000`. W części **Redirect URLs** kliknij **Add URL**, wpisz `http://localhost:3000/**` (z dwiema gwiazdkami) i zapisz.

**Część B — adres projektu i klucz dla przeglądarki**

5. W menu po lewej otwórz **Settings** (ikona koła zębatego) → **API Keys**. Znajdź klucz **publishable** — zaczyna się od `sb_publishable_`. Skopiuj go ikoną kopiowania.

   To inny klucz niż secret z lekcji 5. Publishable może trafić do przeglądarki: sam niczego nie otwiera, a danych pilnują reguły w bazie, które dodasz w warsztacie 2.
6. Otwórz plik `.env.local` (obok `package.json`). Dopisz na końcu dwie linie — bez spacji i bez cudzysłowów. Adres projektu jest ten sam co w linii `SUPABASE_URL`:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=tu_wklej_adres_projektu
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_wklej_klucz_publishable
   ```

7. Zapisz plik. W terminalu zatrzymaj serwer (Ctrl+C) i uruchom go ponownie — nowe zmienne wczytują się dopiero przy starcie. Linii `SUPABASE_URL` i `SUPABASE_SECRET_KEY` nie usuwaj.

**Część C — prompt**

Gotowy wynik: wejście na http://localhost:3000 bez logowania przenosi na stronę `/login` z zakładkami „Zaloguj się” i „Załóż konto”. Po zalogowaniu widzisz czat, a w nagłówku swój e-mail i przycisk „Wyloguj”.

```text
Zamień wspólne hasło na konta użytkowników przez Supabase Auth (e-mail i hasło).

- Zainstaluj @supabase/ssr. Zmienne: NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
  Przygotuj klienta Supabase dla przeglądarki i dla serwera oraz odświeżanie sesji w proxy.ts —
  zgodnie z aktualną dokumentacją Supabase dla Next.js.
- Dodaj stronę /login z dwiema zakładkami: „Zaloguj się” i „Załóż konto” (e-mail, hasło min. 8 znaków).
  Po udanym logowaniu albo rejestracji przejdź do czatu.
- Dodaj przycisk „Wyloguj” i pokaż w nagłówku e-mail zalogowanej osoby.
- Wszystkie strony poza /login przekierowują niezalogowanego na /login.
- Każdy endpoint w app/api sprawdza użytkownika na serwerze sposobem zalecanym w dokumentacji
  (weryfikacja sesji, nie samo odczytanie ciasteczka) i bez niego zwraca 401, zanim dotknie
  bazy albo modelu.
- Usuń logowanie wspólnym hasłem i wszystkie użycia lib/session.ts. Zmienne CHAT_PASSWORD
  i SESSION_SECRET przestają być potrzebne.
- Błędy pokazuj po polsku: złe hasło, konto już istnieje, za krótkie hasło.
- Na razie zapis rozmów zostaw bez zmian — dane rozdzielimy w następnym kroku.
- Na końcu sam wyślij do endpointu rozmowy zapytanie bez ciasteczek na działającym serwerze
  i pokaż mi kod odpowiedzi (ma być 401).
```

**Gdy asystent pracuje:** wpisz na czat kursu swój typ. Gdy za chwilę druga osoba założy konto w Twojej aplikacji, zobaczy: **A** — pusty czat, **B** — Twoją ostatnią rozmowę.

**Sprawdź:**

1. Wejdź na http://localhost:3000. Aplikacja przenosi Cię na `/login`.
2. Kliknij „Załóż konto”, wpisz swój e-mail i hasło (minimum 8 znaków), zatwierdź. Jesteś w czacie, w nagłówku widać Twój e-mail.
3. Napisz „Cześć, jestem konto A” — agent odpowiada.
4. W Supabase otwórz **Authentication → Users**. Na liście jest jeden użytkownik: Ty.
5. Kliknij „Wyloguj”. Wpisz w pasku adresu `http://localhost:3000` — wracasz na `/login`.
6. W podsumowaniu asystenta znajdź kod odpowiedzi dla zapytania bez logowania: ma być `401`.

**Minimum zrobione.**

**Eksperyment „przed” (2 minuty).** Otwórz okno incognito (Ctrl+Shift+N), wejdź na http://localhost:3000 i załóż drugie konto — adres może być wymyślony, np. `test-b@example.com`. Co widzi konto B po zalogowaniu? Zrób zrzut ekranu i sprawdź swój typ z czatu. Okno incognito zostaw otwarte — wrócisz do niego w warsztacie 2.

### 🔵 Standard — rejestracja, wylogowanie i brak dostępu bez niespodzianek

```text
Dopracuj logowanie:
- Po wylogowaniu wyczyść z ekranu rozmowę, historię i profil poprzedniej osoby. Przycisk „Wstecz”
  w przeglądarce nie może pokazać starych danych.
- Wejście na chronioną stronę bez logowania zapamiętuje, dokąd chciałem wejść, i po zalogowaniu
  tam wraca (tylko adresy wewnątrz aplikacji).
- Podczas logowania i rejestracji przycisk jest zablokowany i pokazuje „Chwileczkę…”.
- Sprawdź sam i pokaż mi wynik w tabelce: rejestracja, logowanie, złe hasło, wylogowanie,
  wejście na /upload bez sesji, zapytanie do każdego endpointu bez sesji.
```

**Sprawdź:** zaloguj się, napisz coś, wyloguj się i kliknij „Wstecz”. Nie widzisz swojej rozmowy. Tabelka asystenta ma przy każdym endpoincie „401 bez sesji”.

### 🟣 Dla szybkich — spróbuj wejść bez konta

Logowanie działa. Teraz sprawdź, czy da się je obejść.

```text
Zachowuj się jak tester bezpieczeństwa tej aplikacji. Wypisz pięć konkretnych sposobów,
którymi ktoś bez konta mógłby spróbować dostać się do czatu, do endpointów w app/api
albo do stron /upload i /dashboard (np. zapytanie bez ciasteczek, ze zmyślonym ciasteczkiem,
z wygasłą sesją, bezpośrednio do endpointu obrazów, zmiana adresu powrotu po logowaniu).
Każdy sprawdź na działającym serwerze i pokaż mi tabelkę: próba, co odpowiedział serwer,
czy to poprawne. Niczego jeszcze nie naprawiaj.
```

**Sprawdź:** w tabelce każda próba kończy się odmową (401 albo przekierowanie na `/login`). Jeśli któraś przeszła — to najlepsze znalezisko zajęć: wrzuć ją na czat kursu i dopiero wtedy poproś asystenta o naprawę.

---

## Warsztat 2 — Prywatne rozmowy i personalizacja (20 min)

**Po co:** logowanie mówi, kim jesteś. Teraz baza musi pilnować, **co wolno Ci zobaczyć**. Robi to RLS: reguła w bazie, która przy każdym wierszu sprawdza, czy należy do zalogowanej osoby. Działa nawet wtedy, gdy w kodzie aplikacji jest błąd.

**Gotowe, gdy:** dwa konta — każde widzi tylko swoje rozmowy.

Co zmieniasz w tym warsztacie:

| Teraz | Po warsztacie |
|---|---|
| wiersz w tabeli nie wie, czyj jest | każdy wiersz ma kolumnę `user_id` z identyfikatorem właściciela |
| aplikacja czyta bazę kluczem secret, który widzi wszystko | aplikacja czyta bazę „jako zalogowana osoba” i dostaje tylko jej wiersze |
| konto B widzi rozmowę konta A | konto B widzi pusty czat |

### 🟢 Minimum — każdy widzi tylko swoje

**Część A — kolumna właściciela i reguły w bazie**

1. W Supabase otwórz **SQL Editor** (ikona terminala w menu po lewej).
2. W dużym pustym polu wklej **cały** poniższy kod.
3. Kliknij **Run** (albo Ctrl+Enter). Pod spodem pojawia się komunikat o powodzeniu (*Success. No rows returned*).

```sql
-- 1. Każdy wiersz dostaje właściciela. Baza wpisuje go sama: to zalogowana osoba.
alter table public.conversations
  add column if not exists user_id uuid default auth.uid() references auth.users (id) on delete cascade;
alter table public.messages
  add column if not exists user_id uuid default auth.uid() references auth.users (id) on delete cascade;
alter table public.user_profiles
  add column if not exists user_id uuid default auth.uid() references auth.users (id) on delete cascade;

-- 2. Jedna osoba ma jeden profil.
create unique index if not exists user_profiles_user_id_key on public.user_profiles (user_id);

-- 3. RLS zostaje włączony.
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.user_profiles enable row level security;

-- 4. Polityki: zalogowana osoba czyta, dodaje, zmienia i usuwa tylko swoje wiersze.
drop policy if exists "tylko wlasne rozmowy" on public.conversations;
create policy "tylko wlasne rozmowy" on public.conversations
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "tylko wlasne wiadomosci" on public.messages;
create policy "tylko wlasne wiadomosci" on public.messages
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "tylko wlasny profil" on public.user_profiles;
create policy "tylko wlasny profil" on public.user_profiles
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 5. Zalogowane osoby mogą korzystać z tych tabel (w granicach polityk).
grant select, insert, update, delete
  on table public.conversations, public.messages, public.user_profiles
  to authenticated;
```

Nie musisz rozumieć każdej linii. Wystarczy wiedzieć, co powstało:

| Część skryptu | Co robi | Co już znasz |
|---|---|---|
| 1. `add column … user_id` | dodaje do trzech tabel kolumnę z identyfikatorem właściciela; baza wpisuje go sama przy zapisie | relacja z **Cascade** jak w lekcji 5: usunięcie konta usuwa jego dane |
| 2. `create unique index` | pilnuje, żeby jedna osoba miała jeden profil | — |
| 3. `enable row level security` | zostawia zamki włączone | to samo zaznaczenie co w Table Editor |
| 4. `create policy` | reguła: widzisz i zmieniasz tylko wiersze, w których `user_id` to Twój identyfikator | nowość dzisiejszych zajęć |
| 5. `grant … to authenticated` | pozwala zalogowanym osobom w ogóle korzystać z tabel | podobnie jak `grant … to service_role` w lekcji 6 |

4. Otwórz **Table Editor** → `conversations`. Na końcu jest nowa kolumna `user_id`. W starych wierszach ma wartość `NULL` — te rozmowy nie należą do nikogo.
5. W menu po lewej otwórz **Authentication → Policies**. Przy każdej z trzech tabel widać jedną politykę.

**Część B — prompt**

Gotowy wynik: aplikacja wygląda tak samo. Zmienia się to, co widzi każde konto.

```text
Rozdziel dane między użytkowników. W bazie jest już gotowe: tabele conversations, messages
i user_profiles mają kolumnę user_id (uuid, domyślnie auth.uid()), włączony RLS, polityki
„tylko własne wiersze” dla roli authenticated oraz unikalny user_id w user_profiles.
Nie zmieniaj schematu bazy.

1. Rozmowy, wiadomości i profil czytaj i zapisuj klientem Supabase zalogowanego użytkownika
   (klucz publishable + sesja z ciasteczek), a nie kluczem secret. Wtedy bazy pilnuje RLS.
2. Identyfikator użytkownika bierz wyłącznie z sesji na serwerze — nigdy z treści zapytania
   ani od modelu. Kolumnę user_id wypełnia baza; nie przyjmuj jej z przeglądarki.
3. Narzędzie zapiszProfil i wczytywanie profilu do instrukcji działają na profilu zalogowanej
   osoby (jeden wiersz na użytkownika).
4. Baza wiedzy (documents, chunks, match_chunks) zostaje na razie wspólna i nadal korzysta
   z klucza secret na serwerze.
5. Na końcu sprawdź na działającym serwerze: nowa rozmowa zapisuje się z user_id zalogowanej
   osoby. Pokaż mi, jak to zobaczyć w Table Editor.
```

**Gdy asystent pracuje:** w Supabase otwórz **Authentication → Users** i znajdź kolumnę z identyfikatorem (`UID`) przy swoich dwóch kontach. Te długie ciągi znaków to wartości, które za chwilę pojawią się w kolumnie `user_id`.

**Sprawdź — eksperyment „po”:**

1. W zwykłym oknie zaloguj się jako konto A. Stara rozmowa zniknęła — to poprawne, nie należała do żadnego konta. Kliknij „Nowa rozmowa” i napisz „Jestem konto A”.
2. Wróć do okna incognito z kontem B i odśwież stronę (F5). Czat konta B jest pusty. Napisz „Jestem konto B”.
3. Odśwież oba okna. Każde konto widzi tylko swoją rozmowę. Połóż ten zrzut obok zrzutu „przed” z warsztatu 1.
4. W Supabase otwórz **Table Editor** → `conversations`. Dwa nowe wiersze mają w kolumnie `user_id` dwie różne wartości.

**Minimum zrobione.**

Błąd „permission denied” albo „row-level security”? Uruchom skrypt z części A jeszcze raz (jest bezpieczny do ponownego uruchomienia), a potem skopiuj komunikat do asystenta.

### 🔵 Standard — dokumenty, profil i próba z cudzym adresem

```text
Dokończ rozdzielanie danych:
- Baza wiedzy: przygotuj SQL do wklejenia w SQL Editor, który doda user_id i takie same polityki
  do tabel documents i chunks oraz sprawi, że match_chunks zwraca tylko fragmenty zalogowanej
  osoby. Poczekaj na moje „wklejone”. Potem /upload i searchKnowledge mają działać klientem
  zalogowanego użytkownika.
- Nowa rozmowa wita właściwą osobę po imieniu z jej profilu. Po zmianie konta na tym samym
  komputerze nie może pojawić się imię ani preferencje poprzedniej osoby.
- Otwarcie cudzej rozmowy przez wpisanie jej adresu albo identyfikatora pokazuje „Nie znaleziono”,
  bez żadnych danych. To samo dotyczy zapisu i usuwania.
- Sprawdź sam, poza interfejsem: zapytania do endpointów jako konto B z identyfikatorem
  rozmowy konta A. Pokaż mi wyniki w tabelce.
```

**Sprawdź:** jako konto A powiedz agentowi swoje imię i dodaj jeden dokument przez `/upload`. Jako konto B zacznij nową rozmowę i zapytaj o treść tego dokumentu. Agent nie wita B imieniem A i nie zna dokumentu A.

### 🟣 Dla szybkich — udowodnij, że pilnuje baza, a nie kod

Klucz publishable jest publiczny — każdy może go wyjąć z przeglądarki. Sprawdź, co da się nim wyciągnąć z bazy z pominięciem Twojej aplikacji.

```text
Udowodnij mi, że danych pilnuje baza, a nie kod aplikacji. Jednorazowym skryptem, który potem
usuniesz, połącz się z Supabase samym kluczem publishable (bez logowania) i spróbuj:
odczytać conversations, messages i user_profiles, dodać wiersz do conversations oraz dodać
wiersz z cudzym user_id. Potem zaloguj się w skrypcie jako konto B (dane logowania podam
w terminalu, nie w czacie) i spróbuj odczytać oraz zmienić rozmowę konta A.
Pokaż mi tabelkę: próba, wynik, czy to poprawne. Nie wypisuj wartości z .env.local.
```

**Sprawdź:** bez logowania każda próba zwraca pustą listę albo odmowę. Jako konto B nie da się odczytać ani zmienić wiersza konta A. Jeśli coś przeszło — brakuje polityki albo została tabela bez RLS; znajdź ją w **Authentication → Policies**.

Zostało kilka minut? Przygotuj pierwsze wejście nowej osoby w Twoim temacie:

```text
Mój agent to [temat]. Przygotuj pierwsze wejście nowego użytkownika: gdy profil jest pusty,
agent wita się, mówi jednym zdaniem, w czym pomaga, i zadaje dwa pytania ważne w moim temacie:
[pytania]. Odpowiedzi zapisuje w profilu tej osoby. Przy kolejnych wejściach już nie pyta.
```

---

## Warsztat 3 — Google OAuth: imię i avatar (30 min)

**Po co:** „Zaloguj przez Google” to jedno kliknięcie zamiast kolejnego hasła. Google przekazuje aplikacji tylko imię, e-mail i zdjęcie profilowe — nie dostęp do poczty.

**Gotowe, gdy:** Google OAuth działa, a aplikacja pokazuje właściwe imię i avatar.

Kto z kim rozmawia podczas logowania przez Google:

| Krok | Co się dzieje |
|---|---|
| 1 | klikasz „Zaloguj przez Google” w swojej aplikacji |
| 2 | przeglądarka przechodzi na stronę Google; wybierasz konto i zgadzasz się |
| 3 | Google odsyła Cię do Supabase z potwierdzeniem, kim jesteś |
| 4 | Supabase zakłada (albo odnajduje) Twoje konto i odsyła Cię do aplikacji — już zalogowanego |

Dlatego konfigurujesz dwa panele: w Google mówisz „ufam temu adresowi Supabase”, a w Supabase — „ufam temu klientowi Google”.

### 🟢 Minimum — przycisk „Zaloguj przez Google”

To najdłuższe klikanie w kursie. Idź krok po kroku razem z prowadzącym i nie wyprzedzaj. Miej otwarte dwie karty: Supabase i Google Cloud.

**Część A — karta Supabase: skopiuj adres zwrotny**

1. W Supabase wejdź w **Authentication → Sign In / Providers**.
2. Na liście dostawców kliknij **Google**. Rozwinie się formularz.
3. Skopiuj widoczny tam adres zwrotny (**Callback URL**). Wygląda mniej więcej tak: `https://abcdefgh.supabase.co/auth/v1/callback`. Wklej go na chwilę do notatnika. Kartę zostaw otwartą.

**Część B — karta Google Cloud: projekt i ekran zgody**

4. Wejdź na https://console.cloud.google.com i zaloguj się kontem Google. Przy pierwszym wejściu zaakceptuj warunki usługi.
5. U góry strony kliknij nazwę projektu (obok logo Google Cloud). W okienku kliknij **New project**, wpisz nazwę `agent-kurs` i kliknij **Create**. Poczekaj kilkanaście sekund, potem wybierz ten projekt z tej samej listy.
6. W polu wyszukiwania u góry wpisz `Google Auth Platform` i otwórz tę stronę.
7. Jeśli widzisz przycisk **Get started**, kliknij go i wypełnij krótki formularz. Ma cztery części — po każdej klikasz **Next**:

   | Pole | Co wpisać |
   |---|---|
   | nazwa aplikacji (**App name**) | nazwa Twojego agenta |
   | e-mail pomocy (**User support email**) | Twój adres Gmail |
   | odbiorcy (**Audience**) | **External** |
   | dane kontaktowe (**Contact information**) | Twój adres Gmail |

   W ostatniej części (**Finish**) zaznacz zgodę na zasady (**I agree to the Google API Services: User Data Policy**), kliknij **Continue**, a potem **Create**.
8. W menu po lewej otwórz **Audience**. W części **Test users** kliknij **Add users**, wpisz swój adres Gmail i zapisz. Aplikacja jest w trybie testowym: przez Google zalogują się tylko osoby z tej listy. Na dziś wystarczy Twój adres.
9. W menu po lewej otwórz **Data Access**. Kliknij **Add or remove scopes** i zaznacz trzy pozycje: `openid`, `…/auth/userinfo.email` i `…/auth/userinfo.profile`. Niczego więcej nie zaznaczaj. Zatwierdź (**Update**) i zapisz (**Save**).

**Część C — karta Google Cloud: klient OAuth**

10. W menu po lewej otwórz **Clients** i kliknij **Create client**.
11. W polu **Application type** wybierz **Web application**. Nazwę zostaw domyślną.
12. W części **Authorized JavaScript origins** kliknij **Add URI** i wpisz `http://localhost:3000`.
13. W części **Authorized redirect URIs** kliknij **Add URI** i wklej adres z kroku 3 (ten z Supabase, zakończony na `/auth/v1/callback`).
14. Kliknij **Create**. Pojawi się okienko z dwiema wartościami: **Client ID** i **Client secret**. **Nie zamykaj go** — sekret jest pokazywany tylko raz.

**Część D — z powrotem w karcie Supabase**

15. W formularzu dostawcy **Google** włącz przełącznik (**Enable Sign in with Google**).
16. Skopiuj **Client ID** z okienka Google i wklej w pole **Client ID** w Supabase.
17. Skopiuj **Client secret** z okienka Google i wklej w pole **Client Secret** w Supabase.
18. Kliknij **Save**.

Client secret wklejasz **tylko** w tym formularzu Supabase. Nie trafia do `.env.local`, do kodu ani do czatu z asystentem.

Zamknąłeś okienko przed skopiowaniem sekretu? W Google Cloud otwórz **Clients**, kliknij swojego klienta i dodaj nowy sekret (**Add secret**).

**Część E — prompt**

Gotowy wynik: na stronie `/login` jest przycisk „Zaloguj przez Google”. Po zalogowaniu w nagłówku widać Twoje imię i zdjęcie.

```text
Dodaj logowanie przez Google (Supabase Auth). Dostawca Google jest już skonfigurowany
w panelu Supabase — w kodzie nie potrzebujesz Client ID ani Client Secret.

- Na stronie /login dodaj przycisk „Zaloguj przez Google”. Logowanie e-mailem zostaje.
- Użyj przepływu zalecanego w dokumentacji Supabase dla Next.js po stronie serwera:
  start logowania u dostawcy google i trasa /auth/callback, która wymienia kod na sesję,
  a potem przenosi do czatu.
- Adres powrotu buduj z adresu, pod którym aplikacja właśnie działa (nie wpisuj localhost
  na sztywno), i przyjmuj tylko ścieżki wewnątrz aplikacji.
- Po zalogowaniu pokaż w nagłówku imię i avatar z danych konta Google. Nazwy pól sprawdź
  w rzeczywistych danych użytkownika, nie zgaduj. Avatar pokaż zwykłym znacznikiem img.
- Gdy logowanie się nie uda albo zostanie anulowane, wróć na /login z komunikatem po polsku.
- Wszystkie zasady z warsztatów 1 i 2 zostają: sesja sprawdzana na serwerze, dane tylko własne.
```

**Gdy asystent pracuje:** wpisz na czat kursu swój typ. Po kliknięciu „Zaloguj przez Google” Twoja aplikacja dostanie od Google: **A** — imię, e-mail i zdjęcie, **B** — także listę kontaktów, **C** — także dostęp do poczty. Odpowiedź zobaczysz za chwilę na ekranie zgody Google.

**Sprawdź:**

1. Wyloguj się z aplikacji i wejdź na http://localhost:3000/login.
2. Kliknij „Zaloguj przez Google”. Otwiera się strona Google.
3. Wybierz konto, które dodałeś jako użytkownika testowego w kroku 8. Google może ostrzec, że aplikacja nie jest zweryfikowana — to normalne w trybie testowym; kliknij **Continue**.
4. Przeczytaj, o co prosi aplikacja: imię, adres e-mail, zdjęcie profilowe. Zatwierdź.
5. Wracasz do czatu. W nagłówku widzisz swoje imię i zdjęcie.
6. W Supabase otwórz **Authentication → Users**. Jest nowy użytkownik z dostawcą Google.

**Minimum zrobione.**

To konto Google jest dla aplikacji nową osobą — nie widzi rozmów konta A założonego e-mailem i hasłem, chyba że oba konta mają ten sam adres e-mail.

### 🔵 Standard — powrót, wylogowanie i imię w profilu

```text
Dopracuj logowanie przez Google:
- Jeśli profil nie ma jeszcze imienia, zapisz w nim imię z konta Google — agent wita po imieniu
  już w pierwszej rozmowie.
- Brak zdjęcia w koncie Google: pokaż kółko z pierwszą literą imienia, nie pusty obrazek.
- Wylogowanie kończy sesję i czyści imię, avatar oraz dane z ekranu. Ponowne kliknięcie
  „Zaloguj przez Google” działa bez błędu.
- Sprawdź sam i pokaż wyniki w tabelce: logowanie, powrót do czatu, anulowanie na ekranie Google,
  wylogowanie, ponowne logowanie, wejście na /upload po wylogowaniu.
```

**Sprawdź:** zaloguj się przez Google, zacznij nową rozmowę — agent wita Cię imieniem z Google. Wyloguj się: imię i avatar znikają. Kliknij logowanie przez Google i na ekranie Google wybierz „Anuluj” — wracasz na `/login` z czytelnym komunikatem.

### 🟣 Dla szybkich — Twój agent online z logowaniem

Opublikuj swojego agenta z logowaniem na Vercel — to pierwszy krok pracy domowej. Wykonaj listę „Zanim wyślesz link” z sekcji o pracy domowej, a potem:

```text
Opublikowałem aplikację na Vercel pod adresem [adres]. Sprawdź w kodzie, czy logowanie
e-mailem i przez Google nie ma nigdzie wpisanego na sztywno adresu localhost, i wypisz mi
listę adresów, które muszę dodać w panelach Supabase i Google, żeby logowanie działało online.
```

**Sprawdź:** otwórz adres z Vercel w oknie incognito, zaloguj się przez Google i napisz „Cześć”. Potem wyślij link jednej osobie z kursu i poproś, żeby założyła konto e-mailem i hasłem.

---

## Pokaż, co zrobiłeś

Wrzuć na czat kursu **jeden zrzut ekranu**: Twoja aplikacja po zalogowaniu, z imieniem w nagłówku (i avatarem, jeśli działa Google). Dopisz jedno zdanie: który poziom zrobiłeś w każdym warsztacie. Jeśli masz zrzuty „przed” i „po” z dwóch kont — wrzuć je obok siebie.

## Praca domowa (12 pkt)

**Wyślij link dwóm osobom (osoby z kursu albo znajomi). Niech się zalogują i porozmawiają z agentem. Sprawdź w Supabase, że widzisz 3 użytkowników z osobnymi rozmowami.**

| Kryterium | Punkty |
|---|---|
| Trzech użytkowników w Supabase (zrzut z zasłoniętymi adresami) | 4 |
| Każdy ma tylko swoje rozmowy | 4 |
| Zrzut i jedno zdanie o tym, co powiedzieli testerzy | 4 |

Oddajesz na czacie kursu: zrzuty ekranu albo link. Użytkowników zobaczysz w Supabase w **Authentication → Users**. Osobne rozmowy widać w **Table Editor → conversations**: w kolumnie `user_id` są trzy różne wartości.

**Kto testuje.** Najprościej: osoby z kursu testują się nawzajem. Pary i trójki dobieramy na czacie kursu pod koniec zajęć. Testerzy zakładają u Ciebie konto **e-mailem i hasłem** — to działa od razu i niczego nie musisz dla nich ustawiać. Logowanie przez Google zostaje dla Ciebie, jako właściciela aplikacji.

**Zanim wyślesz link:**

1. Opublikuj aplikację na Vercel tak jak w lekcji 1.
2. W projekcie na Vercel otwórz **Settings → Environment Variables** i dodaj `NEXT_PUBLIC_SUPABASE_URL` oraz `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (i pozostałe zmienne z `.env.local`, jeśli ich tam jeszcze nie ma). Kliknij **Save** i opublikuj aplikację ponownie — nowe zmienne działają dopiero po ponownej publikacji.
3. W Supabase, w **Authentication → URL Configuration**, zmień **Site URL** na adres z Vercel, a w **Redirect URLs** dodaj `https://twoj-adres.vercel.app/**`. Wpis `http://localhost:3000/**` zostaw — dzięki niemu logowanie działa dalej także na Twoim komputerze.
4. W Google Cloud otwórz **Clients**, kliknij swojego klienta i w **Authorized JavaScript origins** dodaj adres z Vercel. Adresu w **Authorized redirect URIs** nie zmieniaj.
5. Sprawdź sam, zanim wyślesz: otwórz adres z Vercel w oknie incognito, załóż konto wymyślonym adresem i napisz „Cześć”.

Link wysyłaj tylko testerom. Każdy, kto go zna, może założyć konto i korzystać z modelu na kluczu kursu.

## Gdy coś nie działa

| Co widzisz | Co zrobić |
|---|---|
| Rejestracja: błąd o adresie e-mail albo o limicie wiadomości | W Supabase, w dostawcy **Email**, wyłącz **Confirm email** i zapisz (krok 3 w warsztacie 1). |
| Po rejestracji komunikat „sprawdź skrzynkę” i nic się nie dzieje | To samo: **Confirm email** jest włączone. Wyłącz i załóż konto jeszcze raz innym adresem. |
| Po zalogowaniu aplikacja wraca na `/login` | Napisz: „Po zalogowaniu wracam na /login. Sprawdź odświeżanie sesji w proxy.ts i weryfikację użytkownika na serwerze według dokumentacji Supabase dla Next.js”. |
| Błąd o brakującym adresie albo kluczu Supabase | Sprawdź dwie nowe linie w `.env.local` (nazwy zaczynają się od `NEXT_PUBLIC_`) i uruchom serwer ponownie. |
| Po warsztacie 2 nic się nie zapisuje albo błąd „permission denied” / „row-level security” | Uruchom ponownie skrypt z części A warsztatu 2. Jeśli błąd zostaje — skopiuj go do asystenta i dopisz: „Nie wyłączaj RLS”. |
| Konto B nadal widzi rozmowę konta A | Napisz: „Rozmowy nadal czytasz kluczem secret. Czytaj i zapisuj je klientem zalogowanego użytkownika”. |
| Zniknęły stare rozmowy | Tak ma być — powstały przed kontami i nie należą do nikogo. |
| Google: `Error 400: redirect_uri_mismatch` | Adres w **Authorized redirect URIs** musi być dokładnie adresem **Callback URL** z Supabase — bez spacji i bez dodatkowego ukośnika na końcu. |
| Google: „Odmowa dostępu” / `access_denied` | Logujesz się kontem spoza listy **Test users**. Dodaj swój adres w **Audience** (krok 8 w warsztacie 3). |
| Supabase: błąd o dostawcy, który nie jest włączony | W formularzu dostawcy Google włącz przełącznik i kliknij **Save** (krok 15). |
| Po logowaniu przez Google nie ma imienia ani zdjęcia | Napisz: „Wypisz w terminalu nazwy pól w danych użytkownika z Google (bez wartości) i popraw wyświetlanie imienia i avatara”. |
| Logowanie działa lokalnie, a na Vercel nie | Przejdź listę „Zanim wyślesz link” — najczęściej brakuje adresu z Vercel w **Redirect URLs** w Supabase. |
| Po zmianach nic nie działa | Napisz do asystenta: „Cofnij ostatnią zmianę i wróć do działającej wersji”. W ostateczności weź `starter_lekcja_07`. |
