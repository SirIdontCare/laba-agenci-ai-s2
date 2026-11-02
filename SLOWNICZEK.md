# Słowniczek — po ludzku

Nie musisz zapamiętywać wszystkiego. Wróć tutaj, kiedy trafisz na nowe słowo. Przykłady odnoszą się do chatbota z pierwszej lekcji.

## Komputer i pliki

| Pojęcie | Co oznacza | Przykład z kursu |
|---|---|---|
| Folder / katalog | Miejsce grupujące pliki | moj-agent |
| Plik | Zapisana rzecz w folderze | package.json |
| Ścieżka | Adres pliku lub folderu na komputerze | C:\projekty\moj-agent |
| Główny folder projektu / root | Najwyższy folder konkretnej aplikacji | Tu zwykle leży package.json |
| Rozszerzenie pliku | Końcówka nazwy określająca rodzaj | .md to instrukcja tekstowa, .json to zapis danych |
| Markdown / .md | Tekst z prostym formatowaniem | README.md na GitHub |
| README | Strona startowa projektu | Wyjaśnia, co otworzyć najpierw |
| ZIP | Spakowany zestaw plików | Materiały z Download ZIP trzeba rozpakować |
| Ukryty plik | Plik niewidoczny w domyślnym widoku | .env.local |
| Zapis pliku | Utrwalenie wpisanej treści | Ctrl+S albo Cmd+S |

## Terminal i narzędzia

| Pojęcie | Co oznacza | Przykład |
|---|---|---|
| Terminal | Okno do wpisywania poleceń | Otwierasz PowerShell lub Terminal na Macu |
| PowerShell / CMD / Bash / Zsh | Program interpretujący polecenia w terminalu | Polecenie dla PowerShell nie zawsze pasuje do Bash |
| Komenda | Polecenie dla komputera | git --version |
| CLI | Program obsługiwany z terminala | Codex CLI |
| PATH | Lista miejsc, w których system szuka programów | Po instalacji otwierasz nowy terminal |
| Node.js | Środowisko uruchamiające JavaScript poza przeglądarką | Uruchamia projekt Next.js |
| npm | Narzędzie instalujące biblioteki i uruchamiające polecenia projektu | npm install |
| npm.cmd | Windowsowy plik uruchamiający npm | Używamy go przy blokadzie npm.ps1 |
| npx | Narzędzie uruchamiające pakiety; może je pobrać, jeśli ich brak | Asystent może użyć go do utworzenia projektu |
| Zależność / paczka / biblioteka | Gotowy fragment oprogramowania używany przez projekt | Biblioteka do połączenia z modelem |
| package.json | Opis projektu, zależności i dostępnych poleceń | Zawiera skrypt dev |
| Lockfile | Zapis dokładnych wersji zależności | package-lock.json pomaga odtworzyć instalację |
| node_modules | Folder z zainstalowanymi bibliotekami | Nie wysyłamy go na GitHub |
| Skrypt dev | Polecenie uruchomienia wersji roboczej strony | npm run dev |

## AI i aplikacja

| Pojęcie | Co oznacza | Przykład |
|---|---|---|
| Prompt | Instrukcja przekazana AI | „Dodaj ekran hasła” |
| Asystent kodowania | AI pomagające zmieniać pliki i uruchamiać narzędzia | Codex lub Claude Code |
| Model | System generujący odpowiedź | Model wskazany przez prowadzącego |
| Identyfikator modelu / model ID / slug | Dokładna nazwa używana przez API; może różnić się od nazwy wyświetlanej w aplikacji | openai/gpt-6-luna; [lista i konfiguracja](MODELE_DO_CWICZEN.md) |
| Chatbot | Aplikacja do rozmowy z modelem | Nasz efekt lekcji 1 |
| Agent | System, który może dobierać kroki i używać narzędzi do zadania | Rozwijamy go w dalszej części kursu |
| API | Sposób, w jaki programy wysyłają sobie żądania | Nasz serwer prosi OpenRouter o odpowiedź |
| Klucz API | Sekret dający programowi dostęp do usługi | Klucz OpenRouter od LABA |
| OpenRouter | Usługa pośrednicząca w dostępie do modeli | Aplikacja używa przydzielonego klucza |
| Token modelu | Jednostka fragmentów tekstu przetwarzanych przez model | Zużycie tokenów wpływa na limit lub koszt |
| Next.js | Narzędzia do budowy naszej strony i części serwerowej | Projekt chatbota |
| Vercel AI SDK | Biblioteki ułatwiające pracę aplikacji z modelami | Obsługują m.in. generowanie i przesyłanie odpowiedzi |
| Provider | Adapter łączący bibliotekę z dostawcą | Adapter OpenRouter do AI SDK |
| Frontend | Część aplikacji, którą widzisz w przeglądarce | Przycisk „Wyślij” |
| Backend / serwer | Część wykonująca operacje po stronie serwera | Sprawdza hasło i używa klucza API |
| Endpoint | Adres konkretnej funkcji serwera | /api/chat |
| Streaming | Przesyłanie odpowiedzi we fragmentach | Tekst pojawia się podczas generowania |
| Sesja rozmowy | Obecna rozmowa z historią wiadomości | Chatbot pamięta imię do odświeżenia |

