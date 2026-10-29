# Lekcja 1. Od czatu do agenta

**Dzisiaj budujesz własny czat AI i publikujesz go pod linkiem.**

Nie musisz pisać kodu ręcznie. Ty opisujesz zadanie, asystent pomaga je wykonać, a potem sprawdzasz efekt. **Jedno polecenie, jedna zmiana, jeden test.**

## Co będzie na zajęciach

| Etap | Co robimy | Po czym poznasz, że działa |
|---|---|---|
| Wprowadzenie | Pokaz gotowego agenta i omówienie jego decyzji | Rozróżniasz czat, ustalony proces i agenta |
| 1. Środowisko | Otwieramy projekt, zmieniamy stronę i naprawiamy błąd | Widzisz własną stronę w przeglądarce |
| 2. Czat | Podłączamy model przez OpenRouter i Vercel AI SDK | Wysyłasz wiadomość i dostajesz prawdziwą odpowiedź |
| 3. Publikacja | Wysyłamy projekt na GitHub i Vercel | Czat działa po wyłączeniu lokalnego serwera |

Podział na małe kroki pomaga wrócić do miejsca, w którym utkniesz. Wykonuj je po kolei, w tempie wskazanym przez prowadzącego.

## Zanim zaczniesz

- Wykonaj [instrukcję instalacji i zakładania kont](INSTALACJA_I_KONTA.md).
- Przygotuj **Codex lub Claude Code** z działającym dostępem na swoim koncie.
- Przygotuj konto GitHub i Vercel.
- Klucz OpenRouter oraz nazwę dopuszczonego modelu dostaniesz od LABA/prowadzącego.
- Utwórz osobny folder aplikacji, np. **moj-agent**.

**Folder materiałów to instrukcja. Folder moj-agent to Twoja aplikacja.** Nie generuj aplikacji w katalogu pobranych materiałów.

### Codex czy Claude Code?

Prompty poniżej działają w obu narzędziach. Nie musisz wklejać innych instrukcji zależnie od asystenta.

- W aplikacji z widokiem projektów wybierz **folder moj-agent** i pracę na lokalnych plikach.
- Jeśli używasz terminala, najpierw przejdź do tego folderu, a potem uruchom `codex` albo `claude`. Po instalacji Codex przez npm w Windows PowerShell może być potrzebne `codex.cmd`.
- Zostań w jednej rozmowie podczas tej lekcji. Nową rozmowę zacznij promptem „Powrót do pracy” z końca instrukcji.
- Zgody na operacje czytaj przed zatwierdzeniem. Jeśli asystent wskazuje inny folder, zatrzymaj go i otwórz właściwy projekt.

## Wprowadzenie. Co właściwie budujemy?

Prowadzący pokaże agenta, który rzeczywiście korzysta z narzędzia. Zwróć uwagę:

1. Co chce osiągnąć użytkownik?
2. Czy system tylko odpowiada, czy wykonuje dodatkową czynność?
3. Kto wybiera następny krok: człowiek, z góry zapisany proces czy model?
4. Które działania wymagają zgody człowieka?

Dzisiaj budujesz podstawę: **czat połączony z modelem AI**. Kolejne możliwości dołożymy na następnych spotkaniach. Sam wygląd okna rozmowy nie oznacza jeszcze, że mamy autonomicznego agenta.

---

## Etap 1. Uruchom własną stronę

### Krok 1A. Sprawdź miejsce pracy

**Ty:** otwórz folder moj-agent w asystencie. Wklej ten prompt tylko raz, na początku pracy:

```text
Pracujemy nad moim projektem na kursie LABA AI Agents. Jestem początkujący.
Pisz po polsku i krótko wyjaśniaj nowe pojęcia.

Wykonuj tylko aktualnie zlecony krok. Przed zmianą opisz plan w maksymalnie
3 punktach. Korzystaj z dostępnych narzędzi do pracy na plikach i uruchamiania
komend. Gdy czegoś nie możesz wykonać, podaj mi dokładnie jedną następną
czynność i poczekaj na wynik.

Nie nadpisuj istniejącego projektu. Nie usuwaj plików poza zakresem zadania.
Nie odczytuj ani nie wypisuj wartości z plików .env, kluczy i haseł.
Nie zastępuj prawdziwego połączenia z modelem atrapą bez wyraźnego oznaczenia.

Teraz tylko sprawdź: bieżący folder, czy istnieje package.json,
wersję Node.js, npm i Git. W PowerShell używaj npm.cmd i npx.cmd,
jeśli skrypty .ps1 są blokowane. Niczego jeszcze nie instaluj.
Podaj, co jest gotowe, czego brakuje i zatrzymaj się.
```

**Oczekiwany efekt:** asystent wskazuje właściwy folder oraz dostępne narzędzia. Brak package.json w pustym folderze jest normalny.

**Nie idź dalej, jeśli:** jesteś w katalogu materiałów, folderze domowym albo innym projekcie. Popraw wybór folderu.

### Krok 1B. Zbuduj pustą aplikację

**Ty:** po poprawnym sprawdzeniu środowiska wklej:

```text
W tym folderze przygotuj minimalny projekt Next.js App Router z TypeScript.
Jeżeli projekt już istnieje, uzupełnij go zamiast tworzyć kolejny.

Użyj wersji zaleconych przez prowadzącego. Jeśli nie zostały podane,
sprawdź oficjalną dokumentację i zgodność zależności, zanim je wybierzesz.
Zapisz dokładne wersje i lockfile; nie aktualizuj ich samowolnie w kolejnych krokach.

Na stronie głównej wyświetl tytuł „Mój agent AI” i tekst „Pierwsza lekcja LABA”.
Na tym etapie bez modelu, bazy danych i logowania użytkowników.
Zainstaluj zależności i uruchom aplikację.
Podaj dokładny adres z terminala oraz sposób zatrzymania serwera.
Jeśli nie możesz utrzymać serwera uruchomionego, podaj komendę,
którą mam wykonać w terminalu w folderze projektu. Zatrzymaj się po tym kroku.
```

**Ty:** otwórz adres podany przez terminal. Może to być localhost:3000, ale jeśli terminal poda inny port, użyj właśnie tego adresu.

**Sprawdź:**

- [ ] Widzę stronę z tytułem „Mój agent AI”.
- [ ] Wiem, w którym folderze jest projekt.
- [ ] Wiem, gdzie działa serwer. Ctrl+C w jego terminalu go zatrzymuje.

Jeśli sam uruchamiasz aplikację, w folderze z package.json wpisz:

| Windows PowerShell | macOS / CMD |
|---|---|
| `npm.cmd run dev` | `npm run dev` |

### Krok 1C. Zmień jedną rzecz i sprawdź efekt

```text
Zmień tylko tekst pod tytułem na „Buduję swojego pierwszego agenta”.
Nie przebudowuj strony i nie dodawaj funkcji.
Po zmianie wskaż zmieniony plik i powiedz, jak sprawdzić efekt w przeglądarce.
```

**Ty:** wróć do strony. Jeśli trzeba, odśwież ją.

**Gotowe, gdy:** nowy tekst rzeczywiście jest na stronie. Komunikat asystenta „zmienione” nie zastępuje sprawdzenia.

### Krok 1D. Zobacz błąd i napraw go

To kontrolowana próba, wykonywana z prowadzącym.

```text
Przygotuj odwracalne ćwiczenie z błędem importu w tej aplikacji.
Najpierw zapisz aktualny działający stan w lokalnym Git, jeśli jest dostępny;
nie wysyłaj nic do internetu i nie dodawaj plików .env.

Dodaj mały komponent z tekstem na stronie, sprawdź go, a następnie celowo
zmień tylko ścieżkę jego importu na nieistniejącą.
Pokaż mi, gdzie zobaczę błąd. Nie naprawiaj go jeszcze.
Nie zmieniaj zależności ani konfiguracji.
```

