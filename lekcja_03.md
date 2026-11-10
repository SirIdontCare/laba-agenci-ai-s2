# Lekcja 3 — Narzędzia: ręce agenta

Do tej pory Twój chatbot tylko rozmawiał. Dziś dostaje **narzędzia**: wyszuka coś w internecie, obejrzy zdjęcie, wygeneruje obraz — i sam zdecyduje, którego narzędzia użyć.

**Na koniec zajęć wrzucasz na czat kursu jeden zrzut ekranu:** Twój chatbot odpowiada na pytanie, używając narzędzia.

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

## Przed startem (5 minut)

**Twoja aplikacja z lekcji 2 działa?** Uruchom ją (`npm run dev`, w Windows PowerShell `npm.cmd run dev`), zaloguj się hasłem, napisz „Cześć”. Jeśli dostajesz odpowiedź — przejdź do kroku 0.

**Nie działa albo jej nie masz?** Nie naprawiaj jej teraz. Weź **starter** — gotową aplikację w stanie „po lekcji 2”:

1. Pobierz materiały kursu. W terminalu, w folderze na swoje projekty, wpisz:

   ```bash
   git clone https://github.com/SirIdontCare/laba-agenci-ai-s2.git
   ```

   Skopiuj folder [`starter_lekcja_03`](starter_lekcja_03) w swoje miejsce na projekty i otwórz w nim terminal. To od teraz Twój projekt.
2. Wpisz `npm install` (Windows PowerShell: `npm.cmd install`).
3. Skopiuj do tego folderu swój plik `.env.local` z poprzedniego projektu. Nie masz go? Skopiuj `.env.example` jako `.env.local` i uzupełnij cztery wartości.
4. Wpisz `npm run dev` i otwórz http://localhost:3000.

### Krok 0 — jeden prompt na początek

Otwórz asystenta w folderze aplikacji i wklej to **raz**. Kolejne prompty wklejaj w tej samej rozmowie.

```text
Dziś dodajemy do tej aplikacji narzędzia dla modelu. Zanim cokolwiek zmienisz:

1. Przeczytaj package.json i sprawdź wersje: next, ai, @ai-sdk/react, @openrouter/ai-sdk-provider, zod.
2. Nie pisz kodu z pamięci. Sposób użycia funkcji sprawdzaj w node_modules/ai/docs/
   oraz w plikach typów bibliotek. W AI SDK 7 obowiązują m.in.: tool() z inputSchema,
   stopWhen: isStepCount(n), instructions zamiast system, toUIMessageStream().
3. Każdy nowy endpoint ma najpierw sprawdzić sesję i bez niej zwrócić 401, zanim wywoła model.
4. Nie czytaj i nie wypisuj wartości z .env.local.
5. Rozmawiaj ze mną po polsku, prostym językiem. Po każdej zmianie uruchom build,
   napraw błędy i napisz w 3 punktach, co zrobiłeś i jak to sprawdzić w przeglądarce.

Na razie niczego nie zmieniaj. Napisz tylko, jakie wersje znalazłeś i w których plikach
jest czat, endpoint rozmowy i charakter chatbota.
```

---

## Warsztat 1 — Function calling i wyszukiwanie (20 min)

**Po co:** model sam z siebie nie zna dzisiejszych wiadomości. Narzędzie wyszukiwania daje mu dostęp do aktualnych informacji, a Ty widzisz, skąd pochodzą.

**Gotowe, gdy:** narzędzie działa; odpowiedź ma rzeczywiste źródło i datę pobrania.

### 🟢 Minimum — chatbot szuka w internecie

Najpierw w pliku `.env.local` ustaw model, który obsługuje wyszukiwanie Google, zapisz plik i uruchom serwer ponownie:

```dotenv
OPENROUTER_MODEL=google/gemini-3.8-flash
```

Potem wklej prompt:

