# Lekcja 8 — Agent wykonuje misje

Do tej pory Twój agent odpowiadał na pytania. Dziś dostaje **misje**: zadania z danymi na wejściu i gotowym wynikiem na wyjściu. Posortuje pięć maili i przygotuje szkice odpowiedzi, napisze raport ze źródłami, porówna trzy firmy w tabeli. Na koniec zbudujesz własną misję — taką, która przyda się Tobie.

**Na koniec zajęć wrzucasz na czat kursu jeden zrzut ekranu:** wynik Twojej własnej misji. Nie zdążysz z własną? Wrzuć wynik triage albo raportu.

## Jak pracujemy

Każdy warsztat ma trzy poziomy. **Poziom wybierasz sam i możesz go zmieniać między warsztatami.**

| Poziom | Dla kogo | Co to znaczy |
|---|---|---|
| 🟢 **Minimum** | dla każdego | To wystarczy, żeby zaliczyć warsztat i iść dalej. |
| 🔵 **Standard** | gdy minimum działa i zostało kilka minut | Ta sama funkcja, tylko dopracowana. |
| 🟣 **Dla szybkich** | gdy standard działa | Wyzwanie: to samo na własnym temacie albo próba, czy wynik da się podważyć. |

Zasady:

- Zrobione minimum = warsztat zaliczony. Nikt nie zostaje w tyle, jeśli ma minimum.
- Prompty są gotowe — kopiujesz je do asystenta (Codex albo Claude Code) i czekasz na wynik.
- Coś nie działa dłużej niż 3 minuty? Znajdź błąd (tabela niżej), skopiuj go do asystenta i napisz: „Napraw ten błąd”. Jeśli dalej nie działa — podnieś rękę.
- Agent **niczego sam nie wysyła**. Każdy wynik to szkic, raport albo tabela — czyta je i zatwierdza człowiek.
- Do misji nie wklejaj prawdziwych maili klientów ani cudzych danych osobowych. Przykłady w tej lekcji są wymyślone.

**Przy każdym prompcie postępuj tak samo:**

1. Wklej prompt do asystenta — w tej samej rozmowie, w której wkleiłeś prompt z kroku 0.
2. Asystent może pytać o zgodę na zmianę plików albo uruchomienie polecenia — zgadzaj się. O klucze i hasła nie powinien pytać; gdyby zapytał, niczego nie wklejaj.
3. Poczekaj — zwykle kilka minut. W tym czasie zrób zadanie „Gdy asystent pracuje” spod promptu.
4. Asystent skończył, gdy napisze w 3 punktach, co zrobił. Widzisz błąd? Napisz: „Napraw ten błąd”.
5. Odśwież stronę w przeglądarce (F5). Serwer nie działa? Uruchom go ponownie: `npm run dev` (Windows PowerShell: `npm.cmd run dev`).

**Gdzie szukać błędu**

| Gdzie | Jak wygląda | Co skopiować |
|---|---|---|
| na stronie misji | czerwony komunikat pod przyciskiem albo w karcie wyniku | cały komunikat |
| w terminalu, w którym działa `npm run dev` | czerwone linie, często ze słowem `Error` | ostatnie 10–20 linii |
| w oknie asystenta | asystent sam pisze, że build się nie udał | nic — napisz tylko „Napraw to i uruchom build ponownie” |
| w Supabase, SQL Editor (tylko poziom 🟣 w warsztacie 3) | komunikat pod polem z kodem | cały komunikat |

Zaznacz tekst myszą, skopiuj (Ctrl+C) i wklej do asystenta razem ze zdaniem: „Napraw ten błąd”. Jeśli w skopiowanym tekście widzisz coś, co wygląda jak klucz (`sb_secret_…`, `sk-or-…`) — usuń ten kawałek przed wklejeniem.

## Słowa, które dziś padną

| Słowo | Co to jest | W biurze |
|---|---|---|
| **Misja** | zadanie od danych wejściowych do gotowego wyniku | zlecenie dla nowego pracownika: „posortuj pocztę i przygotuj odpowiedzi” |
| **Kontrakt misji** | pięć linijek: cel, wejście, narzędzia, wynik, kontrola | karteczka ze zleceniem — bez niej każdy zrobi to po swojemu |
| **Triage** | wstępne sortowanie: co to za sprawa i jak pilna | sekretariat rozkłada pocztę na kupki, zanim trafi do szefa |
| **Szkic** | propozycja odpowiedzi, której nikt jeszcze nie wysłał | list przygotowany do podpisu |
| **Wynik w ustalonych polach** | model zwraca dane w tym samym kształcie za każdym razem, a serwer to sprawdza | formularz z rubrykami zamiast kartki z luźnym opisem |
| **Źródło** | strona, z której agent wziął informację | przypis: „skąd to wiesz?” |

Pytanie w czacie to rozmowa na korytarzu: odpowiedź jest, ale za każdym razem inna i nie wiadomo, gdzie ją potem znaleźć. Misja to zlecenie na piśmie: wiadomo, co ma wrócić i kto to podpisuje.

## Przed startem (5 minut)

**Twoja aplikacja z lekcji 7 działa?** Uruchom ją (`npm run dev`, w Windows PowerShell `npm.cmd run dev`), zaloguj się swoim kontem i napisz „Cześć”. Jeśli dostajesz odpowiedź — przejdź do kroku 0. Logowanie przez Google nie jest dziś potrzebne; wystarczy e-mail i hasło.

