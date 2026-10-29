# Lekcja 1. Działający chatbot za hasłem

**Na koniec masz własny link. Otwierasz go, wpisujesz hasło i rozmawiasz z AI. Tyle na dziś.**

Budujesz z Codex lub Claude Code. Ty określasz efekt i sprawdzasz, czy działa.

## Przygotowanie

Potrzebujesz narzędzi z [instrukcji instalacji](INSTALACJA_I_KONTA.md), dostępu do jednego asystenta, kont GitHub i Vercel oraz klucza OpenRouter od LABA.

Utwórz folder **moj-agent** i otwórz go w Codex lub Claude Code. To tutaj powstaje aplikacja. Folder pobranych materiałów trzymaj osobno.

Wykonuj poniższe kroki w jednej rozmowie z asystentem. Kolejny prompt wklej dopiero po sprawdzeniu poprzedniego kroku.

## 1. Uruchom stronę

**Wklej do asystenta:**

```text
Budujemy mój pierwszy chatbot na kursie LABA. Jestem początkujący.
Pisz po polsku i krótko. Wykonuj tylko aktualny krok, korzystając
z narzędzi do plików i terminala. Jeśli coś muszę zrobić sam, podaj
jedną konkretną czynność i poczekaj na wynik.

Sprawdź bieżący folder oraz Node.js, npm i Git.
W tym folderze przygotuj minimalny Next.js App Router z TypeScript.
Jeśli projekt już istnieje, kontynuuj go zamiast tworzyć nowy.
Nie nadpisuj moich plików. W PowerShell używaj npm.cmd i npx.cmd,
jeśli uruchamianie plików .ps1 jest blokowane.

Na stronie pokaż „Mój chatbot”, puste miejsce na rozmowę,
pole wiadomości i przycisk „Wyślij”. Na razie bez odpowiedzi AI.
Zainstaluj potrzebne zależności, uruchom stronę i podaj dokładny adres.
Zatrzymaj się po tym kroku.
```

**Ty:** otwórz adres wypisany w terminalu, np. localhost:3000. Jeśli podaje inny port, otwórz właśnie ten adres.

**Sprawdź:** widzisz tytuł, pole wiadomości i przycisk. Na tym etapie czat jeszcze nie odpowiada.

Jeśli serwer musisz uruchomić sam, wpisz w terminalu w folderze aplikacji:

- Windows PowerShell: `npm.cmd run dev`
- macOS lub CMD: `npm run dev`

Terminal z serwerem zostaw otwarty.

## 2. Podłącz model

**Wklej do asystenta:**

```text
Dodaj prawdziwy czat do tej aplikacji przez Vercel AI SDK
i @openrouter/ai-sdk-provider. Sprawdź zgodność wersji w oficjalnej
dokumentacji i zachowaj lockfile.

Użyj serwerowego /api/chat ze streamText i interfejsu zgodnego
z wybraną wersją SDK. Odpowiedź ma docierać strumieniowo.
Przekazuj historię bieżącej rozmowy, aby model znał poprzednie wiadomości.
Dodaj stan oczekiwania, czytelny błąd i blokadę pustych wiadomości.

Konfigurację pobieraj ze zmiennych OPENROUTER_API_KEY i OPENROUTER_MODEL.
Przygotuj .env.example z pustymi polami oraz .gitignore chroniący
.env i .env.local. Nie odczytuj istniejących sekretów i nie proś
o wklejanie klucza do rozmowy. Klucz ma pozostać wyłącznie na serwerze.

Wyjaśnij, jak samodzielnie wpisać wartości w .env.local.
Jeśli ich brakuje, pokaż czytelny komunikat zamiast udawanej odpowiedzi.
Nie dodawaj bazy danych ani innych funkcji. Nie wykonuj sam płatnych
wywołań — pierwszy test zrobię w przeglądarce.
```

**Ty:**

1. W głównym folderze aplikacji, obok package.json, otwórz lub utwórz plik **.env.local**.
2. Wpisz w nim lokalnie klucz od LABA i dokładny identyfikator modelu od prowadzącego:

```dotenv
OPENROUTER_API_KEY=tu_wpisz_klucz_od_LABA
OPENROUTER_MODEL=tu_wpisz_id_modelu_od_prowadzacego
```

3. Zapisz plik. Sprawdź, czy nie nazywa się .env.local.txt.
4. Zatrzymaj serwer przez Ctrl+C i uruchom go ponownie.

Nie wklejaj wartości klucza do asystenta, grupy ani repozytorium.

**Sprawdź w przeglądarce:**

- Wyślij: „Mam na imię Alex”.
- Następnie: „Jak mam na imię?”.

**Gotowe, gdy:** model odpowiada i pamięta imię w tej rozmowie. Po odświeżeniu historia może zniknąć — zapis rozmów zrobimy później.

## 3. Dodaj hasło

Jedno wspólne hasło do Twojego chatbota. Po otwarciu linku najpierw pojawia się ekran z polem hasła.

**Wklej do asystenta:**