**Ty:** zobacz komunikat w przeglądarce lub terminalu. Następnie wklej:

```text
Wyjaśnij ten błąd jednym prostym zdaniem. Znajdź jego przyczynę i napraw
wyłącznie błędny import. Sprawdź, czy strona znów działa.
Nie ukrywaj komunikatu błędu i nie usuwaj komponentu jako „naprawy”.
```

**Gotowe, gdy:** potrafisz wskazać, co się zepsuło, i widzisz ponownie działającą stronę.

---

## Etap 2. Podłącz prawdziwy model AI

### Krok 2A. Przygotuj konfigurację bez ujawniania klucza

```text
Przygotuj konfigurację czatu: Vercel AI SDK i jawny provider
@openrouter/ai-sdk-provider. Sprawdź w oficjalnej dokumentacji zgodność
wersji oraz aktualny sposób obsługi streamingu, zanim napiszesz kod.
Nie zastępuj AI SDK samym zapytaniem HTTP.

Utwórz .env.example z pustymi polami:
OPENROUTER_API_KEY=
OPENROUTER_MODEL=

Przygotuj .gitignore tak, aby lokalne pliki .env i .env.local nie trafiały
do repozytorium, a .env.example mógł być zapisany bez sekretów.
Jeżeli .env.local już istnieje, nie odczytuj go ani nie nadpisuj.
Wyjaśnij mi, jak samodzielnie utworzyć lub otworzyć .env.local
i wpisać klucz oraz identyfikator modelu. Nie proś o ich wklejenie do rozmowy.
Nie wykonuj jeszcze płatnego wywołania modelu.
```

**Ty:**

1. Utwórz lub otwórz plik **.env.local w głównym folderze aplikacji**, obok package.json.
2. Wpisz lokalnie klucz od LABA i dokładny identyfikator modelu od prowadzącego.
3. Zapisz plik. Uważaj, żeby nie miał nazwy .env.local.txt.
4. Jeśli serwer już działał, zatrzymaj go i uruchom ponownie.

Nie wysyłaj tego pliku na czat. Nie dodawaj prefiksu NEXT_PUBLIC_ do klucza — oznaczałby konfigurację udostępnianą stronie.

**Jeśli nie masz jeszcze klucza:** przygotuj konfigurację i zgłoś brak prowadzącemu. Nie kupuj dostępu w ciemno i nie oznaczaj połączenia jako sprawdzonego.

### Krok 2B. Zbuduj prosty czat

```text
W tym samym projekcie dodaj czat przez Vercel AI SDK i OpenRouter.

Zakres:
- serwerowy endpoint /api/chat korzystający ze streamText;
- konfiguracja wyłącznie z OPENROUTER_API_KEY i OPENROUTER_MODEL;
- jedno pole wiadomości, przycisk „Wyślij” i historia bieżącej rozmowy;
- rzeczywista odpowiedź strumieniowa zgodna z wybraną wersją SDK;
- czytelny stan oczekiwania i błąd, bez ujawniania sekretów;
- blokada pustej wiadomości oraz powtórnego wysłania podczas oczekiwania;
- serwerowa walidacja rozmiaru wejścia i ograniczenie długości odpowiedzi.

Nie dodawaj jeszcze bazy danych, narzędzi, załączników ani pełnego systemu kont.
Nie odczytuj pliku .env.local. W kodzie odwołuj się do zmiennych środowiskowych.
Nie wykonuj testowych wywołań modelu samodzielnie. Przygotuj aplikację,
uruchom dostępne kontrole bez API i podaj mi adres do ręcznego testu.
Wskaż osobno testy wykonane oraz te, których jeszcze nie uruchomiono.
```

### Krok 2C. Sprawdź rozmowę

**Ty:** na lokalnej stronie wyślij kolejno:

1. „Mam na imię Alex. Odpowiedz jednym zdaniem.”
2. „Jak mam na imię?”
3. „Wymień trzy pomysły na zastosowanie asystenta AI w małej firmie.”

**Oczekiwany efekt:**

- Pierwsza wiadomość dostaje odpowiedź modelu.
- W tej samej rozmowie model ma dostęp do poprzednich wiadomości.
- Przy dłuższej odpowiedzi tekst dociera stopniowo. Szybka odpowiedź może pojawić się niemal od razu — sama obserwacja animacji nie dowodzi streamingu.

Na razie historia może zniknąć po odświeżeniu. Trwałą pamięć zbudujemy później.

Poproś asystenta o sprawdzenie techniczne:

```text
Sprawdź w kodzie i dostępnych lokalnych kontrolach, czy frontend odbiera
strumień z endpointu, zamiast animować gotowy tekst.
Nie wykonuj kolejnych płatnych wywołań modelu.
Wskaż dowód, który mogę zobaczyć w narzędziach przeglądarki podczas
mojego następnego ręcznego testu. Jeśli nie możesz potwierdzić streamingu,
napisz to wprost i zaproponuj najmniejszą poprawkę.
```

### Krok 2D. Przygotuj czat do publikacji

Publiczny link do strony nie może oznaczać nieograniczonego korzystania z klucza LABA.

```text
Przygotuj prostą kontrolę dostępu do szkoleniowego czatu przed publikacją.
Nie buduj jeszcze kont użytkowników ani integracji OAuth.

Zaproponuj najprostszy wariant działający na naszym hostingu:
ochrona wdrożenia, jeśli jest dostępna, albo hasło warsztatowe sprawdzane
na serwerze z wygasającą, podpisaną sesją w cookie HttpOnly.
Dla wariantu aplikacyjnego przygotuj potrzebne nazwy zmiennych w .env.example.
Ich wartości wprowadzę lokalnie i na hostingu, nie w tej rozmowie.

Zabezpiecz sam endpoint /api/chat, nie tylko widok strony.
Bez poprawnego dostępu odrzuć żądanie przed wywołaniem OpenRouter.
Dodaj ograniczenia zapytań i kosztów odpowiednie dla wybranego wdrożenia.
Jawnie wskaż ograniczenia rozwiązania: licznik tylko w pamięci procesu
nie jest globalnym limitem dla wielu instancji na Vercel.
Nie deklaruj pełnego limitu kosztów bez działającego mechanizmu.

Sprawdź odmowę dostępu bez wykonywania płatnego wywołania.
Nie wyłączaj ochrony, aby przejść test. Podaj, co mam sprawdzić ręcznie.
```

**Ty:** wykonaj wskazane ustawienia z prowadzącym. Jeśli brakuje działającej ochrony, dokończ lokalną próbę i wróć do publikacji po jej skonfigurowaniu.

**Sprawdź etap 2:**

- [ ] Czat naprawdę odpowiada.
- [ ] Model korzysta z wiadomości bieżącej sesji.
- [ ] Pusta wiadomość nie jest wysyłana.
- [ ] Problemy są pokazywane czytelnym komunikatem.
- [ ] Klucz pozostaje na serwerze.
- [ ] Brak dostępu blokuje wywołanie modelu.

---

## Etap 3. Opublikuj aplikację

### Krok 3A. Przygotuj wersję do zapisania

```text
Przygotuj projekt do pierwszej publikacji. Nie wysyłaj go jeszcze do internetu.

Sprawdź build i dostępne kontrole projektu.
Sprawdź listę plików śledzonych oraz przygotowanych do commita.
Zweryfikuj, że pliki .env są ignorowane, a .env.example zawiera tylko puste pola.
Nie wypisuj wartości sekretów ani zawartości lokalnej konfiguracji.
Jeżeli sekret jest już śledzony przez Git, zatrzymaj publikację i opisz problem.

Przygotuj lokalny commit tylko z plikami projektu.
Nie zmieniaj historii i nie używaj force push.
Podaj wynik builda, listę istotnych zmian i to, co nadal wymaga ręcznej próby.
```