**Nie działa albo jej nie masz?** Nie naprawiaj jej teraz. Weź gotowy projekt w stanie „po lekcji 7”:

1. Pobierz materiały kursu. W terminalu, w folderze na swoje projekty, wpisz:

   ```bash
   git clone https://github.com/SirIdontCare/laba-agenci-ai-s2.git
   ```

   Masz już ten folder z poprzednich zajęć? Wejdź do niego i wpisz `git pull`.
2. Skopiuj folder `starter_lekcja_08` w swoje miejsce na projekty i otwórz w nim terminal. To od teraz Twój projekt.
3. Wpisz `npm install` (Windows PowerShell: `npm.cmd install`).
4. Skopiuj do tego folderu swój plik `.env.local` z poprzedniego projektu. Nie masz go? Skopiuj `.env.example` jako `.env.local` i uzupełnij wartości. Od lekcji 7 w pliku są dwie dodatkowe linie: `NEXT_PUBLIC_SUPABASE_URL` i `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — skąd je wziąć, opisuje plik `README.md` w folderze projektu.
5. Otwórz swój projekt w Supabase → **SQL Editor**, wklej całą treść pliku `baza.sql` z folderu projektu i kliknij **Run**. Skrypt tworzy tylko to, czego brakuje.
6. W Supabase wejdź w **Authentication → Sign In / Providers → Email** i sprawdź, że przełącznik **Confirm email** jest wyłączony. Jeśli zmieniasz — kliknij **Save**.
7. Wpisz `npm run dev`, otwórz http://localhost:3000 i załóż konto e-mailem i hasłem.

### Krok 0 — jeden prompt na początek

Otwórz asystenta w folderze aplikacji i wklej to **raz**. Kolejne prompty wklejaj w tej samej rozmowie.

```text
Dziś dodajemy do tej aplikacji misje: zadania, które agent wykonuje od danych wejściowych
do gotowego wyniku. Zanim cokolwiek zmienisz:

1. Przeczytaj AGENTS.md i package.json. Sprawdź, gdzie w projekcie są: endpoint agenta,
   wyszukiwanie w internecie, wyszukiwanie w bazie wiedzy, przycisk „Analiza JSON”
   (wynik w ustalonych polach sprawdzany na serwerze) i sprawdzanie zalogowanej osoby.
2. Nie pisz kodu z pamięci. Sposób użycia funkcji sprawdzaj w node_modules/ai/docs/,
   node_modules/next/dist/docs/ oraz w plikach typów bibliotek.
3. Każda nowa strona jest tylko dla zalogowanych. Każdy nowy endpoint najpierw sprawdza
   zalogowaną osobę tak samo jak istniejące endpointy i bez niej zwraca 401,
   zanim wywoła model.
4. Agent niczego nie wysyła na zewnątrz: żadnych maili ani wiadomości. Wynik misji to
   zawsze tekst na ekranie do przeczytania przez człowieka.
5. Nie czytaj i nie wypisuj wartości z .env.local.
6. Rozmawiaj ze mną po polsku, prostym językiem. Po każdej zmianie uruchom build,
   napraw błędy i napisz w 3 punktach, co zrobiłeś i jak to sprawdzić w przeglądarce.

Na razie niczego nie zmieniaj. Napisz tylko, co znalazłeś w punkcie 1.
```

Asystent skończył, gdy wypisze pięć miejsc z punktu 1. Niczego jeszcze nie zmienia.

---

## Warsztat 1 — Triage pięciu wiadomości (20 min)

**Po co:** poranna skrzynka to dziesiątki maili. Triage odpowiada na trzy pytania: co to za sprawa, jak pilna i co odpisać. Agent przygotowuje, Ty zatwierdzasz.

**Gotowe, gdy:** każdy z pięciu maili ma kategorię, priorytet i szkic albo jawny błąd.

**Pięć maili na dziś.** Będziesz je wklejać dwa razy, więc skopiuj cały blok:

```text
Od: Marta Wilczek <marta.wilczek@example.com>
Temat: Cena warsztatów dla grupy
Dzień dobry, chciałabym zapisać 8 osób z mojego zespołu na warsztaty ceramiki w grudniu.
Ile to kosztuje i czy wystawiają Państwo fakturę na firmę?
---
Od: Tomasz Rybak <t.rybak@example.com>
Temat: Nie mogę się zalogować
Od wczoraj nie mogę wejść do panelu rezerwacji. Klikam „przypomnij hasło” i żaden mail
nie przychodzi. Zapisy na sobotni kurs kończą się jutro, a ja nie mogę się zapisać!
---
Od: Biuro Rachunkowe Abakus <biuro@abakus.example>
Temat: Płatność z 20 listopada
Dzień dobry, w imieniu klientki pytam, czy przelew za kurs z 20 listopada do Państwa dotarł.
Nie dostaliśmy potwierdzenia. Proszę o informację.
---
Od: Olek <olek1990@example.com>
Temat: pytanie
Dzień dobry, czy to jeszcze aktualne? Proszę o info.
---
Od: Irena Sowa <irena.sowa@example.com>
Temat: Reklamacja — pęknięty kubek
Kubek, który odebrałam po kursie, pękł przy pierwszym użyciu. Zapłaciłam 240 zł i oczekuję
zwrotu albo nowego kubka. Jeśli nie dostanę odpowiedzi do piątku, opiszę sprawę w opiniach.
```

**Eksperyment „przed” (2 minuty).** Zanim cokolwiek zbudujesz, otwórz zwykły czat swojej aplikacji i wklej:

```text
Posortuj te maile i napisz odpowiedzi.
```

a pod spodem pięć maili z bloku wyżej. Zrób zrzut ekranu odpowiedzi i sprawdź trzy rzeczy:

1. Czy od razu widać, który mail jest najpilniejszy?
2. Czy w odpowiedzi do biura rachunkowego agent potwierdził przelew, o którym nic nie wie?
3. Czy dałoby się skopiować jedną odpowiedź jednym kliknięciem?

Napisz na czacie kursu, co wyszło w punkcie 1: **tak** albo **nie**. Zrzut zostaw — porównasz go z wynikiem misji.

### 🟢 Minimum — strona /email-triage

Gotowy wynik: na stronie http://localhost:3000/email-triage wklejasz maile, klikasz „Posortuj” i dostajesz pięć kart. Każda karta ma nadawcę, temat, kategorię, priorytet, szkic odpowiedzi i przycisk „Kopiuj szkic”.

```text
Dodaj stronę /email-triage (tylko dla zalogowanych) i endpoint, który ją obsługuje.

