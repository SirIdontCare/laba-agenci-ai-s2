# Lekcja 6 — Agent zna Twoją firmę: baza wiedzy (RAG)

Twój agent pamięta już rozmowy. Dziś dostaje **bazę wiedzy**: wklejasz dokument (np. cennik), a agent odpowiada na jego podstawie i podaje źródło. Gdy czegoś w dokumentach nie ma — mówi to wprost, zamiast zgadywać.

Ta metoda nazywa się RAG: **wyszukaj** pasujący fragment → **dołącz** go do pytania → **odpowiedz** z faktów.

**Na koniec zajęć wrzucasz na czat kursu jeden zrzut ekranu:** odpowiedź agenta z dopiskiem „📎 Źródło: …”.

## Jak pracujemy

Każdy warsztat ma trzy poziomy. **Poziom wybierasz sam i możesz go zmieniać między warsztatami.**

| Poziom | Dla kogo | Co to znaczy |
|---|---|---|
| 🟢 **Minimum** | dla każdego | To wystarczy, żeby zaliczyć warsztat i iść dalej. |
| 🔵 **Standard** | gdy minimum działa i zostało kilka minut | Ta sama funkcja, tylko dopracowana. |
| 🟣 **Dla szybkich** | gdy standard działa | To samo na Twoim własnym temacie. |

Zasady:

- Zrobione minimum = warsztat zaliczony. Nikt nie zostaje w tyle, jeśli ma minimum.
- Prompty są gotowe — kopiujesz je do asystenta (Codex albo Claude Code) i czekasz na wynik. Poziom Minimum w warsztacie 2 ma dwa krótkie prompty, żeby po każdym dało się sprawdzić wynik.
- Coś nie działa dłużej niż 3 minuty? Znajdź błąd (tabela niżej), skopiuj go do asystenta i napisz: „Napraw ten błąd”. Jeśli dalej nie działa — podnieś rękę.
- Kluczy i haseł **nigdy** nie wklejasz do czatu z asystentem ani do kodu. Trafiają tylko do pliku `.env.local` i do ustawień Vercel.

**Gdzie szukać błędu**

| Gdzie | Jak wygląda | Co skopiować |
|---|---|---|
| na stronie aplikacji | czerwony komunikat w formularzu albo w czacie | cały komunikat |
| w terminalu, w którym działa `npm run dev` | czerwone linie, często ze słowem `Error` | ostatnie 10–20 linii |
| w oknie asystenta | asystent sam pisze, że build się nie udał | nic — napisz tylko „Napraw to i uruchom build ponownie” |
| w Supabase, SQL Editor | komunikat pod polem z kodem | cały komunikat |

Zaznacz tekst myszą, skopiuj (Ctrl+C) i wklej do asystenta razem ze zdaniem: „Napraw ten błąd”. Jeśli w skopiowanym tekście widzisz coś, co wygląda jak klucz (`sb_secret_…`, `sk-or-…`) — usuń ten kawałek przed wklejeniem.

## Słowa, które dziś padną

| Słowo | Co to jest | W segregatorze firmy |
|---|---|---|
| **Baza wiedzy** | dokumenty, z których agent ma odpowiadać | cały segregator |
| **Fragment** (ang. *chunk*) | kawałek dokumentu, zwykle jeden akapit | jedna kartka |
| **Embedding** | zapis **znaczenia** tekstu jako długa lista liczb | etykieta z tematem kartki; kartki o podobnym temacie mają podobne etykiety |
| **pgvector** | dodatek do bazy, który przechowuje takie listy liczb i szuka najbliższych | szafa, która podaje kartki o najbliższym temacie |
| **RAG** | wyszukaj fragment → dołącz do pytania → odpowiedz | zanim odpowiesz, wyjmij z segregatora właściwe kartki |

## Przed startem (5 minut)

**Twoja aplikacja z lekcji 5 działa?** Uruchom ją (`npm run dev`, w Windows PowerShell `npm.cmd run dev`), zaloguj się hasłem, napisz „Cześć” i naciśnij F5. Jeśli rozmowa została na ekranie — przejdź do kroku 0.

**Nie działa albo jej nie masz?** Nie naprawiaj jej teraz. Weź gotowy projekt w stanie „po lekcji 5”:

1. Pobierz materiały kursu. W terminalu, w folderze na swoje projekty, wpisz:

   ```bash
   git clone https://github.com/SirIdontCare/laba-agenci-ai-s2.git
   ```

   Masz już ten folder z poprzednich zajęć? Wejdź do niego i wpisz `git pull`.
2. Skopiuj folder `starter_lekcja_06` w swoje miejsce na projekty i otwórz w nim terminal. To od teraz Twój projekt.
3. Wpisz `npm install` (Windows PowerShell: `npm.cmd install`).
4. Skopiuj do tego folderu swój plik `.env.local` z poprzedniego projektu. Nie masz go? Skopiuj `.env.example` jako `.env.local` i uzupełnij wartości.
5. Gotowy projekt potrzebuje tabel z lekcji 5. Otwórz swój projekt w Supabase → **SQL Editor**, wklej całą treść pliku `baza.sql` z folderu projektu i kliknij **Run**. Nie masz jeszcze projektu Supabase? Załóż go według części A i C warsztatu 1 lekcji 5.
6. Wpisz `npm run dev` i otwórz http://localhost:3000.