**Gotowe, gdy:** build przechodzi, a w plikach do wysłania nie ma sekretów. Jeżeli budowanie wymaga konfiguracji, asystent ma wskazać nazwę brakującej zmiennej, a nie prosić o jej wartość na czacie.

### Krok 3B. Zapisz kod na swoim GitHub

**Ty:**

1. Zaloguj się do GitHub.
2. Wybierz **New repository**.
3. Nazwij repo np. **moj-agent-laba**.
4. Dla swojej aplikacji możesz wybrać **Private**.
5. Utwórz puste repo: bez dodatkowego README, licencji i .gitignore, jeśli masz już te pliki lokalnie.
6. Skopiuj adres repozytorium. Adres repo to nie sekret.

Wklej do asystenta, uzupełniając adres:

```text
Moje repozytorium aplikacji: [WKLEJ ADRES SWOJEGO REPO].

Sprawdź aktualny remote i gałąź. Połącz ten lokalny projekt z podanym repo
i wyślij przygotowany commit. Nie wysyłaj nic do repo materiałów kursowych.
Nie nadpisuj istniejącego remote bez wyjaśnienia i nie używaj force push.

Jeśli potrzebne jest logowanie, poprowadź mnie przez standardowy proces
w przeglądarce lub narzędziu. Nie proś o hasło ani token w tej rozmowie.
Na końcu podaj link do zapisanej wersji i sposób sprawdzenia plików na GitHub.
```

**Ty:** otwórz swoje repo w przeglądarce. Sprawdź obecność kodu i brak plików .env.

### Krok 3C. Wdróż na Vercel

**Ty:**

1. Zaloguj się do Vercel kontem połączonym z GitHub.
2. Wybierz utworzenie nowego projektu i import swojego repo.
3. Wybierz **folder aplikacji** jako katalog projektu. Jeśli package.json jest w głównym folderze repo, nie wskazuj innego katalogu.
4. Zostaw wykryty framework Next.js, jeśli odpowiada projektowi.
5. W sekcji **Environment Variables** dodaj OPENROUTER_API_KEY, OPENROUTER_MODEL i zmienne ochrony dostępu przygotowane w kroku 2D.
6. Wartości wpisuj bezpośrednio w panelu. Nie wysyłaj zrzutu zawierającego klucze.
7. Uruchom wdrożenie i poczekaj na jego wynik.
8. Jeśli zmieniasz zmienne po wdrożeniu, uruchom nowe wdrożenie.

Jeśli nie wiesz, co wpisać w ustawieniach:

```text
Pomóż mi skonfigurować import tego projektu na Vercel.
Na podstawie plików projektu podaj katalog aplikacji, komendę budowania
i nazwy potrzebnych zmiennych. Nie odczytuj ich wartości.
Wyjaśnij, które ustawienia mam uzupełnić w panelu.
Nie zmieniaj projektu ani nie uruchamiaj dodatkowego płatnego planu.
```

### Krok 3D. Sprawdź link, nie tylko zielony build

**Ty:**

1. Otwórz adres wdrożenia w nowym prywatnym oknie przeglądarki.
2. Sprawdź, czy bez dostępu czat jest zablokowany.
3. Uzyskaj dostęp zgodnie z ustawioną ochroną.
4. Wyślij jedną wiadomość i sprawdź odpowiedź.
5. Wyłącz lokalny serwer, a potem ponów otwarcie strony online.
6. Z prowadzącym sprawdź kontrolowany błąd, np. brak wymaganej konfiguracji w oddzielnym wdrożeniu testowym. Po teście przywróć ustawienia.

**Gotowe, gdy:** aplikacja działa przez internet, a płatny endpoint ma działającą ochronę. Sam ekran „Deployment successful” potwierdza wdrożenie, nie połączenie z modelem.

---

## Gdy utkniesz — prompty ratunkowe

### „Nie wiem, co zrobić dalej”