- Na stronie jest duże pole tekstowe. Wklejam do niego kilka maili oddzielonych linią
  z samymi trzema myślnikami (---) i klikam „Posortuj”. Najwyżej 10 maili naraz.
- Podziel tekst na maile na serwerze. Każdy mail przetwarzaj osobnym wywołaniem modelu,
  z wynikiem w ustalonych polach sprawdzanym na serwerze — tak jak „Analiza JSON”
  w tej aplikacji. Pola wyniku:
  nadawca, temat,
  kategoria (dokładnie jedna z: oferta i ceny / problem techniczny / płatności / reklamacja / inne),
  priorytet (dokładnie jeden z: wysoki / średni / niski),
  jedno zdanie uzasadnienia priorytetu,
  szkic odpowiedzi po polsku (3–5 zdań, uprzejmy, z podpisem „Zespół obsługi”).
- Wyniki pokaż jako karty w tej samej kolejności co maile: nadawca i temat, kategoria,
  priorytet, uzasadnienie, szkic oraz przycisk „Kopiuj szkic”.
- Gdy jeden mail się nie uda, jego karta pokazuje czytelny komunikat błędu po polsku,
  a pozostałe karty mają normalne wyniki.
- Szkic nie może obiecywać ani potwierdzać rzeczy, których agent nie wie (wpłata, cena,
  termin, zwrot pieniędzy) — w takim miejscu pisze, że sprawa zostanie sprawdzona.
  Gdy mail jest niejasny, szkic dopytuje, o co chodzi.
- Nie dodawaj żadnego przycisku „Wyślij” i niczego nie wysyłaj.
- Podczas pracy pokaż napis „Agent sortuje…” i zablokuj przycisk.
- Dodaj link „Triage” w nawigacji aplikacji.
- Na końcu sam wyślij do nowego endpointu zapytanie bez ciasteczek na działającym serwerze
  i pokaż mi kod odpowiedzi (ma być 401).
```

**Gdy asystent pracuje:** wpisz na czat kursu numer maila (1–5), który Twoim zdaniem dostanie priorytet „wysoki”. Jeśli myślisz, że więcej niż jeden — wpisz wszystkie.

**Sprawdź:**

1. Zaloguj się i otwórz http://localhost:3000/email-triage.
2. Wklej pięć maili z bloku wyżej i kliknij „Posortuj”. Poczekaj — do pół minuty.
3. Widzisz **pięć kart** w kolejności: Marta Wilczek, Tomasz Rybak, Biuro Rachunkowe Abakus, Olek, Irena Sowa.
4. Kategorie powinny wyjść tak:

   | Mail | Kategoria |
   |---|---|
   | Marta Wilczek | oferta i ceny |
   | Tomasz Rybak | problem techniczny |
   | Biuro Rachunkowe Abakus | płatności |
   | Olek | inne |
   | Irena Sowa | reklamacja |

   Priorytety mogą się różnić między osobami — to ocena modelu. Porównaj je ze swoim typem z czatu.
5. Przeczytaj szkic do biura rachunkowego. **Nie potwierdza przelewu** — pisze, że sprawa zostanie sprawdzona.
6. Przeczytaj szkic do Olka. Dopytuje, o co chodzi, zamiast zgadywać.
7. Kliknij „Kopiuj szkic” przy jednej karcie i wklej tekst do notatnika (Ctrl+V). Na stronie nie ma przycisku „Wyślij”.
8. W podsumowaniu asystenta znajdź kod odpowiedzi dla zapytania bez logowania: ma być `401`.
9. Zostało kilka minut? Wklej trzy prawdziwe maile ze swojej skrzynki, które przyszły od firm, a nie od osób prywatnych — na przykład newsletter, ofertę handlową i powiadomienie z serwisu. Skopiuj nadawcę, temat i treść, oddziel maile linią `---` i kliknij „Posortuj”. Czy kategorie i priorytety są takie, jakie sam byś nadał?

**Minimum zrobione.** Połóż obok siebie zrzut z eksperymentu „przed” i pięć kart. Te same maile, ten sam model — różni je tylko to, że misja ma ustalone pola i zasady.

Jedna karta zamiast pięciu? Między mailami musi być linia z samymi trzema myślnikami `---`. Karta z komunikatem błędu to dopuszczalny wynik — kliknij „Posortuj” jeszcze raz.

### 🔵 Standard — odpowiedzi z bazy wiedzy i kolejność od najpilniejszego

Gotowy wynik: szkic, który podaje cenę albo zasadę, bierze ją z Twojej bazy wiedzy z lekcji 6 i pokazuje nazwę dokumentu. Gdy w bazie nie ma odpowiedzi, w szkicu jest widoczny znacznik zamiast zmyślonej kwoty.

```text
Dopracuj triage:
- Przy pytaniach o ceny, terminy i zasady przed napisaniem szkicu przeszukaj bazę wiedzy
  tej aplikacji (ta sama funkcja, z której korzysta narzędzie searchKnowledge).
  Gdy szkic korzysta ze znalezionego fragmentu, pokaż pod nim „📎 Źródło: [tytuł dokumentu]”.