### Krok 0 — model embeddingów i prompt na początek

Do rozmowy używasz jednego modelu. Do zamiany tekstu na embedding służy **drugi, osobny model** — dużo mniejszy i tańszy. Dziś dopisujesz jego nazwę do ustawień.

1. Otwórz plik `.env.local` (obok `package.json`) i dopisz na końcu jedną linię:

   ```dotenv
   OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-small
   ```

   Jeśli prowadzący poda inną nazwę modelu — wpisz tę od prowadzącego.
2. Zapisz plik. W terminalu zatrzymaj serwer (Ctrl+C) i uruchom go ponownie — nowe zmienne wczytują się dopiero przy starcie.
3. Otwórz asystenta w folderze aplikacji i wklej poniższy prompt **raz**. Kolejne prompty wklejaj w tej samej rozmowie.

```text
Dziś dodajemy do tej aplikacji bazę wiedzy (RAG) na Supabase pgvector. Zanim cokolwiek zmienisz:

1. Przeczytaj AGENTS.md i package.json. Sprawdź wersje: next, ai, @openrouter/ai-sdk-provider,
   @supabase/supabase-js.
2. Nie pisz kodu z pamięci. Embeddingi w AI SDK sprawdź w
   node_modules/ai/docs/03-ai-sdk-core/30-embeddings.mdx (embed, embedMany), a model embeddingów
   w plikach typów @openrouter/ai-sdk-provider (textEmbeddingModel).
3. Nazwa modelu embeddingów jest w zmiennej OPENROUTER_EMBEDDING_MODEL. Dodaj ją w lib/model.ts
   obok modelu rozmowy. Ten sam model służy do zapisu dokumentów i do pytań.
4. Z bazą łączy się wyłącznie serwer (lib/supabase.ts). Każdy endpoint najpierw sprawdza sesję
   i bez niej zwraca 401 — zanim dotknie bazy albo modelu.
5. Nie czytaj i nie wypisuj wartości z .env.local.
6. Rozmawiaj ze mną po polsku, prostym językiem. Po każdej zmianie uruchom build,
   napraw błędy i napisz w 3 punktach, co zrobiłeś i jak to sprawdzić w przeglądarce.

Na razie niczego nie zmieniaj. Napisz tylko, w których plikach są: połączenie z bazą,
endpoint rozmowy z narzędziami i instrukcja agenta.
```

---

## Warsztat 1 — Włącz pgvector i przygotuj bazę (20 min)

**Po co:** zwykła baza szuka identycznych słów. Dodatek pgvector pozwala jej szukać po **znaczeniu**: na pytanie „ile zapłacę za najtańszy plan” znajdzie akapit o „cenie pakietu Start”, choć nie mają wspólnych słów.

**Gotowe, gdy:** pgvector jest włączony, tabela na fragmenty istnieje.

Panel Supabase jest po angielsku i co jakiś czas zmienia wygląd. Jeśli przycisk nazywa się u Ciebie trochę inaczej niż tutaj, szukaj najbliższego odpowiednika albo użyj promptu ratunkowego z końca poziomu Minimum.

### 🟢 Minimum — jedno pytanie, jedno kliknięcie i jedno zapytanie SQL

**Najpierw eksperyment „przed” (2 minuty)**

Zanim cokolwiek zbudujesz, zadaj swojemu agentowi to pytanie i **zrób zrzut ekranu odpowiedzi**:

```text
Ile kosztuje pakiet Start w firmie Kwantowy Borsuk?
```

Kwantowy Borsuk to firma wymyślona na potrzeby tych zajęć — nie ma jej w internecie, więc agent nie może znać jej cennika. Zobacz, co zrobi: przyzna, że nie wie, poszuka w sieci, a może poda kwotę „z głowy”? Wpisz jego odpowiedź na czat kursu.

To samo pytanie zadasz na końcu warsztatu 3. Różnica między dwoma zrzutami to cała dzisiejsza lekcja.

**Część A — włącz dodatek `vector`**

1. Wejdź na https://supabase.com/dashboard i otwórz swój projekt z lekcji 5 (`agent-kurs`). **Nie zakładaj nowego** — baza wiedzy trafia do tej samej bazy co rozmowy.
2. W menu po lewej kliknij **Database** (ikona bazy danych).
3. W bocznej liście, która się pojawi, kliknij **Extensions**.
4. W polu wyszukiwania wpisz `vector`.
5. Przy pozycji **vector** włącz przełącznik. Jeśli pojawi się okienko z pytaniem o schemat, zostaw `extensions` i potwierdź.
6. Poczekaj kilka sekund. Przełącznik zostaje włączony (zielony) — dodatek działa.

**Część B — utwórz tabele i funkcję wyszukiwania**