```text
Zabezpiecz tego chatbota jednym hasłem warsztatowym.
Przed czatem pokaż prosty ekran „Wpisz hasło” i przycisk „Wejdź”.
Dodaj możliwość wyjścia, która usuwa sesję.

Hasło sprawdzaj wyłącznie na serwerze ze zmiennej CHAT_PASSWORD.
Po poprawnym haśle utwórz wygasającą sesję w podpisanym cookie:
HttpOnly, SameSite oraz Secure w produkcji.
Podpis opieraj na SESSION_SECRET. Nie wkładaj hasła do cookie.
Sprawdzaj sesję także w /api/chat, zanim nastąpi wywołanie OpenRouter.
Bez sesji endpoint ma zwracać 401 i nie wywoływać modelu.
Brak konfiguracji ma blokować dostęp, a nie wyłączać ochronę.
Ogranicz próby zgadywania hasła; nie traktuj licznika w pamięci
procesu jako globalnej ochrony na hostingu.

Dodaj puste CHAT_PASSWORD i SESSION_SECRET do .env.example.
Wyjaśnij, jak ustawić je lokalnie. SESSION_SECRET wygeneruj lokalnie
kryptograficznie i zapisz bez wypisywania jego wartości w rozmowie.
Nie odczytuj istniejących sekretów.

Bez kont użytkowników, rejestracji, OAuth i bazy danych.
Sprawdź poprawne i błędne hasło, wyjście oraz odmowę /api/chat
bez sesji. Te próby nie wymagają płatnego wywołania modelu.
Podaj wykonane sprawdzenia i te, które mam wykonać ręcznie.
```

**Ty:** ustaw **CHAT_PASSWORD** lokalnie w .env.local. Użyj własnego, trudnego do zgadnięcia hasła, innego niż hasła do Twoich kont. Po zmianie konfiguracji uruchom ponownie serwer.

**Sprawdź:**

- [ ] W prywatnym oknie przeglądarki widzę ekran hasła.
- [ ] Błędne hasło nie otwiera czatu.
- [ ] Poprawne hasło otwiera czat i mogę wysłać wiadomość.
- [ ] Po wyjściu znów muszę wpisać hasło.
- [ ] Asystent potwierdził, że /api/chat bez sesji zwraca 401, bez połączenia z modelem.

Samo schowanie czatu za formularzem nie wystarczy. Hasło ma chronić również wysyłanie wiadomości do modelu.

## 4. Opublikuj i sprawdź link

**Najpierw wklej do asystenta:**

```text
Przygotuj tę aplikację do publikacji na moim GitHub i Vercel.
Sprawdź build oraz pliki do commita. .env.local i inne sekrety
nie mogą trafić do repozytorium. Nie wypisuj ich wartości.
Jeśli sekret jest już śledzony przez Git, zatrzymaj publikację.

Pomóż mi zapisać projekt w moim własnym repozytorium, a następnie
zaimportować je do Vercel. Nie wysyłaj kodu do repo materiałów kursowych.
Jeśli muszę utworzyć repo lub zalogować się, poprowadź mnie
jedną czynnością naraz. Nie proś o hasło do konta ani token na czacie.

Podaj nazwy zmiennych do ustawienia na Vercel, bez ich wartości.
Nie pomijaj sprawdzania hasła po wdrożeniu.
Zostań przy obecnym zakresie: chatbot, hasło i działający link.
```

**Ty:**

1. Na GitHub utwórz własne puste repo, np. **moj-chatbot-laba**. Może być prywatne.
2. Podaj asystentowi adres tego repo — pomoże wysłać kod.
3. Zaloguj się do Vercel i zaimportuj swoje repo jako nowy projekt.
4. W **Environment Variables** ustaw cztery zmienne:

| Nazwa | Co wpisujesz bezpośrednio w panelu Vercel |
|---|---|
| OPENROUTER_API_KEY | Klucz od LABA |
| OPENROUTER_MODEL | Identyfikator modelu od prowadzącego |
| CHAT_PASSWORD | Hasło do Twojego chatbota |
| SESSION_SECRET | Lokalnie wygenerowany sekret podpisu sesji |

Wartości przenieś samodzielnie z lokalnego pliku do panelu. Nie przesyłaj zrzutów, na których są widoczne.

5. Uruchom wdrożenie. Po zmianie zmiennych wykonaj nowe wdrożenie.
6. Otwórz otrzymany link w prywatnym oknie przeglądarki.
7. Sprawdź błędne hasło, poprawne hasło i jedną odpowiedź czatu.
8. Wyłącz lokalny serwer. Link online nadal ma działać.

**Efekt końcowy: link + działające hasło + prawdziwa odpowiedź AI.**

## Gdy coś nie działa

Wklej do asystenta:

```text
Jestem w kroku [NUMER].
Używam [WINDOWS / MACOS] i [NAZWA TERMINALA].
Robię [CZYNNOŚĆ LUB KOMENDA].
Widzę [KOMUNIKAT BŁĘDU BEZ SEKRETÓW].

Znajdź przyczynę i napraw najmniejszy potrzebny zakres.
Nie przebudowuj aplikacji i nie dodawaj funkcji.
Nie wyłączaj hasła, żeby obejść błąd.
Jeżeli brakuje informacji, poproś o jedną konkretną rzecz.
Po naprawie podaj sposób sprawdzenia efektu.
```

PowerShell blokuje npm? Użyj `npm.cmd` zamiast `npm`. Strona nie odpowiada? Sprawdź, czy serwer działa i czy otwierasz port wypisany w terminalu.

## Koniec

- [ ] Mam link do własnego chatbota.
- [ ] Bez hasła nie można z niego korzystać.
- [ ] Po wpisaniu hasła model odpowiada.
- [ ] Klucz API i hasło nie znajdują się w repozytorium.

Na dziś wystarczy. [Praca domowa](PRACE_DOMOWE.md) pojawi się po zajęciach.

[Plan kursu](README.md) · [Instalacja](INSTALACJA_I_KONTA.md)