- Gdy w bazie nie ma odpowiedzi, wstaw w szkicu widoczny znacznik
  [DO UZUPEŁNIENIA: czego brakuje] zamiast wymyślać cenę, termin albo zasadę.
- Karty ułóż od najwyższego priorytetu do najniższego; przy tym samym priorytecie
  zachowaj kolejność maili.
- Nad kartami pokaż podsumowanie: ile maili ma priorytet wysoki, średni i niski.
```

**Sprawdź:**

1. Posortuj pięć maili jeszcze raz. Karty są ułożone od priorytetu „wysoki”, a nad nimi jest podsumowanie z trzema liczbami.
2. W szkicu do Marty Wilczek (cena warsztatów ceramiki) jest znacznik `[DO UZUPEŁNIENIA: …]`. W Twojej bazie wiedzy nie ma cennika ceramiki, więc agent nie ma skąd wziąć kwoty. Szkic podaje cenę z Twojego „Cennika 2026”? To cena innej usługi. Napisz do asystenta: „Fragment z bazy wiedzy wolno wykorzystać tylko wtedy, gdy dotyczy tej samej usługi, o którą pyta mail”.
3. Masz w bazie dokument „Cennik 2026” z lekcji 6? Dopisz szósty mail i posortuj jeszcze raz:

   ```text
   ---
   Od: Jan Kruk <jan.kruk@example.com>
   Temat: Pakiet Start
   Dzień dobry, ile kosztuje pakiet Start i co zawiera?
   ```

   Szkic podaje cenę z dokumentu, a pod nim jest „📎 Źródło: Cennik 2026”.

### 🟣 Dla szybkich — poczta z Twojego tematu

Napisz pięć krótkich, wymyślonych maili, jakie mogłaby dostać **Twoja** firma albo Twój zespół. Jeden z nich napisz tak, żeby był trudny do zaklasyfikowania — na przykład reklamacja ukryta w uprzejmym pytaniu o cenę.

```text
Zmień kategorie triage na pasujące do mojego tematu: [wypisz 4–5 kategorii].
Dodaj do instrukcji zasady priorytetu: wysoki, gdy [kiedy]; niski, gdy [kiedy].
Szkice pisz w stylu mojego chatbota i korzystaj z mojej bazy wiedzy.
```

**Sprawdź:** zanim klikniesz „Posortuj”, zapisz na kartce kategorię i priorytet każdego z pięciu maili tak, jak sam byś je ocenił. Ile z pięciu agent ocenił tak samo? Wynik (np. „4 z 5”) wpisz na czat kursu razem z mailem, przy którym się nie zgodziliście.

**A prawdziwa skrzynka?** Da się ją podłączyć, ale to osobny temat: agent musi dostać od Google albo Microsoftu zgodę na czytanie Twojej poczty, a w skrzynce są cudze dane osobowe. Dziś pracujesz na wklejonych, wymyślonych mailach — najpierw sprawdzasz, czy możesz ufać wynikowi, dopiero potem dajesz agentowi dostęp. Jeśli programujesz i chcesz to zrobić po kursie, zacznij od modułu [Integracje — OAuth i MCP](https://github.com/SirIdontCare/grupa-zaawansowana-s2/blob/main/T1_INTEGRACJE.md) w grupie zaawansowanej.

---

## Warsztat 2 — Raport oraz porównanie trzech firm (30 min)

**Po co:** zebranie informacji z kilku stron i ułożenie ich w raport albo tabelę zajmuje człowiekowi godzinę. Agent zrobi pierwszą wersję w minutę — pod warunkiem, że pokaże źródła i przyzna się do braków.

**Gotowe, gdy:** działają oba scenariusze: raport i tabela trzech firm z rekomendacją.

Minimum ma dwa kroki: najpierw raport, potem porównanie. Każdy krok to jeden prompt i jedno sprawdzenie.

### 🟢 Minimum, krok A — misja „Raport”

Gotowy wynik: na stronie http://localhost:3000/misje wybierasz misję „Raport”, wpisujesz temat i po chwili widzisz raport z czterema sekcjami. Ostatnia sekcja to klikalne linki do stron, z których agent skorzystał.

```text
Dodaj stronę /misje (tylko dla zalogowanych) i endpoint, który ją obsługuje.
Strona pokazuje listę misji do wyboru — na razie jedną. Zbuduj ją tak, żeby kolejne misje
dało się dodawać w jednym miejscu (nazwa, opis, pola formularza, instrukcja dla modelu).

