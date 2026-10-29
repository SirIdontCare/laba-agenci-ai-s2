# Instalacja narzędzi i zakładanie kont — LABA AI Agents, edycja 2

Instrukcja dla Windows i macOS. **Osobny edytor kodu nie jest potrzebny.** Pracujemy z Codex albo Claude Code; wystarczy jeden asystent.

## 1. Co przygotować i kiedy

| Narzędzie / konto | Kiedy | Do czego |
|---|---|---|
| Node.js LTS + npm | Przed pierwszą lekcją | Uruchamianie projektu Next.js |
| Git | Przed pierwszą lekcją | Pobieranie kodu i historia zmian |
| GitHub | Przed pierwszą lekcją | Własne repozytorium aplikacji |
| Vercel | Przed pierwszą lekcją | Publikacja aplikacji |
| OpenAI / ChatGPT z dostępem do Codex ALBO Claude z dostępem do Claude Code | Przed pierwszą lekcją | Asystent tworzący kod |
| Klucz OpenRouter od LABA | Do wywołania modelu w aplikacji | Modele używane przez Twojego agenta |
| Supabase | Przed lekcją 5; konto można założyć wcześniej | Baza danych, pamięć, później RAG i logowanie |
| Konto Google do konfiguracji OAuth | Przed lekcją 7 | Logowanie użytkowników przez Google |
| Własna lub przydzielona subdomena | Przed lekcją 11 | Domena aplikacji i HTTPS |

**Dwa różne dostępy:** konto Codex/Claude Code służy do tworzenia kodu. Klucz OpenRouter od LABA służy budowanej aplikacji. Ten klucz nie zapewnia automatycznie dostępu do asystenta programowania. Samo założenie darmowego konta nie dowodzi, że wybrane narzędzie działa — wykonaj test z punktu 6. Nie trzeba kupować obu asystentów.

## 2. Terminal — gdzie wpisywać polecenia

- **Windows:** Start → wpisz „PowerShell” → otwórz. Początek wiersza wygląda np. `PS C:\Users\Admin>`. Możesz też otworzyć „Wiersz polecenia” (`cmd`).
- **macOS:** Cmd + Spacja → wpisz „Terminal” → Enter.
- Wklejaj tylko polecenia, bez oznaczenia `PS C:\...>`, znaku `$` i bez przykładowych wyników.
- Każde polecenie zatwierdź Enter. Gdy program pokazuje pytanie, przeczytaj je przed odpowiedzią.
- Po instalacji zamknij terminal i otwórz nowy, aby odświeżyć PATH. Asystenta również może być trzeba uruchomić ponownie.

## 3. Node.js i npm

### Windows