```text
Dodaj do endpointu rozmowy narzędzie wyszukiwania w internecie.

- Użyj gotowego narzędzia z providera OpenRouter: openrouter.tools.webSearch
  z ustawieniami maxResults: 3 i engine: "native" (wyszukiwanie Google dla modeli Gemini).
- Pozwól modelowi wykonać kilka kroków: stopWhen: isStepCount(5).
- Przekaż źródła do przeglądarki (sendSources: true w toUIMessageStream).
- W czacie pod odpowiedzią pokaż listę „Źródła”: tytuł i klikalny link każdego źródła
  oraz dopisek „pobrano: [dzisiejsza data i godzina]”.
- Dopisz do instrukcji chatbota: gdy pytanie dotyczy aktualnych wydarzeń, cen, dat
  lub faktów, których nie jesteś pewien — użyj wyszukiwania i oprzyj odpowiedź na źródłach.
```

**Sprawdź:** zapytaj o coś, czego model nie może wiedzieć z pamięci:

```text
Jaki jest dziś kurs euro według NBP? Podaj źródło.
```

Widzisz odpowiedź, link do źródła i datę pobrania? **Minimum zrobione.** Kliknij w link i sprawdź, czy naprawdę prowadzi do tej informacji.

### 🔵 Standard — własna funkcja i informacja „użyto narzędzia”

```text
Dodaj drugie narzędzie — zwykłą funkcję napisaną przez nas (function calling):

- Nazwa: aktualnyCzas. Zwraca dzisiejszą datę, dzień tygodnia i godzinę w strefie Europe/Warsaw.
- Opis narzędzia napisz tak, żeby model wiedział, kiedy go użyć (pytania o „dziś”, „jutro”, „za ile dni”).
- W czacie, nad odpowiedzią, pokaż małą etykietę z nazwą każdego użytego narzędzia,
  np. „🔎 wyszukiwanie” albo „🕒 aktualnyCzas”. Gdy narzędzie nie było użyte — nic nie pokazuj.
```

**Sprawdź** trzema pytaniami — przy każdym powinna pojawić się inna etykieta albo żadna:

```text
Ile dni zostało do końca roku?
```

```text
Co nowego ogłosił ostatnio OpenRouter?
```

```text
Napisz dwuzdaniowe powitanie dla nowego klienta.
```

### 🟣 Dla szybkich — narzędzie z Twojego tematu

Wymyśl jedno narzędzie, które przyda się **Twojemu** chatbotowi, i podłącz prawdziwe, darmowe dane. Przykłady API bez klucza:

- pogoda: `https://api.open-meteo.com` (np. asystent biegacza, organizator wydarzeń),
- kursy walut: `https://api.nbp.pl` (np. asystent sklepu, biura podróży).

```text
Dodaj narzędzie [nazwa], które pobiera [jakie dane] z publicznego API [adres].
Najpierw sprawdź w dokumentacji API, jak wygląda zapytanie i odpowiedź.
Narzędzie ma zwracać tylko potrzebne pola oraz datę pobrania.
Gdy API nie odpowiada, narzędzie zwraca czytelny komunikat zamiast błędu aplikacji.
Dodaj etykietę tego narzędzia w czacie.
```

---

## Warsztat 2 — Nano Banana 2 i Vision (25 min)

**Po co:** agent, który widzi i tworzy obrazy, potrafi opisać zdjęcie produktu, odczytać zrzut ekranu albo przygotować grafikę do posta.

**Gotowe, gdy:** analiza i wygenerowany obraz działają; model jest nazwany zgodnie z próbą.

„Nazwany zgodnie z próbą” znaczy: pod obrazem i pod analizą widać nazwę modelu, który **naprawdę** wykonał zadanie — nie tę, którą chcieliśmy użyć.

### 🟢 Minimum — bot widzi zdjęcie i generuje obraz

```text
Dodaj dwie funkcje związane z obrazami.

A. Vision — analiza obrazu:
- W czacie dodaj przycisk „Dodaj zdjęcie” (jpg, png, webp, do 4 MB).
- Zdjęcie wysyłamy razem z wiadomością jako część typu file; model odpowiada na jego temat.
- Miniatura wysłanego zdjęcia jest widoczna w rozmowie.

B. Generowanie obrazu:
- Dodaj endpoint /api/image (sprawdza sesję, potem przyjmuje opis obrazu, do 500 znaków).
- Użyj generateImage z AI SDK i modelu obrazów z providera OpenRouter:
  openrouter.imageModel("google/gemini-3.1-flash-image-preview") — to Nano Banana 2.
- W czacie dodaj przycisk „Wygeneruj obraz”, który wysyła wpisany tekst do /api/image
  i pokazuje wynik w rozmowie.

Pod każdym wygenerowanym obrazem i pod każdą odpowiedzią o zdjęciu pokaż małym tekstem
identyfikator modelu, który faktycznie został użyty (z odpowiedzi API, nie wpisany na sztywno).
Gdy model jest niedostępny, pokaż zrozumiały komunikat po polsku.
```