7. W menu po lewej otwórz **SQL Editor** (ikona terminala).
8. W dużym pustym polu wklej **cały** poniższy kod.
9. Kliknij **Run** (albo Ctrl+Enter). Pod spodem powinien pojawić się komunikat o powodzeniu (*Success. No rows returned*).

```sql
create table documents (
  id bigint generated always as identity primary key,
  title text not null,
  created_at timestamptz not null default now()
);

create table chunks (
  id bigint generated always as identity primary key,
  document_id bigint not null references documents (id) on delete cascade,
  chunk_index int not null,
  content text not null,
  embedding extensions.vector(1536)
);

alter table documents enable row level security;
alter table chunks enable row level security;
grant all on table documents, chunks to service_role;

create or replace function match_chunks (
  query_embedding extensions.vector(1536),
  match_count int default 3
)
returns table (id bigint, document_id bigint, title text, content text, similarity float)
language sql stable
set search_path = public, extensions
as $$
  select c.id, c.document_id, d.title, c.content,
         1 - (c.embedding <=> query_embedding) as similarity
  from chunks c
  join documents d on d.id = c.document_id
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

grant execute on function match_chunks to service_role;
```

Nie musisz rozumieć każdej linii. Wystarczy wiedzieć, co powstało:

| Co | Do czego służy | Co już znasz z lekcji 5 |
|---|---|---|
| tabela `documents` | lista dokumentów: tytuł i data dodania | zwykła tabela, jak `conversations` |
| tabela `chunks` | fragmenty tekstu; każdy ma numer dokumentu, kolejność, treść i embedding | relacja `document_id` → `documents.id` z **Cascade**, tak jak wiadomości i rozmowy |
| kolumna `embedding` typu `vector(1536)` | lista 1536 liczb opisująca znaczenie fragmentu | nowy typ kolumny — dał go dodatek `vector` |
| `enable row level security` | tabele nie są publiczne | to samo zaznaczenie co w Table Editor |
| `grant … to service_role` | serwer Twojej aplikacji (klucz secret) ma dostęp | — |
| funkcja `match_chunks` | dostaje embedding pytania i zwraca 3 najbliższe znaczeniem fragmenty wraz z tytułem dokumentu — nie całą bazę | — |

Liczba `1536` to długość embeddingu naszego modelu. Jeśli prowadzący poda inną — zmień ją w **obu** miejscach przed kliknięciem **Run**.

**Część C — sprawdź, co powstało**

10. Otwórz **Table Editor**. Na liście są dwie nowe tabele: `documents` i `chunks`. Obie puste.
11. Kliknij `chunks` i znajdź kolumnę `embedding` — to do niej trafią listy liczb.
12. Wróć do **SQL Editor**, wyczyść pole, wklej poniższą linię i kliknij **Run**. Wynik `0` oznacza, że tabela działa i czeka na dane.

```sql
select count(*) from chunks;
```

Zgubiłeś się albo widzisz błąd? Wklej asystentowi:

```text
Włączam pgvector w Supabase Dashboard (Database → Extensions → vector) i uruchamiam w SQL Editor
skrypt tworzący tabele documents i chunks oraz funkcję match_chunks. Prowadź mnie krok po kroku,
jedno kliknięcie naraz. Jeśli wkleję komunikat błędu z SQL Editor, wyjaśnij go prostym językiem
i podaj poprawiony fragment do ponownego wklejenia. Nie wyłączaj RLS.
```

**Sprawdź:** w **Table Editor** widzisz tabele `documents` i `chunks`, a zapytanie z kroku 12 zwraca `0`. **Minimum zrobione.**

### 🔵 Standard — potwierdź długość embeddingu i dostęp

Skąd wiadomo, że model naprawdę zwraca 1536 liczb? Sprawdź to, zamiast wierzyć na słowo. Jeśli liczby się nie zgadzają, zapis w warsztacie 2 skończy się błędem.

```text
Sprawdź, czy baza wiedzy jest dobrze przygotowana:
- Wywołaj raz model embeddingów (zmienna OPENROUTER_EMBEDDING_MODEL) dla zdania „test”
  i podaj mi nazwę modelu oraz długość zwróconej listy liczb. Zrób to jednorazowym skryptem
  albo tymczasowym endpointem ze sprawdzeniem sesji, który potem usuniesz.
- Pokaż mi pierwsze 5 liczb z tej listy, żebym zobaczył, jak wygląda embedding.
- Jeśli długość jest inna niż 1536, daj mi gotowy SQL, który poprawi kolumnę embedding
  w tabeli chunks i funkcję match_chunks, i poczekaj na moje „wklejone”.
- Powiedz mi, gdzie w Supabase Dashboard sprawdzę, że tabele documents i chunks mają
  włączony RLS i nie mają żadnych polityk (czyli nie są publiczne).
- Zapisz nazwę modelu i długość embeddingu w komentarzu w lib/model.ts.
```

**Sprawdź:** asystent podaje nazwę modelu, liczbę i pięć pierwszych wartości (małe ułamki, dodatnie i ujemne). Liczba jest taka sama jak w tabeli `chunks` (domyślnie 1536). Obie tabele mają włączony RLS.

### 🟣 Dla szybkich — zmierz znaczenie na liczbach