Misja „Raport”:
- Wpisuję temat (jedno pole, najwyżej 200 znaków) i klikam „Uruchom misję”.
- Agent szuka informacji wyszukiwaniem w internecie, które już jest w tej aplikacji
  (webSearchTool w lib/model.ts), i pisze raport po polsku z sekcjami w tej kolejności:
  Podsumowanie (3 zdania), Najważniejsze informacje (4–6 punktów), Wnioski (2–3 punkty), Źródła.
- Sekcja Źródła to klikalne linki do stron, które naprawdę wróciły z wyszukiwania —
  nie adresy wymyślone przez model. Gdy wyszukiwanie nic nie zwróciło, raport mówi to wprost.
- Podczas pracy pokaż napis „Agent pracuje…” i zablokuj przycisk. Misja może trwać
  do minuty. Ogranicz liczbę kroków agenta tak jak w czacie.
- Gdy misja się nie uda, pokaż czytelny komunikat po polsku i odblokuj przycisk.
- Niczego nie zapisuj w bazie i niczego nie wysyłaj.
- Dodaj link „Misje” w nawigacji aplikacji.
```

**Gdy asystent pracuje:** wpisz na czat kursu liczbę — ile źródeł będzie miał Twój raport?

**Sprawdź:**

1. Otwórz http://localhost:3000/misje. Na liście jest misja „Raport”.
2. Wpisz temat i kliknij „Uruchom misję”:

   ```text
   Jak małe firmy w Polsce używają agentów AI do obsługi klienta
   ```

3. Przez chwilę widzisz napis „Agent pracuje…”, a przycisk jest zablokowany.
4. Raport ma cztery sekcje w kolejności: Podsumowanie, Najważniejsze informacje, Wnioski, Źródła.
5. Kliknij jeden link w sekcji Źródła. Otwiera się prawdziwa strona na temat raportu.
6. Policz źródła i porównaj ze swoim typem z czatu.

Raport bez źródeł albo błąd wyszukiwania? Wpisz w zwykłym czacie: „Znajdź w internecie jedną wiadomość z tego tygodnia o sztucznej inteligencji i podaj źródło”. Jeśli pod odpowiedzią czatu też nie ma linków, zgłoś to prowadzącemu — to sprawa modelu, nie Twojego kodu.

### 🟢 Minimum, krok B — misja „Porównanie trzech firm”

Gotowy wynik: na tej samej stronie wybierasz drugą misję, wpisujesz trzy nazwy i kryteria, a agent pokazuje tabelę — firmy w kolumnach, kryteria w wierszach — z rekomendacją i źródłami pod spodem.

```text
Dodaj na stronie /misje drugą misję: „Porównanie trzech firm”.

- Formularz: trzy pola na nazwy firm lub produktów oraz pole „Kryteria” (po przecinku,
  od 2 do 5 kryteriów). Przycisk „Uruchom misję”.
- Agent szuka w internecie informacji o każdej firmie i pokazuje tabelę: firmy w kolumnach,
  kryteria w wierszach. Każda firma jest oceniana według tych samych kryteriów.
- Gdy agent nie znalazł informacji, w komórce pisze „brak danych” — nie zgaduje
  i nie wpisuje zera.
- Pod tabelą: rekomendacja z jednym zdaniem uzasadnienia oraz źródła jako klikalne linki
  do stron, które naprawdę wróciły z wyszukiwania.
- Tabelę zbuduj z wyniku w ustalonych polach sprawdzanego na serwerze, nie z tekstu
  pisanego przez model. Uwaga: jeśli wyszukiwanie i wynik w ustalonych polach nie działają
  w jednym wywołaniu modelu, zrób to w dwóch krokach — najpierw zebranie informacji
  ze źródłami, potem ułożenie ich w pola.
- Napis „Agent pracuje…”, blokada przycisku i komunikat błędu — tak jak w misji „Raport”.
```

**Gdy asystent pracuje:** wpisz na czat kursu, którą aplikację do nauki języków poleci agent: Duolingo, Babbel czy Busuu.

**Sprawdź:**

1. Na stronie http://localhost:3000/misje są dwie misje. Wybierz „Porównanie trzech firm”.
2. Wpisz firmy `Duolingo`, `Babbel`, `Busuu` oraz kryteria:

   ```text
   cena miesięczna w Polsce, liczba języków, czy jest wersja darmowa
   ```

3. Kliknij „Uruchom misję” i poczekaj — do minuty.
4. Widzisz tabelę: **trzy kolumny** z nazwami firm i **trzy wiersze** z kryteriami. W każdej komórce jest wartość albo napis „brak danych” — to też dobry wynik.
5. Pod tabelą jest rekomendacja z uzasadnieniem i lista linków.
6. Porównaj rekomendację ze swoim typem i z wynikami innych osób na czacie.
7. Zostało kilka minut? Uruchom porównanie jeszcze raz na trzech firmach albo produktach ze swojej branży i z własnymi kryteriami.

**Minimum zrobione.** Jeśli różne osoby dostały różne rekomendacje — to normalne i zaraz o tym porozmawiamy: agent trafił na inne strony albo inaczej zważył kryteria.

### 🔵 Standard — fakty osobno, wnioski osobno, bez zgadywania

Gotowy wynik: raport oddziela fakty (z numerem źródła) od wniosków i ma sekcję o tym, czego nie udało się ustalić. Rekomendacja podaje warunek, a przy zbyt wielu brakach agent jej nie daje.

```text
Dopracuj obie misje:
- Raport: sekcję „Najważniejsze informacje” zamień na „Fakty” — każdy fakt kończy się
  numerem źródła w nawiasie kwadratowym, np. [2], a źródła są ponumerowane.
  Dodaj sekcję „Czego nie udało się ustalić”. W sekcji „Wnioski” są tylko interpretacje.