**Sprawdź A:** dodaj dowolne zdjęcie z komputera i zapytaj:

```text
Co widzisz na tym zdjęciu? Opisz w trzech punktach.
```

**Sprawdź B:** wpisz opis i kliknij „Wygeneruj obraz”:

```text
Minimalistyczne logo kawiarni: filiżanka z parą w kształcie liścia, dwa kolory, białe tło
```

Masz opis zdjęcia, obraz i nazwy modeli pod spodem? **Minimum zrobione.**

### 🔵 Standard — wygodniej i bezpieczniej

```text
Dopracuj funkcje obrazów:
- Pod polem wiadomości dodaj trzy klikalne podpowiedzi opisów obrazu pasujące do tematu mojego chatbota.
- Przy wygenerowanym obrazie dodaj przycisk „Pobierz”.
- Podczas generowania pokaż „Generuję obraz…”, a przyciski zablokuj, żeby nie wysłać zlecenia dwa razy.
- Za duży plik albo zły format — pokaż komunikat od razu w przeglądarce, bez wysyłania na serwer.
```

**Sprawdź:** spróbuj dodać plik PDF. Powinien pojawić się komunikat, a nie błąd.

### 🟣 Dla szybkich — obraz, który do czegoś służy

Wybierz jedno:

- **Analiza do danych:** bot ogląda zdjęcie (np. paragonu, wizytówki, zrzutu ekranu) i zwraca uporządkowane pola — tak jak analiza JSON z lekcji 2.
- **Styl marki:** każdy generowany obraz dostaje stały styl Twojego projektu (kolory, nastrój, format), dopisywany po stronie serwera.

```text
[Opisz wybrany wariant swoimi słowami i poproś asystenta o plan w 3 krokach, zanim zacznie pisać kod.]
```

---

## Warsztat 3 — Multi-tool na jednym endpoincie (25 min)

**Po co:** prawdziwy agent nie ma osobnego przycisku do każdej funkcji. Dostaje zadanie i sam wybiera narzędzia.

**Gotowe, gdy:** jeden endpoint obsługuje narzędzia, streaming i wynik strukturalny.

### 🟢 Minimum — jeden endpoint /api/agent

```text
Połącz wszystko w jednym endpoincie /api/agent (najpierw sprawdza sesję).

Endpoint przyjmuje pole mode:
- mode "chat": rozmowa ze streamingiem (streamText) i narzędziami:
  wyszukiwanie w internecie, generowanie obrazu oraz narzędzia dodane w warsztacie 1.
  Limit: stopWhen: isStepCount(5).
- mode "analyze": wynik strukturalny — dotychczasowa analiza JSON
  (generateText z Output.object i sprawdzeniem schematu na serwerze).

Narzędzie generowania obrazu: obraz ma trafić do przeglądarki, ale do modelu wraca tylko
krótki tekst „obraz wygenerowany” (toModelOutput) — nie wysyłaj modelowi całego pliku.

Przełącz czat i przycisk „Analiza JSON” na /api/agent. Wygenerowany przez narzędzie obraz
pokaż w rozmowie. Stare endpointy usuń dopiero, gdy nowy działa.
```

**Sprawdź** — wszystko w tym samym oknie czatu, bez dodatkowych przycisków:

```text
Sprawdź w internecie, jaka będzie jutro pogoda w Krakowie, i podaj źródło.
```

```text
Wygeneruj obraz: plakat zapraszający na poranny bieg po Plantach.
```

Potem wpisz dowolną wiadomość klienta i kliknij „Analiza JSON”.

Odpowiedź pisze się na żywo, narzędzia działają i analiza zwraca pola? **Minimum zrobione.**

### 🔵 Standard — dwa narzędzia w jednym zadaniu

