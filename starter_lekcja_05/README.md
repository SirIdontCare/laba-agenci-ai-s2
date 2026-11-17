# Starter — agent po lekcji 4

Gotowa, działająca aplikacja w stanie „po lekcji 4”. Użyj jej, jeśli Twój projekt z poprzednich zajęć nie działa albo chcesz zacząć lekcję 5 z czystego miejsca.

## Co już działa

- czat z odpowiedzią pisaną na żywo (streaming),
- ekran hasła — bez hasła nikt nie wejdzie do czatu, do dashboardu ani do modelu,
- charakter chatbota i przykłady odpowiedzi (plik `lib/persona.ts`),
- wyszukiwanie w internecie z listą „Źródła”, zdjęcia (Vision), generowanie obrazów i przycisk „Analiza JSON” — tak jak po lekcji 3,
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

- **etykiety użytych narzędzi** nad odpowiedzią, np. „🌤️ pogoda”, „💱 waluty”,
- **pętla ReAct** — pod etykietami lista kroków po kolei, np. „Kroki: 1. waluty → 2. kalkulator”,
- **limit 6 kroków** na jedno zadanie — po dojściu do limitu agent pisze „Zatrzymałem się po 6 krokach” i pokazuje, co zdążył ustalić,
- **strona `/dashboard` (asystent podróży)** — wpisujesz miasto i datę, dostajesz pięć kart (pogoda, waluty, święta, Wikipedia, czas) z nazwą źródła i godziną pobrania, przycisk „Odśwież” oraz krótkie podsumowanie od agenta. Dostępna tylko po zalogowaniu hasłem; link jest w nagłówku czatu.

Notatki agenta i rozmowy nie są jeszcze nigdzie zapisywane — trwałą pamięć w bazie Supabase dodajesz na lekcji 5.

## Uruchomienie (5 minut)

1. Skopiuj ten folder w swoje miejsce na projekty (np. `Dokumenty/projekty/moj-agent`) i otwórz w nim terminal.
2. Zainstaluj biblioteki:

   ```bash
   npm install
   ```

   W Windows PowerShell wpisuj `npm.cmd` zamiast `npm`.

3. Skopiuj plik `.env.example` jako `.env.local` i uzupełnij cztery pierwsze wartości. Jeśli masz `.env.local` z poprzedniego projektu — po prostu skopiuj go tutaj, nazwy są te same. Sprawdź tylko, czy model to `google/gemini-3.8-flash` (wyszukiwanie i zdjęcia działają z modelami Gemini). Dwie zmienne `SUPABASE_…` na końcu pliku zostaw na razie puste — uzupełnisz je na lekcji 5.
4. Uruchom:

   ```bash
   npm run dev
   ```

5. Otwórz http://localhost:3000 i wpisz swoje hasło.

## Sprawdź, czy działa

Zadaj w czacie te pytania — przy każdym powinna pojawić się etykieta narzędzia i lista kroków:

```text
Jaka będzie jutro pogoda w Lizbonie?
```

```text
Sprawdź kurs euro, a potem policz, ile euro dostanę za 1500 zł.
```

Potem kliknij „Asystent podróży” w nagłówku, wpisz „Lizbona” i datę w najbliższych dniach. Powinno pojawić się pięć kart z godzinami pobrania. Prognoza pogody sięga najwyżej 16 dni naprzód — przy dalszej dacie karta pogody pokaże brak danych, a pozostałe karty działają normalnie.

## Zrób z niego swój projekt

Otwórz `lib/persona.ts` i zmień nazwę, powitanie, opis, przykłady oraz podpowiedzi obrazów na własny temat. Albo poproś asystenta:

```text
Zmień chatbota w pliku lib/persona.ts na: [opisz swój pomysł, np. asystent małej kwiaciarni w Krakowie].
Dopasuj nazwę, powitanie, zasady, dwa przykłady odpowiedzi i trzy podpowiedzi obrazów. Reszty aplikacji nie zmieniaj.
```

## Gdzie co jest

| Plik | Co robi |
|---|---|
| `lib/persona.ts` | charakter chatbota, zasady używania narzędzi i pracy krok po kroku, kształt analizy JSON |
| `lib/tools.ts` | narzędzia agenta (opisy, sprawdzanie danych wejściowych) i limit kroków `MAX_STEPS` |
| `lib/sources.ts` | funkcje pobierające dane: pogoda, waluty, święta, Wikipedia, kalkulator, czas |
| `lib/trip.ts` | pięć kart asystenta podróży — składane z funkcji z `lib/sources.ts` |
| `lib/model.ts` | połączenie z modelem przez OpenRouter (rozmowa, obrazy, wyszukiwanie) |
| `lib/session.ts` | hasło i sesja |
| `app/api/agent/route.ts` | agent: tryb `chat` (streaming, narzędzia, limit kroków) oraz tryb `analyze` (analiza JSON) |
| `app/api/image/route.ts` | generowanie obrazu z przycisku „Wygeneruj obraz” |
| `app/components/Chat.tsx` | wygląd czatu: etykiety narzędzi, lista kroków, komunikat o limicie, źródła, zdjęcia, obrazy |
| `app/dashboard/page.tsx` | strona `/dashboard`: formularz, pięć kart, podsumowanie od agenta |
