# Lekcja 4 — Pętla ReAct: agent, który działa krok po kroku

Na poprzednich zajęciach Twój agent dostał pierwsze narzędzia. Dziś dostaje ich **osiem** i uczy się pracować w pętli: robi krok, patrzy na wynik, decyduje, co dalej — i wie, kiedy przestać.

**Na koniec zajęć wrzucasz na czat kursu jeden zrzut ekranu:** Twój agent wykonuje jedno zadanie w kilku krokach.

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

**Twoja aplikacja z lekcji 3 działa?** Uruchom ją (`npm run dev`, w Windows PowerShell `npm.cmd run dev`), zaloguj się hasłem i zapytaj: „Ile dni zostało do końca roku?”. Jeśli dostajesz odpowiedź — przejdź do kroku 0.

**Nie działa albo jej nie masz?** Nie naprawiaj jej teraz. Weź gotowy projekt w stanie „po lekcji 3” — folder `starter_lekcja_04` w repozytorium kursu:

1. Pobierz repozytorium kursu:

   ```bash
   git clone https://github.com/SirIdontCare/laba-agenci-ai-s2.git
   ```

   Masz je już u siebie? Wejdź do folderu repozytorium i wpisz `git pull`.

2. Skopiuj folder `starter_lekcja_04` w swoje miejsce na projekty i otwórz w nim terminal.
3. Wpisz `npm install` (Windows PowerShell: `npm.cmd install`).
4. Skopiuj do tego folderu swój plik `.env.local` z poprzedniego projektu. Nie masz go? Skopiuj `.env.example` jako `.env.local` i uzupełnij cztery wartości.
5. Wpisz `npm run dev` i otwórz http://localhost:3000.

### Krok 0 — jeden prompt na początek

Otwórz asystenta w folderze aplikacji i wklej to **raz**. Kolejne prompty wklejaj w tej samej rozmowie.

```text
Dziś rozbudowujemy agenta w tej aplikacji: więcej narzędzi, praca w kilku krokach, limity.
Zanim cokolwiek zmienisz:

1. Przeczytaj package.json i sprawdź wersje: next, ai, @ai-sdk/react, @openrouter/ai-sdk-provider, zod.
2. Nie pisz kodu z pamięci. Sposób użycia funkcji sprawdzaj w node_modules/ai/docs/
   oraz w plikach typów bibliotek. W AI SDK 7 obowiązują m.in.: tool() z inputSchema,
   stopWhen: isStepCount(n), instructions zamiast system, toUIMessageStream().
3. Każdy nowy endpoint ma najpierw sprawdzić sesję i bez niej zwrócić 401, zanim wywoła model.
4. Nie czytaj i nie wypisuj wartości z .env.local.
5. Rozmawiaj ze mną po polsku, prostym językiem. Po każdej zmianie uruchom build,
   napraw błędy i napisz w 3 punktach, co zrobiłeś i jak to sprawdzić w przeglądarce.

Na razie niczego nie zmieniaj. Napisz tylko, jakie wersje znalazłeś, jakie narzędzia agent
ma już teraz i w którym pliku są zdefiniowane.
```

---

## Warsztat 1 — Osiem narzędzi (40 min)

**Po co:** im więcej agent potrafi sprawdzić sam, tym mniej zgaduje. Osiem prostych narzędzi to zestaw, z którego da się złożyć prawdziwe zadanie.

**Gotowe, gdy:** osiem narzędzi jest w agencie; dwa odpowiadają na pytanie testowe.

Osiem narzędzi z programu: **pogoda, waluty, święta, Wikipedia, kalkulator, czas, notatki, diagnostyka**. Wszystkie korzystają z darmowych danych — nie potrzebujesz nowych kluczy.

### 🟢 Minimum — osiem narzędzi jednym promptem