```text
Dopracuj agenta:
- Przy każdej odpowiedzi pokaż po kolei etykiety użytych narzędzi (jak w warsztacie 1).
- Gdy agent dojdzie do limitu 5 kroków, pokaż komunikat „Przerwałem po 5 krokach” zamiast pustej odpowiedzi.
- Dopisz do instrukcji: przy zadaniu złożonym najpierw zbierz informacje, potem twórz.
```

**Sprawdź** jednym poleceniem, które wymaga dwóch narzędzi:

```text
Sprawdź, jaka będzie pogoda w sobotę w Gdańsku, i wygeneruj pasującą do niej grafikę na post zapraszający na spacer.
```

Powinny pojawić się dwie etykiety: najpierw wyszukiwanie, potem obraz.

### 🟣 Dla szybkich — scenariusz z Twojego tematu

Wymyśl jedno zadanie z Twojej dziedziny, do którego agent potrzebuje co najmniej dwóch narzędzi, i doprowadź je do działania. Przykłady:

- asystent kwiaciarni: sprawdza, jakie kwiaty są teraz w sezonie, i generuje grafikę bukietu tygodnia,
- asystent rekrutera: ogląda zrzut ogłoszenia o pracę i zwraca jego analizę w ustalonych polach.

---

## Pokaż, co zrobiłeś

Wrzuć na czat kursu **jeden zrzut ekranu**: pytanie, odpowiedź chatbota i ślad użytego narzędzia (źródło z datą albo wygenerowany obraz). Dopisz jedno zdanie: który poziom zrobiłeś w każdym warsztacie.

Jeśli chcesz, opublikuj zmiany na Vercel tak jak w lekcji 1 i dodaj link.

## Praca domowa (16 pkt)

**Dodaj do swojego agenta 2 własne narzędzia** — z pomocą asystenta kodowania. Na przykład: pobieranie danych z publicznego API, generowanie grafik w stylu Twojego projektu, przeliczanie walut, wycena usługi, sprawdzanie dnia tygodnia i świąt.

„Własne” znaczy: pasujące do tematu Twojego chatbota i inne niż te zrobione wspólnie na zajęciach. Jeśli na zajęciach zrobiłeś poziom „dla szybkich”, tamto narzędzie liczy się jako pierwsze.

| Kryterium | Punkty |
|---|---|
| Pierwsze narzędzie działa w Twojej aplikacji | 4 |
| Drugie narzędzie działa w Twojej aplikacji | 4 |
| Agent sam wybiera właściwe narzędzie: jedno pytanie uruchamia pierwsze, drugie pytanie — drugie, a trzecie nie uruchamia żadnego (trzy zrzuty ekranu) | 4 |
| Pokaz na czacie kursu: link do aplikacji albo zrzuty ekranu oraz 2–3 zdania o tym, co robią narzędzia i komu się przydadzą | 4 |

Prompt na start:

```text
Chcę dodać do agenta dwa własne narzędzia pasujące do tematu mojego chatbota.
Zaproponuj pięć pomysłów: dla każdego napisz jednym zdaniem, co robi, skąd bierze dane
i czy wymaga klucza API. Wybiorę dwa, a potem dodamy je po kolei — najpierw jedno, test, potem drugie.
```

## Gdy coś nie działa

| Co widzisz | Co zrobić |
|---|---|
| Bot odpowiada, ale nie używa wyszukiwania | Zapytaj wprost: „Wyszukaj w internecie…”. Sprawdź, czy `OPENROUTER_MODEL` to `google/gemini-3.8-flash` i czy po zmianie uruchomiłeś serwer ponownie. |
| Błąd przy wyszukiwaniu | Poproś asystenta: „Zmień engine wyszukiwania z native na auto i sprawdź ponownie”. |
| Obraz się nie generuje | Skopiuj komunikat błędu do asystenta. Jeśli mówi o braku dostępu do modelu — zgłoś prowadzącemu, to kwestia klucza, nie Twojego kodu. |
| Bot „nie widzi” zdjęcia | Zmniejsz plik (poniżej 4 MB) i sprawdź model jak w pierwszym wierszu. |
| Po zmianach nic nie działa | Napisz do asystenta: „Cofnij ostatnią zmianę i wróć do działającej wersji”. W ostateczności weź starter. |