Zanim uruchomisz prompt, zgadnij: które zdanie jest „bliżej” pytania A — zdanie B czy C? I jak duża będzie różnica?

```text
Pokaż mi na liczbach, że embedding łapie znaczenie. Jednorazowym skryptem, który potem usuniesz,
policz embeddingi trzech zdań modelem z OPENROUTER_EMBEDDING_MODEL:
A: „Ile zapłacę za najtańszy plan?”
B: „Pakiet Start kosztuje 490 zł netto miesięcznie.”
C: „Agent rozmawia po polsku i po angielsku.”
Policz podobieństwo kosinusowe par A–B i A–C. Sprawdź w dokumentacji AI SDK w node_modules,
czy jest do tego gotowa funkcja, zanim napiszesz własną. Podaj oba wyniki i jedno zdanie wniosku.
Nie wypisuj wartości z .env.local.
```

**Sprawdź:** masz dwie liczby. A–B jest wyraźnie wyższe niż A–C, chociaż zdania A i B nie mają wspólnych słów. Potem podmień zdanie C na własne i poszukaj pary, która oszuka model: zdania o różnym znaczeniu, ale z wysokim wynikiem. Wrzuć ją na czat kursu.

Zostało kilka minut? Zaplanuj bazę wiedzy swojego agenta — przyda się w warsztacie 3 i w pracy domowej:

```text
Mój agent to [temat]. Pomóż mi zaplanować jego bazę wiedzy:
- zaproponuj 3–5 dokumentów, które powinien znać (np. cennik, FAQ, regulamin),
- dla każdego napisz dwa pytania, na które agent ma odpowiadać z tego dokumentu,
- dopisz dwa pytania-pułapki, na które NIE powinien odpowiadać, bo tego nie będzie w dokumentach.
Niczego nie zmieniaj w kodzie. Zapisz plan w pliku baza-wiedzy-plan.md.
```

---

## Warsztat 2 — /upload: od tekstu do bazy wiedzy (20 min)

**Po co:** agent nie przeczyta całego regulaminu przy każdym pytaniu — to wolne i drogie. Dzielimy dokument na krótkie **fragmenty** i zapisujemy każdy razem z jego embeddingiem. Potem do pytania trafia tylko kilka najlepiej pasujących kartek, a nie cały segregator.

**Gotowe, gdy:** tekst został podzielony i zapisany jako fragmenty z wektorami.

Co się stanie po kliknięciu „Dodaj do bazy wiedzy”:

| Krok | Co robi aplikacja | Gdzie to zobaczysz |
|---|---|---|
| 1 | zapisuje tytuł dokumentu | nowy wiersz w tabeli `documents` |
| 2 | dzieli treść na fragmenty po akapitach | kilka wierszy w tabeli `chunks` |
| 3 | prosi model embeddingów o listę liczb dla każdego fragmentu | kolumna `embedding` wypełniona liczbami |

### 🟢 Minimum — strona /upload w dwóch krokach

Robisz to dwoma krótkimi promptami. Po pierwszym tekst trafia do bazy, po drugim dochodzą embeddingi. Dzięki temu od razu widać, co działa, a co nie.

Przy **każdym** prompcie postępuj tak samo:

1. Wklej prompt do asystenta — w tej samej rozmowie, w której wkleiłeś prompt z kroku 0.
2. Asystent może pytać o zgodę na zmianę plików albo uruchomienie polecenia — zgadzaj się. O klucze i hasła nie powinien pytać; gdyby zapytał, niczego nie wklejaj.
3. Poczekaj — zwykle kilka minut. W tym czasie zrób zadanie „Gdy asystent pracuje”.
4. Asystent skończył, gdy napisze w 3 punktach, co zrobił. Widzisz błąd? Napisz: „Napraw ten błąd”.
5. Odśwież stronę w przeglądarce (F5). Serwer nie działa? Uruchom go ponownie: `npm run dev`.

**Krok A — strona, która zapisuje tekst**

```text
Dodaj stronę /upload do wklejania dokumentów do bazy wiedzy. Na razie BEZ embeddingów.

- Formularz: pole „Tytuł” i duże pole „Treść” (do 20 000 znaków) oraz przycisk „Dodaj do bazy wiedzy”.
- Endpoint najpierw sprawdza sesję. Potem zapisuje dokument w tabeli documents i dzieli treść
  na fragmenty: jeden akapit (tekst oddzielony pustą linią) to jeden fragment. Nie łącz krótkich
  akapitów. Akapit dłuższy niż 800 znaków podziel na granicy zdania.
- Fragmenty zapisuje w tabeli chunks: document_id, chunk_index, content. Kolumna embedding
  zostaje na razie pusta.
- Pusty tytuł albo pusta treść — komunikat od razu w formularzu.
- Po zapisie pokaż: „Zapisano dokument „[tytuł]”: [liczba] fragmentów”.
- Jeśli zapis się nie uda, usuń niedokończony dokument i pokaż zrozumiały komunikat po polsku.
- W czacie dodaj link „Baza wiedzy” prowadzący do /upload.
```