```text
Dodaj do agenta zestaw ośmiu narzędzi. Jeśli któreś już istnieje (np. aktualny czas), zostaw je
i dopasuj do listy. Dotychczasowe narzędzia (wyszukiwanie, obraz) mają działać dalej.

1. pogoda — prognoza dla miasta i dnia. Dane: Open-Meteo (geokodowanie nazwy miasta + prognoza), bez klucza.
2. waluty — kurs waluty wobec złotego i przeliczenie kwoty. Dane: API NBP (api.nbp.pl), bez klucza.
3. swieta — dni wolne od pracy w podanym kraju i roku. Dane: Nager.Date (date.nager.at), bez klucza.
4. wikipedia — krótkie streszczenie hasła z polskiej Wikipedii i link do artykułu.
5. kalkulator — działania na liczbach podanych jako osobne argumenty (bez wykonywania wpisanego kodu).
6. czas — aktualna data i godzina w podanej strefie czasowej.
7. notatki — zapisz notatkę i pokaż zapisane notatki. Na razie trzymaj je w pamięci serwera
   (znikną po restarcie — bazę danych dodamy na następnej lekcji).
8. diagnostyka — zwraca: nazwę modelu, listę dostępnych narzędzi, limit kroków i informację,
   czy wymagane zmienne środowiskowe są ustawione (tylko tak/nie — nigdy ich wartości).

Dla każdego narzędzia:
- najpierw sprawdź w dokumentacji API, jak wygląda zapytanie i odpowiedź,
- opisz je tak, żeby model wiedział, kiedy go użyć,
- sprawdzaj dane wejściowe (inputSchema),
- zwracaj tylko potrzebne pola oraz godzinę pobrania,
- gdy API nie odpowiada albo nie ma takiego miasta/waluty — zwróć czytelny komunikat po polsku
  zamiast błędu aplikacji.

W czacie pokaż etykietę każdego użytego narzędzia, tak jak przy dotychczasowych.
```

**Sprawdź** dwoma pytaniami — przy każdym powinna pojawić się etykieta innego narzędzia:

```text
Jaka będzie jutro pogoda w Lizbonie?
```

```text
Ile złotych to 250 euro po dzisiejszym kursie NBP?
```

Dwie odpowiedzi z etykietami narzędzi? **Minimum zrobione.**

### 🔵 Standard — sprawdź wszystkie osiem

Zadaj po jednym pytaniu do pozostałych narzędzi:

```text
Jakie dni wolne od pracy są w Portugalii w grudniu?
```

```text
Opowiedz w trzech zdaniach o Lizbonie — na podstawie Wikipedii, z linkiem.
```

```text
Policz: 3 noclegi po 420 zł plus 2 bilety po 389 zł.
```

```text
Która jest teraz godzina w Lizbonie?
```

```text
Zapisz notatkę: sprawdzić ceny lotów do Lizbony. Potem pokaż wszystkie moje notatki.
```

```text
Uruchom diagnostykę i powiedz, czy wszystko jest gotowe do pracy.
```

Jeśli któreś narzędzie nie odpowiada, skopiuj pytanie i odpowiedź do asystenta: „To narzędzie nie zadziałało — sprawdź je i napraw”.

Potem sprawdź, jak agent radzi sobie z błędem:

```text
Jaka będzie jutro pogoda w mieście Xyzabcowo?
```

Agent powinien napisać, że nie znalazł takiego miasta — a nie wymyślić prognozę.

### 🟣 Dla szybkich — dziewiąte narzędzie z Twojego tematu

Dodaj narzędzie, którego potrzebuje **Twój** chatbot — przyda się w pracy domowej.

```text
Zaproponuj trzy narzędzia pasujące do tematu mojego chatbota, które korzystają z darmowych
danych bez klucza API. Dla każdego napisz jednym zdaniem, co robi i skąd bierze dane.
Wybiorę jedno — dodasz je tak samo jak pozostałe: opis, sprawdzanie danych wejściowych,
czytelny błąd, etykieta w czacie.
```

---

## Warsztat 2 — ReAct: stan, limit i błędy (20 min)

**Po co:** agent bez hamulców potrafi kręcić się w kółko i zużywać budżet. Pętla ReAct to: **pomyśl → użyj narzędzia → zobacz wynik → zdecyduj, co dalej**. Limit kroków pilnuje, żeby się skończyła.

**Gotowe, gdy:** agent wykorzystuje wynik poprzedniego kroku i zatrzymuje się na limicie.

### 🟢 Minimum — kroki widać, limit działa

```text
Dopracuj pętlę agenta (ReAct):

- Limit: najwyżej 6 kroków modelu na jedno zadanie (stopWhen: isStepCount(6)).
- Dopisz do instrukcji agenta: przy zadaniu złożonym pracuj krok po kroku — użyj narzędzia,
  przeczytaj wynik i dopiero wtedy zdecyduj o następnym kroku. Nie zgaduj danych, które możesz sprawdzić.
- W czacie nad odpowiedzią pokaż listę kroków po kolei: numer kroku i nazwę użytego narzędzia,
  np. „1. pogoda → 2. waluty → 3. kalkulator”.
- Gdy agent dojdzie do limitu, pokaż komunikat „Zatrzymałem się po 6 krokach” i to,
  co udało się ustalić — zamiast pustej odpowiedzi.
```

