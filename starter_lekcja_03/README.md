# Starter — chatbot po lekcji 2

Gotowa, działająca aplikacja w stanie „po lekcji 2”. Użyj jej, jeśli Twój projekt z poprzednich zajęć nie działa albo chcesz zacząć lekcję 3 z czystego miejsca.

## Co już działa

- czat z odpowiedzią pisaną na żywo (streaming),
- ekran hasła — bez hasła nikt nie wejdzie do czatu ani do modelu,
- charakter chatbota i przykłady odpowiedzi (plik `lib/persona.ts`),
- przycisk **Analiza JSON** — model ocenia wiadomość i zwraca kategorię, priorytet oraz szkic odpowiedzi.

## Uruchomienie (5 minut)

1. Skopiuj ten folder w swoje miejsce na projekty i otwórz w nim terminal.
2. Zainstaluj biblioteki:

   ```bash
   npm install
   ```

   W Windows PowerShell wpisuj `npm.cmd` zamiast `npm`.

3. Skopiuj plik `.env.example` jako `.env.local` i uzupełnij cztery wartości. Jeśli masz `.env.local` z poprzedniego projektu — po prostu skopiuj go tutaj, nazwy są te same.
4. Uruchom:

   ```bash
   npm run dev
   ```

5. Otwórz http://localhost:3000, wpisz swoje hasło i napisz „Cześć”.

## Zrób z niego swój projekt

Otwórz `lib/persona.ts` i zmień nazwę, powitanie, opis oraz przykłady na własny temat. Albo poproś asystenta:

```text
Zmień chatbota w pliku lib/persona.ts na: [opisz swój pomysł, np. asystent małej kwiaciarni w Krakowie].
Dopasuj nazwę, powitanie, zasady i dwa przykłady odpowiedzi. Reszty aplikacji nie zmieniaj.
```

## Gdzie co jest

| Plik | Co robi |
|---|---|
| `lib/persona.ts` | charakter chatbota, przykłady, kształt analizy JSON |
| `lib/model.ts` | połączenie z modelem przez OpenRouter |
| `lib/session.ts` | hasło i sesja |
| `app/api/chat/route.ts` | rozmowa ze streamingiem |
| `app/api/analyze/route.ts` | analiza JSON |
| `app/components/Chat.tsx` | wygląd czatu |