**Gdy asystent pracuje:** policz akapity w cenniku poniżej i wpisz na czat kursu, ile wierszy pojawi się w tabeli `chunks` po jego dodaniu.

**Sprawdź krok A:**

1. W czacie aplikacji kliknij link „Baza wiedzy” albo wejdź na http://localhost:3000/upload. Widzisz formularz z polami „Tytuł” i „Treść”.
2. W polu „Tytuł” wpisz `Cennik 2026`.
3. Skopiuj poniższy tekst w całości — razem z pustymi liniami między akapitami — i wklej w pole „Treść”:

```text
Kwantowy Borsuk buduje agentów AI dla małych firm z Polski. Oferujemy trzy pakiety: Start, Zespół i Firma. Wszystkie ceny w tym cenniku są cenami netto i obowiązują od 1 stycznia 2026 roku.

Pakiet Start kosztuje 490 zł netto miesięcznie. Obejmuje jednego agenta, do 1000 rozmów w miesiącu i jedną bazę wiedzy do 20 dokumentów. To nasz najmniejszy pakiet, przeznaczony dla jednoosobowych firm.

Pakiet Zespół kosztuje 1290 zł netto miesięcznie. Obejmuje trzech agentów, do 5000 rozmów w miesiącu i wsparcie e-mail w dni robocze, z odpowiedzią w ciągu 24 godzin.

Cena pakietu Firma jest ustalana indywidualnie po rozmowie z doradcą. Pakiet obejmuje dowolną liczbę agentów, własne integracje i opiekuna klienta.

Umowę można wypowiedzieć z miesięcznym okresem wypowiedzenia. Płatność odbywa się przelewem na podstawie faktury, w terminie 14 dni. Przy płatności za cały rok z góry udzielamy 10% rabatu.
```

4. Kliknij „Dodaj do bazy wiedzy”. Pod formularzem pojawia się komunikat: „Zapisano dokument „Cennik 2026”: 5 fragmentów”. Zgadza się z Twoim typem?
5. Otwórz Supabase → **Table Editor** → kliknij tabelę `chunks` na liście po lewej. Widzisz 5 wierszy. W kolumnie `content` są akapity cennika, a kolumna `embedding` jest pusta (`NULL`). Tak ma być — embeddingi dojdą w kroku B.

Masz 1 albo 2 wiersze zamiast 5? Napisz asystentowi: „Każdy akapit ma być osobnym fragmentem. Popraw dzielenie”. Potem w Table Editor otwórz tabelę `documents`, zaznacz wiersz kwadracikiem po lewej, kliknij **Delete** i dodaj cennik ponownie.

**Krok B — embeddingi**

```text
Dodaj embeddingi do importu na /upload.

- Po podzieleniu tekstu utwórz embeddingi wszystkich fragmentów jednym wywołaniem
  (embedMany, model z OPENROUTER_EMBEDDING_MODEL) i zapisz je w kolumnie embedding tabeli chunks.
- Przy każdym imporcie uzupełnij też embeddingi fragmentów, które już są w bazie
  i mają pustą kolumnę embedding.
- Jeśli embeddingi się nie udadzą, usuń niedokończony dokument i pokaż zrozumiały komunikat
  po polsku. Nie pokazuj „Zapisano”, gdy czegoś brakuje.
```

**Gdy asystent pracuje:** przeczytaj dokument FAQ poniżej i wymyśl jedno pytanie, na które odpowiada — ale ułożone tak, żeby nie użyć żadnego słowa z tekstu. Przyda się w warsztacie 3.

**Sprawdź krok B:**

6. Wróć na http://localhost:3000/upload i odśwież stronę (F5).
7. Dodaj drugi dokument. W polu „Tytuł” wpisz `FAQ`, a w pole „Treść” wklej w całości:

```text
Jak długo trwa wdrożenie? Od podpisania umowy do pierwszej rozmowy agenta z klientem mija zwykle 5 dni roboczych. W pakiecie Firma termin ustalamy indywidualnie.

W jakich językach rozmawia agent? Agent rozmawia po polsku i po angielsku. Inne języki są dostępne w pakiecie Firma.

Czy mogę zmienić pakiet? Tak. Pakiet można zmienić na wyższy w dowolnym momencie, a na niższy od początku kolejnego miesiąca rozliczeniowego.

Czy jest okres próbny? Tak. Pakiet Start można testować bezpłatnie przez 14 dni, bez podawania danych karty.

Gdzie są przechowywane dane rozmów? Dane są przechowywane na serwerach w Unii Europejskiej i usuwane po 90 dniach od zakończenia umowy.
```

8. Kliknij „Dodaj do bazy wiedzy”. Komunikat: „Zapisano dokument „FAQ”: 5 fragmentów”. Tym razem trwa to chwilę dłużej — aplikacja pyta model embeddingów.

**Zajrzyj do środka** — to najciekawszy moment tego warsztatu:

9. Otwórz Supabase → **Table Editor** → `documents`. Są dwa wiersze: `Cennik 2026` i `FAQ`. Dane się nie odświeżyły? Kliknij **Refresh** nad tabelą.
10. Otwórz `chunks`. Jest dziesięć wierszy — po jednym na akapit. W kolumnie `document_id` jest numer dokumentu, z którego pochodzi fragment — to relacja, jak w lekcji 5.
11. Przewiń tabelę w prawo do kolumny `embedding` i kliknij dowolną komórkę. Ta ściana liczb to „znaczenie” jednego akapitu zapisane tak, żeby baza mogła je porównywać.

Kolumna `embedding` jest wypełniona we wszystkich dziesięciu wierszach — także w pięciu z cennika? **Minimum zrobione.**

Kolumna `embedding` jest pusta albo import kończy się błędem? Skopiuj komunikat ze strony i ostatnie linie z terminala do asystenta. Jeśli błąd mówi o modelu albo dostępie — zgłoś prowadzącemu, to sprawa klucza, a nie Twojego kodu.

### 🔵 Standard — postęp, błędy, lista dokumentów

```text
Dopracuj stronę /upload:
- Podczas importu pokaż, co się dzieje: „Dzielę tekst…”, „Tworzę embeddingi…”, „Zapisuję…”.
  Przycisk jest wtedy zablokowany, żeby nie wysłać dokumentu dwa razy.
- Pod formularzem pokaż listę dokumentów w bazie: tytuł (to jest nazwa źródła),
  data dodania (to jest wersja) i liczba fragmentów. Dane tylko po sprawdzeniu sesji.
- Ponowne dodanie dokumentu o tym samym tytule zastępuje poprzednią wersję: stare fragmenty
  znikają, zostają tylko nowe. Zapytaj o potwierdzenie przed zastąpieniem.
- Przy każdym dokumencie jest przycisk „Usuń” z potwierdzeniem.
- Gdy import się nie uda, pokaż, na którym etapie i co mogę zrobić.
```

**Sprawdź:** dodaj `Cennik 2026` drugi raz, ale zmień cenę pakietu Start na 540 zł. Na liście jest nadal jeden dokument o tym tytule, a w tabeli `chunks` nie ma już ceny 490 zł. Potem przywróć 490 zł — warsztat 3 korzysta z tej kwoty.

### 🟣 Dla szybkich — dokumenty Twojej firmy

Wklej przez `/upload` dokumenty **swojego** tematu — prawdziwej albo wymyślonej firmy: cennik, FAQ, regulamin. Nie wklejaj danych osobowych ani tajemnic firmowych.

Nie masz gotowych tekstów? Poproś asystenta:

```text
Mój agent to [temat]. Napisz trzy krótkie, spójne ze sobą dokumenty wymyślonej firmy:
cennik, FAQ (8 pytań) i regulamin (10 punktów). Każdy na około 1500 znaków, z konkretnymi
liczbami i nazwami. Zapisz je w plikach cennik.txt, faq.txt i regulamin.txt.
```

**Sprawdź:** na liście w `/upload` są trzy dokumenty. To już pierwsza część pracy domowej.

**Wyzwanie: jak ciąć tekst?** Dzielenie po akapitach to tylko jedna z możliwości. Sprawdź drugą na swoim regulaminie i sam zdecyduj, która jest lepsza.

```text
Dodaj na stronie /upload wybór sposobu dzielenia tekstu: „akapity” (jak teraz) albo
„stałe kawałki” — po 300 znaków z zakładką 50 znaków. Domyślnie zostają akapity.
Niczego więcej nie zmieniaj.
```

Dodaj swój regulamin drugi raz, sposobem „stałe kawałki”, pod tytułem `Regulamin (kawałki)`. Otwórz tabelę `chunks` i porównaj oba warianty: ile jest fragmentów i czy pojedynczy fragment da się zrozumieć bez sąsiednich. W warsztacie 3 zadaj pytanie o regulamin i zobacz, który wariant trafia do źródeł. Gorszy wariant usuń przed pracą domową.

---

## Warsztat 3 — searchKnowledge, cytaty i brak danych (20 min)

**Po co:** agent, który zmyśla cenę, jest gorszy niż agent, który mówi „nie wiem”. Odmowa bywa poprawną odpowiedzią.

**Gotowe, gdy:** odpowiedź ma wspierające źródło; brak wiedzy nie prowadzi do zgadywania.

Co się stanie, gdy zadasz pytanie:

| Krok | Co robi aplikacja |
|---|---|
| 1 | agent uznaje, że pytanie dotyczy firmy, i wywołuje narzędzie `searchKnowledge` |
| 2 | narzędzie zamienia pytanie na embedding — tym samym modelem co przy imporcie |
| 3 | funkcja `match_chunks` zwraca fragmenty najbliższe znaczeniem |
| 4 | agent odpowiada tylko z tych fragmentów i dopisuje źródło — albo mówi, że odpowiedzi w nich nie ma |

### 🟢 Minimum — agent odpowiada z dokumentów