**Sprawdź** zadaniem, w którym drugi krok zależy od pierwszego:

```text
Sprawdź kurs euro, a potem policz, ile euro dostanę za 1500 zł.
```

Widzisz dwa kroki po kolei, a wynik liczenia zgadza się z kursem z pierwszego kroku? Teraz sprawdź hamulec — poproś asystenta:

```text
Zmień na chwilę limit kroków na 2, żebym mógł zobaczyć komunikat o zatrzymaniu.
```

Zadaj pytanie, które wymaga więcej kroków:

```text
Porównaj pogodę jutro w Lizbonie, Rzymie, Atenach i Oslo.
```

Jest komunikat o zatrzymaniu? Przywróć limit 6 („Przywróć limit 6 kroków”). **Minimum zrobione.**

### 🔵 Standard — pełne hamulce

```text
Dodaj dwa kolejne ograniczenia i lepszą obsługę błędów:
- najwyżej 16 wywołań narzędzi na jedno zadanie (liczone osobno od kroków modelu),
- najwyżej 60 sekund na całe zadanie,
- pojedyncze narzędzie czeka na odpowiedź API najwyżej 10 sekund; po tym czasie zwraca
  komunikat „źródło nie odpowiada”,
- gdy narzędzie zwróci błąd, agent mówi wprost, czego nie udało się sprawdzić,
  i kończy z wynikiem częściowym — nie powtarza tego samego wywołania w kółko.
Pod odpowiedzią pokaż małym tekstem: liczba kroków, liczba wywołań narzędzi, czas.
```

**Sprawdź:** zadaj dowolne pytanie wielokrokowe i przeczytaj licznik pod odpowiedzią. Ile kroków, a ile wywołań narzędzi? To nie zawsze ta sama liczba.

### 🟣 Dla szybkich — przycisk STOP

```text
Dodaj w czacie przycisk „Stop”, widoczny tylko podczas pracy agenta. Kliknięcie przerywa
zadanie, a w rozmowie zostaje to, co agent zdążył zrobić, z dopiskiem „Przerwane przez użytkownika”.
```

---

## Warsztat 3 — Asystent podróży: pięć źródeł i dashboard (35 min)

**Po co:** składasz wszystko w jedno zadanie. Agent zbiera dane z pięciu miejsc, a Ty widzisz je na jednym ekranie — z godziną pobrania, żeby było jasne, że są świeże.

**Gotowe, gdy:** dashboard pokazuje dane z pięciu źródeł i godzinę pobrania.

Pięć źródeł: **pogoda, waluty, święta, Wikipedia, czas**.

### 🟢 Minimum — strona /dashboard

```text
Zbuduj asystenta podróży na nowej stronie /dashboard (dostępna tylko po zalogowaniu hasłem).

- Na górze pole „Dokąd jedziesz?” (miasto) i „Kiedy?” (data) oraz przycisk „Sprawdź”.
- Po kliknięciu strona pokazuje pięć kart z danymi z pięciu źródeł — użyj tych samych funkcji,
  z których korzystają narzędzia agenta:
  1. Pogoda — prognoza na wybrany dzień,
  2. Waluty — kurs waluty kraju docelowego wobec złotego,
  3. Święta — najbliższe dni wolne w kraju docelowym,
  4. Wikipedia — dwa zdania o mieście i link,
  5. Czas — aktualna godzina na miejscu i różnica względem Polski.
- Każda karta pokazuje: wartość z jednostką, nazwę źródła i godzinę pobrania.
- Przycisk „Odśwież” pobiera dane ponownie i aktualizuje godziny.
- Pod kartami krótkie podsumowanie od agenta (2–3 zdania): co spakować i na co uważać.
- Dodaj link do /dashboard w nagłówku czatu i link powrotny do czatu.
```

**Sprawdź:** wpisz „Lizbona” i datę w przyszłym tygodniu. Widzisz pięć kart z danymi i godzinami pobrania? Kliknij „Odśwież” — godziny powinny się zmienić. **Minimum zrobione.**

