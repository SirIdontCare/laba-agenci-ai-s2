# Starter — agent po lekcji 3

Gotowa, działająca aplikacja w stanie „po lekcji 3”. Użyj jej, jeśli Twój projekt z poprzednich zajęć nie działa albo chcesz zacząć lekcję 4 z czystego miejsca.

## Co już działa

- czat z odpowiedzią pisaną na żywo (streaming),
- ekran hasła — bez hasła nikt nie wejdzie do czatu ani do modelu,
- charakter chatbota i przykłady odpowiedzi (plik `lib/persona.ts`),
- **wyszukiwanie w internecie** — pod odpowiedzią lista „Źródła” z linkami i dopiskiem „pobrano: data i godzina”,
- **własne narzędzie `aktualnyCzas`** — data, dzień tygodnia i godzina w Polsce,
- **etykiety użytych narzędzi** nad odpowiedzią, np. „🔎 wyszukiwanie”, „🕒 aktualnyCzas”, „🎨 generujObraz”,
- **zdjęcia (Vision)** — przycisk „Dodaj zdjęcie” (jpg, png, webp, do 4 MB), miniatura w rozmowie,
- **generowanie obrazów** — przycisk „Wygeneruj obraz”, podpowiedzi opisów, przycisk „Pobierz”, nazwa modelu pod obrazem,
- **jeden endpoint `/api/agent`** — tryb `chat` (rozmowa z narzędziami, limit 5 kroków) i tryb `analyze` (przycisk „Analiza JSON”).

## Uruchomienie (5 minut)

1. Skopiuj ten folder w swoje miejsce na projekty (np. `Dokumenty/projekty/moj-agent`) i otwórz w nim terminal.
2. Zainstaluj biblioteki:

   ```bash
   npm install
   ```

   W Windows PowerShell wpisuj `npm.cmd` zamiast `npm`.

3. Skopiuj plik `.env.example` jako `.env.local` i uzupełnij cztery wartości. Jeśli masz `.env.local` z poprzedniego projektu — po prostu skopiuj go tutaj, nazwy są te same. Sprawdź tylko, czy model to `google/gemini-3.8-flash` (wyszukiwanie i zdjęcia działają z modelami Gemini).
4. Uruchom:

   ```bash
   npm run dev
   ```

5. Otwórz http://localhost:3000, wpisz swoje hasło i zapytaj: „Ile dni zostało do końca roku?”. Nad odpowiedzią powinna pojawić się etykieta „🕒 aktualnyCzas”.

## Zrób z niego swój projekt

Otwórz `lib/persona.ts` i zmień nazwę, powitanie, opis, przykłady oraz podpowiedzi obrazów na własny temat. Albo poproś asystenta:

```text
Zmień chatbota w pliku lib/persona.ts na: [opisz swój pomysł, np. asystent małej kwiaciarni w Krakowie].
Dopasuj nazwę, powitanie, zasady, dwa przykłady odpowiedzi i trzy podpowiedzi obrazów. Reszty aplikacji nie zmieniaj.
```

## Gdzie co jest

| Plik | Co robi |
|---|---|
| `lib/persona.ts` | charakter chatbota, zasady używania narzędzi, podpowiedzi obrazów, kształt analizy JSON |
| `lib/tools.ts` | narzędzia agenta: wyszukiwanie, `aktualnyCzas`, `generujObraz` |
| `lib/model.ts` | połączenie z modelem przez OpenRouter (rozmowa, obrazy, wyszukiwanie) |
| `lib/session.ts` | hasło i sesja |
| `app/api/agent/route.ts` | agent: tryb `chat` (streaming i narzędzia) oraz tryb `analyze` (analiza JSON) |
| `app/api/image/route.ts` | generowanie obrazu z przycisku „Wygeneruj obraz” |
| `app/components/Chat.tsx` | wygląd czatu: etykiety narzędzi, źródła, zdjęcia, obrazy |