- Rekomendacja wynika z tabeli i podaje warunek: „najlepszy wybór, jeśli zależy Ci na…”.
  Gdy w tabeli jest za dużo „brak danych”, agent pisze, że nie ma podstaw do rekomendacji.
- Pod każdym wynikiem pokaż datę i godzinę wykonania misji.
```

**Sprawdź:**

1. Uruchom raport na tym samym temacie. Każdy punkt w sekcji „Fakty” ma numer źródła, a numer zgadza się z listą na dole.
2. Uruchom porównanie z kryterium, którego raczej nie ma w internecie:

   ```text
   cena miesięczna w Polsce, liczba języków, liczba pracowników biura w Krakowie
   ```

3. W ostatnim wierszu jest „brak danych” — a nie wymyślona liczba. Rekomendacja ma warunek „jeśli zależy Ci na…”.
4. Pod wynikiem widać datę i godzinę.

### 🟣 Dla szybkich — czy agent zmienia zdanie?

```text
Dodaj do misji „Porównanie” pole „Dla kogo wybieramy” (np. „dla trzyosobowego biura
z małym budżetem”). Rekomendacja ma brać ten opis pod uwagę i powołać się na niego
w uzasadnieniu. Dodaj przy obu wynikach przycisk „Kopiuj jako tekst”.
```

**Sprawdź** — to jest eksperyment, zapisz wyniki:

1. Uruchom to samo porównanie **dwa razy** bez żadnej zmiany. Czy rekomendacja jest ta sama? Czy ceny w tabeli są te same?
2. Zmień opis „dla kogo” na przeciwny (np. z „mały budżet” na „cena nie gra roli”) i uruchom trzeci raz. Czy rekomendacja się zmieniła albo wyjaśnia, dlaczego zostaje?
3. Napisz na czacie kursu jedno zdanie: czy zaufałbyś tej tabeli bez klikania w źródła — i dlaczego.

---

## Warsztat 3 — Twój własny scenariusz (25 min)

**Po co:** trzy gotowe misje to wzór. Najwięcej zyskasz na tej, którą wymyślisz dla siebie — do pracy albo do życia.

**Gotowe, gdy:** własna misja działa od wejścia do sprawdzonego rezultatu.

### Najpierw kontrakt (5 minut)

Wybierz coś **małego**: jeden typ zadania, dane, które masz pod ręką, wynik, który da się przeczytać w minutę. Kilka pomysłów:

| Misja | Wejście | Wynik |
|---|---|---|
| Notatka ze spotkania | wklejone luźne notatki | ustalenia, zadania z osobami, pytania otwarte |
| Odpowiedź na opinię klienta | treść opinii | ocena tonu i szkic uprzejmej odpowiedzi |
| Plan tygodnia | lista spraw do załatwienia | plan na 5 dni z priorytetami |
| Ogłoszenie o pracę | opis stanowiska w punktach | gotowe ogłoszenie i 5 pytań na rozmowę |
| Porównanie ofert | trzy wklejone oferty | tabela i rekomendacja |

Wypełnij pięć linijek. To Twój **kontrakt misji**:

```text
Cel: [jaki problem rozwiązuje misja, jednym zdaniem]
Wejście: [co wklejam albo wpisuję]
Narzędzia: [z czego agent może skorzystać: internet, baza wiedzy, nic]
Wynik: [w jakiej formie: lista, tabela, szkic, sekcje]
Kontrola: [co sprawdzam sam, zanim użyję wyniku]
```

Dziś agent ma trzy źródła: internet, Twoją bazę wiedzy i to, co wkleisz. Dane z kalendarza, arkusza albo CRM wklej jako tekst — misja zadziała tak samo.

**Nie masz pomysłu?** Weź gotowy kontrakt i gotowe dane do testu — to nadal Twoja misja, a w pracy domowej podmienisz dane na własne.

```text
Cel: zamienić luźne notatki ze spotkania w listę ustaleń i zadań.
Wejście: wklejone notatki, od kilku do kilkudziesięciu linii.
Narzędzia: nic — agent pracuje tylko na wklejonym tekście.
Wynik: trzy sekcje: Ustalenia, Zadania (kto, co, do kiedy), Pytania otwarte.
Kontrola: sprawdzam, czy każde zadanie ma osobę i termin albo dopisek „brak terminu”.
```

Notatki do testu:

```text
spotkanie pon, byli: Kasia, Marek, Ola
- strona www: Marek mówi że nowa wersja gotowa na 80%, brakuje zdjęć
- zdjęcia ma zrobić Ola, do piątku
- budżet na reklamę: Kasia chce 3000 zł, Marek że za dużo, nie ustalono
- newsletter rusza od grudnia, pierwszy numer pisze Kasia
- kto odpowiada klientom na Instagramie??? nikt nie wie
- następne spotkanie za 2 tyg
```

### 🟢 Minimum — trzecia misja na stronie /misje

Gotowy wynik: na stronie http://localhost:3000/misje jest trzecia misja z nazwą i opisem. Wklejasz dane, klikasz „Uruchom misję” i dostajesz wynik w formie, którą zapisałeś w kontrakcie.

```text
Dodaj na stronie /misje trzecią misję według mojego kontraktu:

[wklej tutaj swoje pięć linijek]

Zbuduj ją tak samo jak dwie poprzednie: pole na dane wejściowe, przycisk „Uruchom misję”,
napis „Agent pracuje…”, wynik na ekranie w formie opisanej w linijce „Wynik”.
Agent korzysta tylko z narzędzi wymienionych w linijce „Narzędzia” i niczego nie wysyła.
Nadaj misji krótką nazwę i jednozdaniowy opis widoczny na stronie.
Na końcu powiedz mi, w którym pliku jest instrukcja (prompt) tej misji.
```

Nie masz strony `/misje`, bo nie skończyłeś warsztatu 2? Zamień pierwsze zdanie promptu na: „Dodaj stronę /misje (tylko dla zalogowanych) z jedną misją według mojego kontraktu:”.

**Gdy asystent pracuje:** napisz na czacie kursu jedno zdanie: „Moja misja: … Ręcznie zajmuje mi to około … minut”.

**Sprawdź:**

1. Na stronie http://localhost:3000/misje jest Twoja misja z nazwą i opisem.
2. Wklej jeden normalny przykład danych (albo notatki do testu z ramki wyżej) i kliknij „Uruchom misję”.
3. Wynik ma formę z linijki „Wynik” Twojego kontraktu. Dla gotowego kontraktu: trzy sekcje — Ustalenia, Zadania, Pytania otwarte.
4. Zrób to, co zapisałeś w linijce „Kontrola”. Dla gotowego kontraktu: zadanie „zdjęcia — Ola — do piątku” ma osobę i termin, a „pierwszy numer newslettera — Kasia” ma dopisek „brak terminu” albo termin „grudzień”. Budżet na reklamę jest w pytaniach otwartych, nie w ustaleniach.
5. Asystent podał nazwę pliku z instrukcją misji. Otwórz go i przeczytaj — to zwykły tekst, który możesz poprawiać sam.

**Minimum zrobione.** Zrób zrzut ekranu wyniku — to zrzut na koniec zajęć.

### 🔵 Standard — kontrakt na ekranie i test braku danych

Gotowy wynik: pod nazwą misji da się rozwinąć jej kontrakt. Gdy wkleisz za mało danych, agent prosi o uzupełnienie zamiast zmyślać.

```text
Dopracuj moją misję:
- Pod nazwą misji pokaż rozwijany opis: cel, dostępne narzędzia, format wyniku
  i co człowiek ma sprawdzić przed użyciem wyniku.
- Gdy dane wejściowe są puste, za krótkie albo nie na temat, agent nie zgaduje:
  pisze, czego brakuje, i prosi o uzupełnienie.