### 🔵 Standard — gdy jedno źródło zawiedzie

```text
Uodpornij dashboard:
- Każda karta ma stan: „OK”, „Ładuję…” albo „Brak danych”.
- Gdy jedno źródło nie odpowiada, pozostałe cztery karty działają normalnie, a ta jedna
  pokazuje „Brak danych — spróbuj odświeżyć”. Nigdy nie wstawiaj danych zastępczych ani wymyślonych.
- Podsumowanie agenta mówi wprost, którego źródła zabrakło.
```

**Sprawdź:** poproś asystenta: „Wyłącz na chwilę źródło walut (niech zwraca błąd), żebym zobaczył kartę Brak danych”. Zobacz wynik, potem: „Przywróć źródło walut”.

### 🟣 Dla szybkich — porównanie dwóch miast

```text
Dodaj tryb „Porównaj”: wpisuję dwa miasta i ten sam termin, a dashboard pokazuje karty obu
miast obok siebie. Agent na końcu poleca jedno z nich i uzasadnia to danymi z kart.
```

Albo zamień temat podróży na swój: ten sam układ kart, ale ze źródłami potrzebnymi **Twojemu** chatbotowi.

---

## Pokaż, co zrobiłeś

Wrzuć na czat kursu **jeden zrzut ekranu**: polecenie, lista kroków i odpowiedź agenta — albo Twój dashboard z pięcioma kartami. Dopisz jedno zdanie: który poziom zrobiłeś w każdym warsztacie.

Jeśli chcesz, opublikuj zmiany na Vercel tak jak w lekcji 1 i dodaj link.

## Praca domowa (16 pkt)

**Dodaj własny scenariusz wielokrokowy:** jedno polecenie, po którym agent sam wykonuje co najmniej 3 kroki. Na przykład: porównuje pogodę w 3 miastach i poleca cel podróży; sprawdza kurs waluty, przelicza budżet i zapisuje wynik w notatce; sprawdza święta w dwóch krajach i proponuje termin spotkania.

Scenariusz ma pasować do tematu Twojego chatbota. Zrzut ekranu z widocznymi krokami wrzuć na czat kursu.

| Kryterium | Punkty |
|---|---|
| Scenariusz działa od polecenia do odpowiedzi | 4 |
| Agent wykonuje co najmniej 3 kroki, a kolejny krok korzysta z wyniku poprzedniego | 4 |
| Agent zatrzymuje się na limicie i pokazuje zrozumiały komunikat, gdy narzędzie zwróci błąd | 4 |
| Zrzut ekranu z krokami i dwa zdania opisu na czacie kursu | 4 |

Prompt na start:

```text
Chcę dodać własny scenariusz wielokrokowy pasujący do tematu mojego chatbota: jedno polecenie,
po którym agent sam wykonuje co najmniej 3 kroki, a każdy kolejny korzysta z wyniku poprzedniego.
Zaproponuj trzy pomysły oparte na narzędziach, które agent już ma. Dla każdego napisz polecenie
użytkownika i kolejne kroki. Wybiorę jeden, a potem sprawdzimy go razem — także na limicie kroków
i przy błędzie narzędzia.
```

## Gdy coś nie działa

| Co widzisz | Co zrobić |
|---|---|
| Agent odpowiada „z głowy”, bez narzędzia | Zapytaj wprost: „Użyj narzędzia pogoda i sprawdź…”. Jeśli pomaga — poproś asystenta o poprawienie opisu tego narzędzia. |
| Narzędzie zwraca błąd albo „źródło nie odpowiada” | Spróbuj ponownie za minutę — darmowe API bywają chwilowo niedostępne. Jeśli błąd wraca, skopiuj go do asystenta. |
| Agent kończy za wcześnie albo urywa odpowiedź | Sprawdź, czy limit kroków wrócił do 6 po teście z limitem 2. |
| Dashboard pokazuje puste karty | Otwórz konsolę przeglądarki (F12), skopiuj czerwony komunikat do asystenta. |
| Kurs waluty „brak danych” w weekend | NBP publikuje kursy w dni robocze — poproś asystenta: „Gdy nie ma kursu z dziś, weź ostatni dostępny i pokaż jego datę”. |
| Po zmianach nic nie działa | Napisz do asystenta: „Cofnij ostatnią zmianę i wróć do działającej wersji”. W ostateczności weź `starter_lekcja_04`. |