1. Wklej poniższy prompt do asystenta — w tej samej rozmowie, w której wkleiłeś prompt z kroku 0.
2. Asystent może pytać o zgodę na zmianę plików albo uruchomienie polecenia — zgadzaj się. O klucze i hasła nie powinien pytać; gdyby zapytał, niczego nie wklejaj.
3. Poczekaj. Asystent pisze kilka plików i uruchamia build, więc zwykle trwa to kilka minut. W tym czasie zrób zadanie „Gdy asystent pracuje” spod promptu.
4. Asystent skończył, gdy napisze w 3 punktach, co zrobił. Jeśli zamiast tego widzisz błąd — napisz: „Napraw ten błąd”.
5. Odśwież stronę w przeglądarce (F5). Serwer nie działa? Uruchom go ponownie: `npm run dev`.

Gotowy wynik: czat wygląda tak samo jak przedtem. Nowe narzędzie widać dopiero w odpowiedziach — po linii „📎 Źródło: …”.

```text
Dodaj agentowi narzędzie searchKnowledge — wyszukiwanie w bazie wiedzy.

- Narzędzie przyjmuje pytanie, tworzy jego embedding (ten sam model co przy imporcie)
  i wywołuje w Supabase funkcję match_chunks. Zwraca 3 najlepiej pasujące fragmenty: tytuł dokumentu,
  treść fragmentu i podobieństwo.
- Opis narzędzia: używaj przy każdym pytaniu o firmę, ofertę, ceny, zasady i regulamin.
- Dopisz do instrukcji agenta:
  1. Na pytania o firmę odpowiadaj wyłącznie na podstawie fragmentów zwróconych przez searchKnowledge.
  2. Na końcu takiej odpowiedzi dodaj linię „📎 Źródło: [tytuł dokumentu]”.
  3. Jeśli fragmenty nie zawierają odpowiedzi, napisz: „Nie mam tej informacji w bazie wiedzy”
     i zaproponuj, co można dodać. Nie zgaduj, nie uzupełniaj z własnej wiedzy
     ani z wyszukiwarki internetowej.
  4. Fragment na podobny temat to jeszcze nie odpowiedź — sprawdź, czy naprawdę odpowiada na pytanie.
- Narzędzie działa w endpoincie, który najpierw sprawdza sesję.
```

**Gdy asystent pracuje:** wpisz na czat kursu swój typ. Na pytanie o numer telefonu do sprzedaży (nie ma go w dokumentach) agent: **A** — odmówi, **B** — zmyśli numer, **C** — poszuka w internecie.

