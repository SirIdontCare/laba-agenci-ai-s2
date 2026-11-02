# Codex lub Claude Code — od instalacji do pierwszego pliku

**Wybierz jednego asystenta.** W obu wykonasz ćwiczenia z lekcji 1. Nie trzeba instalować dodatkowego edytora kodu.

Jeśli ktoś mówi „otwórz projekt”, chodzi o wskazanie folderu na Twoim komputerze, w którym asystent może tworzyć pliki. Samo otwarcie zwykłego czatu w przeglądarce nie potwierdza takiego dostępu.

## 1. Przygotuj miejsce

1. Utwórz folder **projekty/moj-agent** zgodnie z [instrukcją folderów](TERMINAL_I_PLIKI.md).
2. Sprawdź Node, npm i Git według [instalacji](INSTALACJA_I_KONTA.md).
3. Wybierz poniżej Codex albo Claude Code. Nie wykonuj obu ścieżek naraz.

## 2. Codex — wariant w terminalu

Ta ścieżka daje jednoznaczną komendę do każdego kroku. Jeśli masz już działającą aplikację Codex z lokalnym dostępem do folderu, przejdź do punktu 4.

### A. Konto

Wejdź na [ChatGPT](https://chatgpt.com), zaloguj się na swoje konto albo utwórz je w formularzu. Potwierdź adres, jeśli serwis tego wymaga. Sprawdź dostęp do Codex na swoim planie. Sama instalacja nie przyznaje płatnego dostępu.

**Ważne:** klucz OpenRouter od LABA jest dla chatbota. Nie wklejaj go do formularza logowania Codex.

### B. Instalacja

Otwórz terminal systemowy. Wklej komendę odpowiednią dla systemu.

**Windows PowerShell — po zainstalowaniu Node.js:**

```powershell
npm.cmd install -g @openai/codex
```

**macOS:**

```bash
npm install -g @openai/codex
```

`-g` oznacza instalację narzędzia poza zależnościami jednej aplikacji. W tej metodzie instalujemy oficjalny pakiet Codex z npm. Nie wpisuj tej komendy jako promptu do AI.

Poczekaj na zakończenie. Następnie zamknij terminal i otwórz nowy. Sprawdź:

| System | Komenda |
|---|---|
| PowerShell po instalacji przez npm | `codex.cmd --version` |
| macOS | `codex --version` |

**Gotowe, gdy:** pojawia się numer wersji. Błąd „not recognized” / „command not found” opisujemy w [P03](PROBLEMY.md#p03). Przy błędzie uprawnień nie dodawaj losowo sudo — przejdź do [P04](PROBLEMY.md#p04).

### C. Otwórz projekt i zaloguj się

1. W terminalu przejdź przez `cd` do **moj-agent**.
2. Sprawdź ścieżkę: Windows `Get-Location`, macOS `pwd`.
3. Uruchom:

| System | Komenda |
|---|---|
| PowerShell po instalacji przez npm | `codex.cmd` |
| macOS | `codex` |

4. Wybierz **Sign in with ChatGPT**, jeśli korzystasz z dostępu na koncie ChatGPT.
5. Dokończ logowanie w otwartej przeglądarce.
6. Wróć do terminala. Sprawdź, czy zamiast ekranu logowania widzisz rozmowę z asystentem.
7. Jeśli pojawia się pytanie o folder lub zaufanie, przeczytaj ścieżkę. Ma to być Twój projekt.

W aktywnej rozmowie Codex wpisujesz polecenia dla AI. Aby wykonać systemową komendę npm samodzielnie, otwórz drugie okno terminala w folderze projektu.

Źródła: [Codex CLI](https://learn.chatgpt.com/docs/codex/cli), [logowanie](https://learn.chatgpt.com/docs/auth), [oficjalne repo pakietu](https://github.com/openai/codex).

## 3. Claude Code — wybierz aplikację albo terminal

### A. Konto i aplikacja

1. Zaloguj się na [claude.ai](https://claude.ai) lub utwórz konto.
2. Sprawdź, czy Twój plan albo organizacja zapewnia Claude Code.
3. Pobierz [oficjalną aplikację Claude Desktop](https://claude.com/download) dla systemu.
4. Uruchom instalator, a po zakończeniu otwórz aplikację i zaloguj się.
5. Otwórz zakładkę **Code**, rozpocznij lokalną pracę i wskaż folder **moj-agent**.

**Gotowe, gdy:** możesz wykonać test z punktu 4. Brak zakładki lub dostępu: [P05](PROBLEMY.md#p05).

### B. Wariant terminalowy

Jeśli wybrałeś aplikację i test działa, ten punkt możesz pominąć.

**Windows PowerShell:**

```powershell
irm https://claude.ai/install.ps1 | iex
```

**macOS:**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

To polecenia pobierające i uruchamiające oficjalny instalator Anthropic. Po instalacji otwórz nowy terminal, sprawdź `claude --version`, przejdź do folderu moj-agent i wpisz `claude`. Dokończ logowanie; jeśli trzeba, użyj `/login`.

Źródła: [instalacja](https://code.claude.com/docs/en/setup), [pierwsza sesja](https://support.claude.com/en/articles/14552382-your-first-day-in-claude-code).

## 4. Test: czy AI faktycznie tworzy pliki?

**Wklej do rozmowy asystenta:**

```text
Sprawdź, w którym folderze pracujesz. Podaj jego ścieżkę.
Jeśli to folder moj-agent, utwórz w nim plik gotowosc.txt z tekstem
„Gotowe do LABA”. Nie instaluj niczego i nie twórz jeszcze aplikacji.
```

**Ty:**

1. Otwórz folder moj-agent w Eksploratorze albo Finderze.
2. Znajdź **gotowosc.txt**.
3. Otwórz plik i sprawdź tekst.

**Gotowe, gdy:** plik rzeczywiście istnieje. Sama odpowiedź AI „utworzyłem” nie wystarczy.

Jeśli powstał tylko blok tekstu w rozmowie, otwórz lokalny projekt w narzędziu: [P06](PROBLEMY.md#p06).

## 5. Jak pracować dalej

- Prompty z lekcji wklejaj do rozmowy z asystentem, po jednym.
- Po odpowiedzi sprawdzaj pliki lub stronę.
- Jeśli asystent pyta o zgodę, sprawdź zakres. Nie włączaj pełnego dostępu tylko po to, by uniknąć pytań.
- Gdy proponuje utworzenie drugiej aplikacji, wskaż istniejący folder i poproś o kontynuowanie.
- Hasła i klucze wpisujesz lokalnie albo w panelu usługi, nie w rozmowie.

**Prompt na początek:**

```text
Jestem początkujący. Wyjaśniaj po polsku, krótko i na przykładach.
Pracuj w obecnym folderze moj-agent. Wykonuj tylko zlecony krok.
Jeśli muszę coś zrobić sam, podaj jedną czynność i poczekaj.
```

**Po przerwie:**

```text
Kontynuuję mój chatbot LABA. Nie twórz nowej aplikacji.
Sprawdź strukturę projektu i package.json bez odczytywania plików .env.
Powiedz, jak uruchomić obecną wersję. Jestem na kroku [NUMER] lekcji 1.
```

## 6. Dwa różne logowania

| Dostęp | Co uruchamia |
|---|---|
| Twoje konto ChatGPT / Claude | Asystenta, który pisze kod |
| Klucz OpenRouter od LABA | Model odpowiadający w Twoim chatbocie |

Problem z limitem Codex nie musi oznaczać problemu z chatbotem. Błąd klucza chatbota nie oznacza, że trzeba przeinstalować Codex.

[Pomoc](POMOC.md) · [Lekcja 1](lekcja_01.md) · [Problemy z asystentem](PROBLEMY.md#p03)

Dokumentacja sprawdzona 02.11.2026. Nazwy przycisków mogą zależeć od wersji aplikacji; w razie różnic opisz to, co widzisz.