- Gdy agent nie ma jakiejś informacji, zaznacza to w wyniku słowami „brak danych”.
```

**Sprawdź** dwa razy:

1. Z pełnymi danymi — wynik jak wcześniej, a pod nazwą misji rozwija się kontrakt.
2. Z samym zdaniem `zrób to` zamiast danych — dostajesz prośbę o uzupełnienie, a nie zmyślony wynik.

### 🟣 Dla szybkich — misja, do której wracasz

Gotowy wynik: pod misją jest lista pięciu ostatnich wykonań z datą. Kliknięcie otwiera zapisany wynik. Drugie konto nie widzi Twoich wyników.

**Część A — tabela w Supabase.** Otwórz **SQL Editor**, wklej cały kod i kliknij **Run**:

```sql
-- Zapisane wykonania misji. Każdy wiersz ma właściciela: zalogowaną osobę.
create table if not exists public.mission_runs (
  id bigint generated by default as identity primary key,
  created_at timestamptz not null default now(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  mission text not null,
  input text,
  result text
);

alter table public.mission_runs enable row level security;

drop policy if exists "tylko wlasne wyniki misji" on public.mission_runs;
create policy "tylko wlasne wyniki misji" on public.mission_runs
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on table public.mission_runs to authenticated;
```

To ten sam wzór co w lekcji 7: kolumna `user_id`, którą baza wypełnia sama, i jedna polityka „tylko własne wiersze”.

**Część B — prompt:**

```text
Zapisuj wyniki mojej misji w tabeli mission_runs (kolumny: mission, input, result;
user_id baza wypełnia sama). Tabela już istnieje i ma RLS — korzystaj z klienta Supabase
zalogowanej osoby, tak jak przy rozmowach, nie z klucza secret.
Pod misją pokaż listę pięciu ostatnich wykonań z datą. Kliknięcie otwiera zapisany wynik.
```

**Sprawdź:**

1. Wykonaj misję dwa razy na różnych danych. Odśwież stronę (F5) — pod misją są dwa wykonania.
2. Kliknij starsze — otwiera się zapisany wynik.
3. W oknie incognito zaloguj się drugim kontem i wejdź na `/misje`. Lista wykonań jest pusta.
4. W Supabase otwórz **Table Editor → mission_runs**. Są dwa wiersze, oba z Twoim `user_id`.

---

## Pokaż, co zrobiłeś

Wrzuć na czat kursu **jeden zrzut ekranu**: wynik Twojej własnej misji. Jeśli nie zdążyłeś z warsztatem 3 — karty z triage, raport albo tabelę trzech firm. Dopisz jedno zdanie: który poziom zrobiłeś w każdym warsztacie.

Jeśli chcesz, opublikuj zmiany na Vercel tak jak w poprzednich lekcjach i dodaj link.

## Praca domowa (14 pkt)

**Zbuduj własny scenariusz, który przyda Ci się w pracy albo w życiu. Przetestuj na prawdziwych danych (bez danych wrażliwych i cudzych danych osobowych). 3 zrzuty i opis: co robi i ile czasu oszczędza.**

Możesz rozwinąć misję z warsztatu 3 albo zbudować nową. „Prawdziwe dane” to na przykład Twoje własne notatki, publiczna oferta, Twój plan tygodnia. Imiona, adresy i numery innych osób usuń albo zamień na wymyślone.

| Kryterium | Punkty |
|---|---|
| Własny scenariusz działa od wejścia do wyniku | 5 |
| Test na prawdziwych danych | 3 |
| Trzy zrzuty | 3 |
| Opis i szacunek oszczędzonego czasu | 3 |

Trzy zrzuty to: dane wejściowe, wynik misji i jedno miejsce, które po kontroli poprawiłeś albo uznałeś za dobre.

Oszczędność policz uczciwie, razem z czasem na sprawdzenie wyniku. Przykład: ręcznie 18 minut; z agentem 3 minuty przygotowania + 2 minuty pracy agenta + 5 minut kontroli + 2 minuty poprawek = 12 minut. Oszczędzasz 6 minut na jednym zadaniu.

Forma oddania: zrzuty ekranu albo link na czacie kursu.

Prompt na start:

```text
Chcę zbudować własną misję, która przyda mi się w pracy albo w życiu.
Zadaj mi po kolei pięć pytań: o cel, dane wejściowe, narzędzia, formę wyniku i o to,
co sprawdzam sam. Potem zaproponuj najmniejszą wersję, którą da się zbudować w godzinę,
i poczekaj na moją zgodę.
```

**Przed lekcją 9:** sprawdź, czy logujesz się do Vercel i czy Twoja aplikacja jest tam opublikowana. We wtorek ustawiamy na niej harmonogram.

## Gdy coś nie działa

| Co widzisz | Co zrobić |
|---|---|
| Triage zwraca jedną kartę zamiast pięciu | Między mailami musi być linia z samymi trzema myślnikami `---`, bez spacji. |
| Jedna karta pokazuje błąd | To dopuszczalny wynik. Kliknij „Posortuj” ponownie; jeśli błąd wraca przy tym samym mailu, skopiuj go do asystenta. |
| Wszystkie karty pokazują błąd | Sprawdź, czy zwykły czat odpowiada na „Cześć”. Jeśli nie — problem jest w modelu albo kluczu, nie w triage. |
| Kategoria spoza listy (np. „zapytanie”) | Napisz do asystenta: „Kategoria ma być dokładnie jedną z pięciu z promptu — wymuś to w schemacie wyniku”. |
| Raport nie ma źródeł albo agent nie szuka w internecie | Wpisz w zwykłym czacie: „Znajdź w internecie jedną wiadomość z tego tygodnia o sztucznej inteligencji i podaj źródło”. Jeśli pod odpowiedzią też nie ma linków — zgłoś prowadzącemu. |
| Linki w źródłach prowadzą donikąd | Napisz do asystenta: „Źródła mają pochodzić wyłącznie z wyników wyszukiwania, nie z tekstu modelu”. |
| Misja kręci się ponad minutę i kończy błędem | Napisz do asystenta: „Zmniejsz liczbę kroków w misji i pokaż czytelny komunikat po przekroczeniu czasu”. |
| W tabeli są ceny, których nie ma na stronach źródłowych | Napisz do asystenta: „Wartości w tabeli mają pochodzić tylko ze znalezionych stron. Gdy ich tam nie ma, wpisz »brak danych«”. |
| Tabela ma firmy w wierszach zamiast w kolumnach | Napisz do asystenta: „Firmy w kolumnach, kryteria w wierszach”. |
| Strona /misje albo /email-triage przenosi do logowania | Tak ma być. Zaloguj się i wejdź ponownie. |
| Poziom 🟣 w warsztacie 3: `permission denied for table mission_runs` | Skrypt SQL nie wykonał się do końca. Wklej go jeszcze raz w SQL Editor i kliknij **Run**. |
| Po zmianach nic nie działa | Napisz do asystenta: „Cofnij ostatnią zmianę i wróć do działającej wersji”. W ostateczności weź `starter_lekcja_08`. |