**Sprawdź trzema pytaniami.** Wróć do czatu aplikacji (http://localhost:3000) i odśwież stronę (F5). Przed każdym pytaniem kliknij „Nowa rozmowa”, żeby poprzednia odpowiedź nie podpowiadała agentowi.

**Pytanie 1 — „po”.** To samo pytanie co na początku zajęć:

```text
Ile kosztuje pakiet Start w firmie Kwantowy Borsuk?
```

Odpowiedź: 490 zł netto miesięcznie i linia „📎 Źródło: Cennik 2026”. Połóż ten zrzut obok zrzutu z początku zajęć.

**Pytanie 2 — inne słowa, to samo znaczenie.** W dokumentach nie ma słów „szybko” ani „zacznie działać”:

```text
Jak szybko mój agent zacznie działać?
```

Agent odpowiada: zwykle 5 dni roboczych, „📎 Źródło: FAQ”. Baza miała dziesięć fragmentów, a podała te o wdrożeniu — choć pytanie nie ma z nimi wspólnych słów. Zwykłe wyszukiwanie słów by tego nie znalazło.

**Pytanie 3 — pułapka.** Tego w dokumentach nie ma:

```text
Jaki jest numer telefonu do działu sprzedaży?
```

Agent pisze, że nie ma tej informacji w bazie wiedzy — i nie podaje żadnego numeru. **Minimum zrobione.** Wyszło B albo C? Zgłoś to prowadzącemu — to dobry przykład do omówienia — i użyj wiersza „Agent odpowiada z internetu…” z tabeli na końcu.

### 🔵 Standard — pokaż fragment, który to potwierdza

```text
Dopracuj odpowiedzi z bazy wiedzy:
- Pod odpowiedzią pokaż listę źródeł: tytuł dokumentu, podobieństwo w procentach
  i przycisk „Pokaż fragment”, który rozwija dokładny tekst fragmentu użytego w odpowiedzi.
- Nad odpowiedzią pokaż etykietę użytego narzędzia, np. „📚 baza wiedzy” — tak jak etykiety
  innych narzędzi.
- Fragmenty o niskim podobieństwie nie liczą się jako źródło. Dobierz próg na podstawie
  kilku prób i zapisz go w jednym miejscu w kodzie.
- Gdy odpowiedź jest tylko częściowo w dokumentach, agent mówi, co wie ze źródła,
  a czego w bazie brakuje.
```

**Sprawdź dwiema trudniejszymi pułapkami:**

```text
Ile kosztuje pakiet Start brutto?
```

Agent podaje cenę netto ze źródła i mówi, że w bazie nie ma stawki VAT ani ceny brutto — nie liczy jej sam. Kliknij „Pokaż fragment” i sprawdź, czy cena naprawdę tam jest. Porównaj procenty podobieństwa przy źródłach: to baza wybrała te fragmenty, model tylko z nich skorzystał.

```text
Ile kosztuje pakiet Firma?
```

Agent odpowiada, że cena jest ustalana indywidualnie — nie wymyśla kwoty.

### 🟣 Dla szybkich — spróbuj złamać własnego agenta

Sprawdź agenta na **swoich** dokumentach. Ułóż pięć pytań: trzy, na które odpowiedź jest w dokumentach, jedno z odpowiedzią częściową i jedno całkiem spoza bazy. Szukaj takiego, przy którym agent zmyśli.

Gdy któreś pytanie da zły wynik, wklej asystentowi:

```text
Zadałem agentowi pytanie: „[pytanie]”. Odpowiedział: „[odpowiedź]”.
Oczekiwałem: [co powinno się stać]. Sprawdź osobno dwie rzeczy: czy wyszukiwanie zwróciło
właściwy fragment oraz czy model dobrze z niego skorzystał. Popraw tylko to, co zawiodło.
```

**Sprawdź:** wszystkie pięć pytań daje oczekiwany wynik: trzy odpowiedzi ze źródłem, jedna częściowa, jedna odmowa. Jeśli udało Ci się przyłapać agenta na zmyśleniu — wrzuć to pytanie na czat kursu, niech inni sprawdzą swoich.

---

## Pokaż, co zrobiłeś

Wrzuć na czat kursu **jeden zrzut ekranu**: pytanie, odpowiedź agenta i linia „📎 Źródło: …”. Dopisz jedno zdanie: który poziom zrobiłeś w każdym warsztacie. Jeśli masz zrzut „przed” z początku zajęć — wrzuć oba obok siebie.

Jeśli publikujesz zmiany na Vercel: w projekcie na Vercel otwórz **Environment Variables**, dodaj `OPENROUTER_EMBEDDING_MODEL` (oraz `SUPABASE_URL` i `SUPABASE_SECRET_KEY`, jeśli jeszcze ich tam nie ma), kliknij **Save** i opublikuj aplikację ponownie.

## Praca domowa (16 pkt)

**Wklej do bazy wiedzy 3 dokumenty swojej (prawdziwej albo wymyślonej) firmy: cennik, FAQ, regulamin. Pokaż odpowiedź z cytowanym źródłem i odmowę na pytanie spoza bazy.**

| Kryterium | Punkty |
|---|---|
| Trzy dokumenty w bazie | 4 |
| Odpowiedź z nazwą źródła | 4 |
| Odmowa przy pytaniu spoza bazy | 4 |
| Dwa zrzuty na czacie | 4 |

Oddajesz na czacie kursu: zrzuty ekranu albo link. Dwa zrzuty to: odpowiedź ze źródłem oraz odmowa. Jeśli na zajęciach zrobiłeś poziom „dla szybkich” w warsztacie 2, trzy dokumenty masz już w bazie.

Nie wklejaj do bazy danych osobowych ani poufnych dokumentów — wymyślona firma jest w pełni w porządku.

## Gdy coś nie działa

| Co widzisz | Co zrobić |
|---|---|
| Nie widzę **Extensions** w panelu | Najpierw kliknij **Database** w menu po lewej — **Extensions** jest na bocznej liście tej strony. |
| SQL Editor: „type vector does not exist” | Dodatek nie jest włączony. Wróć do **Database → Extensions**, włącz `vector` i uruchom skrypt ponownie. |
| SQL Editor: „relation already exists” | Tabele już są — skrypt uruchomił się wcześniej. Sprawdź w Table Editor i idź dalej. |
| Błąd przy tworzeniu embeddingów (brak dostępu do modelu, nieznany model) | Sprawdź nazwę w `OPENROUTER_EMBEDDING_MODEL` i uruchom serwer ponownie. Jeśli dalej nie działa — zgłoś prowadzącemu, to kwestia klucza, nie Twojego kodu. |
| Błąd „expected 1536 dimensions, not …” | Model zwraca embedding innej długości. Wklej błąd asystentowi i użyj promptu z poziomu Standard w warsztacie 1. |
| Błąd „permission denied for table …” albo „… for function match_chunks” | Otwórz **SQL Editor** i uruchom: `grant all on table documents, chunks to service_role; grant execute on function match_chunks to service_role;` |
| Import się udał, ale kolumna `embedding` jest pusta | Napisz: „Fragmenty zapisują się bez embeddingu. Sprawdź, czy wynik embedMany trafia do kolumny embedding”. |
| Agent nie korzysta z bazy wiedzy | Zapytaj wprost: „Sprawdź w bazie wiedzy, ile kosztuje…”. Jeśli pomaga — poproś asystenta o poprawienie opisu narzędzia searchKnowledge. |
| Agent odpowiada z internetu albo „z głowy” zamiast odmówić | Napisz: „Na pytania o firmę agent ma odpowiadać tylko z searchKnowledge. Wzmocnij tę zasadę w instrukcji”. |
| Po zmianach nic nie działa | Napisz do asystenta: „Cofnij ostatnią zmianę i wróć do działającej wersji”. W ostateczności weź `starter_lekcja_06`. |