1. Otwórz [oficjalne pobieranie Node.js](https://nodejs.org/en/download).
2. Wybierz **LTS**, system Windows i instalator `.msi` odpowiedni dla procesora. Najczęściej jest to x64; dla Windows na ARM wybierz ARM64.
3. Uruchom instalator. Zostaw składniki Node.js, npm oraz dodanie do PATH. Dodatkowe pakiety do kompilacji nie są potrzebne do samego sprawdzenia instalacji.
4. Otwórz nowy PowerShell i wpisz:

```powershell
node -v
npm.cmd -v
```

Obie komendy powinny wypisać numery wersji. Kurs wymaga Node 22 lub nowszego; wybieraj wspieraną wersję LTS. Jeśli masz już działającą wersję, np. `v26.13.0`, nie odinstalowuj jej tylko dlatego, że numer jest inny niż na czyimś ekranie. Wersje zależności projektu ustalamy osobno.

### macOS

1. Na tej samej stronie wybierz instalator macOS `.pkg` oraz wersję LTS.
2. Przejdź instalację i otwórz nowy Terminal.
3. Sprawdź:

```bash
node -v
npm -v
```

npm instaluje się razem z Node.js.

### PowerShell: „npm.ps1 cannot be loaded / running scripts is disabled”

To blokada skryptu `npm.ps1`, a nie dowód nieudanej instalacji Node.js. Wpisz:

```powershell
npm.cmd -v
```

W dalszej pracy w PowerShell używaj:

```powershell
npm.cmd install
npm.cmd run dev
npx.cmd --version
```

Dopisanie `.cmd` wybiera inny plik uruchamiający to samo narzędzie. **Nie musisz zmieniać ExecutionPolicy ani uruchamiać terminala jako administrator.** Alternatywa: otwórz `cmd`, gdzie możesz używać `npm -v`. Na komputerze firmowym z dodatkowymi blokadami zgłoś problem administratorowi.

## 4. Git

### Windows

1. Otwórz [Git for Windows](https://git-scm.com/install/windows).
2. Pobierz instalator dla swojego systemu i przejdź instalację.
3. Zachowaj opcję dostępu do Git z wiersza poleceń i innych programów. Git Bash przyda się także przy pracy z Claude Code.
4. Otwórz nowy PowerShell i wpisz:

```powershell
git --version
```

Prawidłowy wynik wygląda np. `git version 2.56.0.windows.4`.

**Uwaga:** `git --version` jest poprawne, a `git -- version` ma zbędną spację.

### macOS

1. W Terminalu wpisz `git --version`.
2. Jeśli macOS poprosi o Command Line Tools, dokończ instalację narzędzi Apple.
3. Jeśli trzeba wywołać instalację ręcznie, wpisz `xcode-select --install`.
4. Po zakończeniu ponów `git --version`. Pełny Xcode nie jest wymagany do tych ćwiczeń.

## 5. GitHub i Vercel

### GitHub

1. Wejdź na [github.com/signup](https://github.com/signup).
2. Utwórz konto lub użyj dostępnego logowania Google/Apple.
3. Wybierz nazwę użytkownika i potwierdź e-mail, jeśli serwis o to poprosi.
4. Zaloguj się i sprawdź, czy widzisz swój profil. Darmowe konto wystarczy do przechowywania kodu ćwiczeń.
5. Materiały kursu są publiczne: [laba-agenci-ai-s2](https://github.com/SirIdontCare/laba-agenci-ai-s2). Nie musisz prosić o dostęp.
6. Własną aplikację zapisuj w **swoim** repozytorium. Nie nadpisuj materiałów kursowych.

Przed pierwszym commitem ustaw autora. Zastąp przykładowe wartości swoimi danymi; możesz użyć adresu noreply widocznego w ustawieniach e-mail GitHub:

```bash
git config --global user.name "Twoje imię i nazwisko"
git config --global user.email "twoj-adres@example.com"
```

Te komendy ustawiają podpis commitów. **Nie logują do GitHub.**

### Vercel

1. Otwórz [vercel.com/signup](https://vercel.com/signup).
2. Wybierz logowanie przez GitHub i swoje właściwe konto.
3. Dla osobistego projektu edukacyjnego wybierz plan Hobby, o ile spełniasz jego warunki. Nie włączaj płatnego planu tylko na potrzeby rejestracji.
4. Sprawdź, czy możesz wejść do dashboardu.
5. Import własnego repo, konfigurację zmiennych i pierwszy deploy wykonamy na lekcji 1. Gdy połączysz repo z Vercel, wybierz dostęp do potrzebnego repozytorium.
6. Klucza OpenRouter nie wklejaj do opisu projektu ani kodu frontendu — konfigurujemy go jako zmienną serwerową.

## 6. Asystent kodowania — wybierz jedną ścieżkę

### A. Codex

1. Utwórz konto OpenAI/ChatGPT albo zaloguj się na już posiadane.
2. Sprawdź dostęp do Codex na swoim koncie. Aktualne metody logowania i ograniczenia pokazuje [oficjalna instrukcja Codex CLI](https://learn.chatgpt.com/docs/codex/cli).
3. Wariant terminalowy z npm, po instalacji Node.js:

Windows PowerShell:

```powershell
npm.cmd install -g @openai/codex
codex.cmd --version
codex.cmd
```

macOS:

```bash
npm install -g @openai/codex
codex --version
codex
```

4. Wybierz logowanie przez ChatGPT i dokończ je w przeglądarce. Nie potrzebujesz własnego klucza OpenAI API, jeśli korzystasz ze ścieżki logowania ChatGPT z dostępnym Codex.
5. Test: w pustym folderze testowym poproś o utworzenie pliku `test.txt` z tekstem „Gotowe do LABA”. Sprawdź, czy plik powstał.
6. Możesz używać aplikacji z lokalnym trybem Codex, jeśli masz ją już skonfigurowaną. Ważne, aby asystent miał dostęp do właściwego folderu na komputerze.

### B. Claude Code

1. Załóż konto na [claude.ai](https://claude.ai) lub zaloguj się na istniejące. Zweryfikuj, czy Twoja subskrypcja lub organizacja zapewnia Claude Code.
2. Najprostszy wariant graficzny: pobierz [Claude Desktop](https://claude.com/download), zaloguj się i otwórz zakładkę **Code**. Zwykły czat i Code to różne tryby.
3. Wariant terminalowy — Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

macOS:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

To oficjalne instalatory Anthropic; polecenia pobierają i uruchamiają instalator.
4. Otwórz nowy terminal, wpisz `claude --version`, następnie `claude` i dokończ logowanie.
5. Otwórz pusty folder testowy i wykonaj taki sam test pliku jak przy Codex.
6. Przy problemach uruchom `claude doctor` i skorzystaj z [instrukcji instalacji](https://code.claude.com/docs/en/setup). Nie kupuj API Anthropic, jeśli chcesz używać dostępu objętego swoim planem.

## 7. OpenRouter — dostęp od LABA

Nie musisz zakładać własnego płatnego konta OpenRouter ani kupować kredytów na start, jeśli korzystasz z klucza przekazanego przez LABA. Zaczekaj na przekazanie klucza prywatnym kanałem i zatwierdzoną listę modeli.

Klucz wpisz lokalnie w pliku `.env.local` własnej aplikacji według instrukcji prowadzącego. Nazwa zmiennej musi odpowiadać kodowi projektu. Na Vercel ustaw ją także w konfiguracji środowiska — lokalny plik nie przenosi się automatycznie.

Nie wklejaj klucza do czatu kursu, promptu, commita ani zrzutu ekranu. Pliki `.env` powinny być wykluczone przez `.gitignore`. Nie używaj prefiksu `NEXT_PUBLIC_` dla klucza. Przy przypadkowej publikacji poproś o unieważnienie i nowy klucz.

## 8. Supabase i konta potrzebne później

**Supabase — przed L05:**
1. Wejdź na [supabase.com](https://supabase.com) i przejdź do panelu/rejestracji.
2. Utwórz konto lub użyj dostępnego logowania GitHub.
3. Sprawdź dostęp do dashboardu. Projekt, tabele i zasady RLS utworzymy wspólnie na lekcji 5; nie musisz znać SQL przed startem.
4. Przy tworzeniu projektu zapisz hasło bazy w menedżerze haseł i korzystaj z planu dobranego do ćwiczeń.

**Google OAuth — przed L07:** przygotuj konto Google. Konfigurację aplikacji, adresów przekierowań i logowania wykonamy na zajęciach. Nie trzeba dziś tworzyć kluczy OAuth.

**Domena — przed L11:** przygotuj własną albo przydzieloną subdomenę oraz uprawniony dostęp do jej konfiguracji DNS. Nie kupuj domeny w ciemno.

## 9. Pobranie materiałów i własny katalog

Najprościej: repozytorium kursu → **Code → Download ZIP** → rozpakuj. W środku powinny być `START.md`, ta instrukcja i `lekcja_01.md`.

Alternatywa z Git:

```bash
git clone https://github.com/SirIdontCare/laba-agenci-ai-s2.git
cd laba-agenci-ai-s2
```

Utwórz obok osobny folder `moj-agent` na aplikację. Otwórz go w asystencie i wskaż mu instrukcję lekcji z folderu materiałów. W jednym projekcie rozwijasz kolejne funkcje przez cały kurs.

Komendy `npm install` i `npm run dev` wykonuj dopiero w **folderze wygenerowanej aplikacji z plikiem package.json**. Sam folder materiałów nie jest gotową aplikacją Next.js. W PowerShell użyj odpowiednio `npm.cmd install` i `npm.cmd run dev`.

Po uruchomieniu aplikacji otwórz adres wypisany w terminalu, np. `http://localhost:3000`. Jeśli pokazuje inny port, użyj właśnie tego adresu. Ctrl+C zatrzymuje serwer.

## 10. Checklista gotowości

- [ ] `node -v` pokazuje wersję wspieranego Node.js LTS, minimum 22.
- [ ] `npm.cmd -v` na Windows albo `npm -v` na macOS pokazuje numer.
- [ ] `git --version` pokazuje numer.
- [ ] Loguję się do GitHub i Vercel.
- [ ] Mam Codex lub Claude Code i wykonałem test utworzenia pliku lokalnie.
- [ ] Mam materiały **edycji 2** oraz osobny folder aplikacji.
- [ ] Wiem, że klucz OpenRouter dostanę od LABA.

Jeśli coś nie działa, opublikuj w grupie: system, nazwę terminala, dokładną komendę i komunikat błędu. Ukryj klucze i dane prywatne. Nie wystarczy samo „nie działa”.

## Źródła i aktualność

Sprawdzono 29.10.2026. Wygląd serwisów i zakres planów mogą się zmieniać; dostęp do konta sprawdź testem.

- [Node.js — pobieranie](https://nodejs.org/en/download)
- [Git — instalacja](https://git-scm.com/install/)
- [GitHub — zakładanie konta](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github)
- [Vercel — konta](https://vercel.com/docs/accounts)
- [Codex CLI](https://learn.chatgpt.com/docs/codex/cli)
- [OpenAI Codex — oficjalne repozytorium i instalacja npm](https://github.com/openai/codex)
- [Claude Code — instalacja](https://code.claude.com/docs/en/setup)
- [Microsoft — wybór polecenia przez rozszerzenie pliku](https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_command_precedence)

Dalej: [START.md](START.md) → [lekcja 1](lekcja_01.md). [Prace domowe i punktacja](PRACE_DOMOWE.md).