## Uruchomienie i konfiguracja

| Pojęcie | Co oznacza | Przykład |
|---|---|---|
| Lokalnie | Na Twoim komputerze | Czat działa podczas pracy serwera |
| localhost | Adres wskazujący własny komputer | http://localhost:3000 |
| Port | Numer pozwalający wybrać usługę na komputerze | 3000 albo 3001 |
| Serwer deweloperski | Program obsługujący stronę podczas pracy | Działa po npm run dev |
| Build | Przygotowanie i sprawdzenie wersji do wdrożenia | npm run build, jeśli projekt ma taki skrypt |
| Deploy / wdrożenie | Uruchomienie aplikacji na hostingu | Publikacja na Vercel |
| Hosting | Usługa utrzymująca działającą aplikację | Vercel |
| URL / link | Adres strony | Adres wdrożenia .vercel.app |
| Production | Wersja docelowa dostępna pod głównym adresem projektu | Link wysyłany do testu |
| Preview | Oddzielne wdrożenie do podglądu zmian | Może mieć inny adres i konfigurację |
| Zmienna środowiskowa | Nazwana wartość konfiguracji | OPENROUTER_MODEL |
| .env.local | Lokalny plik z konfiguracją aplikacji | Tu ręcznie wpisujesz klucz |
| .env.example | Szablon nazw zmiennych bez sekretów | Pomaga ustawić projekt na innym komputerze |
| Redeploy | Ponowne wdrożenie | Potrzebne po zmianie konfiguracji hostingu |
| Logi | Komunikaty programu o jego działaniu i błędach | Czytasz pierwszy błąd wdrożenia |

## Hasło i dostęp

| Pojęcie | Co oznacza | Przykład |
|---|---|---|
| CHAT_PASSWORD | Hasło do Twojego szkoleniowego czatu | Nie jest hasłem do GitHub |
| Cookie | Mała informacja przechowywana przez przeglądarkę | Potwierdza udaną weryfikację hasła |
| Sesja dostępu | Czas, w którym aplikacja rozpoznaje dostęp | Kończy się po wyjściu lub wygaśnięciu |
| SESSION_SECRET | Sekret serwera do podpisu sesji | Inny niż hasło wpisywane na ekranie |
| HttpOnly | Cookie niedostępne do odczytu przez JavaScript strony | Ustawienie sesji dostępu |
| 401 | Serwer nie uznał uwierzytelnienia | Może pochodzić z naszego czatu albo od dostawcy API |
| 403 | Brak uprawnienia do danej operacji | Samo ponowne logowanie nie zawsze pomoże |
| 429 | Przekroczony limit | Nie ponawiaj wywołania w pętli |
| HTTPS | Szyfrowane połączenie z witryną | Link wdrożonej aplikacji |

## Git i GitHub

| Pojęcie | Co oznacza | Przykład |
|---|---|---|
| Git | Program zapisujący historię zmian lokalnie | Działa także bez GitHub |
| GitHub | Serwis przechowujący repozytoria online | Tu trafia kod aplikacji |
| GitHub CLI / gh | Oficjalne narzędzie do obsługi GitHub w terminalu | gh auth login otwiera logowanie w przeglądarce |
| Repozytorium / repo | Projekt wraz z historią Git | Twoje moj-chatbot-laba |
| Commit | Zapis wybranych zmian w lokalnej historii | „Dodaj hasło do czatu” |
| Staging / index | Lista zmian wybranych do następnego commita | Wypełniasz ją przez git add |
| Branch / gałąź | Nazwana ścieżka zmian w repo | main |
| Remote | Nazwane połączenie ze zdalnym repo | origin |
| Push | Wysłanie lokalnych commitów do remote | git push |
| Clone | Pobranie repo wraz z historią | git clone |
| Pull | Pobranie i zintegrowanie zmian z remote | Nie jest potrzebne przed każdą komendą |
| .gitignore | Reguły pomijania plików, które nie są już śledzone | Chroni nowe pliki .env przed dodaniem |
| Prywatne repo | Kod dostępny dla uprawnionych kont | Nie zastępuje hasła w działającej aplikacji |

**Najczęstsze pomyłki:** zapis pliku ≠ commit; commit ≠ push; push ≠ pewność poprawnego wdrożenia. Każdy etap sprawdzasz osobno.

[Pomoc](POMOC.md) · [Komendy Git](GIT_KROK_PO_KROKU.md)