```text
Jestem w kroku [NUMER]. Widzę [OPIS EKRANU].
Podaj mi tylko jedną następną czynność. Napisz, gdzie mam ją wykonać:
w asystencie, terminalu czy przeglądarce. Poczekaj na mój wynik.
```

### „Mam błąd”

```text
Krok: [NUMER]. System i terminal: [NP. WINDOWS, POWERSHELL].
Uruchamiam: [KOMENDA].
Wynik: [WKLEJ KOMUNIKAT BEZ SEKRETÓW].

Najpierw ustal przyczynę na podstawie tego komunikatu i plików projektu.
Jeśli brakuje danych, poproś o jedną konkretną informację.
Napraw najmniejszy potrzebny zakres, bez przebudowy działających części.
Podaj test, który pokaże, że problem został rozwiązany.
```

### „Asystent robi za dużo”

```text
Zatrzymaj rozszerzanie projektu. W tym kroku chcę tylko: [JEDEN REZULTAT].
Podsumuj już wykonane zmiany i wykonaj wyłącznie to, czego brakuje
do tego rezultatu. Nie usuwaj mojej pracy i nie cofaj zmian bez uzgodnienia.
```

### Powrót do pracy w nowej rozmowie

```text
Kontynuuję projekt LABA AI Agents. Jestem w kroku [NUMER] lekcji 1.
Sprawdź package.json, strukturę projektu i stan Git, bez czytania plików .env.
Nie twórz nowej aplikacji i nie aktualizuj zależności.
Podsumuj obecny stan, a potem pomóż wykonać tylko ten krok:
[WKLEJ INSTRUKCJĘ KROKU].
```

## Najczęstsze problemy

| Widzisz | Co sprawdzić |
|---|---|
| npm.ps1 / running scripts is disabled | W PowerShell użyj npm.cmd zamiast npm i npx.cmd zamiast npx |
| git -- version nie działa | Popraw na git --version, bez spacji po dwóch myślnikach |
| Brak package.json | Czy terminal jest w folderze aplikacji, a projekt został utworzony? |
| Strona nie odpowiada | Czy serwer działa i otwierasz dokładny port z terminala? |
| Strona działa, czat nie odpowiada | Komunikat backendu, dostęp do modelu, zmienne i ponowne uruchomienie serwera |
| Lokalnie działa, na Vercel nie | Zmienne na hostingu, nowe wdrożenie i logi błędu bez sekretów |
| 401 / brak dostępu | Czy masz aktywny dostęp warsztatowy? Nie usuwaj zabezpieczenia |
| Asystent mówi „gotowe”, ale nie sprawdził | Poproś o rozdzielenie wykonanych kontroli od testów nieuruchomionych |

Nie wklejaj całych logów bez sprawdzenia, czy nie zawierają kluczy lub danych prywatnych.

## Koniec lekcji — Twoja checklista

- [ ] Potrafię otworzyć właściwy projekt i zlecić jedną zmianę.
- [ ] Widziałem kontrolowany błąd i jego naprawę.
- [ ] Mój czat odpowiada przez model z OpenRouter.
- [ ] Mam sprawdzony streaming i historię bieżącej rozmowy.
- [ ] Klucz nie trafił do repozytorium ani przeglądarki.
- [ ] Kod jest zapisany na moim GitHub.
- [ ] Aplikacja działa na Vercel po wyłączeniu lokalnego serwera.
- [ ] Brak dostępu blokuje płatne wywołanie.
- [ ] Znam link do aplikacji i ostatnią działającą wersję kodu.

Niezrobiony test oznacz jako **niesprawdzony**, a napotkany błąd zapisz do dokończenia. Nie musisz zgadywać, że działa.

Praca domowa pojawi się po zajęciach w [zasadach i zadaniach](PRACE_DOMOWE.md).

[Plan kursu](README.md) · [Instalacja](INSTALACJA_I_KONTA.md) · [Jak pracujemy](START.md)
